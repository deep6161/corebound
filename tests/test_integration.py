"""
Full end-to-end integration test for Phase 2.

REGISTER → LOGIN → MISSION → START GAMEPLAY → RECEIVE SAFE CHALLENGE
→ SUBMIT ANSWER → SERVER EVALUATES → QuestionAttempt SAVED
→ PERFORMANCE UPDATED → REWARD GRANTED → MISSION COMPLETED
→ NEXT MISSION UNLOCKED

Verifies database state, not just HTTP status codes.
Gemini is mocked.
"""
import json
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import patch

from app.models.challenge import Challenge
from app.models.gameplay_session import GameplaySession, SESSION_COMPLETED
from app.models.mission import Mission
from app.models.mission_progress import (
    MissionProgress,
    STATUS_AVAILABLE,
    STATUS_LOCKED,
    STATUS_COMPLETED as MISSION_COMPLETED,
)
from app.models.question_attempt import QuestionAttempt
from app.models.reward_event import RewardEvent
from app.models.story import Story, Chapter, Sector
from app.models.subject import Subject
from app.models.topic import Topic
from app.models.user_performance import UserPerformance
from app.models.user_profile import UserProfile


GM001_RESPONSE = json.dumps({
    "question": "What is Newton's first law?",
    "options": [
        "An object at rest stays at rest",
        "Force equals mass times acceleration",
        "Every action has an equal reaction",
        "Energy cannot be created or destroyed",
    ],
    "answer": "An object at rest stays at rest",
    "explanation": "Newton's first law is the law of inertia.",
})


def _seed_world(db: Session):
    """Create two missions: m1 (AVAILABLE via progress) and m2 (LOCKED)."""
    subject = Subject(name="Physics", description="")
    db.add(subject)
    db.flush()

    topic = Topic(subject_id=subject.id, name="Classical Mechanics", description="")
    db.add(topic)
    db.flush()

    story = Story(title="Corebound: Origins")
    db.add(story)
    db.flush()

    chapter = Chapter(story_id=story.id, title="Chapter 1", order_index=1)
    db.add(chapter)
    db.flush()

    sector = Sector(chapter_id=chapter.id, title="Sector Alpha", order_index=1)
    db.add(sector)
    db.flush()

    m1 = Mission(
        sector_id=sector.id,
        topic_id=topic.id,
        title="Newton's Laws",
        objective="Understand Newton's first law",
        order_index=1,
        difficulty="EASY",
        gameplay_type="GM001",
        is_active=True,
    )
    m2 = Mission(
        sector_id=sector.id,
        topic_id=topic.id,
        title="Force and Motion",
        order_index=2,
        difficulty="MEDIUM",
        gameplay_type="GM001",
        is_active=True,
    )
    db.add_all([m1, m2])
    db.commit()
    db.refresh(m1)
    db.refresh(m2)
    return m1, m2, topic


