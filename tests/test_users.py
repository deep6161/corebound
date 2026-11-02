from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.models.user import User
from app.models.user_profile import UserProfile


def _register_and_login(client: TestClient, email: str = "user@test.com", password: str = "password123"):
    reg = client.post("/api/v1/auth/register", json={"email": email, "password": password})
    user_id = reg.json()["id"]
    token = create_access_token(subject=user_id)
    return user_id, token


def test_get_me_authenticated(client: TestClient):
    """Authenticated user can get their own account info."""
    user_id, token = _register_and_login(client)
    response = client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id
    assert "email" in data
    assert "password_hash" not in data
    assert "password" not in data


def test_get_me_unauthenticated(client: TestClient):
    """Unauthenticated request to /users/me returns 401."""
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401


def test_get_my_profile_created_on_register(client: TestClient, db_session: Session):
    """Profile is automatically created when user registers."""
    user_id, token = _register_and_login(client)

    # Check DB
    profile = db_session.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    assert profile is not None
    assert profile.xp == 0
    assert profile.level == 1

    # Check API
    response = client.get("/api/v1/users/me/profile", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == user_id
    assert data["level"] == 1
    assert data["xp"] == 0
    assert "password_hash" not in data


def test_get_my_profile_unauthenticated(client: TestClient):
    """Unauthenticated request to /users/me/profile returns 401."""
    response = client.get("/api/v1/users/me/profile")
    assert response.status_code == 401


def test_update_my_profile(client: TestClient):
    """User can update their display name, bio, avatar."""
    _, token = _register_and_login(client)
    auth = {"Authorization": f"Bearer {token}"}

    response = client.patch(
        "/api/v1/users/me/profile",
        json={"display_name": "Commander Core", "bio": "Testing player", "avatar_url": "https://example.com/avatar.png"},
        headers=auth,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["display_name"] == "Commander Core"
    assert data["bio"] == "Testing player"
    assert data["avatar_url"] == "https://example.com/avatar.png"


def test_update_profile_unauthenticated(client: TestClient):
    """Unauthenticated PATCH to profile returns 401."""
    response = client.patch("/api/v1/users/me/profile", json={"display_name": "Hacker"})
    assert response.status_code == 401


def test_user_cannot_access_other_user_profile(client: TestClient):
    """
    There is no GET /users/{id}/profile endpoint intentionally.
    Verify the pattern is absent (ownership enforced by design).
    """
    _, token = _register_and_login(client, email="userA@test.com")
    # Trying to access another user's profile via users/me/profile returns own data only
    response = client.get("/api/v1/users/me/profile", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    # No generic /users/{id}/profile route exists
    response2 = client.get("/api/v1/users/2/profile", headers={"Authorization": f"Bearer {token}"})
    assert response2.status_code == 404  # route doesn't exist


def test_patch_me_updates_display_name(client: TestClient):
    """PATCH /users/me updates profile display name."""
    _, token = _register_and_login(client, email="patch@test.com")
    auth = {"Authorization": f"Bearer {token}"}

    response = client.patch(
        "/api/v1/users/me",
        json={"display_name": "PatchedName"},
        headers=auth,
    )
    assert response.status_code == 200
