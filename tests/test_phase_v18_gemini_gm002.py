"""
Phase V18 Gemini + GM002 Challenge Generator Backend Tests

Tests all 20 required backend verification scenarios:
1. Mission 3 generates GM002
2. correct gameplay type
3. valid instruction
4. valid objects
5. valid slots
6. unique object IDs
7. unique slot IDs
8. valid internal mapping
9. every object maps to one valid slot
10. unknown mapping IDs rejected
11. malformed Gemini JSON rejected
12. missing mapping rejected
13. public response is sanitized
14. no canonical mapping in public response
15. authentication required
16. user isolation
17. adaptive difficulty is respected
18. mission context cannot be overridden by client
19. challenge persistence works
20. challenge ID uniqueness

ALL TESTS USE MOCKED GEMINI CLIENT.
"""

import json
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.ai.gemini_client import gemini_client
from app.core.security import create_access_token
from app.models.challenge import Challenge
from app.models.mission import Mission, DIFFICULTY_EASY, DIFFICULTY_MEDIUM, DIFFICULTY_HARD
from app.models.user import User
from app.models.user_performance import UserPerformance
from app.models.user_profile import UserProfile
from app.services.gemini_question_generator import (
    GeminiGenerationError,
    GeminiValidationError,
    build_gm002_generation_prompt,
    generate_gm002_challenge,
    parse_gemini_json_response,
    sanitize_playable_gm002,
    validate_gemini_gm002_output,
)
from scripts.seed_curriculum import seed_curriculum


VALID_GEMINI_GM002_RESPONSE = json.dumps({
    "instruction": "Harmonize Energy Channels: Assign each input wavelength component to its matching resonant conduit slot.",
    "objects": [
        {"id": "obj_1", "text": "Wavelength Alpha [500 nm]"},
        {"id": "obj_2", "text": "Wavelength Beta [650 nm]"},
        {"id": "obj_3", "text": "Wavelength Gamma [450 nm]"},
        {"id": "obj_4", "text": "Wavelength Delta [580 nm]"}
    ],
    "slots": [
        {"id": "slot_1", "label": "Cyan Conduit [500 nm]"},
        {"id": "slot_2", "label": "Red Conduit [650 nm]"},
        {"id": "slot_3", "label": "Violet Conduit [450 nm]"},
        {"id": "slot_4", "label": "Yellow Conduit [580 nm]"}
    ],
    "correctMapping": {
        "obj_1": "slot_1",
        "obj_2": "slot_2",
        "obj_3": "slot_3",
        "obj_4": "slot_4"
    },
    "explanation": "Direct optical resonance match between wavelength spectra and receiver conduits."
})


def _setup_test_env(db: Session):
    """Seed curriculum and return seeded missions."""
    seed_curriculum(db)
    missions = db.query(Mission).order_by(Mission.order_index).all()
    return missions


def _register_user(client: TestClient, email: str = "v18_user@test.com", password: str = "pass123"):
    reg = client.post("/api/v1/auth/register", json={"email": email, "password": password})
    user_id = reg.json()["id"]
    token = create_access_token(subject=user_id)
    return user_id, token


# ─────────────────────────────────────────────────────────────────────────────
# UNIT & STRUCTURAL TESTS (1–12)
# ─────────────────────────────────────────────────────────────────────────────

def test_1_mission_3_generates_gm002(client: TestClient, db_session: Session):
    """1. Requesting mission 3 generates a GM002 challenge."""
    _setup_test_env(db_session)
    user_id, token = _register_user(client, "v18_m3@test.com")

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM002_RESPONSE):
        res = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 3},
            headers={"Authorization": f"Bearer {token}"}
        )

    assert res.status_code == 200
    data = res.json()
    assert data["gameplayType"] == "GM002"
    assert data["metadata"]["missionId"] == 3


def test_2_correct_gameplay_type():
    """2. Validated output preserves gameplayType GM002."""
    parsed = parse_gemini_json_response(VALID_GEMINI_GM002_RESPONSE)
    validated = validate_gemini_gm002_output(parsed)
    context = {"mission_id": 3, "topic_id": 3, "difficulty": "MEDIUM"}
    sanitized = sanitize_playable_gm002("gm002_test", validated, context)
    assert sanitized["gameplay_type"] == "GM002"


