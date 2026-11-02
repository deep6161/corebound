"""
Phase 14D Comprehensive Automated Tests:
1. Boss Challenge Schema (BossPhaseContent, BossChallengeGeneratedContent).
2. GM002 Hardening (unique sources, unique targets, bijection, normalization, duplicate rejection).
3. Sanitized Boss Payload (accepted_answers stripped, playable format = boss_3phase).
4. Boss Session Creation & current_phase initialization.
5. Boss Session Reuse & Refresh Persistence across Phase 1, Phase 2, Phase 3.
6. Boss Phase 1, Phase 2, Phase 3 progressive evaluation.
7. Wrong boss answer handling (same phase, no progression, server explanation).
8. Reward idempotency & no duplicate reward on completion.
9. User isolation for boss sessions.
10. Normal GM001-GM004 regression (standard GM004 works unaffected).
"""

import json
from unittest.mock import MagicMock, patch
import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.models.challenge import Challenge
from app.models.gameplay_session import GameplaySession, SESSION_ACTIVE, SESSION_COMPLETED
from app.models.mission import Mission, GAMEPLAY_GM001, GAMEPLAY_GM002, GAMEPLAY_GM003, GAMEPLAY_GM004
from app.models.mission_progress import (
    MissionProgress,
    STATUS_AVAILABLE,
    STATUS_IN_PROGRESS,
    STATUS_COMPLETED as MISSION_COMPLETED,
)
from app.models.story import Story, Chapter, Sector
from app.models.subject import Subject
from app.models.topic import Topic
from app.models.user import User
from app.models.user_profile import UserProfile
from app.schemas.gameplay import (
    BossPhaseContent,
    BossChallengeGeneratedContent,
    GM002GeneratedContent,
    GM002Item,
)
from app.services.evaluation_service import evaluate, evaluate_boss_phase, evaluate_gm004
from app.services.gameplay_service import (
    _build_playable,
    _generate_or_build_boss_challenge,
    start_gameplay_session,
)
from app.services.answer_service import submit_answer


# ==============================================================================
# 1. Pydantic Schema Hardening Tests
# ==============================================================================

class TestBossAndGM002Schemas:

    def test_boss_schema_valid_3phases(self):
        """BossChallengeGeneratedContent validates exactly 3 progressive phases."""
        content = BossChallengeGeneratedContent(
            format="boss_3phase",
            boss_name="Guardian Atlas",
            phases=[
                BossPhaseContent(
                    phase=1,
                    hero="BLAZE",
                    equation="[(18 * 4) - 22] / 2",
                    accepted_answers=["25", "25 gw"],
                    presets=[15, 20, 25, 30],
                    shield_pct=80,
                ),
                BossPhaseContent(
                    phase=2,
                    hero="BYTE",
                    equation="{[(25 * 3) + 45] / 3} + 30",
                    accepted_answers=["70", "70 gw"],
                    presets=[50, 60, 70, 85],
                    shield_pct=30,
                ),
                BossPhaseContent(
                    phase=3,
                    hero="NOVA",
                    equation="{[(70 * 2) - 40] / 5} * 4 + 24",
                    accepted_answers=["104", "104 gw"],
                    presets=[84, 96, 104, 120],
                    shield_pct=0,
                ),
            ],
            explanation="BODMAS multi-hero resonance complete.",
        )
        assert len(content.phases) == 3
        assert content.phases[0].hero == "BLAZE"
        assert content.phases[1].hero == "BYTE"
        assert content.phases[2].hero == "NOVA"

    def test_boss_schema_rejects_non_3phases(self):
        """Boss schema rejects challenge with less than 3 phases."""
        with pytest.raises(ValidationError):
            BossChallengeGeneratedContent(
                format="boss_3phase",
                boss_name="Guardian Atlas",
                phases=[
                    BossPhaseContent(
                        phase=1,
                        hero="BLAZE",
                        equation="[(18 * 4) - 22] / 2",
                        accepted_answers=["25"],
                        presets=[15, 20, 25, 30],
                        shield_pct=80,
                    )
                ],
                explanation="Incomplete boss",
            )

    def test_gm002_rejects_duplicate_normalized_source_labels(self):
        """GM002 rejects duplicate source labels (case & whitespace insensitive)."""
        with pytest.raises(ValidationError) as exc:
            GM002GeneratedContent(
                question="Match pairs:",
                objects=[
                    {"id": "o1", "label": "1/6"},
                    {"id": "o2", "label": " 1/6 "},
                    {"id": "o3", "label": "1/3"},
                    {"id": "o4", "label": "1/2"},
                ],
                slots=[
                    {"id": "s1", "label": "A"},
                    {"id": "s2", "label": "B"},
                    {"id": "s3", "label": "C"},
                    {"id": "s4", "label": "D"},
                ],
                canonical_mapping={"o1": "s1", "o2": "s2", "o3": "s3", "o4": "s4"},
                explanation="Test",
            )
        assert "duplicate" in str(exc.value).lower()

    def test_gm002_rejects_duplicate_normalized_target_labels(self):
        """GM002 rejects duplicate target slot labels."""
        with pytest.raises(ValidationError) as exc:
            GM002GeneratedContent(
                question="Match pairs:",
                objects=[
                    {"id": "o1", "label": "A"},
                    {"id": "o2", "label": "B"},
                    {"id": "o3", "label": "C"},
                    {"id": "o4", "label": "D"},
                ],
                slots=[
                    {"id": "s1", "label": "2^6"},
                    {"id": "s2", "label": "2^6"},
                    {"id": "s3", "label": "2^4"},
                    {"id": "s4", "label": "2^5"},
                ],
                canonical_mapping={"o1": "s1", "o2": "s2", "o3": "s3", "o4": "s4"},
                explanation="Test",
            )
        assert "duplicate" in str(exc.value).lower()


