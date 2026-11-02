from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.user import User


def test_register_valid(client: TestClient, db_session: Session):
    """Test successful user registration."""
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "player@corebound.com", "password": "securepassword123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "player@corebound.com"
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data
    assert "password" not in data
    assert "password_hash" not in data

    # Verify user exists in database
    user = db_session.query(User).filter(User.email == "player@corebound.com").first()
    assert user is not None
    assert user.password_hash != "securepassword123"  # Password must be hashed


def test_register_duplicate_email(client: TestClient):
    """Test registration with existing email returns HTTP 409 Conflict."""
    client.post(
        "/api/v1/auth/register",
        json={"email": "duplicate@corebound.com", "password": "password123"},
    )
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "duplicate@corebound.com", "password": "newpassword123"},
    )
    assert response.status_code == 409
    assert response.json()["detail"] == "Email already registered"


def test_register_invalid_email(client: TestClient):
    """Test registration with invalid email format returns HTTP 422 Unprocessable Entity."""
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "invalid-email-format", "password": "password123"},
    )
    assert response.status_code == 422


def test_register_invalid_password(client: TestClient):
    """Test registration with password shorter than 6 chars returns HTTP 422."""
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "user@corebound.com", "password": "123"},
    )
    assert response.status_code == 422


def test_login_correct_credentials(client: TestClient):
    """Test login with valid email and password returns JWT access token and user info."""
    client.post(
        "/api/v1/auth/register",
        json={"email": "loginuser@corebound.com", "password": "mypassword123"},
    )

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "loginuser@corebound.com", "password": "mypassword123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "loginuser@corebound.com"


def test_login_incorrect_password(client: TestClient):
    """Test login with wrong password returns HTTP 401 Unauthorized."""
    client.post(
        "/api/v1/auth/register",
        json={"email": "wrongpass@corebound.com", "password": "correctpassword"},
    )

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "wrongpass@corebound.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_login_nonexistent_account(client: TestClient):
    """Test login with non-existent email returns generic HTTP 401 error."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@corebound.com", "password": "anypassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"