class TestFullIntegrationFlow:

    def test_complete_gameplay_pipeline(self, client: TestClient, db_session: Session):
        """
        Full pipeline test.

        Verifies:
        1. Registration creates user
        2. Gameplay start fails for locked mission
        3. Gameplay start succeeds for available mission
        4. Response contains no canonical answer
        5. Incorrect answer leaves session active, no reward
        6. Correct answer evaluates correctly
        7. QuestionAttempt saved with correct user/session linkage
        8. UserPerformance updated
        9. RewardEvent created with correct XP/stars
        10. UserProfile XP/credits/stars updated
        11. MissionProgress shows COMPLETED
        12. Next mission is unlocked
        13. Duplicate submission rejected
        """
        m1, m2, topic = _seed_world(db_session)

        # ── Step 1: Register ──────────────────────────────────────
        reg_resp = client.post("/api/v1/auth/register", json={
            "email": "integration@test.com",
            "password": "secure123",
        })
        assert reg_resp.status_code == 201
        user_id = reg_resp.json()["id"]

        # Login to get token
        login_resp = client.post("/api/v1/auth/login", json={
            "email": "integration@test.com",
            "password": "secure123",
        })
        assert login_resp.status_code == 200
        auth = {"Authorization": f"Bearer {login_resp.json()['access_token']}"}

        # Verify UserProfile auto-created
        profile = db_session.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        assert profile is not None
        assert profile.xp == 0

        # ── Step 2: Confirm mission 2 is locked (only m1 gets AVAILABLE at registration) ──
        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_RESPONSE):
            start_locked = client.post(
                "/api/v1/gameplay/start",
                json={"mission_id": m2.id},
                headers=auth,
            )
        assert start_locked.status_code == 403

        # ── Step 3: m1 is already AVAILABLE from registration seeding ──
        # Fetch the auto-created progress records for DB inspection later
        mp1 = db_session.query(MissionProgress).filter(
            MissionProgress.user_id == user_id,
            MissionProgress.mission_id == m1.id,
        ).first()
        mp2 = db_session.query(MissionProgress).filter(
            MissionProgress.user_id == user_id,
            MissionProgress.mission_id == m2.id,
        ).first()
        assert mp1 is not None and mp1.status == STATUS_AVAILABLE
        assert mp2 is not None and mp2.status == "LOCKED"

        # ── Step 4: Start gameplay for available mission ──────────
        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_RESPONSE):
            start_resp = client.post(
                "/api/v1/gameplay/start",
                json={"mission_id": m1.id},
                headers=auth,
            )
        assert start_resp.status_code == 201
        start_data = start_resp.json()
        session_id = start_data["session_id"]
        assert "playable" in start_data

        # ── Step 5: Canonical answer NOT in response ──────────────
        content = start_data["playable"]["content"]
        assert "answer" not in content
        assert "question" in content
        assert len(content["options"]) == 4

        # ── Step 6: Submit wrong answer → no reward, session stays ACTIVE ──
        wrong_resp = client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "Force equals mass times acceleration", "time_taken_ms": 3000},
            headers=auth,
        )
        assert wrong_resp.status_code == 200
        wrong_data = wrong_resp.json()
        assert wrong_data["is_correct"] is False
        assert wrong_data["xp_earned"] == 0
        assert wrong_data["stars_earned"] == 0
        assert wrong_data["mission_completed"] is False

        # Verify session still ACTIVE
        session = db_session.query(GameplaySession).filter(GameplaySession.id == session_id).first()
        assert session.status != SESSION_COMPLETED

        # ── Step 7: Submit correct answer ────────────────────────
        correct_resp = client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "An object at rest stays at rest", "time_taken_ms": 2500},
            headers=auth,
        )
        assert correct_resp.status_code == 200
        correct_data = correct_resp.json()
        assert correct_data["is_correct"] is True
        assert correct_data["mission_completed"] is True
        assert correct_data["next_mission_unlocked"] is True

        # This was the 2nd attempt → 2 stars
        assert correct_data["stars_earned"] == 2
        assert correct_data["xp_earned"] == 50  # EASY difficulty

        # ── Step 8: Verify QuestionAttempt records in DB ─────────
        attempts = db_session.query(QuestionAttempt).filter(
            QuestionAttempt.gameplay_session_id == session_id
        ).all()
        assert len(attempts) == 2  # wrong + correct
        assert attempts[0].is_correct is False
        assert attempts[1].is_correct is True
        assert attempts[0].attempt_number == 1
        assert attempts[1].attempt_number == 2

        # ── Step 9: Verify UserPerformance updated ────────────────
        perf = db_session.query(UserPerformance).filter(
            UserPerformance.user_id == user_id,
            UserPerformance.topic_id == topic.id,
            UserPerformance.gameplay_type == "GM001",
        ).first()
        assert perf is not None
        assert perf.total_attempts == 2
        assert perf.correct_attempts == 1
        assert perf.accuracy == 0.5

        # ── Step 10: Verify RewardEvent created ──────────────────
        event = db_session.query(RewardEvent).filter(
            RewardEvent.gameplay_session_id == session_id
        ).first()
        assert event is not None
        assert event.xp == 50
        assert event.stars == 2
        assert event.credits == 2

        # ── Step 11: Verify UserProfile totals updated ────────────
        db_session.refresh(profile)
        assert profile.xp == 50
        assert profile.stars == 2
        assert profile.credits == 2

        # ── Step 12: Verify MissionProgress completed ─────────────
        db_session.refresh(mp1)
        assert mp1.status == MISSION_COMPLETED
        assert mp1.stars == 2

        # ── Step 13: Verify mission 2 unlocked ───────────────────
        db_session.refresh(mp2)
        assert mp2.status == STATUS_AVAILABLE

        # ── Step 14: Verify MissionProgress.attempts = 2 (answer subs) ──
        assert mp1.attempts == 2

        # ── Step 15: Duplicate submission rejected ────────────────
        dup_resp = client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "An object at rest stays at rest"},
            headers=auth,
        )
        assert dup_resp.status_code == 409

        # ── Step 16: Session is COMPLETED in DB ──────────────────
        db_session.refresh(session)
        assert session.status == SESSION_COMPLETED
        assert session.is_correct is True
