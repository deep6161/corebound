"""
Phase V16 Adaptive Selector Backend Tests:
Tests deterministic difficulty selection, topic-specific performance integration,
explicit user preference overrides, endpoint security, and user isolation.
"""
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.models.mission import Mission, DIFFICULTY_EASY, DIFFICULTY_MEDIUM, DIFFICULTY_HARD
from app.models.story import Story, Chapter, Sector
from app.models.subject import Subject
from app.models.topic import Topic
from app.models.user import User
from app.models.user_performance import UserPerformance
from app.models.user_profile import UserProfile
from app.services.adaptive_selector import (
    determine_adaptive_difficulty,
    select_adaptive_mission_context,
    SOURCE_MISSION_BASELINE,
    SOURCE_PERFORMANCE_ADAPTIVE,
    SOURCE_USER_PREFERENCE,
)
from scripts.seed_curriculum import seed_curriculum


def _setup_test_environment(db: Session):
    """Seed curriculum and return seeded missions."""
    seed_curriculum(db)
    missions = db.query(Mission).order_by(Mission.order_index).all()
    return missions


def _register_user(client: TestClient, email: str = "v16_user@test.com", password: str = "pass123"):
    reg = client.post("/api/v1/auth/register", json={"email": email, "password": password})
    user_id = reg.json()["id"]
    token = create_access_token(subject=user_id)
    return user_id, token


# ── Direct Selector Unit Tests ──

def test_1_no_performance_history():
    """1. No performance history -> uses mission baseline difficulty."""
    diff, source = determine_adaptive_difficulty(
        mission_difficulty=DIFFICULTY_MEDIUM,
        topic_accuracy=None,
        difficulty_preference="Adaptive"
    )
    assert diff == DIFFICULTY_MEDIUM
    assert source == SOURCE_MISSION_BASELINE


def test_2_accuracy_below_40():
    """2. Accuracy < 40% in Adaptive mode -> EASY."""
    diff, source = determine_adaptive_difficulty(
        mission_difficulty=DIFFICULTY_HARD,
        topic_accuracy=0.35,
        difficulty_preference="Adaptive"
    )
    assert diff == DIFFICULTY_EASY
    assert source == SOURCE_PERFORMANCE_ADAPTIVE


def test_3_accuracy_between_40_and_70():
    """3. Accuracy between 40% and 70% in Adaptive mode -> mission baseline."""
    diff, source = determine_adaptive_difficulty(
        mission_difficulty=DIFFICULTY_MEDIUM,
        topic_accuracy=0.55,
        difficulty_preference="Adaptive"
    )
    assert diff == DIFFICULTY_MEDIUM
    assert source == SOURCE_MISSION_BASELINE

    # Boundary tests
    diff_lower, source_lower = determine_adaptive_difficulty(DIFFICULTY_HARD, 0.40, "Adaptive")
    assert diff_lower == DIFFICULTY_HARD
    assert source_lower == SOURCE_MISSION_BASELINE

    diff_upper, source_upper = determine_adaptive_difficulty(DIFFICULTY_HARD, 0.70, "Adaptive")
    assert diff_upper == DIFFICULTY_HARD
    assert source_upper == SOURCE_MISSION_BASELINE


def test_4_accuracy_above_70():
    """4. Accuracy > 70% in Adaptive mode -> HARD."""
    diff, source = determine_adaptive_difficulty(
        mission_difficulty=DIFFICULTY_EASY,
        topic_accuracy=0.85,
        difficulty_preference="Adaptive"
    )
    assert diff == DIFFICULTY_HARD
    assert source == SOURCE_PERFORMANCE_ADAPTIVE


def test_5_adaptive_preference():
    """5. Adaptive preference is case-insensitive."""
    diff, source = determine_adaptive_difficulty(DIFFICULTY_MEDIUM, 0.25, "adaptive")
    assert diff == DIFFICULTY_EASY
    assert source == SOURCE_PERFORMANCE_ADAPTIVE


def test_6_explicit_easy_preference():
    """6. Explicit Easy preference -> EASY regardless of 100% accuracy."""
    diff, source = determine_adaptive_difficulty(
        mission_difficulty=DIFFICULTY_HARD,
        topic_accuracy=1.0,
        difficulty_preference="Easy"
    )
    assert diff == DIFFICULTY_EASY
    assert source == SOURCE_USER_PREFERENCE


def test_7_explicit_medium_preference():
    """7. Explicit Medium preference -> MEDIUM regardless of 10% accuracy."""
    diff, source = determine_adaptive_difficulty(
        mission_difficulty=DIFFICULTY_HARD,
        topic_accuracy=0.10,
        difficulty_preference="Medium"
    )
    assert diff == DIFFICULTY_MEDIUM
    assert source == SOURCE_USER_PREFERENCE


def test_8_explicit_hard_preference():
    """8. Explicit Hard preference -> HARD regardless of 0% accuracy."""
    diff, source = determine_adaptive_difficulty(
        mission_difficulty=DIFFICULTY_EASY,
        topic_accuracy=0.0,
        difficulty_preference="Hard"
    )
    assert diff == DIFFICULTY_HARD
    assert source == SOURCE_USER_PREFERENCE


def test_9_gameplay_type_authority(db_session: Session):
    """9. Gameplay type ALWAYS comes directly from Mission."""
    missions = _setup_test_environment(db_session)
    for mission in missions:
        ctx = select_adaptive_mission_context(mission, None, None, db_session)
        assert ctx["gameplay_type"] == mission.gameplay_type
        assert ctx["generation_context"]["gameplay_type"] == mission.gameplay_type


