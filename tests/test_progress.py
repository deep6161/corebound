from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.models.mission import Mission
from app.models.mission_progress import MissionProgress, STATUS_AVAILABLE, STATUS_COMPLETED
from app.models.story import Story, Chapter, Sector
from app.models.subject import Subject
from app.models.topic import Topic


def _seed_and_register(client: TestClient, db_session: Session, email: str = "progress@test.com"):
    """Create a user, mission, and a progress record."""
    subject = Subject(name=f"Subj_{email}", description="")
    db_session.add(subject)
    db_session.flush()

    topic = Topic(subject_id=subject.id, name=f"Topic_{email}", description="")
    db_session.add(topic)
    db_session.flush()

    story = Story(title="Story")
    db_session.add(story)
    db_session.flush()

    chapter = Chapter(story_id=story.id, title="Ch", order_index=1)
    db_session.add(chapter)
    db_session.flush()

    sector = Sector(chapter_id=chapter.id, title="S", order_index=1)
    db_session.add(sector)
    db_session.flush()

    mission = Mission(sector_id=sector.id, topic_id=topic.id, title="M1", order_index=1,
                      difficulty="EASY", gameplay_type="GM001", is_active=True)
    db_session.add(mission)
    db_session.flush()
    db_session.commit()
    db_session.refresh(mission)

    reg = client.post("/api/v1/auth/register", json={"email": email, "password": "password123"})
    user_id = reg.json()["id"]
    token = create_access_token(subject=user_id)

    # Registration auto-seeded a MissionProgress row — update it with test-specific values
    progress = db_session.query(MissionProgress).filter(
        MissionProgress.user_id == user_id,
        MissionProgress.mission_id == mission.id,
    ).first()
    if progress:
        progress.attempts = 2
        progress.best_score = 80
        progress.stars = 2
    else:
        progress = MissionProgress(user_id=user_id, mission_id=mission.id, status=STATUS_AVAILABLE, attempts=2, best_score=80, stars=2)
        db_session.add(progress)
    db_session.commit()

    return user_id, token, mission


def test_get_my_progress(client: TestClient, db_session: Session):
    """GET /progress/me returns own mission progress records."""
    user_id, token, _ = _seed_and_register(client, db_session)
    response = client.get("/api/v1/progress/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["status"] == "AVAILABLE"


def test_get_my_progress_unauthenticated(client: TestClient):
    """GET /progress/me without auth returns 401."""
    response = client.get("/api/v1/progress/me")
    assert response.status_code == 401


def test_get_missions_progress(client: TestClient, db_session: Session):
    """GET /progress/missions returns same as /progress/me."""
    user_id, token, _ = _seed_and_register(client, db_session, email="progress2@test.com")
    response = client.get("/api/v1/progress/missions", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_mission_progress_specific(client: TestClient, db_session: Session):
    """GET /progress/missions/{id} returns progress for that mission."""
    user_id, token, mission = _seed_and_register(client, db_session, email="progress3@test.com")
    response = client.get(
        f"/api/v1/progress/missions/{mission.id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["mission_id"] == mission.id
    assert data["attempts"] == 2
    assert data["best_score"] == 80


def test_get_mission_progress_not_found(client: TestClient):
    """GET /progress/missions/999 for a mission with no record returns 404."""
    reg = client.post("/api/v1/auth/register", json={"email": "noprog@test.com", "password": "password123"})
    token = create_access_token(subject=reg.json()["id"])
    response = client.get("/api/v1/progress/missions/999", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 404


def test_progress_summary(client: TestClient, db_session: Session):
    """GET /progress/summary returns aggregate counts."""
    user_id, token, _ = _seed_and_register(client, db_session, email="summary@test.com")
    response = client.get("/api/v1/progress/summary", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert "total_missions" in data
    assert "completed_missions" in data
    assert "completion_percentage" in data


def test_progress_stats(client: TestClient, db_session: Session):
    """GET /progress/stats returns detailed stats."""
    user_id, token, _ = _seed_and_register(client, db_session, email="stats@test.com")
    response = client.get("/api/v1/progress/stats", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["total_attempts"] == 2
    assert data["total_stars_earned"] == 2


def test_cross_user_progress_isolation(client: TestClient, db_session: Session):
    """User A's progress does not appear in User B's response."""
    user_a_id, token_a, mission = _seed_and_register(client, db_session, email="userA_prog@test.com")

    # Register User B — they get their own seeded progress for the same mission
    reg_b = client.post("/api/v1/auth/register", json={"email": "userB_prog@test.com", "password": "password123"})
    token_b = create_access_token(subject=reg_b.json()["id"])

    response_b = client.get("/api/v1/progress/me", headers={"Authorization": f"Bearer {token_b}"})
    assert response_b.status_code == 200
    # User B has their own record (seeded at registration) — not User A's record
    data_b = response_b.json()
    if data_b:
        # If seeded, confirm it doesn't contain User A's data (attempts=2, stars=2)
        for rec in data_b:
            assert rec["attempts"] != 2 or rec["stars"] != 2  # A's record had both set


def test_progress_summary_unauthenticated(client: TestClient):
    """GET /progress/summary without auth returns 401."""
    response = client.get("/api/v1/progress/summary")
    assert response.status_code == 401
