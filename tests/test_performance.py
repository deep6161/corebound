from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.models.subject import Subject
from app.models.topic import Topic
from app.models.user_performance import UserPerformance


def _register_user(client: TestClient, email: str):
    reg = client.post("/api/v1/auth/register", json={"email": email, "password": "password123"})
    user_id = reg.json()["id"]
    token = create_access_token(subject=user_id)
    return user_id, token


def _seed_performance(db_session: Session, user_id: int):
    """Seed a UserPerformance record directly."""
    subject = Subject(name=f"PerfSubj_{user_id}", description="")
    db_session.add(subject)
    db_session.flush()

    topic = Topic(subject_id=subject.id, name=f"PerfTopic_{user_id}", description="")
    db_session.add(topic)
    db_session.flush()

    perf = UserPerformance(
        user_id=user_id,
        topic_id=topic.id,
        gameplay_type="GM001",
        difficulty="EASY",
        total_attempts=10,
        correct_attempts=8,
        accuracy=0.8,
        avg_response_ms=1200.0,
        best_streak=5,
    )
    db_session.add(perf)
    db_session.commit()
    return topic


def test_get_my_performance_empty(client: TestClient):
    """GET /performance/me with no records returns zero totals."""
    _, token = _register_user(client, "perf_empty@test.com")
    response = client.get("/api/v1/performance/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["total_attempts"] == 0
    assert data["correct_attempts"] == 0
    assert data["overall_accuracy"] is None
    assert data["by_topic"] == []


def test_get_my_performance(client: TestClient, db_session: Session):
    """GET /performance/me with records returns aggregated data."""
    user_id, token = _register_user(client, "perf_data@test.com")
    _seed_performance(db_session, user_id)
    response = client.get("/api/v1/performance/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["total_attempts"] == 10
    assert data["correct_attempts"] == 8
    assert data["overall_accuracy"] == 0.8
    assert len(data["by_topic"]) == 1
    assert len(data["by_subject"]) == 1
    assert len(data["by_gameplay"]) == 1


def test_get_performance_unauthenticated(client: TestClient):
    """GET /performance/me without auth returns 401."""
    response = client.get("/api/v1/performance/me")
    assert response.status_code == 401


def test_get_topic_performance(client: TestClient, db_session: Session):
    """GET /performance/topics returns per-topic breakdown."""
    user_id, token = _register_user(client, "perf_topic@test.com")
    _seed_performance(db_session, user_id)
    response = client.get("/api/v1/performance/topics", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["total_attempts"] == 10
    assert data[0]["gameplay_type"] == "GM001"


def test_get_subject_performance(client: TestClient, db_session: Session):
    """GET /performance/subjects returns per-subject breakdown."""
    user_id, token = _register_user(client, "perf_subj@test.com")
    _seed_performance(db_session, user_id)
    response = client.get("/api/v1/performance/subjects", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["total_attempts"] == 10


def test_get_gameplay_performance(client: TestClient, db_session: Session):
    """GET /performance/gameplay returns per-gameplay-type breakdown."""
    user_id, token = _register_user(client, "perf_gm@test.com")
    _seed_performance(db_session, user_id)
    response = client.get("/api/v1/performance/gameplay", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["gameplay_type"] == "GM001"


def test_get_performance_history(client: TestClient, db_session: Session):
    """GET /performance/history returns records."""
    user_id, token = _register_user(client, "perf_hist@test.com")
    _seed_performance(db_session, user_id)
    response = client.get("/api/v1/performance/history", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_cross_user_performance_isolation(client: TestClient, db_session: Session):
    """User B does not see User A's performance data."""
    user_a_id, token_a = _register_user(client, "perf_userA@test.com")
    _seed_performance(db_session, user_a_id)

    _, token_b = _register_user(client, "perf_userB@test.com")
    response_b = client.get("/api/v1/performance/me", headers={"Authorization": f"Bearer {token_b}"})
    assert response_b.status_code == 200
    assert response_b.json()["total_attempts"] == 0


def test_performance_subjects_unauthenticated(client: TestClient):
    """GET /performance/subjects without auth returns 401."""
    response = client.get("/api/v1/performance/subjects")
    assert response.status_code == 401
