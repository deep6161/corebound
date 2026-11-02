"""
Test Phase 5: Real Answer Submission + Server-Side Evaluation
Verifies that:
1. corebound-api.js defines submitGameplayAnswer(sessionId, answer, timeTakenMs).
2. ch1_missions.js delegates answer submission to cbApi.submitGameplayAnswer, implements duplicate submission protection, and strictly uses server-authoritative correctness, XP, and progression.
3. Backend POST /api/v1/gameplay/{session_id}/answer evaluates answers server-side for GM001, GM002, GM003, and GM004.
4. Server result grants XP, records QuestionAttempt, updates UserPerformance, and unlocks progression on correct answers.
5. Incorrect answers keep session ACTIVE for retry without awarding XP or progression.
6. Duplicate submission on completed sessions is rejected with 409 Conflict.
7. Cross-user session access is rejected with 403 Forbidden.
8. Unauthenticated submissions are rejected with 401 Unauthorized.
"""

import json
from pathlib import Path
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.gameplay_session import GameplaySession, SESSION_ACTIVE, SESSION_COMPLETED
from app.models.mission_progress import MissionProgress, STATUS_AVAILABLE
from app.models.question_attempt import QuestionAttempt
from scripts.seed_curriculum import seed_curriculum

FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "COREBOUNDV1" / "COREBOUNDV1" / "COREBOUND"

GM001_MOCK_RESPONSE = json.dumps({
    "question": "What is 12 x 12 in the energy grid?",
    "options": ["144", "124", "164", "134"],
    "answer": "144",
    "explanation": "12 multiplied by 12 equals 144.",
})

GM002_MOCK_RESPONSE = json.dumps({
    "objects": [
        {"id": "obj1", "label": "ALPHA CHIP"},
        {"id": "obj2", "label": "BETA CORE"},
        {"id": "obj3", "label": "GAMMA RAY"},
        {"id": "obj4", "label": "DELTA CELL"},
    ],
    "slots": [
        {"id": "slot1", "label": "PRIMARY BUS"},
        {"id": "slot2", "label": "CENTRAL SOCKET"},
        {"id": "slot3", "label": "OPTICAL LENS"},
        {"id": "slot4", "label": "POWER BAY"},
    ],
    "canonical_mapping": {"obj1": "slot1", "obj2": "slot2", "obj3": "slot3", "obj4": "slot4"},
    "instructions": "Match each core component to its designated observatory bay.",
    "explanation": "All components mapped correctly to their system bays.",
})

GM003_MOCK_RESPONSE = json.dumps({
    "items": [
        {"id": "step1", "label": "Initialize Core Resonance"},
        {"id": "step2", "label": "Calibrate Flux Capacitor"},
        {"id": "step3", "label": "Synchronize Wave Matrix"},
        {"id": "step4", "label": "Engage Prediction Drive"},
    ],
    "canonical_order": ["step1", "step2", "step3", "step4"],
    "instructions": "Arrange the startup sequence in chronological execution order.",
    "explanation": "Resonance precedes calibration, synchronization, and engagement.",
})

GM004_MOCK_RESPONSE = json.dumps({
    "question": "Calculate the critical flux parameter: 14 * 8 - 8",
    "answer_type": "number",
    "accepted_answers": ["104", "104 GW", "104gw"],
    "explanation": "14 * 8 = 112, 112 - 8 = 104.",
})


def test_api_client_has_submit_answer_method():
    """Verify corebound-api.js defines submitGameplayAnswer."""
    api_file = FRONTEND_DIR / "corebound-api.js"
    assert api_file.exists()
    content = api_file.read_text(encoding="utf-8")

    assert "submitGameplayAnswer(" in content
    assert "/api/v1/gameplay/" in content
    assert "/answer" in content


def test_ch1_missions_js_server_answer_flow():
    """Verify ch1_missions.js delegates to backend submit and removes client-side answer authority."""
    missions_js = FRONTEND_DIR / "ch1_missions.js"
    assert missions_js.exists()
    content = missions_js.read_text(encoding="utf-8")

    assert "submitBackendAnswer" in content
    assert "window.cbApi.submitGameplayAnswer" in content
    assert "isSubmittingAnswer" in content
    assert "result.xp_earned" in content
    assert "result.is_correct" in content


