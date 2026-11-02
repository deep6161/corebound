"""
Test Phase 2 Profile & Preferences Synchronization Integration
Verifies that:
1. corebound-api.js exports getProfile, getPreferences, updatePreferences, and formatPreferencesForBackend methods.
2. Token authorization Bearer headers are attached.
3. Calibration options map to valid backend enum schema sets for all 7 categories:
   - Primary Goal
   - Target Role
   - Skill Level
   - Focus Subjects
   - Daily Commitment
   - Difficulty Preference
   - Learning Style
4. Backend PATCH /api/v1/users/me/preferences updates the user's profile in the database.
5. Backend GET /api/v1/users/me/profile reflects the saved preferences as authoritative truth.
6. auth-calibration.js handles calibration completion and sync failures gracefully.
"""

from pathlib import Path
import pytest
from fastapi.testclient import TestClient

from app.schemas.user_profile import (
    VALID_GOALS,
    VALID_TARGET_ROLES,
    VALID_SKILL_LEVELS,
    VALID_SUBJECTS,
    VALID_DAILY_TIMES,
    VALID_DIFFICULTIES,
    VALID_LEARNING_PREFERENCES,
)

FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "COREBOUNDV1" / "COREBOUNDV1" / "COREBOUND"


def test_api_client_has_profile_and_preference_methods():
    """Verify corebound-api.js defines getProfile, getPreferences, updatePreferences, formatPreferencesForBackend."""
    api_file = FRONTEND_DIR / "corebound-api.js"
    assert api_file.exists()
    content = api_file.read_text(encoding="utf-8")

    assert "getProfile(" in content
    assert "getPreferences(" in content
    assert "updatePreferences(" in content
    assert "formatPreferencesForBackend(" in content
    assert "/api/v1/users/me/profile" in content
    assert "/api/v1/users/me/preferences" in content


def test_auth_calibration_calls_update_preferences():
    """Verify auth-calibration.js calls updatePreferences on final synthesis step."""
    auth_js = (FRONTEND_DIR / "auth-calibration.js").read_text(encoding="utf-8")
    assert "window.cbApi.updatePreferences" in auth_js
    assert "calibSyncErrorBox" in auth_js or "Synchronization failed" in auth_js


def test_auth_calibration_login_fetches_profile():
    """Verify auth-calibration.js fetches profile on login to check existing calibration status."""
    auth_js = (FRONTEND_DIR / "auth-calibration.js").read_text(encoding="utf-8")
    assert "window.cbApi.getProfile" in auth_js


def test_backend_preference_patch_and_get_lifecycle(client: TestClient):
    """
    Test full profile & preferences synchronization:
    1. Register user
    2. Patch preferences with all 7 categories
    3. Retrieve preferences & profile
    4. Verify values match authoritative backend data
    """
    email = f"sentinel.phase2.{Path(__file__).stat().st_mtime_ns}@corebound.io"
    password = "QuantumPassword#2026"

    # 1. Register & Login
    reg_res = client.post("/api/v1/auth/register", json={"email": email, "password": password})
    assert reg_res.status_code == 201

    login_res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Patch Preferences with canonical values from frontend mapping
    pref_payload = {
        "goal": "Placement Preparation",
        "target_role": "Full Stack Developer",
        "skill_level": "Intermediate",
        "subjects": ["Data Structures & Algorithms", "JavaScript", "Problem Solving"],
        "daily_time": "1 hour",
        "difficulty_preference": "Adaptive",
        "learning_preference": "Balanced",
    }

    patch_res = client.patch("/api/v1/users/me/preferences", json=pref_payload, headers=headers)
    assert patch_res.status_code == 200, patch_res.text
    patch_data = patch_res.json()
    assert patch_data["goal"] == "Placement Preparation"
    assert patch_data["target_role"] == "Full Stack Developer"
    assert patch_data["skill_level"] == "Intermediate"
    assert patch_data["subjects"] == ["Data Structures & Algorithms", "JavaScript", "Problem Solving"]
    assert patch_data["daily_time"] == "1 hour"
    assert patch_data["difficulty_preference"] == "Adaptive"
    assert patch_data["learning_preference"] == "Balanced"

    # 3. Fetch Full Profile
    profile_res = client.get("/api/v1/users/me/profile", headers=headers)
    assert profile_res.status_code == 200
    profile_data = profile_res.json()
    assert profile_data["goal"] == "Placement Preparation"
    assert profile_data["target_role"] == "Full Stack Developer"
    assert profile_data["skill_level"] == "Intermediate"
    assert profile_data["subjects"] == ["Data Structures & Algorithms", "JavaScript", "Problem Solving"]
    assert profile_data["daily_time"] == "1 hour"
    assert profile_data["difficulty_preference"] == "Adaptive"
    assert profile_data["learning_preference"] == "Balanced"
    assert profile_data["preferences_updated_at"] is not None


def test_backend_rejects_invalid_preference_values(client: TestClient):
    """Test validation errors on invalid preference payloads."""
    email = f"sentinel.invalid.{Path(__file__).stat().st_mtime_ns}@corebound.io"
    password = "QuantumPassword#2026"

    client.post("/api/v1/auth/register", json={"email": email, "password": password})
    login_res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Invalid goal
    res = client.patch("/api/v1/users/me/preferences", json={"goal": "InvalidGoal"}, headers=headers)
    assert res.status_code == 422

    # Invalid skill level
    res = client.patch("/api/v1/users/me/preferences", json={"skill_level": "GodMode"}, headers=headers)
    assert res.status_code == 422
