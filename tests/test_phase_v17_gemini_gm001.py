"""
Phase V17 Gemini + GM001 Challenge Generator Backend Tests

Tests all 30 scenarios specified in Phase V17:
- Generation (1-8)
- Validation (9-17)
- Security (18-22)
- Architecture (23-28)
- Failure Handling (29-30)

ALL TESTS USE MOCKED GEMINI CLIENT TO PREVENT UNCONTROLLED API SPEND OR FLAKINESS.
"""

import json
from unittest.mock import MagicMock, patch
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.ai.gemini_client import gemini_client
from app.core.security import create_access_token
from app.models.challenge import Challenge
from app.models.mission import Mission, DIFFICULTY_EASY, DIFFICULTY_MEDIUM, DIFFICULTY_HARD
from app.models.mission_progress import MissionProgress
from app.models.reward_event import RewardEvent
from app.models.user import User
from app.models.user_performance import UserPerformance
from app.models.user_profile import UserProfile
from app.services.adaptive_selector import select_adaptive_mission_context
from app.services.gemini_question_generator import (
    GeminiGenerationError,
    GeminiValidationError,
    build_gm001_generation_prompt,
    generate_gm001_challenge,
    parse_gemini_json_response,
    sanitize_playable_gm001,
    validate_gemini_gm001_output,
)
from scripts.seed_curriculum import seed_curriculum


VALID_GEMINI_GM001_RESPONSE = json.dumps({
    "question": "What is the next prime frequency in the sequence: 2, 3, 5, 7, [ ? ]?",
    "options": [
        {"id": "A", "text": "11 Hz"},
        {"id": "B", "text": "9 Hz"},
        {"id": "C", "text": "13 Hz"},
        {"id": "D", "text": "15 Hz"}
    ],
    "correctOptionId": "A",
    "explanation": "11 is the next consecutive prime number after 7."
})


def _setup_test_env(db: Session):
    """Seed curriculum and return seeded missions."""
    seed_curriculum(db)
    missions = db.query(Mission).order_by(Mission.order_index).all()
    return missions


def _register_user(client: TestClient, email: str = "v17_user@test.com", password: str = "pass123"):
    reg = client.post("/api/v1/auth/register", json={"email": email, "password": password})
    user_id = reg.json()["id"]
    token = create_access_token(subject=user_id)
    return user_id, token


# ─────────────────────────────────────────────────────────────────────────────
# 1. GENERATION TESTS (1–8)
# ─────────────────────────────────────────────────────────────────────────────

def test_1_valid_gemini_response(db_session: Session):
    """1. Valid Gemini response parses and validates successfully."""
    parsed = parse_gemini_json_response(VALID_GEMINI_GM001_RESPONSE)
    validated = validate_gemini_gm001_output(parsed)
    assert validated["question"] == "What is the next prime frequency in the sequence: 2, 3, 5, 7, [ ? ]?"
    assert len(validated["options"]) == 4
    assert validated["correctOptionId"] == "A"


def test_2_correct_gm001_structure(db_session: Session):
    """2. Validated output contains expected internal GM001 keys."""
    parsed = parse_gemini_json_response(VALID_GEMINI_GM001_RESPONSE)
    validated = validate_gemini_gm001_output(parsed)
    assert "question" in validated
    assert "options" in validated
    assert "correctOptionId" in validated
    assert "explanation" in validated


def test_3_exactly_four_options(db_session: Session):
    """3. Output contains exactly four options with IDs A, B, C, D."""
    parsed = parse_gemini_json_response(VALID_GEMINI_GM001_RESPONSE)
    validated = validate_gemini_gm001_output(parsed)
    option_ids = [opt["id"] for opt in validated["options"]]
    assert option_ids == ["A", "B", "C", "D"]


def test_4_exactly_one_internal_correct_option(db_session: Session):
    """4. Output contains exactly one valid internal correctOptionId."""
    parsed = parse_gemini_json_response(VALID_GEMINI_GM001_RESPONSE)
    validated = validate_gemini_gm001_output(parsed)
    assert validated["correctOptionId"] in ["A", "B", "C", "D"]


