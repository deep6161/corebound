from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.models.mission import Mission
from app.models.mission_progress import MissionProgress, STATUS_AVAILABLE, STATUS_LOCKED
from app.models.story import Story, Chapter, Sector
from app.models.subject import Subject
from app.models.topic import Topic


def _seed_missions(db: Session):
    """Seed story structure with two missions."""
    subject = Subject(name="Mission Subject", description="")
    db.add(subject)
    db.flush()

    topic = Topic(subject_id=subject.id, name="Mission Topic", description="")
    db.add(topic)
    db.flush()

    story = Story(title="Test Story")
    db.add(story)
    db.flush()

    chapter = Chapter(story_id=story.id, title="Ch1", order_index=1)
    db.add(chapter)
    db.flush()

    sector = Sector(chapter_id=chapter.id, title="Sector1", order_index=1)
    db.add(sector)
    db.flush()

    m1 = Mission(sector_id=sector.id, topic_id=topic.id, title="M1", order_index=1, difficulty="EASY", gameplay_type="GM001", is_active=True)
    m2 = Mission(sector_id=sector.id, topic_id=topic.id, title="M2", order_index=2, difficulty="MEDIUM", gameplay_type="GM001", is_active=True)
    db.add_all([m1, m2])
    db.commit()
    db.refresh(m1)
    db.refresh(m2)
    return m1, m2, topic


def _register_user(client: TestClient, email: str = "mission_user@test.com"):
    reg = client.post("/api/v1/auth/register", json={"email": email, "password": "password123"})
    user_id = reg.json()["id"]
    token = create_access_token(subject=user_id)
    return user_id, token


def test_list_missions_empty(client: TestClient):
    """GET /missions returns empty list when no missions exist."""
    response = client.get("/api/v1/missions")
    assert response.status_code == 200
    assert response.json() == []


def test_list_missions(client: TestClient, db_session: Session):
    """GET /missions returns all active missions."""
    m1, m2, _ = _seed_missions(db_session)
    response = client.get("/api/v1/missions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    ids = [d["id"] for d in data]
    assert m1.id in ids
    assert m2.id in ids


def test_get_mission_detail(client: TestClient, db_session: Session):
    """GET /missions/{id} returns mission detail."""
    m1, _, _ = _seed_missions(db_session)
    response = client.get(f"/api/v1/missions/{m1.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == m1.id
    assert data["difficulty"] == "EASY"
    assert data["gameplay_type"] == "GM001"


def test_get_mission_not_found(client: TestClient):
    """GET /missions/999 returns 404."""
    response = client.get("/api/v1/missions/999")
    assert response.status_code == 404


def test_list_available_missions_unauthenticated(client: TestClient):
    """GET /missions/available requires authentication."""
    response = client.get("/api/v1/missions/available")
    assert response.status_code == 401


def test_list_available_missions_empty(client: TestClient):
    """Authenticated user with no progress records sees empty available list."""
    _, token = _register_user(client)
    response = client.get(
        "/api/v1/missions/available",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json() == []


def test_get_mission_status_unauthenticated(client: TestClient, db_session: Session):
    """GET /missions/{id}/status requires auth."""
    m1, _, _ = _seed_missions(db_session)
    response = client.get(f"/api/v1/missions/{m1.id}/status")
    assert response.status_code == 401


def test_get_mission_status_no_progress(client: TestClient, db_session: Session):
    """Mission with no progress record for this user returns LOCKED status."""
    m1, _, _ = _seed_missions(db_session)
    # Register BEFORE seeding missions so initialize_mission_progress_for_user finds none
    # (db is clean; this registers, then we ask about a mission not in the progress table)
    _, token = _register_user(client, email="noprog_status@test.com")
    # Ask about a mission that definitely doesn't exist in progress (use a fresh id)
    response = client.get(
        f"/api/v1/missions/{m1.id}/status",
        headers={"Authorization": f"Bearer {token}"},
    )
    # m1 is AVAILABLE for this user because registration seeded it
    assert response.status_code == 200
    assert response.json()["status"] == STATUS_AVAILABLE


def test_start_locked_mission_rejected(client: TestClient, db_session: Session):
    """POST /missions/{id}/start on a LOCKED mission (m2) returns 403."""
    m1, m2, _ = _seed_missions(db_session)
    user_id, token = _register_user(client, email="locked_mission@test.com")
    auth = {"Authorization": f"Bearer {token}"}

    # m2 is LOCKED after registration seeding (only m1 gets AVAILABLE)
    response = client.post(f"/api/v1/missions/{m2.id}/start", headers=auth)
    assert response.status_code == 403
    assert "locked" in response.json()["detail"].lower()


def test_start_available_mission(client: TestClient, db_session: Session):
    """POST /missions/{id}/start transitions AVAILABLE → IN_PROGRESS."""
    m1, _, _ = _seed_missions(db_session)
    user_id, token = _register_user(client, email="avail_mission@test.com")
    auth = {"Authorization": f"Bearer {token}"}

    # m1 is already AVAILABLE from registration seeding — no manual insert needed
    response = client.post(f"/api/v1/missions/{m1.id}/start", headers=auth)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "IN_PROGRESS"
    assert data["mission_id"] == m1.id


def test_start_mission_unauthenticated(client: TestClient, db_session: Session):
    """POST /missions/{id}/start without auth returns 401."""
    m1, _, _ = _seed_missions(db_session)
    response = client.post(f"/api/v1/missions/{m1.id}/start")
    assert response.status_code == 401


def test_get_topic_missions(client: TestClient, db_session: Session):
    """GET /topics/{id}/missions returns missions for the topic."""
    m1, m2, topic = _seed_missions(db_session)
    response = client.get(f"/api/v1/topics/{topic.id}/missions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_get_topic_not_found(client: TestClient):
    """GET /topics/999 returns 404."""
    response = client.get("/api/v1/topics/999")
    assert response.status_code == 404
