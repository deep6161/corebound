"""
Tests for POST /api/v1/gameplay/start and POST /api/v1/gameplay/{session_id}/answer.

Gemini is mocked throughout — tests do not require an API key.
"""
import json
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import patch

from app.core.security import create_access_token
from app.models.challenge import Challenge
from app.models.gameplay_session import GameplaySession, SESSION_ACTIVE, SESSION_COMPLETED
from app.models.mission import Mission
from app.models.mission_progress import (
    MissionProgress,
    STATUS_AVAILABLE,
    STATUS_IN_PROGRESS,
    STATUS_LOCKED,
    STATUS_COMPLETED as MISSION_COMPLETED,
)
from app.models.reward_event import RewardEvent
from app.models.story import Story, Chapter, Sector
from app.models.subject import Subject
from app.models.topic import Topic
from app.models.user_profile import UserProfile
from app.models.question_attempt import QuestionAttempt


# ──────────────────────────────────────────────
# Fixtures and helpers
# ──────────────────────────────────────────────

GM001_GEMINI_RESPONSE = json.dumps({
    "question": "What is the speed of light?",
    "options": ["300,000 km/s", "150,000 km/s", "450,000 km/s", "100,000 km/s"],
    "answer": "300,000 km/s",
    "explanation": "The speed of light in a vacuum is approximately 300,000 km/s.",
})

GM002_GEMINI_RESPONSE = json.dumps({
    "objects": [
        {"id": "obj1", "label": "CPU"},
        {"id": "obj2", "label": "RAM"},
        {"id": "obj3", "label": "GPU"},
        {"id": "obj4", "label": "PSU"},
    ],
    "slots": [
        {"id": "slot1", "label": "Processing Unit"},
        {"id": "slot2", "label": "Memory"},
        {"id": "slot3", "label": "Graphics"},
        {"id": "slot4", "label": "Power"},
    ],
    "canonical_mapping": {"obj1": "slot1", "obj2": "slot2", "obj3": "slot3", "obj4": "slot4"},
    "instructions": "Drag each component to its correct slot.",
    "explanation": "CPU is a processing unit, RAM is memory.",
})

GM003_GEMINI_RESPONSE = json.dumps({
    "items": [
        {"id": "item1", "label": "Step A"},
        {"id": "item2", "label": "Step B"},
        {"id": "item3", "label": "Step C"},
        {"id": "item4", "label": "Step D"},
    ],
    "canonical_order": ["item1", "item2", "item3", "item4"],
    "instructions": "Arrange the steps in order.",
    "explanation": "A comes before B, B before C, etc.",
})

GM004_GEMINI_RESPONSE = json.dumps({
    "question": "What element has atomic number 1?",
    "answer_type": "text",
    "accepted_answers": ["Hydrogen", "hydrogen", "H"],
    "explanation": "Hydrogen is the first element with atomic number 1.",
})


def _seed_full_stack(db: Session, gameplay_type: str = "GM001", difficulty: str = "EASY"):
    """Seed subject → topic → story structure → mission."""
    subject = Subject(name=f"Sub_{gameplay_type}", description="")
    db.add(subject)
    db.flush()

    topic = Topic(subject_id=subject.id, name=f"Topic_{gameplay_type}", description="")
    db.add(topic)
    db.flush()

    story = Story(title="Test Story")
    db.add(story)
    db.flush()

    chapter = Chapter(story_id=story.id, title="Ch1", order_index=1)
    db.add(chapter)
    db.flush()

    sector = Sector(chapter_id=chapter.id, title="Sector1", order_index=1)
    db.add(sector)
    db.flush()

    m1 = Mission(
        sector_id=sector.id,
        topic_id=topic.id,
        title="Mission 1",
        order_index=1,
        difficulty=difficulty,
        gameplay_type=gameplay_type,
        is_active=True,
    )
    m2 = Mission(
        sector_id=sector.id,
        topic_id=topic.id,
        title="Mission 2",
        order_index=2,
        difficulty=difficulty,
        gameplay_type=gameplay_type,
        is_active=True,
    )
    db.add_all([m1, m2])
    db.commit()
    db.refresh(m1)
    db.refresh(m2)
    return m1, m2, topic, subject


def _register_and_auth(client: TestClient, email: str = "gp_user@test.com"):
    reg = client.post("/api/v1/auth/register", json={"email": email, "password": "pw12345"})
    user_id = reg.json()["id"]
    token = create_access_token(subject=user_id)
    return user_id, token, {"Authorization": f"Bearer {token}"}