def test_3_valid_instruction():
    """3. Validated output contains a non-empty instruction."""
    parsed = parse_gemini_json_response(VALID_GEMINI_GM002_RESPONSE)
    validated = validate_gemini_gm002_output(parsed)
    assert "instruction" in validated
    assert len(validated["instruction"]) > 10


def test_4_valid_objects():
    """4. Objects list contains valid objects with id and text."""
    parsed = parse_gemini_json_response(VALID_GEMINI_GM002_RESPONSE)
    validated = validate_gemini_gm002_output(parsed)
    assert len(validated["objects"]) == 4
    for obj in validated["objects"]:
        assert "id" in obj and len(obj["id"]) > 0
        assert "text" in obj and len(obj["text"]) > 0


def test_5_valid_slots():
    """5. Slots list contains valid slots with id and label."""
    parsed = parse_gemini_json_response(VALID_GEMINI_GM002_RESPONSE)
    validated = validate_gemini_gm002_output(parsed)
    assert len(validated["slots"]) == 4
    for slot in validated["slots"]:
        assert "id" in slot and len(slot["id"]) > 0
        assert "label" in slot and len(slot["label"]) > 0


def test_6_unique_object_ids():
    """6. Duplicate object IDs in Gemini output raise GeminiValidationError."""
    bad_data = {
        "instruction": "Match the pairs",
        "objects": [
            {"id": "obj_1", "text": "A"},
            {"id": "obj_1", "text": "B"},
            {"id": "obj_3", "text": "C"}
        ],
        "slots": [
            {"id": "slot_1", "label": "1"},
            {"id": "slot_2", "label": "2"},
            {"id": "slot_3", "label": "3"}
        ],
        "correctMapping": {"obj_1": "slot_1", "obj_3": "slot_3"}
    }
    with pytest.raises(GeminiValidationError, match="Duplicate object ID detected"):
        validate_gemini_gm002_output(bad_data)


def test_7_unique_slot_ids():
    """7. Duplicate slot IDs in Gemini output raise GeminiValidationError."""
    bad_data = {
        "instruction": "Match the pairs",
        "objects": [
            {"id": "obj_1", "text": "A"},
            {"id": "obj_2", "text": "B"},
            {"id": "obj_3", "text": "C"}
        ],
        "slots": [
            {"id": "slot_1", "label": "1"},
            {"id": "slot_1", "label": "2"},
            {"id": "slot_3", "label": "3"}
        ],
        "correctMapping": {"obj_1": "slot_1", "obj_2": "slot_1", "obj_3": "slot_3"}
    }
    with pytest.raises(GeminiValidationError, match="Duplicate slot ID detected"):
        validate_gemini_gm002_output(bad_data)


def test_8_valid_internal_mapping(db_session: Session):
    """8. Generating GM002 challenge stores valid internal correctMapping in DB."""
    missions = _setup_test_env(db_session)
    m3 = missions[2]
    context = {
        "mission_id": m3.id,
        "topic_id": m3.topic_id,
        "difficulty": "MEDIUM",
        "generation_context": {"objective": m3.objective}
    }

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM002_RESPONSE):
        sanitized = generate_gm002_challenge(context, m3, db_session)

    # Verify Challenge stored in DB
    record = db_session.query(Challenge).filter(Challenge.gameplay_type == "GM002").first()
    assert record is not None
    assert record.ai_generated is True
    assert record.validated is True
    internal_data = json.loads(record.content)
    assert "correctMapping" in internal_data
    assert internal_data["correctMapping"]["obj_1"] == "slot_1"


def test_9_every_object_maps_to_one_valid_slot():
    """9. Missing mapping for any object raises GeminiValidationError."""
    bad_data = {
        "instruction": "Match pairs",
        "objects": [
            {"id": "obj_1", "text": "A"},
            {"id": "obj_2", "text": "B"},
            {"id": "obj_3", "text": "C"}
        ],
        "slots": [
            {"id": "slot_1", "label": "1"},
            {"id": "slot_2", "label": "2"},
            {"id": "slot_3", "label": "3"}
        ],
        "correctMapping": {
            "obj_1": "slot_1",
            "obj_2": "slot_2"
            # obj_3 is unmapped!
        }
    }
    with pytest.raises(GeminiValidationError, match="missing mapping for objects"):
        validate_gemini_gm002_output(bad_data)


