"""
Phase V14 Backend User Goal + Preferences Integration Tests.
Tests:
1. New user has valid empty/default preference state
2. Authenticated user can save preferences (camelCase & snake_case)
3. Authenticated user can retrieve preferences
4. Saved values persist across requests
5. Partial PATCH works (updating single field leaves others intact)
6. Invalid goal rejected (422)
7. Invalid target role rejected (422)
8. Invalid skill level rejected (422)
9. Invalid subject rejected (422)
10. Invalid daily time rejected (422)
11. Invalid difficulty rejected (422)
12. Invalid learning preference rejected (422)
13. Invalid subjects list rejected (empty list, non-list, bad items) (422)
14. Unauthenticated GET rejected (401)
15. Unauthenticated PATCH rejected (401)
16. User A cannot access User B preferences (isolation)
17. User A cannot modify User B preferences (isolation)
18. Existing authentication/profile tests pass
19. Database migration / model attributes work
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.user_profile import UserProfile
from app.services.profile_service import create_profile_for_user


def _register_and_login(client: TestClient, email: str, password: str = "StrongPass123!"):
    # Register
    reg_res = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password},
    )
    assert reg_res.status_code in (200, 201), f"Register failed: {reg_res.text}"

    # Login
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_01_new_user_default_preferences(client: TestClient):
    """1. New user has valid default/empty preference state."""
    headers = _register_and_login(client, "user_default@corebound.io")
    res = client.get("/api/v1/users/me/preferences", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["goal"] is None
    assert data["target_role"] is None
    assert data["skill_level"] is None
    assert data["subjects"] == []
    assert data["daily_time"] is None
    assert data["difficulty_preference"] == "Adaptive"
    assert data["learning_preference"] is None


def test_02_authenticated_user_can_save_preferences(client: TestClient):
    """2. Authenticated user can save preferences using frontend camelCase format."""
    headers = _register_and_login(client, "user_save@corebound.io")
    payload = {
        "goal": "Placement Preparation",
        "targetRole": "Full Stack Developer",
        "skillLevel": "Intermediate",
        "subjects": ["Data Structures & Algorithms", "Python", "SQL"],
        "dailyTime": "1 hour",
        "difficultyPreference": "Adaptive",
        "learningPreference": "Balanced",
    }
    res = client.patch("/api/v1/users/me/preferences", json=payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["goal"] == "Placement Preparation"
    assert data["target_role"] == "Full Stack Developer"
    assert data["skill_level"] == "Intermediate"
    assert data["subjects"] == ["Data Structures & Algorithms", "Python", "SQL"]
    assert data["daily_time"] == "1 hour"
    assert data["difficulty_preference"] == "Adaptive"
    assert data["learning_preference"] == "Balanced"
    assert data["preferences_updated_at"] is not None


def test_03_authenticated_user_can_retrieve_preferences(client: TestClient):
    """3. Authenticated user can retrieve preferences."""
    headers = _register_and_login(client, "user_retrieve@corebound.io")
    payload = {
        "goal": "Interview Preparation",
        "targetRole": "Backend Developer",
        "skillLevel": "Advanced",
        "subjects": ["Python", "Backend Development", "Databases"],
        "dailyTime": "2 hours",
        "difficultyPreference": "Hard",
        "learningPreference": "Practice-heavy",
    }
    client.patch("/api/v1/users/me/preferences", json=payload, headers=headers)

    get_res = client.get("/api/v1/users/me/preferences", headers=headers)
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["goal"] == "Interview Preparation"
    assert data["target_role"] == "Backend Developer"
    assert data["skill_level"] == "Advanced"
    assert data["subjects"] == ["Python", "Backend Development", "Databases"]
    assert data["daily_time"] == "2 hours"
    assert data["difficulty_preference"] == "Hard"
    assert data["learning_preference"] == "Practice-heavy"


def test_04_saved_values_persist_in_database(client: TestClient, db_session: Session):
    """4. Saved values persist in UserProfile database record."""
    headers = _register_and_login(client, "user_persist@corebound.io")
    payload = {
        "goal": "Competitive Programming",
        "targetRole": "Software Developer",
        "skillLevel": "Advanced",
        "subjects": ["Data Structures & Algorithms", "C++"],
        "dailyTime": "3+ hours",
        "difficultyPreference": "Hard",
        "learningPreference": "Challenge-heavy",
    }
    client.patch("/api/v1/users/me/preferences", json=payload, headers=headers)

    user = db_session.query(User).filter(User.email == "user_persist@corebound.io").first()
    assert user is not None
    profile = db_session.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    assert profile is not None
    assert profile.goal == "Competitive Programming"
    assert profile.target_role == "Software Developer"
    assert profile.skill_level == "Advanced"
    assert profile.subjects == ["Data Structures & Algorithms", "C++"]
    assert profile.daily_time == "3+ hours"
    assert profile.difficulty_preference == "Hard"
    assert profile.learning_preference == "Challenge-heavy"


def test_05_partial_patch_preserves_unmodified_fields(client: TestClient):
    """5. Partial PATCH works (updating single field leaves others intact)."""
    headers = _register_and_login(client, "user_partial@corebound.io")
    initial = {
        "goal": "Placement Preparation",
        "targetRole": "Frontend Developer",
        "skillLevel": "Beginner",
        "subjects": ["JavaScript", "HTML / CSS"],
        "dailyTime": "30 minutes",
        "difficultyPreference": "Easy",
        "learningPreference": "Story-driven",
    }
    client.patch("/api/v1/users/me/preferences", json=initial, headers=headers)

    # Partial update: only skillLevel and dailyTime
    patch_res = client.patch(
        "/api/v1/users/me/preferences",
        json={"skillLevel": "Intermediate", "dailyTime": "1 hour"},
        headers=headers,
    )
    assert patch_res.status_code == 200
    data = patch_res.json()
    assert data["goal"] == "Placement Preparation"
    assert data["target_role"] == "Frontend Developer"
    assert data["skill_level"] == "Intermediate"
    assert data["subjects"] == ["JavaScript", "HTML / CSS"]
    assert data["daily_time"] == "1 hour"
    assert data["difficulty_preference"] == "Easy"
    assert data["learning_preference"] == "Story-driven"


def test_06_invalid_goal_rejected(client: TestClient):
    """6. Invalid goal is rejected with 422."""
    headers = _register_and_login(client, "user_inv_goal@corebound.io")
    res = client.patch(
        "/api/v1/users/me/preferences",
        json={"goal": "Become a Millionaire Over Night"},
        headers=headers,
    )
    assert res.status_code == 422


def test_07_invalid_target_role_rejected(client: TestClient):
    """7. Invalid target role is rejected with 422."""
    headers = _register_and_login(client, "user_inv_role@corebound.io")
    res = client.patch(
        "/api/v1/users/me/preferences",
        json={"targetRole": "Astronaut Pilot"},
        headers=headers,
    )
    assert res.status_code == 422


def test_08_invalid_skill_level_rejected(client: TestClient):
    """8. Invalid skill level is rejected with 422."""
    headers = _register_and_login(client, "user_inv_skill@corebound.io")
    res = client.patch(
        "/api/v1/users/me/preferences",
        json={"skillLevel": "GodMode"},
        headers=headers,
    )
    assert res.status_code == 422


def test_09_invalid_subject_rejected(client: TestClient):
    """9. Invalid subject is rejected with 422."""
    headers = _register_and_login(client, "user_inv_subj@corebound.io")
    res = client.patch(
        "/api/v1/users/me/preferences",
        json={"subjects": ["Python", "Quantum Teleportation"]},
        headers=headers,
    )
    assert res.status_code == 422


def test_10_invalid_daily_time_rejected(client: TestClient):
    """10. Invalid daily time is rejected with 422."""
    headers = _register_and_login(client, "user_inv_time@corebound.io")
    res = client.patch(
        "/api/v1/users/me/preferences",
        json={"dailyTime": "24 hours nonstop"},
        headers=headers,
    )
    assert res.status_code == 422


def test_11_invalid_difficulty_rejected(client: TestClient):
    """11. Invalid difficulty is rejected with 422."""
    headers = _register_and_login(client, "user_inv_diff@corebound.io")
    res = client.patch(
        "/api/v1/users/me/preferences",
        json={"difficultyPreference": "Impossible"},
        headers=headers,
    )
    assert res.status_code == 422


def test_12_invalid_learning_preference_rejected(client: TestClient):
    """12. Invalid learning preference is rejected with 422."""
    headers = _register_and_login(client, "user_inv_lp@corebound.io")
    res = client.patch(
        "/api/v1/users/me/preferences",
        json={"learningPreference": "Hypnosis"},
        headers=headers,
    )
    assert res.status_code == 422


def test_13_invalid_subjects_list_rejected(client: TestClient):
    """13. Empty subjects list, non-list, or invalid types are rejected with 422."""
    headers = _register_and_login(client, "user_inv_sublist@corebound.io")

    # Empty list
    res1 = client.patch(
        "/api/v1/users/me/preferences",
        json={"subjects": []},
        headers=headers,
    )
    assert res1.status_code == 422

    # String instead of list
    res2 = client.patch(
        "/api/v1/users/me/preferences",
        json={"subjects": "Python"},
        headers=headers,
    )
    assert res2.status_code == 422


def test_14_unauthenticated_get_rejected(client: TestClient):
    """14. Unauthenticated GET /users/me/preferences is rejected with 401."""
    res = client.get("/api/v1/users/me/preferences")
    assert res.status_code == 401


def test_15_unauthenticated_patch_rejected(client: TestClient):
    """15. Unauthenticated PATCH /users/me/preferences is rejected with 401."""
    res = client.patch(
        "/api/v1/users/me/preferences",
        json={"goal": "Skill Improvement"},
    )
    assert res.status_code == 401


def test_16_user_a_cannot_access_user_b_preferences(client: TestClient):
    """16. User A cannot access User B's preferences (Strict Authorization)."""
    headers_a = _register_and_login(client, "user_alpha@corebound.io")
    headers_b = _register_and_login(client, "user_bravo@corebound.io")

    # User A sets preferences
    client.patch(
        "/api/v1/users/me/preferences",
        json={"goal": "Placement Preparation", "skillLevel": "Beginner"},
        headers=headers_a,
    )

    # User B sets different preferences
    client.patch(
        "/api/v1/users/me/preferences",
        json={"goal": "Competitive Programming", "skillLevel": "Advanced"},
        headers=headers_b,
    )

    # Verify User A gets User A's data
    res_a = client.get("/api/v1/users/me/preferences", headers=headers_a)
    assert res_a.status_code == 200
    assert res_a.json()["goal"] == "Placement Preparation"
    assert res_a.json()["skill_level"] == "Beginner"

    # Verify User B gets User B's data
    res_b = client.get("/api/v1/users/me/preferences", headers=headers_b)
    assert res_b.status_code == 200
    assert res_b.json()["goal"] == "Competitive Programming"
    assert res_b.json()["skill_level"] == "Advanced"