def test_5_v16_context_passed_into_generator():
    """5. Prompt builder incorporates full V16 context."""
    context = {
        "mission_id": 1,
        "chapter_id": 1,
        "sector_id": 1,
        "topic_id": 1,
        "gameplay_type": "GM001",
        "difficulty": "EASY",
        "performance": {"total_attempts": 5, "accuracy": 0.35, "streak": 1},
        "generation_context": {
            "goal": "Data Science",
            "target_role": "AI Engineer",
            "skill_level": "Beginner",
            "subjects": ["Aptitude & Logic"],
            "chapter": "Pattern Observatory",
            "sector": "Sector 1",
            "mission": "Awaken the Pattern Lens",
            "objective": "Identify arithmetic sequences",
            "topic": "Number Series",
            "gameplay_type": "GM001",
            "difficulty": "EASY",
        }
    }
    prompt = build_gm001_generation_prompt(context)
    assert "Data Science" in prompt
    assert "AI Engineer" in prompt
    assert "Beginner" in prompt
    assert "Awaken the Pattern Lens" in prompt
    assert "GM001" in prompt


def test_6_topic_passed_correctly():
    """6. Mission topic is clearly included in Gemini prompt."""
    context = {
        "generation_context": {
            "topic": "Number Series",
            "difficulty": "HARD",
        }
    }
    prompt = build_gm001_generation_prompt(context)
    assert "Topic: Number Series" in prompt


def test_7_difficulty_passed_correctly():
    """7. Selected difficulty is clearly included in Gemini prompt."""
    context = {
        "generation_context": {
            "topic": "Number Series",
            "difficulty": "HARD",
        }
    }
    prompt = build_gm001_generation_prompt(context)
    assert "Difficulty: HARD" in prompt


def test_8_mission_objective_passed_correctly():
    """8. Mission objective is embedded in the prompt."""
    context = {
        "generation_context": {
            "objective": "Calculate geometric progression ratios",
            "difficulty": "MEDIUM",
        }
    }
    prompt = build_gm001_generation_prompt(context)
    assert "Mission Objective: Calculate geometric progression ratios" in prompt


# ─────────────────────────────────────────────────────────────────────────────
# 2. VALIDATION TESTS (9–17)
# ─────────────────────────────────────────────────────────────────────────────

def test_9_invalid_json():
    """9. Non-JSON or malformed string raises GeminiValidationError."""
    with pytest.raises(GeminiValidationError):
        parse_gemini_json_response("This is not JSON at all.")


def test_10_missing_question():
    """10. Missing question field raises GeminiValidationError."""
    bad_data = {
        "options": [{"id": "A", "text": "1"}, {"id": "B", "text": "2"}, {"id": "C", "text": "3"}, {"id": "D", "text": "4"}],
        "correctOptionId": "A"
    }
    with pytest.raises(GeminiValidationError, match="question is missing"):
        validate_gemini_gm001_output(bad_data)


def test_11_missing_options():
    """11. Missing options field raises GeminiValidationError."""
    bad_data = {
        "question": "What is 2+2?",
        "correctOptionId": "A"
    }
    with pytest.raises(GeminiValidationError, match="options must be a list"):
        validate_gemini_gm001_output(bad_data)


def test_12_three_options():
    """12. 3 options raises GeminiValidationError."""
    bad_data = {
        "question": "What is 2+2?",
        "options": [{"id": "A", "text": "1"}, {"id": "B", "text": "2"}, {"id": "C", "text": "4"}],
        "correctOptionId": "C"
    }
    with pytest.raises(GeminiValidationError, match="must have exactly 4 options"):
        validate_gemini_gm001_output(bad_data)


def test_13_five_options():
    """13. 5 options raises GeminiValidationError."""
    bad_data = {
        "question": "What is 2+2?",
        "options": [{"id": "A", "text": "1"}, {"id": "B", "text": "2"}, {"id": "C", "text": "3"}, {"id": "D", "text": "4"}, {"id": "E", "text": "5"}],
        "correctOptionId": "D"
    }
    with pytest.raises(GeminiValidationError, match="must have exactly 4 options"):
        validate_gemini_gm001_output(bad_data)


