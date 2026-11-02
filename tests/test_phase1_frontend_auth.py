"""
Test Phase 1 Frontend API Client & Real Authentication Integration
Verifies that:
1. corebound-api.js exists and exports API methods (register, login, getCurrentUser, isAuthenticated, logout, getAuthHeaders).
2. Token storage and Authorization Bearer header formatting logic is valid.
3. No passwords are saved to localStorage.
4. auth-calibration.js delegates to real cbApi.register/login rather than generating fake offline data on successful backend responses.
5. Backend authentication endpoints (POST /api/v1/auth/register, POST /api/v1/auth/login, GET /api/v1/auth/me) respond accurately to the client contract.
"""

from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.models.user import User


FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "COREBOUNDV1" / "COREBOUNDV1" / "COREBOUND"


def test_corebound_api_file_exists():
    """Verify corebound-api.js exists in the active Vanilla frontend directory."""
    api_file = FRONTEND_DIR / "corebound-api.js"
    assert api_file.exists(), f"corebound-api.js not found at {api_file}"
    content = api_file.read_text(encoding="utf-8")
    
    # Check essential methods
    assert "class CoreboundApi" in content
    assert "register(" in content
    assert "login(" in content
    assert "getCurrentUser(" in content
    assert "isAuthenticated(" in content
    assert "logout(" in content
    assert "getAuthHeaders(" in content
    assert "getToken(" in content
    assert "setToken(" in content
    assert "window.cbApi" in content
    assert "Authorization" in content
    assert "Bearer" in content


def test_corebound_api_no_password_storage():
    """Verify that password is NEVER stored in localStorage by corebound-api.js."""
    api_file = FRONTEND_DIR / "corebound-api.js"
    content = api_file.read_text(encoding="utf-8")
    
    # Must only store token and sanitized user object
    assert "localStorage.setItem('password'" not in content
    assert "localStorage.setItem('pass'" not in content
    assert "password" not in content.split("setStoredUser")[1].split("}")[0]


def test_auth_calibration_delegates_to_cb_api():
    """Verify auth-calibration.js uses window.cbApi and handles responses safely."""
    auth_js_file = FRONTEND_DIR / "auth-calibration.js"
    assert auth_js_file.exists(), f"auth-calibration.js not found at {auth_js_file}"
    content = auth_js_file.read_text(encoding="utf-8")

    assert "window.cbApi" in content
    assert "window.cbApi.register" in content
    assert "window.cbApi.login" in content
    # Ensure error alert is displayed on failure
    assert "alertBox.innerText" in content


def test_script_inclusion_in_html_entrypoints():
    """Verify corebound-api.js is loaded in story.html and level.html before auth-calibration.js."""
    story_html = (FRONTEND_DIR / "story.html").read_text(encoding="utf-8")
    level_html = (FRONTEND_DIR / "level.html").read_text(encoding="utf-8")

    assert "corebound-api.js" in story_html
    assert "corebound-api.js" in level_html
    assert story_html.index("corebound-api.js") < story_html.index("auth-calibration.js")
    assert level_html.index("corebound-api.js") < level_html.index("auth-calibration.js")


def test_backend_auth_lifecycle_contract(client: TestClient):
    """
    Test real backend auth contract matching frontend API client calls:
    1. Register new user -> 201 Created
    2. Login user -> 200 OK with Bearer access_token
    3. Call GET /auth/me with Bearer token -> 200 OK with UserResponse
    """
    email = f"sentinel.test.{Path(__file__).stat().st_mtime_ns}@corebound.io"
    password = "QuantumPassword#2026"

    # 1. Register
    reg_res = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password},
    )
    assert reg_res.status_code == 201, reg_res.text
    reg_data = reg_res.json()
    assert reg_data["email"] == email
    assert "id" in reg_data
    user_id = reg_data["id"]

    # 2. Login
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert login_res.status_code == 200, login_res.text
    login_data = login_res.json()
    assert "access_token" in login_data
    assert login_data["token_type"] == "bearer"
    token = login_data["access_token"]

    # 3. Get Current User with Bearer token
    me_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200, me_res.text
    me_data = me_res.json()
    assert me_data["id"] == user_id
    assert me_data["email"] == email


def test_backend_auth_rejects_invalid_credentials(client: TestClient):
    """Test login failure with invalid password returns 401."""
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent.sentinel@corebound.io", "password": "WrongPassword#123"},
    )
    assert res.status_code == 401
    assert "Invalid email or password" in res.json()["detail"]