def _make_available(db: Session, user_id: int, mission_id: int):
    p = db.query(MissionProgress).filter(
        MissionProgress.user_id == user_id,
        MissionProgress.mission_id == mission_id,
    ).first()
    if p:
        p.status = STATUS_AVAILABLE
    else:
        p = MissionProgress(user_id=user_id, mission_id=mission_id, status=STATUS_AVAILABLE)
        db.add(p)
    db.commit()


# ──────────────────────────────────────────────
# /gameplay/start — Session creation tests
# ──────────────────────────────────────────────

class TestGameplayStart:

    def test_start_unauthenticated(self, client: TestClient, db_session: Session):
        """POST /gameplay/start requires auth."""
        m1, _, _, _ = _seed_full_stack(db_session)
        resp = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id})
        assert resp.status_code == 401

    def test_start_locked_mission_rejected(self, client: TestClient, db_session: Session):
        """m2 is seeded LOCKED at registration — attempting to start it returns 403."""
        m1, m2, _, _ = _seed_full_stack(db_session)
        user_id, token, auth = _register_and_auth(client, "locked@test.com")
        # m1=AVAILABLE, m2=LOCKED via initialize_mission_progress_for_user
        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_GEMINI_RESPONSE):
            resp = client.post("/api/v1/gameplay/start", json={"mission_id": m2.id}, headers=auth)
        assert resp.status_code == 403

    def test_start_nonexistent_mission(self, client: TestClient, db_session: Session):
        """Non-existent mission returns 404."""
        user_id, token, auth = _register_and_auth(client, "missing@test.com")
        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_GEMINI_RESPONSE):
            resp = client.post("/api/v1/gameplay/start", json={"mission_id": 99999}, headers=auth)
        assert resp.status_code == 404

    def test_start_gm001_session_created(self, client: TestClient, db_session: Session):
        """GM001 session created successfully; response contains session_id and playable content."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, token, auth = _register_and_auth(client, "gm001@test.com")
        _make_available(db_session, user_id, m1.id)

        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_GEMINI_RESPONSE):
            resp = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)

        assert resp.status_code == 201
        data = resp.json()
        assert "session_id" in data
        assert data["gameplay_type"] == "GM001"
        assert "playable" in data
        content = data["playable"]["content"]
        assert "question" in content
        assert "options" in content
        assert len(content["options"]) == 4

    def test_gm001_canonical_answer_not_exposed(self, client: TestClient, db_session: Session):
        """The canonical answer must NOT appear in any field of the /start response."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, token, auth = _register_and_auth(client, "noans@test.com")
        _make_available(db_session, user_id, m1.id)

        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_GEMINI_RESPONSE):
            resp = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)

        assert resp.status_code == 201
        resp_text = resp.text
        assert '"answer"' not in resp_text or _answer_only_in_options(resp_text)

    def test_start_gm002_no_mapping_exposed(self, client: TestClient, db_session: Session):
        """GM002 response must not contain canonical_mapping."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM002", "MEDIUM")
        user_id, token, auth = _register_and_auth(client, "gm002@test.com")
        _make_available(db_session, user_id, m1.id)

        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM002_GEMINI_RESPONSE):
            resp = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)

        assert resp.status_code == 201
        data = resp.json()
        content = data["playable"]["content"]
        assert "objects" in content
        assert "slots" in content
        assert "instructions" in content
        assert "canonical_mapping" not in content

    def test_start_gm003_no_canonical_order_exposed(self, client: TestClient, db_session: Session):
        """GM003 response must not contain canonical_order."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM003", "EASY")
        user_id, token, auth = _register_and_auth(client, "gm003@test.com")
        _make_available(db_session, user_id, m1.id)

        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM003_GEMINI_RESPONSE):
            resp = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)

        assert resp.status_code == 201
        data = resp.json()
        content = data["playable"]["content"]
        assert "items" in content
        assert "instructions" in content
        assert "canonical_order" not in content

    def test_start_gm004_no_accepted_answers_exposed(self, client: TestClient, db_session: Session):
        """GM004 response must not contain accepted_answers."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM004", "HARD")
        user_id, token, auth = _register_and_auth(client, "gm004@test.com")
        _make_available(db_session, user_id, m1.id)

        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM004_GEMINI_RESPONSE):
            resp = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)

        assert resp.status_code == 201
        data = resp.json()
        content = data["playable"]["content"]
        assert "question" in content
        assert "answer_type" in content
        assert "accepted_answers" not in content

    def test_session_record_created_in_db(self, client: TestClient, db_session: Session):
        """A GameplaySession row is created in the DB after /start."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, token, auth = _register_and_auth(client, "sess_db@test.com")
        _make_available(db_session, user_id, m1.id)

        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_GEMINI_RESPONSE):
            resp = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)

        assert resp.status_code == 201
        session_id = resp.json()["session_id"]
        session = db_session.query(GameplaySession).filter(GameplaySession.id == session_id).first()
        assert session is not None
        assert session.status == SESSION_ACTIVE
        assert session.user_id == user_id
        assert session.mission_id == m1.id