def test_14_duplicate_options():
    """14. Duplicate option text raises GeminiValidationError."""
    bad_data = {
        "question": "What is 2+2?",
        "options": [{"id": "A", "text": "4"}, {"id": "B", "text": "4"}, {"id": "C", "text": "3"}, {"id": "D", "text": "5"}],
        "correctOptionId": "A"
    }
    with pytest.raises(GeminiValidationError, match="Duplicate option text detected"):
        validate_gemini_gm001_output(bad_data)


def test_15_invalid_option_ids():
    """15. Invalid option IDs (e.g. 1, 2, 3, 4 instead of A, B, C, D) raise GeminiValidationError."""
    bad_data = {
        "question": "What is 2+2?",
        "options": [{"id": "1", "text": "1"}, {"id": "2", "text": "2"}, {"id": "3", "text": "3"}, {"id": "4", "text": "4"}],
        "correctOptionId": "4"
    }
    with pytest.raises(GeminiValidationError, match="Option ID '1' is invalid"):
        validate_gemini_gm001_output(bad_data)


def test_16_missing_correct_option_id():
    """16. Missing correctOptionId raises GeminiValidationError."""
    bad_data = {
        "question": "What is 2+2?",
        "options": [{"id": "A", "text": "1"}, {"id": "B", "text": "2"}, {"id": "C", "text": "3"}, {"id": "D", "text": "4"}],
    }
    with pytest.raises(GeminiValidationError, match="correctOptionId is missing"):
        validate_gemini_gm001_output(bad_data)


def test_17_invalid_correct_option_id():
    """17. Invalid correctOptionId (e.g. 'Z') raises GeminiValidationError."""
    bad_data = {
        "question": "What is 2+2?",
        "options": [{"id": "A", "text": "1"}, {"id": "B", "text": "2"}, {"id": "C", "text": "3"}, {"id": "D", "text": "4"}],
        "correctOptionId": "Z"
    }
    with pytest.raises(GeminiValidationError, match="correctOptionId 'Z' is invalid"):
        validate_gemini_gm001_output(bad_data)


# ─────────────────────────────────────────────────────────────────────────────
# 3. SECURITY TESTS (18–22)
# ─────────────────────────────────────────────────────────────────────────────

def test_18_unauthenticated_request_rejected(client: TestClient, db_session: Session):
    """18. Unauthenticated call to POST /api/v1/challenges/generate is rejected with 401."""
    _setup_test_env(db_session)
    res = client.post("/api/v1/challenges/generate", json={"missionId": 1})
    assert res.status_code == 401


def test_19_correct_answer_absent_from_playable_response(client: TestClient, db_session: Session):
    """19. Playable response strictly omits correctOptionId, answer, solution, canonicalAnswer."""
    missions = _setup_test_env(db_session)
    user_id, token = _register_user(client, "v17_sec@test.com")

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM001_RESPONSE):
        res = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 1},
            headers={"Authorization": f"Bearer {token}"}
        )

    assert res.status_code == 200
    data = res.json()

    # Verify forbidden keys are absent
    forbidden_keys = ["correctOptionId", "correct_option_id", "answer", "correctAnswer", "solution", "canonicalAnswer"]
    for k in forbidden_keys:
        assert k not in data, f"Forbidden key '{k}' found in playable response root"

    for opt in data["options"]:
        for k in forbidden_keys:
            assert k not in opt, f"Forbidden key '{k}' found inside option"


def test_20_difficulty_cannot_be_client_overridden(client: TestClient, db_session: Session):
    """20. Client passing 'difficulty' in body has no effect; backend computes V16 difficulty."""
    missions = _setup_test_env(db_session)
    user_id, token = _register_user(client, "v17_diff@test.com")

    # Set user preference to Easy
    client.patch(
        "/api/v1/users/me/preferences",
        json={"difficultyPreference": "Easy"},
        headers={"Authorization": f"Bearer {token}"}
    )

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM001_RESPONSE) as mock_gen:
        res = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 1, "difficulty": "HARD"},  # Attempted override
            headers={"Authorization": f"Bearer {token}"}
        )

    assert res.status_code == 200
    data = res.json()
    assert data["metadata"]["difficulty"] == "EASY"
    # Verify prompt received EASY from V16, not HARD
    prompt_sent = mock_gen.call_args[0][0]
    assert "Difficulty: EASY" in prompt_sent