# ==============================================================================
# 2. Sanitization & Evaluation Tests
# ==============================================================================

class TestBossEvaluationAndSanitization:

    @pytest.fixture
    def canonical_boss_dict(self):
        return {
            "format": "boss_3phase",
            "boss_name": "Guardian Atlas",
            "phases": [
                {
                    "phase": 1,
                    "hero": "BLAZE",
                    "equation": "[(18 * 4) - 22] / 2",
                    "accepted_answers": ["25", "25 gw"],
                    "presets": [15, 20, 25, 30],
                    "shield_pct": 80,
                },
                {
                    "phase": 2,
                    "hero": "BYTE",
                    "equation": "{[(25 * 3) + 45] / 3} + 30",
                    "accepted_answers": ["70", "70 gw"],
                    "presets": [50, 60, 70, 85],
                    "shield_pct": 30,
                },
                {
                    "phase": 3,
                    "hero": "NOVA",
                    "equation": "{[(70 * 2) - 40] / 5} * 4 + 24",
                    "accepted_answers": ["104", "104 gw"],
                    "presets": [84, 96, 104, 120],
                    "shield_pct": 0,
                },
            ],
            "explanation": "Boss defeated with BODMAS resonance.",
        }

    def test_boss_playable_sanitization(self, canonical_boss_dict):
        """Sanitized boss playable strips accepted_answers completely."""
        playable = _build_playable(GAMEPLAY_GM004, "HARD", canonical_boss_dict, current_phase=1)
        assert playable["format"] == "boss_3phase"
        assert playable["current_phase"] == 1
        assert "accepted_answers" not in playable
        assert "canonical_mapping" not in playable
        assert len(playable["phases_playable"]) == 3
        for ph in playable["phases_playable"]:
            assert "accepted_answers" not in ph
            assert "hero" in ph
            assert "equation" in ph
            assert "presets" in ph

    def test_boss_phase1_evaluation(self, canonical_boss_dict):
        """Phase 1: 25 is correct, wrong answers rejected."""
        res_correct = evaluate_boss_phase("25", canonical_boss_dict, current_phase=1)
        assert res_correct.is_correct is True

        res_json = evaluate_boss_phase('{"phase": 1, "power": "25"}', canonical_boss_dict, current_phase=1)
        assert res_json.is_correct is True

        res_wrong = evaluate_boss_phase("30", canonical_boss_dict, current_phase=1)
        assert res_wrong.is_correct is False
        assert "deflected" in res_wrong.explanation.lower()

    def test_boss_phase2_evaluation(self, canonical_boss_dict):
        """Phase 2: 70 is correct, wrong answers rejected."""
        res_correct = evaluate_boss_phase("70", canonical_boss_dict, current_phase=2)
        assert res_correct.is_correct is True

        res_wrong = evaluate_boss_phase("50", canonical_boss_dict, current_phase=2)
        assert res_wrong.is_correct is False

    def test_boss_phase3_evaluation(self, canonical_boss_dict):
        """Phase 3: 104 is correct, wrong answers rejected."""
        res_correct = evaluate_boss_phase("104", canonical_boss_dict, current_phase=3)
        assert res_correct.is_correct is True

        res_wrong = evaluate_boss_phase("96", canonical_boss_dict, current_phase=3)
        assert res_wrong.is_correct is False

    def test_boss_phase_mismatch_rejected(self, canonical_boss_dict):
        """Submitting phase 2 power while active phase is 1 is rejected."""
        res = evaluate_boss_phase('{"phase": 2, "power": "70"}', canonical_boss_dict, current_phase=1)
        assert res.is_correct is False
        assert "mismatch" in res.explanation.lower()

    def test_normal_gm004_unaffected(self):
        """Standard GM004 evaluation works unaffected."""
        content = {
            "question": "What is 15 * 4?",
            "accepted_answers": ["60", "60.0"],
            "explanation": "15 * 4 = 60",
        }
        res = evaluate_gm004("60", content)
        assert res.is_correct is True
        res_bad = evaluate_gm004("55", content)
        assert res_bad.is_correct is False