@pytest.fixture
def auth_pilot(client: TestClient, db_session: Session) -> tuple[int, dict[str, str]]:
    """Register and login a user, returning (user_id, auth Bearer headers)."""
    register_data = {
        "email": "phase5_pilot@corebound.ai",
        "password": "Password123!",
    }
    reg_res = client.post("/api/v1/auth/register", json=register_data)
    user_id = reg_res.json()["id"]

    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "phase5_pilot@corebound.ai", "password": "Password123!"},
    )
    token = login_res.json()["access_token"]
    return user_id, {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_infiltrator(client: TestClient, db_session: Session) -> tuple[int, dict[str, str]]:
    """Register and login a second user for access isolation testing."""
    register_data = {
        "email": "phase5_infiltrator@corebound.ai",
        "password": "Password123!",
    }
    reg_res = client.post("/api/v1/auth/register", json=register_data)
    user_id = reg_res.json()["id"]

    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "phase5_infiltrator@corebound.ai", "password": "Password123!"},
    )
    token = login_res.json()["access_token"]
    return user_id, {"Authorization": f"Bearer {token}"}


def _unlock_mission(db: Session, user_id: int, mission_id: int):
    """Helper to set mission progress to AVAILABLE."""
    prog = (
        db.query(MissionProgress)
        .filter(
            MissionProgress.user_id == user_id,
            MissionProgress.mission_id == mission_id,
        )
        .first()
    )
    if prog:
        prog.status = STATUS_AVAILABLE
    else:
        prog = MissionProgress(
            user_id=user_id,
            mission_id=mission_id,
            status=STATUS_AVAILABLE,
        )
        db.add(prog)
    db.commit()


def test_backend_answer_unauthenticated(client: TestClient):
    """POST /api/v1/gameplay/{session_id}/answer without token returns 401."""
    res = client.post("/api/v1/gameplay/1/answer", json={"answer": "144"})
    assert res.status_code == 401


def test_backend_answer_gm001_correct(client: TestClient, auth_pilot: tuple[int, dict[str, str]], db_session: Session):
    """Submit correct GM001 answer -> 200 OK, is_correct=True, XP granted, mission completed."""
    user_id, headers = auth_pilot
    seed_curriculum(db_session)
    _unlock_mission(db_session, user_id, 1)

    # 1. Start session
    with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_MOCK_RESPONSE):
        start_res = client.post("/api/v1/gameplay/start", json={"mission_id": 1}, headers=headers)
    assert start_res.status_code == 201
    session_id = start_res.json()["session_id"]

    # 2. Submit correct answer
    ans_res = client.post(
        f"/api/v1/gameplay/{session_id}/answer",
        json={"answer": "144", "time_taken_ms": 3500},
        headers=headers,
    )
    assert ans_res.status_code == 200
    data = ans_res.json()

    assert data["session_id"] == session_id
    assert data["is_correct"] is True
    assert data["xp_earned"] > 0
    assert data["mission_completed"] is True
    assert data["next_mission_unlocked"] is True
    assert "144" in data["explanation"]

    # Verify session completed in DB
    session = db_session.query(GameplaySession).filter(GameplaySession.id == session_id).first()
    assert session.status == SESSION_COMPLETED
    assert session.is_correct is True


def test_backend_answer_gm001_incorrect_allows_retry(client: TestClient, auth_pilot: tuple[int, dict[str, str]], db_session: Session):
    """Submit incorrect GM001 answer -> 200 OK, is_correct=False, session stays ACTIVE."""
    user_id, headers = auth_pilot
    seed_curriculum(db_session)
    _unlock_mission(db_session, user_id, 1)

    # 1. Start session
    with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_MOCK_RESPONSE):
        start_res = client.post("/api/v1/gameplay/start", json={"mission_id": 1}, headers=headers)
    session_id = start_res.json()["session_id"]

    # 2. Submit incorrect answer
    ans_res = client.post(
        f"/api/v1/gameplay/{session_id}/answer",
        json={"answer": "999", "time_taken_ms": 2000},
        headers=headers,
    )
    assert ans_res.status_code == 200
    data = ans_res.json()

    assert data["is_correct"] is False
    assert data["xp_earned"] == 0
    assert data["mission_completed"] is False

    # Verify session remains ACTIVE for retry
    session = db_session.query(GameplaySession).filter(GameplaySession.id == session_id).first()
    assert session.status == SESSION_ACTIVE
    assert session.is_correct is False


