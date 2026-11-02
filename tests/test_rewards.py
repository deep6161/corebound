from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.models.mission import Mission
from app.models.reward_event import RewardEvent
from app.models.story import Story, Chapter, Sector
from app.models.subject import Subject
from app.models.topic import Topic


def _register_user(client: TestClient, email: str):
    reg = client.post("/api/v1/auth/register", json={"email": email, "password": "password123"})
    user_id = reg.json()["id"]
    token = create_access_token(subject=user_id)
    return user_id, token


def _seed_reward_event(db_session: Session, user_id: int):
    """Seed a reward event directly (simulating server-side reward grant)."""
    event = RewardEvent(
        user_id=user_id,
        mission_id=None,
        xp=100,
        credits=50,
        stars=2,
        reason="MISSION_COMPLETE",
    )
    db_session.add(event)
    db_session.commit()
    return event


def test_get_my_rewards(client: TestClient):
    """GET /rewards/me returns user's reward totals from profile."""
    _, token = _register_user(client, "rewards_me@test.com")
    response = client.get("/api/v1/rewards/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["xp"] == 0
    assert data["credits"] == 0
    assert data["stars"] == 0
    assert data["level"] == 1


def test_get_my_rewards_unauthenticated(client: TestClient):
    """GET /rewards/me without auth returns 401."""
    response = client.get("/api/v1/rewards/me")
    assert response.status_code == 401


def test_get_reward_history(client: TestClient, db_session: Session):
    """GET /rewards/history returns reward event audit log."""
    user_id, token = _register_user(client, "rewards_hist@test.com")
    _seed_reward_event(db_session, user_id)

    response = client.get("/api/v1/rewards/history", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["xp"] == 100
    assert data[0]["credits"] == 50
    assert data[0]["stars"] == 2
    assert data[0]["reason"] == "MISSION_COMPLETE"


def test_get_reward_history_empty(client: TestClient):
    """GET /rewards/history with no events returns empty list."""
    _, token = _register_user(client, "rewards_hist_empty@test.com")
    response = client.get("/api/v1/rewards/history", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == []


def test_get_reward_summary(client: TestClient, db_session: Session):
    """GET /rewards/summary aggregates reward events."""
    user_id, token = _register_user(client, "rewards_sum@test.com")
    _seed_reward_event(db_session, user_id)
    _seed_reward_event(db_session, user_id)  # Two events

    response = client.get("/api/v1/rewards/summary", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["total_xp"] == 200
    assert data["total_credits"] == 100
    assert data["total_stars"] == 4
    assert data["total_events"] == 2


def test_no_post_reward_endpoint(client: TestClient):
    """
    No POST /rewards endpoint exists.
    Frontend must never be able to create reward events directly.
    """
    response = client.post("/api/v1/rewards", json={"xp": 9999, "credits": 9999})
    assert response.status_code == 405 or response.status_code == 404


def test_no_patch_reward_endpoint(client: TestClient):
    """No PATCH /rewards endpoint exists."""
    response = client.patch("/api/v1/rewards/me", json={"xp": 9999})
    assert response.status_code == 405 or response.status_code == 404


def test_cross_user_reward_isolation(client: TestClient, db_session: Session):
    """User B cannot see User A's reward history."""
    user_a_id, token_a = _register_user(client, "rewards_userA@test.com")
    _seed_reward_event(db_session, user_a_id)

    _, token_b = _register_user(client, "rewards_userB@test.com")
    response_b = client.get("/api/v1/rewards/history", headers={"Authorization": f"Bearer {token_b}"})
    assert response_b.status_code == 200
    assert response_b.json() == []