# ==============================================================================
# 3. Database & Full Gameplay Flow Integration Tests
# ==============================================================================

class TestBossSessionProgressionIntegration:

    @pytest.fixture
    def test_setup(self, db_session: Session):
        """Setup user, subject, topic, and Mission 10."""
        user = User(email="phase14d_boss_user@example.com", password_hash="pw")
        db_session.add(user)
        db_session.flush()

        profile = UserProfile(user_id=user.id, display_name="Boss Slayer", level=1, xp=0)
        db_session.add(profile)

        subject = Subject(name="Quantitative Aptitude")
        db_session.add(subject)
        db_session.flush()

        topic = Topic(name="Order of Operations", subject_id=subject.id)
        db_session.add(topic)
        db_session.flush()

        story = Story(title="Corebound Story 14D", description="Climax")
        db_session.add(story)
        db_session.flush()

        chapter = Chapter(title="Chapter 1", order_index=1, story_id=story.id)
        db_session.add(chapter)
        db_session.flush()

        sector = Sector(title="Sector 1", order_index=1, chapter_id=chapter.id)
        db_session.add(sector)
        db_session.flush()

        mission10 = Mission(
            id=10,
            title="GUARDIAN ATLAS // THE CORRUPTED SENTINEL",
            order_index=10,
            sector_id=sector.id,
            topic_id=topic.id,
            gameplay_type=GAMEPLAY_GM004,
            difficulty="HARD",
            is_active=True,
        )
        existing_m10 = db_session.query(Mission).filter(Mission.id == 10).first()
        if existing_m10:
            mission10 = existing_m10
        else:
            db_session.add(mission10)
            db_session.flush()

        progress = (
            db_session.query(MissionProgress)
            .filter(MissionProgress.user_id == user.id, MissionProgress.mission_id == mission10.id)
            .first()
        )
        if not progress:
            progress = MissionProgress(user_id=user.id, mission_id=mission10.id, status=STATUS_AVAILABLE)
            db_session.add(progress)
        else:
            progress.status = STATUS_AVAILABLE

        db_session.commit()
        return {"user": user, "mission": mission10}

    def test_boss_full_3phase_progression_flow(self, test_setup, db_session: Session):
        """Full progressive battle: Phase 1 -> Phase 2 -> Phase 3 -> Complete."""
        user = test_setup["user"]
        mission = test_setup["mission"]

        # Step 1: Start session
        session_resp = start_gameplay_session(user_id=user.id, mission_id=mission.id, db=db_session)
        session_id = session_resp.session_id
        assert session_resp.playable["format"] == "boss_3phase"
        assert session_resp.playable["current_phase"] == 1

        # Step 2: Phase 1 Wrong Answer
        wrong_res = submit_answer(
            session_id=session_id,
            user_id=user.id,
            submitted_answer='{"phase": 1, "power": "15"}',
            time_taken_ms=1000,
            db=db_session,
        )
        assert wrong_res.is_correct is False
        assert wrong_res.next_phase == 1
        assert wrong_res.mission_completed is False

        # Step 3: Phase 1 Correct Answer (25)
        p1_res = submit_answer(
            session_id=session_id,
            user_id=user.id,
            submitted_answer='{"phase": 1, "power": "25"}',
            time_taken_ms=1000,
            db=db_session,
        )
        assert p1_res.is_correct is True
        assert p1_res.phase_completed == 1
        assert p1_res.next_phase == 2
        assert p1_res.new_shield_pct == 80
        assert p1_res.mission_completed is False

        # Verify DB session state
        session_in_db = db_session.query(GameplaySession).filter(GameplaySession.id == session_id).first()
        assert session_in_db.current_phase == 2
        assert session_in_db.status == SESSION_ACTIVE

        # Step 4: Refresh Persistence after Phase 1
        refresh_resp = start_gameplay_session(user_id=user.id, mission_id=mission.id, db=db_session)
        assert refresh_resp.session_id == session_id
        assert refresh_resp.playable["current_phase"] == 2

        # Step 5: Phase 2 Correct Answer (70)
        p2_res = submit_answer(
            session_id=session_id,
            user_id=user.id,
            submitted_answer='{"phase": 2, "power": "70"}',
            time_taken_ms=1000,
            db=db_session,
        )
        assert p2_res.is_correct is True
        assert p2_res.phase_completed == 2
        assert p2_res.next_phase == 3
        assert p2_res.new_shield_pct == 30
        assert p2_res.mission_completed is False

        # Step 6: Refresh Persistence after Phase 2
        refresh_resp2 = start_gameplay_session(user_id=user.id, mission_id=mission.id, db=db_session)
        assert refresh_resp2.playable["current_phase"] == 3

        # Step 7: Phase 3 Correct Answer (104) -> Completion!
        p3_res = submit_answer(
            session_id=session_id,
            user_id=user.id,
            submitted_answer='{"phase": 3, "power": "104"}',
            time_taken_ms=1000,
            db=db_session,
        )
        assert p3_res.is_correct is True
        assert p3_res.phase_completed == 3
        assert p3_res.mission_completed is True
        assert p3_res.xp_earned > 0

        # Step 8: Verify Completed State & Reward Idempotency
        db_session.refresh(session_in_db)
        assert session_in_db.status == SESSION_COMPLETED

        # Attempting submission on completed session -> 409 Conflict
        from fastapi import HTTPException
        with pytest.raises(HTTPException) as exc:
            submit_answer(
                session_id=session_id,
                user_id=user.id,
                submitted_answer='{"phase": 3, "power": "104"}',
                time_taken_ms=1000,
                db=db_session,
            )
        assert exc.value.status_code == 409

        # Reloading completed mission -> returns is_completed=True, no new session
        reload_resp = start_gameplay_session(user_id=user.id, mission_id=mission.id, db=db_session)
        assert reload_resp.is_completed is True
        assert reload_resp.session_id == session_id

    def test_boss_user_isolation(self, test_setup, db_session: Session):
        """User A at Phase 2 does not affect User B starting fresh at Phase 1."""
        user_a = test_setup["user"]
        mission = test_setup["mission"]

        user_b = User(email="user_b_isolation@example.com", password_hash="pw")
        db_session.add(user_b)
        db_session.flush()
        profile_b = UserProfile(user_id=user_b.id, display_name="User B", level=1, xp=0)
        db_session.add(profile_b)
        progress_b = MissionProgress(user_id=user_b.id, mission_id=mission.id, status=STATUS_AVAILABLE)
        db_session.add(progress_b)
        db_session.commit()

        # User A session
        resp_a = start_gameplay_session(user_id=user_a.id, mission_id=mission.id, db=db_session)
        # Advance User A to Phase 2 if not already
        if resp_a.playable["current_phase"] == 1:
            submit_answer(session_id=resp_a.session_id, user_id=user_a.id, submitted_answer='{"phase": 1, "power": "25"}', time_taken_ms=1000, db=db_session)

        # User B starts session
        resp_b = start_gameplay_session(user_id=user_b.id, mission_id=mission.id, db=db_session)

        assert resp_a.session_id != resp_b.session_id
        assert resp_b.playable["current_phase"] == 1

        # User B cannot submit to User A's session
        from fastapi import HTTPException
        with pytest.raises(HTTPException) as exc:
            submit_answer(
                session_id=resp_a.session_id,
                user_id=user_b.id,
                submitted_answer='{"phase": 1, "power": "25"}',
                time_taken_ms=1000,
                db=db_session,
            )
        assert exc.value.status_code == 403