def test_10_unknown_mapping_ids_rejected():
    """10. Mapping targeting unknown slot or containing unknown object raises GeminiValidationError."""
    bad_data = {
        "instruction": "Match pairs",
        "objects": [
            {"id": "obj_1", "text": "A"},
            {"id": "obj_2", "text": "B"},
            {"id": "obj_3", "text": "C"}
        ],
        "slots": [
            {"id": "slot_1", "label": "1"},
            {"id": "slot_2", "label": "2"},
            {"id": "slot_3", "label": "3"}
        ],
        "correctMapping": {
            "obj_1": "slot_1",
            "obj_2": "slot_2",
            "obj_3": "slot_UNKNOWN"
        }
    }
    with pytest.raises(GeminiValidationError, match="unknown slot ID"):
        validate_gemini_gm002_output(bad_data)


def test_11_malformed_gemini_json_rejected():
    """11. Malformed JSON raises GeminiValidationError."""
    with pytest.raises(GeminiValidationError):
        parse_gemini_json_response("Non-JSON output from LLM")


def test_12_missing_mapping_rejected():
    """12. Missing correctMapping entirely raises GeminiValidationError."""
    bad_data = {
        "instruction": "Match pairs",
        "objects": [{"id": "obj_1", "text": "A"}, {"id": "obj_2", "text": "B"}, {"id": "obj_3", "text": "C"}],
        "slots": [{"id": "slot_1", "label": "1"}, {"id": "slot_2", "label": "2"}, {"id": "slot_3", "label": "3"}]
    }
    with pytest.raises(GeminiValidationError, match="correctMapping is missing"):
        validate_gemini_gm002_output(bad_data)


# ─────────────────────────────────────────────────────────────────────────────
# SECURITY & INTEGRATION TESTS (13–20)
# ─────────────────────────────────────────────────────────────────────────────

def test_13_public_response_is_sanitized(client: TestClient, db_session: Session):
    """13. Public response contains required GM002 fields: id, gameplayType, instruction, objects, slots, metadata."""
    _setup_test_env(db_session)
    user_id, token = _register_user(client, "v18_pub@test.com")

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM002_RESPONSE):
        res = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 3},
            headers={"Authorization": f"Bearer {token}"}
        )

    assert res.status_code == 200
    data = res.json()
    assert "challengeId" in data
    assert "instruction" in data
    assert "objects" in data
    assert "slots" in data
    assert "metadata" in data
    assert len(data["objects"]) == 4
    assert len(data["slots"]) == 4


def test_14_no_canonical_mapping_in_public_response(client: TestClient, db_session: Session):
    """14. Playable response strictly omits any form of mapping or answer key."""
    _setup_test_env(db_session)
    user_id, token = _register_user(client, "v18_sec@test.com")

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM002_RESPONSE):
        res = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 3},
            headers={"Authorization": f"Bearer {token}"}
        )

    data = res.json()
    forbidden_keys = [
        "correctMapping", "canonicalMapping", "canonical_mapping", "correct_mapping",
        "answerMap", "solution", "solutions", "answer", "correctAnswer", "correctAnswers",
        "mapping", "solutionMap", "expectedPairs", "expectedMapping", "correctSlot", "correctSlotId", "answerKey"
    ]

    for key in forbidden_keys:
        assert key not in data, f"Forbidden key '{key}' found in playable response root"

    for obj in data["objects"]:
        for key in forbidden_keys:
            assert key not in obj, f"Forbidden key '{key}' found in object"

    for slot in data["slots"]:
        for key in forbidden_keys:
            assert key not in slot, f"Forbidden key '{key}' found in slot"


def test_15_authentication_required(client: TestClient, db_session: Session):
    """15. Unauthenticated requests to /api/v1/challenges/generate return 401."""
    _setup_test_env(db_session)
    res = client.post("/api/v1/challenges/generate", json={"missionId": 3})
    assert res.status_code == 401


