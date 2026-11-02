"""
Test Phase 4: Real Gameplay Session + Generic Mission Start
Verifies that:
1. corebound-api.js defines startGameplay(missionId).
2. ch1_missions.html includes corebound-api.js before ch1_missions.js.
3. ch1_missions.js starts generic gameplay via cbApi.startGameplay(mission.id), manages runtime session state, routes based on gameplay_type, and includes GM001-GM004 renderers.
4. Backend POST /api/v1/gameplay/start returns 201 with valid session and sanitized playable content for GM001, GM002, GM003, and GM004.
5. Canonical answers/solutions/orders are strictly absent from playable response payloads.
6. Unauthenticated requests are rejected by backend (401).
7. Invalid mission IDs return 404.
"""

import json
from pathlib import Path
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.mission import Mission
from app.models.mission_progress import MissionProgress, STATUS_AVAILABLE
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


def test_api_client_has_gameplay_start_method():
    """Verify corebound-api.js defines startGameplay."""
    api_file = FRONTEND_DIR / "corebound-api.js"
    assert api_file.exists()
    content = api_file.read_text(encoding="utf-8")

    assert "startGameplay(" in content
    assert "/api/v1/gameplay/start" in content
    assert "mission_id" in content


def test_ch1_missions_html_includes_api_client():
    """Verify ch1_missions.html includes corebound-api.js before ch1_missions.js."""
    html_file = FRONTEND_DIR / "ch1_missions.html"
    assert html_file.exists()
    content = html_file.read_text(encoding="utf-8")

    assert 'src="corebound-api.js"' in content
    assert 'src="ch1_missions.js"' in content
    api_idx = content.find('src="corebound-api.js"')
    js_idx = content.find('src="ch1_missions.js"')
    assert api_idx < js_idx, "corebound-api.js must be loaded before ch1_missions.js"


def test_ch1_missions_js_session_and_gm_routing():
    """Verify ch1_missions.js implements generic mission start, session state, and GM renderers."""
    missions_js = FRONTEND_DIR / "ch1_missions.js"
    assert missions_js.exists()
    content = missions_js.read_text(encoding="utf-8")

    # Session state fields
    assert "activeGameplaySessionId" in content
    assert "activePlayableChallenge" in content
    assert "activeGameplayType" in content
    assert "isBackendSession" in content

    # Backend API integration
    assert "window.cbApi.startGameplay" in content
    assert "renderBackendPlayable" in content

    # GM Renderers
    assert "renderGM001Backend" in content
    assert "renderGM002Backend" in content
    assert "renderGM003Backend" in content
    assert "renderGM004Backend" in content

    # Loading indicator
    assert "GENERATING MISSION CALIBRATION MATRIX" in content


@pytest.fixture
def auth_user(client: TestClient, db_session: Session) -> tuple[int, dict[str, str]]:
    """Register and login a user, returning (user_id, auth Bearer headers)."""
    register_data = {
        "email": "phase4_pilot@corebound.ai",
        "password": "Password123!",
    }
    reg_res = client.post("/api/v1/auth/register", json=register_data)
    user_id = reg_res.json()["id"]

    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "phase4_pilot@corebound.ai", "password": "Password123!"},
    )
    token = login_res.json()["access_token"]
    return user_id, {"Authorization": f"Bearer {token}"}


def _unlock_mission(db: Session, user_id: int, mission_id: int):
    """Helper to set mission progress to AVAILABLE for testing."""
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


def test_backend_gameplay_start_unauthenticated(client: TestClient):
    """POST /api/v1/gameplay/start without token returns 401."""
    res = client.post("/api/v1/gameplay/start", json={"mission_id": 1})
    assert res.status_code == 401


def test_backend_gameplay_start_invalid_mission(client: TestClient, auth_user: tuple[int, dict[str, str]], db_session: Session):
    """POST /api/v1/gameplay/start with invalid mission_id returns 404."""
    user_id, headers = auth_user
    res = client.post(
        "/api/v1/gameplay/start",
        json={"mission_id": 999999},
        headers=headers,
    )
    assert res.status_code == 404