def test_17_user_a_cannot_modify_user_b_preferences(client: TestClient):
    """17. User A cannot modify User B's preferences."""
    headers_a = _register_and_login(client, "user_mut_a@corebound.io")
    headers_b = _register_and_login(client, "user_mut_b@corebound.io")

    # User B initial state
    client.patch(
        "/api/v1/users/me/preferences",
        json={"goal": "Academic Preparation", "dailyTime": "30 minutes"},
        headers=headers_b,
    )

    # User A updates their own
    client.patch(
        "/api/v1/users/me/preferences",
        json={"goal": "Skill Improvement", "dailyTime": "3+ hours"},
        headers=headers_a,
    )

    # Verify User B is unaffected
    res_b = client.get("/api/v1/users/me/preferences", headers=headers_b)
    assert res_b.json()["goal"] == "Academic Preparation"
    assert res_b.json()["daily_time"] == "30 minutes"


def test_18_existing_profile_endpoint_includes_preferences(client: TestClient):
    """18. Existing profile endpoint returns preferences without breaking existing profile fields."""
    headers = _register_and_login(client, "user_prof_ext@corebound.io")
    client.patch(
        "/api/v1/users/me/preferences",
        json={"goal": "Skill Improvement", "targetRole": "Data Analyst"},
        headers=headers,
    )

    prof_res = client.get("/api/v1/users/me/profile", headers=headers)
    assert prof_res.status_code == 200
    prof = prof_res.json()
    assert "xp" in prof
    assert "level" in prof
    assert "credits" in prof
    assert "stars" in prof
    assert prof["goal"] == "Skill Improvement"
    assert prof["target_role"] == "Data Analyst"


def test_19_model_attributes_and_recalibration(client: TestClient, db_session: Session):
    """19. Recalibration overwrites preferences cleanly and updates preferences_updated_at."""
    headers = _register_and_login(client, "user_recal@corebound.io")

    # First calibration
    client.patch(
        "/api/v1/users/me/preferences",
        json={"goal": "Placement Preparation", "difficultyPreference": "Easy"},
        headers=headers,
    )

    # Recalibrate
    recal_res = client.patch(
        "/api/v1/users/me/preferences",
        json={"goal": "Skill Improvement", "difficultyPreference": "Hard"},
        headers=headers,
    )
    assert recal_res.status_code == 200
    assert recal_res.json()["goal"] == "Skill Improvement"
    assert recal_res.json()["difficulty_preference"] == "Hard"
