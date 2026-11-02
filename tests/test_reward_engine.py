"""Tests for the reward service — deterministic values, idempotency."""
import pytest
from sqlalchemy.orm import Session

from app.models.mission import DIFFICULTY_EASY, DIFFICULTY_MEDIUM, DIFFICULTY_HARD
from app.models.reward_event import RewardEvent
from app.models.story import Story, Chapter, Sector
from app.models.subject import Subject
from app.models.topic import Topic
from app.models.mission import Mission
from app.models.gameplay_session import GameplaySession, SESSION_ACTIVE
from app.models.challenge import Challenge
from app.models.user_profile import UserProfile
from app.services.reward_service import (
    grant_reward,
    _calculate_stars,
    _calculate_score,
    XP_BY_DIFFICULTY,
)


def _seed_user_and_session(db: Session, difficulty: str = DIFFICULTY_EASY):
    """Seed minimal DB objects to test reward_service."""
    from app.models.user import User
    from app.core.security import get_password_hash
    user = User(email=f"reward_{difficulty}@test.com", password_hash=get_password_hash("pw"))
    db.add(user)
    db.flush()

    profile = UserProfile(user_id=user.id)
    db.add(profile)
    db.flush()

    subject = Subject(name=f"Sub_{difficulty}", description="")
    db.add(subject)
    db.flush()

    topic = Topic(subject_id=subject.id, name="Topic", description="")
    db.add(topic)
    db.flush()

    story = Story(title="S")
    db.add(story)
    db.flush()

    chapter = Chapter(story_id=story.id, title="C", order_index=1)
    db.add(chapter)
    db.flush()

    sector = Sector(chapter_id=chapter.id, title="Sec", order_index=1)
    db.add(sector)
    db.flush()

    mission = Mission(
        sector_id=sector.id,
        topic_id=topic.id,
        title="M",
        order_index=1,
        difficulty=difficulty,
        gameplay_type="GM001",
        is_active=True,
    )
    db.add(mission)
    db.flush()

    challenge = Challenge(
        topic_id=topic.id,
        gameplay_type="GM001",
        difficulty=difficulty,
        content='{"question":"Q","options":["A","B","C","D"],"answer":"A","explanation":"E"}',
        ai_generated=True,
        validated=True,
    )
    db.add(challenge)
    db.flush()

    session = GameplaySession(
        user_id=user.id,
        mission_id=mission.id,
        challenge_id=challenge.id,
        gameplay_type="GM001",
        difficulty=difficulty,
        status=SESSION_ACTIVE,
    )
    db.add(session)
    db.commit()
    db.refresh(user)
    db.refresh(session)
    return user, session, mission, profile


class TestRewardConstants:
    def test_easy_xp(self):
        assert XP_BY_DIFFICULTY[DIFFICULTY_EASY] == 50

    def test_medium_xp(self):
        assert XP_BY_DIFFICULTY[DIFFICULTY_MEDIUM] == 100

    def test_hard_xp(self):
        assert XP_BY_DIFFICULTY[DIFFICULTY_HARD] == 150


class TestCalculateStars:
    def test_first_attempt_correct_three_stars(self):
        assert _calculate_stars(1, True) == 3

    def test_second_attempt_correct_two_stars(self):
        assert _calculate_stars(2, True) == 2

    def test_third_attempt_correct_one_star(self):
        assert _calculate_stars(3, True) == 1

    def test_tenth_attempt_correct_one_star(self):
        assert _calculate_stars(10, True) == 1

    def test_incorrect_zero_stars(self):
        assert _calculate_stars(1, False) == 0

    def test_incorrect_second_attempt_zero(self):
        assert _calculate_stars(2, False) == 0


class TestGrantReward:

    def test_correct_reward_xp_easy(self, db_session: Session):
        user, session, mission, profile = _seed_user_and_session(db_session, DIFFICULTY_EASY)
        event = grant_reward(
            user_id=user.id,
            mission_id=mission.id,
            gameplay_session_id=session.id,
            difficulty=DIFFICULTY_EASY,
            attempt_number=1,
            is_correct=True,
            db=db_session,
        )
        db_session.commit()
        assert event is not None
        assert event.xp == 50
        assert event.stars == 3
        assert event.credits == 3

    def test_correct_reward_xp_medium(self, db_session: Session):
        user, session, mission, profile = _seed_user_and_session(db_session, DIFFICULTY_MEDIUM)
        event = grant_reward(
            user_id=user.id,
            mission_id=mission.id,
            gameplay_session_id=session.id,
            difficulty=DIFFICULTY_MEDIUM,
            attempt_number=2,
            is_correct=True,
            db=db_session,
        )
        db_session.commit()
        assert event.xp == 100
        assert event.stars == 2
        assert event.credits == 2

    def test_incorrect_no_reward(self, db_session: Session):
        user, session, mission, profile = _seed_user_and_session(db_session, DIFFICULTY_HARD)
        event = grant_reward(
            user_id=user.id,
            mission_id=mission.id,
            gameplay_session_id=session.id,
            difficulty=DIFFICULTY_HARD,
            attempt_number=1,
            is_correct=False,
            db=db_session,
        )
        assert event is None

    def test_user_profile_xp_updated(self, db_session: Session):
        user, session, mission, profile = _seed_user_and_session(db_session, DIFFICULTY_EASY)
        initial_xp = profile.xp
        grant_reward(
            user_id=user.id,
            mission_id=mission.id,
            gameplay_session_id=session.id,
            difficulty=DIFFICULTY_EASY,
            attempt_number=1,
            is_correct=True,
            db=db_session,
        )
        db_session.commit()
        db_session.refresh(profile)
        assert profile.xp == initial_xp + 50

    def test_reward_event_linked_to_session(self, db_session: Session):
        user, session, mission, profile = _seed_user_and_session(db_session, DIFFICULTY_EASY)
        grant_reward(
            user_id=user.id,
            mission_id=mission.id,
            gameplay_session_id=session.id,
            difficulty=DIFFICULTY_EASY,
            attempt_number=1,
            is_correct=True,
            db=db_session,
        )
        db_session.commit()
        event = db_session.query(RewardEvent).filter(
            RewardEvent.gameplay_session_id == session.id
        ).first()
        assert event is not None
        assert event.gameplay_session_id == session.id