def test_10_mission_id_remains_unchanged(db_session: Session):
    """10. Mission ID remains unchanged in adaptive context."""
    missions = _setup_test_environment(db_session)
    m3 = missions[2]
    ctx = select_adaptive_mission_context(m3, None, None, db_session)
    assert ctx["mission_id"] == m3.id
    assert ctx["topic_id"] == m3.topic_id


def test_11_topic_specific_performance_used(db_session: Session):
    """11. Performance for topic A is correctly passed and reflects in output."""
    missions = _setup_test_environment(db_session)
    m1 = missions[0]  # Number Series

    perf = UserPerformance(
        user_id=1,
        topic_id=m1.topic_id,
        gameplay_type=m1.gameplay_type,
        total_attempts=10,
        correct_attempts=9,
        accuracy=0.90,
        avg_response_ms=1200.0,
        best_streak=5,
    )
    db_session.add(perf)
    db_session.flush()

    ctx = select_adaptive_mission_context(m1, None, perf, db_session)
    assert ctx["performance"]["total_attempts"] == 10
    assert ctx["performance"]["correct_attempts"] == 9
    assert ctx["performance"]["accuracy"] == 0.90
    assert ctx["difficulty"] == DIFFICULTY_HARD
    assert ctx["difficulty_source"] == SOURCE_PERFORMANCE_ADAPTIVE


def test_12_missing_topic_performance_fallback(db_session: Session):
    """12. Missing topic performance safely falls back with 0 attempts and baseline difficulty."""
    missions = _setup_test_environment(db_session)
    m1 = missions[0]

    ctx = select_adaptive_mission_context(m1, None, None, db_session)
    assert ctx["performance"]["total_attempts"] == 0
    assert ctx["performance"]["accuracy"] is None
    assert ctx["difficulty"] == m1.difficulty
    assert ctx["difficulty_source"] == SOURCE_MISSION_BASELINE


def test_13_user_isolation(client: TestClient, db_session: Session):
    """13. User 1's high accuracy does not affect User 2's adaptive difficulty."""
    missions = _setup_test_environment(db_session)
    m1 = missions[0]  # Baseline EASY

    # User 1: High accuracy on topic 1 -> HARD
    u1_id, u1_token = _register_user(client, "user1@test.com")
    perf_u1 = UserPerformance(
        user_id=u1_id,
        topic_id=m1.topic_id,
        gameplay_type=m1.gameplay_type,
        total_attempts=10,
        correct_attempts=10,
        accuracy=1.0,
    )
    db_session.add(perf_u1)
    db_session.commit()

    # User 2: No performance -> Baseline EASY
    _, u2_token = _register_user(client, "user2@test.com")

    res1 = client.get(
        f"/api/v1/adaptive/mission/{m1.id}",
        headers={"Authorization": f"Bearer {u1_token}"}
    )
    assert res1.status_code == 200
    assert res1.json()["difficulty"] == DIFFICULTY_HARD

    res2 = client.get(
        f"/api/v1/adaptive/mission/{m1.id}",
        headers={"Authorization": f"Bearer {u2_token}"}
    )
    assert res2.status_code == 200
    assert res2.json()["difficulty"] == m1.difficulty


def test_14_deterministic_output(client: TestClient, db_session: Session):
    """14. Multiple identical calls return the exact same output."""
    missions = _setup_test_environment(db_session)
    m1 = missions[0]
    _, token = _register_user(client, "determ_user@test.com")
    auth = {"Authorization": f"Bearer {token}"}

    res1 = client.get(f"/api/v1/adaptive/mission/{m1.id}", headers=auth).json()
    res2 = client.get(f"/api/v1/adaptive/mission/{m1.id}", headers=auth).json()
    assert res1 == res2


def test_15_no_question_generation_in_output(client: TestClient, db_session: Session):
    """15. Adaptive selector never returns question, options, or answer."""
    missions = _setup_test_environment(db_session)
    m1 = missions[0]
    _, token = _register_user(client, "no_quest_user@test.com")

    res = client.get(
        f"/api/v1/adaptive/mission/{m1.id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200
    data = res.json()

    forbidden_keys = {"question", "options", "answer", "correctAnswer", "correct_answer", "solution", "xp", "credits"}
    for key in forbidden_keys:
        assert key not in data
        assert key not in data.get("generationContext", {})


def test_16_endpoint_security_and_auth(client: TestClient, db_session: Session):
    """16. Endpoint requires authentication and handles invalid mission IDs."""
    missions = _setup_test_environment(db_session)
    m1 = missions[0]

    # Unauthenticated -> 401
    res_unauth = client.get(f"/api/v1/adaptive/mission/{m1.id}")
    assert res_unauth.status_code == 401

    # Authenticated but non-existent mission -> 404
    _, token = _register_user(client, "sec_user@test.com")
    res_404 = client.get(
        "/api/v1/adaptive/mission/99999",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res_404.status_code == 404


def test_17_no_progress_or_reward_mutation(client: TestClient, db_session: Session):
    """17. Querying adaptive endpoint does not modify progress, attempts, or rewards."""
    from app.models.mission_progress import MissionProgress
    missions = _setup_test_environment(db_session)
    m1 = missions[0]
    u_id, token = _register_user(client, "no_mutate_user@test.com")

    # Initial count of progress records
    p_before = db_session.query(MissionProgress).filter(MissionProgress.user_id == u_id).count()

    res = client.get(
        f"/api/v1/adaptive/mission/{m1.id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200

    p_after = db_session.query(MissionProgress).filter(MissionProgress.user_id == u_id).count()
    assert p_before == p_after