def test_21_gameplay_type_cannot_be_client_overridden(client: TestClient, db_session: Session):
    """21. Client cannot override gameplayType; backend enforces Mission.gameplay_type."""
    missions = _setup_test_env(db_session)
    user_id, token = _register_user(client, "v17_gm_override@test.com")

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM001_RESPONSE):
        res = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 1, "gameplayType": "GM004"},  # Attempted override
            headers={"Authorization": f"Bearer {token}"}
        )

    assert res.status_code == 200
    assert res.json()["gameplayType"] == "GM001"


def test_22_api_key_not_exposed(client: TestClient, db_session: Session):
    """22. Gemini API key is never leaked in JSON responses."""
    missions = _setup_test_env(db_session)
    user_id, token = _register_user(client, "v17_nokey@test.com")

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM001_RESPONSE):
        res = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 1},
            headers={"Authorization": f"Bearer {token}"}
        )

    res_text = res.text
    assert "AIzaSy" not in res_text
    assert "GEMINI_API_KEY" not in res_text


# ─────────────────────────────────────────────────────────────────────────────
# 4. ARCHITECTURE TESTS (23–28)
# ─────────────────────────────────────────────────────────────────────────────

def test_23_mission_determines_gameplay_type(client: TestClient, db_session: Session):
    """23. Mission determines gameplay type; unsupported mission returns 400."""
    missions = _setup_test_env(db_session)
    # Find an unsupported mission (e.g. Mission 5 is GM003 or Mission 6 is GM004)
    unsupported_mission = db_session.query(Mission).filter(Mission.gameplay_type.notin_(["GM001", "GM002"])).first()
    assert unsupported_mission is not None

    user_id, token = _register_user(client, "v17_unsupported@test.com")

    res = client.post(
        "/api/v1/challenges/generate",
        json={"missionId": unsupported_mission.id},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 400
    assert "supports" in res.json()["detail"]


def test_24_v16_determines_difficulty(client: TestClient, db_session: Session):
    """24. V16 adaptive logic determines selected difficulty based on user performance."""
    missions = _setup_test_env(db_session)
    m1 = missions[0]

    # User A: low accuracy (20%) -> EASY
    user_a, token_a = _register_user(client, "user_a_v17@test.com")
    db_session.add(UserPerformance(
        user_id=user_a,
        topic_id=m1.topic_id,
        gameplay_type="GM001",
        difficulty=DIFFICULTY_MEDIUM,
        total_attempts=10,
        correct_attempts=2,
        accuracy=0.20,
    ))
    db_session.commit()

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM001_RESPONSE) as mock_a:
        res_a = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": m1.id},
            headers={"Authorization": f"Bearer {token_a}"}
        )
    assert res_a.status_code == 200
    assert res_a.json()["metadata"]["difficulty"] == "EASY"
    assert "Difficulty: EASY" in mock_a.call_args[0][0]

    # User B: high accuracy (90%) -> HARD
    user_b, token_b = _register_user(client, "user_b_v17@test.com")
    db_session.add(UserPerformance(
        user_id=user_b,
        topic_id=m1.topic_id,
        gameplay_type="GM001",
        difficulty=DIFFICULTY_MEDIUM,
        total_attempts=10,
        correct_attempts=9,
        accuracy=0.90,
    ))
    db_session.commit()

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM001_RESPONSE) as mock_b:
        res_b = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": m1.id},
            headers={"Authorization": f"Bearer {token_b}"}
        )
    assert res_b.status_code == 200
    assert res_b.json()["metadata"]["difficulty"] == "HARD"
    assert "Difficulty: HARD" in mock_b.call_args[0][0]