def _answer_only_in_options(resp_text: str) -> bool:
    """Return True if 'answer' key appears but only inside options field (acceptable)."""
    # We specifically check the content object doesn't have an "answer" key
    import json
    data = json.loads(resp_text)
    content = data.get("playable", {}).get("content", {})
    return "answer" not in content


# ──────────────────────────────────────────────
# /gameplay/{session_id}/answer — Submission tests
# ──────────────────────────────────────────────

class TestAnswerSubmission:

    def _start_session(self, client, db_session, user_id, m1, gemini_response):
        with patch("app.ai.gemini_client.gemini_client.generate", return_value=gemini_response):
            resp = client.post(
                "/api/v1/gameplay/start",
                json={"mission_id": m1.id},
                headers={"Authorization": f"Bearer {create_access_token(subject=user_id)}"},
            )
        assert resp.status_code == 201
        return resp.json()["session_id"]

    def test_correct_gm001_answer(self, client: TestClient, db_session: Session):
        """Correct GM001 answer returns is_correct=True and grants XP."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "correct@test.com")
        _make_available(db_session, user_id, m1.id)

        session_id = self._start_session(client, db_session, user_id, m1, GM001_GEMINI_RESPONSE)

        resp = client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "300,000 km/s"},
            headers=auth,
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["is_correct"] is True
        assert data["xp_earned"] > 0
        assert data["stars_earned"] == 3  # first attempt
        assert data["mission_completed"] is True

    def test_incorrect_gm001_answer_no_reward(self, client: TestClient, db_session: Session):
        """Incorrect GM001 answer returns is_correct=False with zero rewards."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "wrong@test.com")
        _make_available(db_session, user_id, m1.id)

        session_id = self._start_session(client, db_session, user_id, m1, GM001_GEMINI_RESPONSE)

        resp = client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "150,000 km/s"},
            headers=auth,
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["is_correct"] is False
        assert data["xp_earned"] == 0
        assert data["stars_earned"] == 0
        assert data["mission_completed"] is False

    def test_session_stays_active_after_wrong_answer(self, client: TestClient, db_session: Session):
        """Wrong answer leaves session ACTIVE — retry allowed."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "retry@test.com")
        _make_available(db_session, user_id, m1.id)

        session_id = self._start_session(client, db_session, user_id, m1, GM001_GEMINI_RESPONSE)

        client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "WRONG"},
            headers=auth,
        )

        session = db_session.query(GameplaySession).filter(GameplaySession.id == session_id).first()
        assert session.status == SESSION_ACTIVE

    def test_duplicate_submission_rejected(self, client: TestClient, db_session: Session):
        """Submitting to a COMPLETED session returns 409."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "dup@test.com")
        _make_available(db_session, user_id, m1.id)

        session_id = self._start_session(client, db_session, user_id, m1, GM001_GEMINI_RESPONSE)

        # First correct submission
        client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "300,000 km/s"},
            headers=auth,
        )

        # Second submission to completed session
        resp = client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "300,000 km/s"},
            headers=auth,
        )
        assert resp.status_code == 409

    def test_cross_user_session_rejected(self, client: TestClient, db_session: Session):
        """User B cannot submit answers to User A's session."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_a_id, _, auth_a = _register_and_auth(client, "userA@test.com")
        user_b_id, _, auth_b = _register_and_auth(client, "userB@test.com")
        _make_available(db_session, user_a_id, m1.id)

        session_id = self._start_session(client, db_session, user_a_id, m1, GM001_GEMINI_RESPONSE)

        resp = client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "300,000 km/s"},
            headers=auth_b,
        )
        assert resp.status_code == 403

    def test_question_attempt_created_in_db(self, client: TestClient, db_session: Session):
        """QuestionAttempt row is created after answer submission."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "attempt_db@test.com")
        _make_available(db_session, user_id, m1.id)

        session_id = self._start_session(client, db_session, user_id, m1, GM001_GEMINI_RESPONSE)

        client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "300,000 km/s"},
            headers=auth,
        )

        attempt = db_session.query(QuestionAttempt).filter(
            QuestionAttempt.gameplay_session_id == session_id
        ).first()
        assert attempt is not None
        assert attempt.is_correct is True
        assert attempt.submitted_answer == "300,000 km/s"

    def test_reward_event_created_on_correct(self, client: TestClient, db_session: Session):
        """RewardEvent is created after a correct answer."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "reward_ev@test.com")
        _make_available(db_session, user_id, m1.id)

        session_id = self._start_session(client, db_session, user_id, m1, GM001_GEMINI_RESPONSE)

        client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "300,000 km/s"},
            headers=auth,
        )

        event = db_session.query(RewardEvent).filter(
            RewardEvent.gameplay_session_id == session_id
        ).first()
        assert event is not None
        assert event.xp == 50  # EASY difficulty
        assert event.stars == 3  # first attempt

    def test_no_reward_event_on_wrong_answer(self, client: TestClient, db_session: Session):
        """No RewardEvent is created for an incorrect answer."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "no_reward@test.com")
        _make_available(db_session, user_id, m1.id)

        session_id = self._start_session(client, db_session, user_id, m1, GM001_GEMINI_RESPONSE)

        client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "WRONG"},
            headers=auth,
        )

        event = db_session.query(RewardEvent).filter(
            RewardEvent.gameplay_session_id == session_id
        ).first()
        assert event is None

    def test_mission_progress_completed_on_correct(self, client: TestClient, db_session: Session):
        """MissionProgress.status becomes COMPLETED after correct answer."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "mp_comp@test.com")
        _make_available(db_session, user_id, m1.id)

        session_id = self._start_session(client, db_session, user_id, m1, GM001_GEMINI_RESPONSE)

        client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "300,000 km/s"},
            headers=auth,
        )

        mp = db_session.query(MissionProgress).filter(
            MissionProgress.user_id == user_id,
            MissionProgress.mission_id == m1.id,
        ).first()
        assert mp.status == MISSION_COMPLETED

    def test_next_mission_unlocked_after_completion(self, client: TestClient, db_session: Session):
        """After completing mission 1, mission 2 becomes AVAILABLE."""
        m1, m2, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "unlock@test.com")
        _make_available(db_session, user_id, m1.id)

        # m2 is already seeded as LOCKED by registration — no manual insert needed
        session_id = self._start_session(client, db_session, user_id, m1, GM001_GEMINI_RESPONSE)

        resp = client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "300,000 km/s"},
            headers=auth,
        )
        assert resp.json()["next_mission_unlocked"] is True

        mp2 = db_session.query(MissionProgress).filter(
            MissionProgress.user_id == user_id,
            MissionProgress.mission_id == m2.id,
        ).first()
        assert mp2.status == STATUS_AVAILABLE

    def test_attempts_incremented_on_answer_not_start(self, client: TestClient, db_session: Session):
        """MissionProgress.attempts is incremented on answer, not on session start."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "attemptcount@test.com")
        _make_available(db_session, user_id, m1.id)

        session_id = self._start_session(client, db_session, user_id, m1, GM001_GEMINI_RESPONSE)

        # Before answer — attempts must be 0 (start doesn't increment)
        mp = db_session.query(MissionProgress).filter(
            MissionProgress.user_id == user_id,
            MissionProgress.mission_id == m1.id,
        ).first()
        assert mp.attempts == 0

        client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "300,000 km/s"},
            headers=auth,
        )

        db_session.refresh(mp)
        assert mp.attempts == 1

    def test_user_profile_xp_updated(self, client: TestClient, db_session: Session):
        """UserProfile XP is updated after a correct answer."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "MEDIUM")
        user_id, _, auth = _register_and_auth(client, "xptest@test.com")
        _make_available(db_session, user_id, m1.id)

        session_id = self._start_session(client, db_session, user_id, m1, GM001_GEMINI_RESPONSE)

        client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "300,000 km/s"},
            headers=auth,
        )

        profile = db_session.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        assert profile.xp >= 50  # At least EASY XP (adaptive may return EASY or MEDIUM)

    def test_unauthenticated_answer_rejected(self, client: TestClient, db_session: Session):
        """Unauthenticated answer submission returns 401."""
        resp = client.post("/api/v1/gameplay/999/answer", json={"answer": "x"})
        assert resp.status_code == 401


# ──────────────────────────────────────────────
# GM002 answer tests
# ──────────────────────────────────────────────

class TestGM002Answers:

    def _start(self, client, db_session, user_id, m1, auth):
        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM002_GEMINI_RESPONSE):
            resp = client.post(
                "/api/v1/gameplay/start",
                json={"mission_id": m1.id},
                headers=auth,
            )
        assert resp.status_code == 201
        return resp.json()["session_id"]

    def test_correct_gm002_mapping(self, client: TestClient, db_session: Session):
        m1, _, _, _ = _seed_full_stack(db_session, "GM002", "MEDIUM")
        user_id, _, auth = _register_and_auth(client, "gm002ok@test.com")
        _make_available(db_session, user_id, m1.id)
        session_id = self._start(client, db_session, user_id, m1, auth)

        correct = json.dumps({"obj1": "slot1", "obj2": "slot2", "obj3": "slot3", "obj4": "slot4"})
        resp = client.post(f"/api/v1/gameplay/{session_id}/answer", json={"answer": correct}, headers=auth)
        assert resp.status_code == 200
        assert resp.json()["is_correct"] is True

    def test_incorrect_gm002_mapping(self, client: TestClient, db_session: Session):
        m1, _, _, _ = _seed_full_stack(db_session, "GM002", "MEDIUM")
        user_id, _, auth = _register_and_auth(client, "gm002bad@test.com")
        _make_available(db_session, user_id, m1.id)
        session_id = self._start(client, db_session, user_id, m1, auth)

        wrong = json.dumps({"obj1": "slot2", "obj2": "slot1", "obj3": "slot3", "obj4": "slot4"})
        resp = client.post(f"/api/v1/gameplay/{session_id}/answer", json={"answer": wrong}, headers=auth)
        assert resp.status_code == 200
        assert resp.json()["is_correct"] is False


# ──────────────────────────────────────────────
# GM003 answer tests
# ──────────────────────────────────────────────

class TestGM003Answers:

    def _start(self, client, db_session, user_id, m1, auth):
        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM003_GEMINI_RESPONSE):
            resp = client.post(
                "/api/v1/gameplay/start",
                json={"mission_id": m1.id},
                headers=auth,
            )
        assert resp.status_code == 201
        return resp.json()["session_id"]

    def test_correct_gm003_sequence(self, client: TestClient, db_session: Session):
        m1, _, _, _ = _seed_full_stack(db_session, "GM003", "EASY")
        user_id, _, auth = _register_and_auth(client, "gm003ok@test.com")
        _make_available(db_session, user_id, m1.id)
        session_id = self._start(client, db_session, user_id, m1, auth)

        correct = json.dumps(["item1", "item2", "item3", "item4"])
        resp = client.post(f"/api/v1/gameplay/{session_id}/answer", json={"answer": correct}, headers=auth)
        assert resp.status_code == 200
        assert resp.json()["is_correct"] is True

    def test_incorrect_gm003_sequence(self, client: TestClient, db_session: Session):
        m1, _, _, _ = _seed_full_stack(db_session, "GM003", "EASY")
        user_id, _, auth = _register_and_auth(client, "gm003bad@test.com")
        _make_available(db_session, user_id, m1.id)
        session_id = self._start(client, db_session, user_id, m1, auth)

        wrong = json.dumps(["item4", "item3", "item2", "item1"])
        resp = client.post(f"/api/v1/gameplay/{session_id}/answer", json={"answer": wrong}, headers=auth)
        assert resp.status_code == 200
        assert resp.json()["is_correct"] is False


# ──────────────────────────────────────────────
# GM004 answer tests
# ──────────────────────────────────────────────

class TestGM004Answers:

    def _start(self, client, db_session, user_id, m1, auth):
        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM004_GEMINI_RESPONSE):
            resp = client.post(
                "/api/v1/gameplay/start",
                json={"mission_id": m1.id},
                headers=auth,
            )
        assert resp.status_code == 201
        return resp.json()["session_id"]

    def test_exact_gm004_answer(self, client: TestClient, db_session: Session):
        m1, _, _, _ = _seed_full_stack(db_session, "GM004", "HARD")
        user_id, _, auth = _register_and_auth(client, "gm004ok@test.com")
        _make_available(db_session, user_id, m1.id)
        session_id = self._start(client, db_session, user_id, m1, auth)

        resp = client.post(f"/api/v1/gameplay/{session_id}/answer", json={"answer": "Hydrogen"}, headers=auth)
        assert resp.status_code == 200
        assert resp.json()["is_correct"] is True

    def test_normalized_gm004_answer(self, client: TestClient, db_session: Session):
        m1, _, _, _ = _seed_full_stack(db_session, "GM004", "HARD")
        user_id, _, auth = _register_and_auth(client, "gm004norm@test.com")
        _make_available(db_session, user_id, m1.id)
        session_id = self._start(client, db_session, user_id, m1, auth)

        resp = client.post(f"/api/v1/gameplay/{session_id}/answer", json={"answer": "  HYDROGEN  "}, headers=auth)
        assert resp.status_code == 200
        assert resp.json()["is_correct"] is True

    def test_incorrect_gm004_answer(self, client: TestClient, db_session: Session):
        m1, _, _, _ = _seed_full_stack(db_session, "GM004", "HARD")
        user_id, _, auth = _register_and_auth(client, "gm004bad@test.com")
        _make_available(db_session, user_id, m1.id)
        session_id = self._start(client, db_session, user_id, m1, auth)

        resp = client.post(f"/api/v1/gameplay/{session_id}/answer", json={"answer": "Helium"}, headers=auth)
        assert resp.status_code == 200
        assert resp.json()["is_correct"] is False


# ──────────────────────────────────────────────
# PHASE 11B: Persistence & Session Resume Tests
# ──────────────────────────────────────────────

class TestPhase11BPersistenceAndSessionResume:

    def test_first_start(self, client: TestClient, db_session: Session):
        """TEST 1: Start an available mission. Verify 1 GameplaySession created (ACTIVE), 1 Challenge, playable returned."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "p11b_t1@test.com")
        _make_available(db_session, user_id, m1.id)

        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_GEMINI_RESPONSE):
            resp = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)

        assert resp.status_code == 201
        data = resp.json()
        assert "session_id" in data
        assert data["mission_id"] == m1.id
        assert data["gameplay_type"] == "GM001"
        assert "playable" in data
        assert "question" in data["playable"]["content"]

        session = db_session.query(GameplaySession).filter(GameplaySession.id == data["session_id"]).first()
        assert session is not None
        assert session.status == SESSION_ACTIVE
        assert session.user_id == user_id
        assert session.mission_id == m1.id
        assert session.challenge_id is not None

        challenge = db_session.query(Challenge).filter(Challenge.id == session.challenge_id).first()
        assert challenge is not None

    def test_second_start_reuses_session(self, client: TestClient, db_session: Session):
        """TEST 2: Second start for same user + mission returns SAME session_id and challenge."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "p11b_t2@test.com")
        _make_available(db_session, user_id, m1.id)

        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_GEMINI_RESPONSE):
            resp1 = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)
            resp2 = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)

        assert resp1.status_code == 201
        assert resp2.status_code == 200 or resp2.status_code == 201
        data1 = resp1.json()
        data2 = resp2.json()

        assert data1["session_id"] == data2["session_id"]
        assert data1["playable"]["content"]["question"] == data2["playable"]["content"]["question"]
        assert data1["playable"]["content"]["options"] == data2["playable"]["content"]["options"]

    def test_no_second_gemini_call(self, client: TestClient, db_session: Session):
        """TEST 3: Call /gameplay/start twice. Verify Gemini call count is 1, NOT 2."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "p11b_t3@test.com")
        _make_available(db_session, user_id, m1.id)

        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_GEMINI_RESPONSE) as mock_gen:
            resp1 = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)
            resp2 = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)

        assert resp1.status_code in (200, 201)
        assert resp2.status_code in (200, 201)
        assert mock_gen.call_count == 1

    def test_no_duplicate_database_rows(self, client: TestClient, db_session: Session):
        """TEST 4: After first start +1 session, +1 challenge. After second start, NO additional rows."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "p11b_t4@test.com")
        _make_available(db_session, user_id, m1.id)

        count_sess_0 = db_session.query(GameplaySession).count()
        count_chal_0 = db_session.query(Challenge).count()

        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_GEMINI_RESPONSE):
            client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)

        count_sess_1 = db_session.query(GameplaySession).count()
        count_chal_1 = db_session.query(Challenge).count()
        assert count_sess_1 == count_sess_0 + 1
        assert count_chal_1 == count_chal_0 + 1

        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_GEMINI_RESPONSE):
            client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)

        count_sess_2 = db_session.query(GameplaySession).count()
        count_chal_2 = db_session.query(Challenge).count()
        assert count_sess_2 == count_sess_1
        assert count_chal_2 == count_chal_1

    def test_incorrect_answer_keeps_session_active_and_reused(self, client: TestClient, db_session: Session):
        """TEST 5: Incorrect answer keeps session ACTIVE. Subsequent start reuses same session and challenge."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "p11b_t5@test.com")
        _make_available(db_session, user_id, m1.id)

        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_GEMINI_RESPONSE) as mock_gen:
            resp_start = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)
            session_id = resp_start.json()["session_id"]
            question = resp_start.json()["playable"]["content"]["question"]

            # Submit wrong answer
            ans_resp = client.post(
                f"/api/v1/gameplay/{session_id}/answer",
                json={"answer": "100,000 km/s"},
                headers=auth,
            )
            assert ans_resp.status_code == 200
            assert ans_resp.json()["is_correct"] is False

            # Verify session in DB remains ACTIVE
            session = db_session.query(GameplaySession).filter(GameplaySession.id == session_id).first()
            assert session.status == SESSION_ACTIVE

            # Re-call start
            resp_reopen = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)
            assert resp_reopen.json()["session_id"] == session_id
            assert resp_reopen.json()["playable"]["content"]["question"] == question
            assert mock_gen.call_count == 1

    def test_browser_refresh_simulation(self, client: TestClient, db_session: Session):
        """TEST 6: Start mission, call /gameplay/start again (browser refresh). Verify same session and challenge."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "p11b_t6@test.com")
        _make_available(db_session, user_id, m1.id)

        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_GEMINI_RESPONSE):
            r1 = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth).json()
            r2 = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth).json()

        assert r1["session_id"] == r2["session_id"]
        assert r1["playable"] == r2["playable"]

    def test_navigation_simulation(self, client: TestClient, db_session: Session):
        """TEST 7: Mission 1 -> Mission 2 -> Mission 3 -> Mission 1 returns original Mission 1 session/challenge."""
        m1, m2, topic, subject = _seed_full_stack(db_session, "GM001", "EASY")
        m3 = Mission(
            sector_id=m1.sector_id,
            topic_id=topic.id,
            title="Mission 3",
            order_index=3,
            difficulty="EASY",
            gameplay_type="GM001",
            is_active=True,
        )
        db_session.add(m3)
        db_session.commit()
        db_session.refresh(m3)

        user_id, _, auth = _register_and_auth(client, "p11b_t7@test.com")
        _make_available(db_session, user_id, m1.id)
        _make_available(db_session, user_id, m2.id)
        _make_available(db_session, user_id, m3.id)

        q1 = json.dumps({"question": "Q1?", "options": ["A", "B", "C", "D"], "answer": "A", "explanation": "E1"})
        q2 = json.dumps({"question": "Q2?", "options": ["W", "X", "Y", "Z"], "answer": "W", "explanation": "E2"})
        q3 = json.dumps({"question": "Q3?", "options": ["1", "2", "3", "4"], "answer": "1", "explanation": "E3"})

        with patch("app.ai.gemini_client.gemini_client.generate", side_effect=[q1, q2, q3]):
            res_m1_first = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth).json()
            res_m2 = client.post("/api/v1/gameplay/start", json={"mission_id": m2.id}, headers=auth).json()
            res_m3 = client.post("/api/v1/gameplay/start", json={"mission_id": m3.id}, headers=auth).json()

        # Reopen Mission 1
        with patch("app.ai.gemini_client.gemini_client.generate") as mock_never:
            res_m1_second = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth).json()
            assert mock_never.call_count == 0

        assert res_m1_first["session_id"] == res_m1_second["session_id"]
        assert res_m1_first["playable"]["content"]["question"] == "Q1?"
        assert res_m1_second["playable"]["content"]["question"] == "Q1?"
        assert res_m1_first["session_id"] != res_m2["session_id"]
        assert res_m1_first["session_id"] != res_m3["session_id"]

    def test_user_isolation(self, client: TestClient, db_session: Session):
        """TEST 8: User A and User B starting Mission 1 get independent sessions and challenges."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_a_id, _, auth_a = _register_and_auth(client, "p11b_uA@test.com")
        user_b_id, _, auth_b = _register_and_auth(client, "p11b_uB@test.com")
        _make_available(db_session, user_a_id, m1.id)
        _make_available(db_session, user_b_id, m1.id)

        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_GEMINI_RESPONSE):
            res_a = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth_a).json()
            res_b = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth_b).json()

        assert res_a["session_id"] != res_b["session_id"]
        sess_a = db_session.query(GameplaySession).filter(GameplaySession.id == res_a["session_id"]).first()
        sess_b = db_session.query(GameplaySession).filter(GameplaySession.id == res_b["session_id"]).first()
        assert sess_a.user_id == user_a_id
        assert sess_b.user_id == user_b_id

    def test_completed_mission_no_new_session_or_reward(self, client: TestClient, db_session: Session):
        """TEST 9: Completed mission revisited does not generate new challenge, active session, or duplicate rewards."""
        m1, _, _, _ = _seed_full_stack(db_session, "GM001", "EASY")
        user_id, _, auth = _register_and_auth(client, "p11b_t9@test.com")
        _make_available(db_session, user_id, m1.id)

        with patch("app.ai.gemini_client.gemini_client.generate", return_value=GM001_GEMINI_RESPONSE):
            start_resp = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)
        session_id = start_resp.json()["session_id"]

        # Complete mission with correct answer
        ans_resp = client.post(
            f"/api/v1/gameplay/{session_id}/answer",
            json={"answer": "300,000 km/s"},
            headers=auth,
        )
        assert ans_resp.status_code == 200
        assert ans_resp.json()["is_correct"] is True
        assert ans_resp.json()["mission_completed"] is True

        progress = db_session.query(MissionProgress).filter(
            MissionProgress.user_id == user_id,
            MissionProgress.mission_id == m1.id,
        ).first()
        assert progress.status == MISSION_COMPLETED

        rewards_before = db_session.query(RewardEvent).filter(RewardEvent.user_id == user_id).count()

        # Reopen completed mission
        with patch("app.ai.gemini_client.gemini_client.generate") as mock_never:
            reopen_resp = client.post("/api/v1/gameplay/start", json={"mission_id": m1.id}, headers=auth)
            assert mock_never.call_count == 0

        assert reopen_resp.status_code in (200, 201)
        # Verify no active session created
        active_count = db_session.query(GameplaySession).filter(
            GameplaySession.user_id == user_id,
            GameplaySession.mission_id == m1.id,
            GameplaySession.status == SESSION_ACTIVE,
        ).count()
        assert active_count == 0

        # Verify no new reward
        rewards_after = db_session.query(RewardEvent).filter(RewardEvent.user_id == user_id).count()
        assert rewards_after == rewards_before

    def test_all_gameplay_types_rehydration(self, client: TestClient, db_session: Session):
        """TEST 10: Rehydration works for GM001, GM002, GM003, GM004 and never leaks answers."""
        configs = [
            ("GM001", GM001_GEMINI_RESPONSE, ["answer"]),
            ("GM002", GM002_GEMINI_RESPONSE, ["canonical_mapping"]),
            ("GM003", GM003_GEMINI_RESPONSE, ["canonical_order"]),
            ("GM004", GM004_GEMINI_RESPONSE, ["accepted_answers"]),
        ]

        for gp_type, gemini_resp, forbidden_keys in configs:
            m, _, _, _ = _seed_full_stack(db_session, gp_type, "MEDIUM")
            user_id, _, auth = _register_and_auth(client, f"rehydrate_{gp_type.lower()}@test.com")
            _make_available(db_session, user_id, m.id)

            with patch("app.ai.gemini_client.gemini_client.generate", return_value=gemini_resp):
                r1 = client.post("/api/v1/gameplay/start", json={"mission_id": m.id}, headers=auth).json()

            with patch("app.ai.gemini_client.gemini_client.generate") as mock_never:
                r2 = client.post("/api/v1/gameplay/start", json={"mission_id": m.id}, headers=auth).json()
                assert mock_never.call_count == 0

            assert r1["session_id"] == r2["session_id"]
            assert r2["gameplay_type"] == gp_type

            # Check that sensitive keys are not exposed in content
            content = r2["playable"]["content"]
            for f_key in forbidden_keys:
                assert f_key not in content, f"Leaked forbidden key '{f_key}' in {gp_type} playable content"