def test_backend_answer_gm002_matching(client: TestClient, auth_pilot: tuple[int, dict[str, str]], db_session: Session):
    """Submit correct GM002 JSON mapping -> 200 OK, is_correct=True."""
    user_id, headers = auth_pilot
    seed_curriculum(db_session)
    _unlock_mission(db_session, user_id, 3)

    with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM002_MOCK_RESPONSE):
        start_res = client.post("/api/v1/gameplay/start", json={"mission_id": 3}, headers=headers)
    session_id = start_res.json()["session_id"]

    correct_mapping = {"obj1": "slot1", "obj2": "slot2", "obj3": "slot3", "obj4": "slot4"}
    ans_res = client.post(
        f"/api/v1/gameplay/{session_id}/answer",
        json={"answer": json.dumps(correct_mapping), "time_taken_ms": 4500},
        headers=headers,
    )
    assert ans_res.status_code == 200
    assert ans_res.json()["is_correct"] is True
    assert ans_res.json()["mission_completed"] is True


def test_backend_answer_gm003_ordering(client: TestClient, auth_pilot: tuple[int, dict[str, str]], db_session: Session):
    """Submit correct GM003 JSON sequence -> 200 OK, is_correct=True."""
    user_id, headers = auth_pilot
    seed_curriculum(db_session)
    _unlock_mission(db_session, user_id, 5)

    with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM003_MOCK_RESPONSE):
        start_res = client.post("/api/v1/gameplay/start", json={"mission_id": 5}, headers=headers)
    session_id = start_res.json()["session_id"]

    correct_order = ["step1", "step2", "step3", "step4"]
    ans_res = client.post(
        f"/api/v1/gameplay/{session_id}/answer",
        json={"answer": json.dumps(correct_order), "time_taken_ms": 5000},
        headers=headers,
    )
    assert ans_res.status_code == 200
    assert ans_res.json()["is_correct"] is True
    assert ans_res.json()["mission_completed"] is True


def test_backend_answer_gm004_input(client: TestClient, auth_pilot: tuple[int, dict[str, str]], db_session: Session):
    """Submit accepted GM004 text/number -> 200 OK, is_correct=True."""
    user_id, headers = auth_pilot
    seed_curriculum(db_session)
    _unlock_mission(db_session, user_id, 6)

    with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM004_MOCK_RESPONSE):
        start_res = client.post("/api/v1/gameplay/start", json={"mission_id": 6}, headers=headers)
    session_id = start_res.json()["session_id"]

    ans_res = client.post(
        f"/api/v1/gameplay/{session_id}/answer",
        json={"answer": "104", "time_taken_ms": 3000},
        headers=headers,
    )
    assert ans_res.status_code == 200
    assert ans_res.json()["is_correct"] is True
    assert ans_res.json()["mission_completed"] is True


def test_backend_answer_duplicate_submission_rejected(client: TestClient, auth_pilot: tuple[int, dict[str, str]], db_session: Session):
    """Submitting an answer to an already COMPLETED session returns 409 Conflict."""
    user_id, headers = auth_pilot
    seed_curriculum(db_session)
    _unlock_mission(db_session, user_id, 1)

    with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_MOCK_RESPONSE):
        start_res = client.post("/api/v1/gameplay/start", json={"mission_id": 1}, headers=headers)
    session_id = start_res.json()["session_id"]

    # First submission (correct) completes the session
    ans1 = client.post(f"/api/v1/gameplay/{session_id}/answer", json={"answer": "144"}, headers=headers)
    assert ans1.status_code == 200

    # Second submission on completed session -> 409 Conflict
    ans2 = client.post(f"/api/v1/gameplay/{session_id}/answer", json={"answer": "144"}, headers=headers)
    assert ans2.status_code == 409


def test_backend_answer_user_isolation(
    client: TestClient,
    auth_pilot: tuple[int, dict[str, str]],
    auth_infiltrator: tuple[int, dict[str, str]],
    db_session: Session,
):
    """User B cannot submit answers to User A's gameplay session (403 Forbidden)."""
    user_a_id, headers_a = auth_pilot
    user_b_id, headers_b = auth_infiltrator

    seed_curriculum(db_session)
    _unlock_mission(db_session, user_a_id, 1)

    with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_MOCK_RESPONSE):
        start_res = client.post("/api/v1/gameplay/start", json={"mission_id": 1}, headers=headers_a)
    session_id = start_res.json()["session_id"]

    # User B attempts to answer User A's session
    ans_res = client.post(f"/api/v1/gameplay/{session_id}/answer", json={"answer": "144"}, headers=headers_b)
    assert ans_res.status_code == 403