def test_backend_gameplay_start_gm001(client: TestClient, auth_user: tuple[int, dict[str, str]], db_session: Session):
    """POST /api/v1/gameplay/start for Mission 1 (GM001)."""
    user_id, headers = auth_user
    seed_curriculum(db_session)
    _unlock_mission(db_session, user_id, 1)

    with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_MOCK_RESPONSE):
        res = client.post(
            "/api/v1/gameplay/start",
            json={"mission_id": 1},
            headers=headers,
        )
    assert res.status_code == 201
    data = res.json()

    assert "session_id" in data
    assert data["mission_id"] == 1
    assert data["gameplay_type"] == "GM001"
    assert "difficulty" in data
    assert "playable" in data

    playable = data["playable"]
    content = playable.get("content", playable)
    assert "question" in content
    assert "options" in content
    assert len(content["options"]) == 4

    # Security check: canonical answer MUST NOT be present in playable payload
    assert "answer" not in content
    assert "correctAnswer" not in content
    assert "correct_answer" not in content


def test_backend_gameplay_start_gm002(client: TestClient, auth_user: tuple[int, dict[str, str]], db_session: Session):
    """POST /api/v1/gameplay/start for Mission 3 (GM002)."""
    user_id, headers = auth_user
    seed_curriculum(db_session)
    _unlock_mission(db_session, user_id, 3)

    with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM002_MOCK_RESPONSE):
        res = client.post(
            "/api/v1/gameplay/start",
            json={"mission_id": 3},
            headers=headers,
        )
    assert res.status_code == 201
    data = res.json()

    assert data["mission_id"] == 3
    assert data["gameplay_type"] == "GM002"
    playable = data["playable"]
    content = playable.get("content", playable)

    assert "objects" in content
    assert "slots" in content
    assert "instructions" in content

    # Security check: canonical mapping MUST NOT be present in playable payload
    assert "canonical_mapping" not in content
    assert "mapping" not in content


def test_backend_gameplay_start_gm003(client: TestClient, auth_user: tuple[int, dict[str, str]], db_session: Session):
    """POST /api/v1/gameplay/start for Mission 5 (GM003)."""
    user_id, headers = auth_user
    seed_curriculum(db_session)
    _unlock_mission(db_session, user_id, 5)

    with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM003_MOCK_RESPONSE):
        res = client.post(
            "/api/v1/gameplay/start",
            json={"mission_id": 5},
            headers=headers,
        )
    assert res.status_code == 201
    data = res.json()

    assert data["mission_id"] == 5
    assert data["gameplay_type"] == "GM003"
    playable = data["playable"]
    content = playable.get("content", playable)

    assert "items" in content
    assert "instructions" in content

    # Security check: canonical order MUST NOT be present in playable payload
    assert "canonical_order" not in content
    assert "order" not in content


def test_backend_gameplay_start_gm004(client: TestClient, auth_user: tuple[int, dict[str, str]], db_session: Session):
    """POST /api/v1/gameplay/start for Mission 6 (GM004)."""
    user_id, headers = auth_user
    seed_curriculum(db_session)
    _unlock_mission(db_session, user_id, 6)

    with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM004_MOCK_RESPONSE):
        res = client.post(
            "/api/v1/gameplay/start",
            json={"mission_id": 6},
            headers=headers,
        )
    assert res.status_code == 201
    data = res.json()

    assert data["mission_id"] == 6
    assert data["gameplay_type"] == "GM004"
    playable = data["playable"]
    content = playable.get("content", playable)

    assert "question" in content
    assert "answer_type" in content

    # Security check: accepted answers MUST NOT be present in playable payload
    assert "accepted_answers" not in content
    assert "answer" not in content


def test_backend_gameplay_start_mission10_climax(client: TestClient, auth_user: tuple[int, dict[str, str]], db_session: Session):
    """POST /api/v1/gameplay/start for Mission 10 (Boss Climax / GM004)."""
    user_id, headers = auth_user
    seed_curriculum(db_session)
    _unlock_mission(db_session, user_id, 10)

    with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM004_MOCK_RESPONSE):
        res = client.post(
            "/api/v1/gameplay/start",
            json={"mission_id": 10},
            headers=headers,
        )
    assert res.status_code == 201
    data = res.json()

    assert data["mission_id"] == 10
    assert data["gameplay_type"] == "GM004"
    playable = data["playable"]
    content = playable.get("content", playable)

    assert "question" in content or "phases_playable" in content
    assert "accepted_answers" not in content