def test_25_no_reward_mutation(client: TestClient, db_session: Session):
    """25. Generating a challenge does NOT award XP, stars, or credits."""
    missions = _setup_test_env(db_session)
    user_id, token = _register_user(client, "v17_noreward@test.com")

    rewards_before = db_session.query(RewardEvent).filter(RewardEvent.user_id == user_id).first()
    assert rewards_before is None

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM001_RESPONSE):
        res = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 1},
            headers={"Authorization": f"Bearer {token}"}
        )
    assert res.status_code == 200

    rewards_after = db_session.query(RewardEvent).filter(RewardEvent.user_id == user_id).first()
    assert rewards_after is None


def test_26_no_progression_mutation(client: TestClient, db_session: Session):
    """26. Generating a challenge does NOT mutate mission progress or complete missions."""
    missions = _setup_test_env(db_session)
    user_id, token = _register_user(client, "v17_noprogress@test.com")

    progress_before = db_session.query(MissionProgress).filter(MissionProgress.user_id == user_id).count()

    with patch.object(gemini_client, "generate", return_value=VALID_GEMINI_GM001_RESPONSE):
        res = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 1},
            headers={"Authorization": f"Bearer {token}"}
        )
    assert res.status_code == 200

    progress_after = db_session.query(MissionProgress).filter(MissionProgress.user_id == user_id).count()
        # Challenge generation must NOT mutate MissionProgress - count must be identical`n    assert progress_before == progress_after


def test_27_no_gemini_dependency_in_answer_evaluation(client: TestClient, db_session: Session):
    """27. Answer evaluation remains independent backend evaluation."""
    # Existing answer evaluation routes and services operate without Gemini.
    from app.services.evaluation_service import evaluate
    res = evaluate("GM001", "42 Hz", {"answer": "42 Hz", "explanation": "Correct frequency."})
    assert res.is_correct is True
    res_false = evaluate("GM001", "38 Hz", {"answer": "42 Hz", "explanation": "Correct frequency."})
    assert res_false.is_correct is False


def test_28_no_database_migration():
    """28. Verifies alembic HEAD revision remains 86e287c0be18."""
    # The expected alembic head revision (Phase 14D added 764f6a036dc7 for current_phase)
    EXPECTED_HEADS = {"86e287c0be18", "764f6a036dc7"}
    from alembic.config import Config
    from alembic.script import ScriptDirectory
    config = Config("alembic.ini")
    script = ScriptDirectory.from_config(config)
    head_rev = script.get_current_head()
    assert head_rev in EXPECTED_HEADS, f"Alembic HEAD should be one of {EXPECTED_HEADS}, got {head_rev}"


# ─────────────────────────────────────────────────────────────────────────────
# 5. FAILURE HANDLING TESTS (29–30)
# ─────────────────────────────────────────────────────────────────────────────

def test_29_gemini_failure_handled_safely(client: TestClient, db_session: Session):
    """29. Gemini network or API timeout returns controlled 502 Bad Gateway."""
    missions = _setup_test_env(db_session)
    user_id, token = _register_user(client, "v17_fail@test.com")

    with patch.object(gemini_client, "generate", side_effect=Exception("API connection timeout")):
        res = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 1},
            headers={"Authorization": f"Bearer {token}"}
        )

    assert res.status_code == 502
    assert "AI challenge service error" in res.json()["detail"]


def test_30_malformed_gemini_response_rejected(client: TestClient, db_session: Session):
    """30. Malformed JSON from Gemini returns controlled 502 Bad Gateway."""
    missions = _setup_test_env(db_session)
    user_id, token = _register_user(client, "v17_malformed@test.com")

    malformed_payload = json.dumps({
        "question": "Malformed question",
        "options": [{"id": "A", "text": "Only one option"}],
        "correctOptionId": "A"
    })

    with patch.object(gemini_client, "generate", return_value=malformed_payload):
        res = client.post(
            "/api/v1/challenges/generate",
            json={"missionId": 1},
            headers={"Authorization": f"Bearer {token}"}
        )

    assert res.status_code == 502
    assert "AI challenge validation failed" in res.json()["detail"]
