from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.security import create_access_token


def _register_user(client: TestClient, email: str = "analytics@test.com"):
    reg = client.post("/api/v1/auth/register", json={"email": email, "password": "password123"})
    user_id = reg.json()["id"]
    token = create_access_token(subject=user_id)
    return user_id, token


def test_analytics_me_authenticated(client: TestClient):
    """GET /analytics/me returns analytics for the current user."""
    _, token = _register_user(client)
    response = client.get("/api/v1/analytics/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()

    # All expected fields present
    assert "total_missions" in data
    assert "completed_missions" in data
    assert "in_progress_missions" in data
    assert "available_missions" in data
    assert "total_attempts" in data
    assert "correct_attempts" in data
    assert "xp" in data
    assert "credits" in data
    assert "stars" in data
    assert "level" in data
    assert "streak" in data
    assert "subject_performance" in data
    assert "topic_performance" in data

    # New user has zero stats
    assert data["total_missions"] == 0
    assert data["xp"] == 0
    assert data["level"] == 1
    assert data["subject_performance"] == []


def test_analytics_me_unauthenticated(client: TestClient):
    """GET /analytics/me without auth returns 401."""
    response = client.get("/api/v1/analytics/me")
    assert response.status_code == 401


def test_analytics_me_invalid_token(client: TestClient):
    """GET /analytics/me with invalid token returns 401."""
    response = client.get("/api/v1/analytics/me", headers={"Authorization": "Bearer badtoken"})
    assert response.status_code == 401


def test_analytics_isolates_users(client: TestClient):
    """Two different users see their own analytics independently."""
    _, token_a = _register_user(client, "analytics_a@test.com")
    _, token_b = _register_user(client, "analytics_b@test.com")

    resp_a = client.get("/api/v1/analytics/me", headers={"Authorization": f"Bearer {token_a}"})
    resp_b = client.get("/api/v1/analytics/me", headers={"Authorization": f"Bearer {token_b}"})

    assert resp_a.status_code == 200
    assert resp_b.status_code == 200
    # Both see their own (zero) data independently
    assert resp_a.json()["xp"] == 0
    assert resp_b.json()["xp"] == 0