def test_16_user_isolation(client: TestClient, db_session: Session):
    """16. Authenticated user's performance is used, isolated from other users."""
    missions = _setup_test_env(db_session)
    m3 = missions[2]

    # User 1: 90% accuracy
    u1, tok1 = _register_user(client, "user_iso1@test.com")
    db_session.add(UserPerformance(
        user_id=u1,
        topic_id=m3.topic_id,
        gameplay_type="GM002",
        difficulty=DIFFICULTY_MEDIUM,
        total_attempts=10,
        correct_attempts=9,
        accuracy=0.90,
    ))
    db_session.commit()

    # User 2: 10% accuracy
    u2, tok2 = _register_user(client, "user_iso2@test.com")
    db_session.add(UserPerformance(
        user_id=u2,
        topic_id=m3.topic_id,
        gameplay_type="GM002",
        difficulty=DIFFICULTY_MEDIUM,
        total_attempts=10,
        correct_attempts=1,
        accuracy=0.10,
    ))
    db_session.commit()

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM002_RESPONSE) as mock_gen:
        res1 = client.post("/api/v1/challenges/generate", json={"missionId": 3}, headers={"Authorization": f"Bearer {tok1}"})
        assert res1.status_code == 200
        assert res1.json()["metadata"]["difficulty"] == "HARD"

        res2 = client.post("/api/v1/challenges/generate", json={"missionId": 3}, headers={"Authorization": f"Bearer {tok2}"})
        assert res2.status_code == 200
        assert res2.json()["metadata"]["difficulty"] == "EASY"


def test_17_adaptive_difficulty_is_respected(client: TestClient, db_session: Session):
    """17. Adaptive difficulty from V16 context is reflected in the prompt guidance."""
    _setup_test_env(db_session)
    user_id, token = _register_user(client, "v18_diff@test.com")

    # Explicit preference Easy
    client.patch(
        "/api/v1/users/me/preferences",
        json={"difficultyPreference": "Easy"},
        headers={"Authorization": f"Bearer {token}"}
    )

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM002_RESPONSE) as mock_gen:
        res = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 3},
            headers={"Authorization": f"Bearer {token}"}
        )

    assert res.status_code == 200
    assert res.json()["metadata"]["difficulty"] == "EASY"
    prompt_sent = mock_gen.call_args[0][0]
    assert "Difficulty: EASY" in prompt_sent


def test_18_mission_context_cannot_be_overridden_by_client(client: TestClient, db_session: Session):
    """18. Client sending difficulty or topic cannot override backend curriculum/context."""
    _setup_test_env(db_session)
    user_id, token = _register_user(client, "v18_no_override@test.com")

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM002_RESPONSE):
        res = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 3, "difficulty": "EASY", "gameplayType": "GM001", "topic": "FakeTopic"},
            headers={"Authorization": f"Bearer {token}"}
        )

    assert res.status_code == 200
    data = res.json()
    assert data["gameplayType"] == "GM002"


def test_19_challenge_persistence_works(client: TestClient, db_session: Session):
    """19. Challenge record is persisted in DB with topic, difficulty, and validated=True."""
    _setup_test_env(db_session)
    user_id, token = _register_user(client, "v18_persist@test.com")

    count_before = db_session.query(Challenge).count()

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM002_RESPONSE):
        res = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 3},
            headers={"Authorization": f"Bearer {token}"}
        )
    assert res.status_code == 200

    count_after = db_session.query(Challenge).count()
    assert count_after == count_before + 1

    latest = db_session.query(Challenge).order_by(Challenge.id.desc()).first()
    assert latest.gameplay_type == "GM002"
    assert latest.ai_generated is True
    assert latest.validated is True


def test_20_challenge_id_uniqueness(client: TestClient, db_session: Session):
    """20. Generating multiple challenges produces distinct, collision-free challenge IDs."""
    _setup_test_env(db_session)
    user_id, token = _register_user(client, "v18_unique@test.com")

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM002_RESPONSE):
        res1 = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 3},
            headers={"Authorization": f"Bearer {token}"}
        )
        res2 = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 3},
            headers={"Authorization": f"Bearer {token}"}
        )

    assert res1.status_code == 200
    assert res2.status_code == 200

    id1 = res1.json()["challengeId"]
    id2 = res2.json()["challengeId"]
    assert id1 != id2, f"Challenge IDs must be unique! Got '{id1}' twice."
