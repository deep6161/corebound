from datetime import timedelta
from fastapi.testclient import TestClient

from app.core.security import create_access_token


def test_get_current_user_authenticated(client: TestClient):
    """Test get_current_user dependency with valid Bearer token."""
    reg_response = client.post(
        "/api/v1/auth/register",
        json={"email": "authed@corebound.com", "password": "password123"},
    )
    user_id = reg_response.json()["id"]
    token = create_access_token(subject=user_id)

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id
    assert data["email"] == "authed@corebound.com"


def test_get_current_user_unauthenticated(client: TestClient):
    """Test get_current_user dependency without Authorization header returns 401."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_get_current_user_invalid_token(client: TestClient):
    """Test get_current_user with invalid token returns 401."""
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalidtoken123"},
    )
    assert response.status_code == 401


def test_get_current_user_expired_token(client: TestClient):
    """Test get_current_user with expired token returns 401."""
    token = create_access_token(subject=1, expires_delta=timedelta(seconds=-5))
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 401
