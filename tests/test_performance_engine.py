"""Tests for PerformanceService — upsert, accuracy, rolling average."""
import pytest
from sqlalchemy.orm import Session

from app.models.subject import Subject
from app.models.topic import Topic
from app.models.user_performance import UserPerformance
from app.services.performance_service import update_performance, get_topic_accuracy


def _seed_user_topic(db: Session, email: str = "perf@test.com"):
    from app.models.user import User
    from app.core.security import get_password_hash
    user = User(email=email, password_hash=get_password_hash("pw"))
    db.add(user)
    db.flush()

    subject = Subject(name=f"Sub_{email}", description="")
    db.add(subject)
    db.flush()

    topic = Topic(subject_id=subject.id, name=f"Topic_{email}", description="")
    db.add(topic)
    db.flush()
    db.commit()
    db.refresh(user)
    db.refresh(topic)
    return user, topic


class TestUpdatePerformance:

    def test_creates_new_record_on_first_attempt(self, db_session: Session):
        user, topic = _seed_user_topic(db_session, "perf1@test.com")
        record = update_performance(user.id, topic.id, "GM001", "EASY", True, None, db_session)
        db_session.commit()
        assert record.total_attempts == 1
        assert record.correct_attempts == 1
        assert record.accuracy == 1.0

    def test_creates_record_on_incorrect(self, db_session: Session):
        user, topic = _seed_user_topic(db_session, "perf2@test.com")
        record = update_performance(user.id, topic.id, "GM001", "EASY", False, None, db_session)
        db_session.commit()
        assert record.total_attempts == 1
        assert record.correct_attempts == 0
        assert record.accuracy == 0.0

    def test_accumulates_across_calls(self, db_session: Session):
        user, topic = _seed_user_topic(db_session, "perf3@test.com")
        update_performance(user.id, topic.id, "GM001", "EASY", True, None, db_session)
        update_performance(user.id, topic.id, "GM001", "EASY", False, None, db_session)
        update_performance(user.id, topic.id, "GM001", "EASY", True, None, db_session)
        db_session.commit()

        record = db_session.query(UserPerformance).filter(
            UserPerformance.user_id == user.id,
            UserPerformance.topic_id == topic.id,
            UserPerformance.gameplay_type == "GM001",
        ).first()
        assert record.total_attempts == 3
        assert record.correct_attempts == 2
        assert round(record.accuracy, 4) == round(2/3, 4)

    def test_response_time_tracked(self, db_session: Session):
        user, topic = _seed_user_topic(db_session, "perf4@test.com")
        update_performance(user.id, topic.id, "GM001", "EASY", True, 1000, db_session)
        update_performance(user.id, topic.id, "GM001", "EASY", True, 2000, db_session)
        db_session.commit()

        record = db_session.query(UserPerformance).filter(
            UserPerformance.user_id == user.id,
        ).first()
        assert record.avg_response_ms == 1500.0

    def test_streak_incremented_on_correct(self, db_session: Session):
        user, topic = _seed_user_topic(db_session, "perf5@test.com")
        update_performance(user.id, topic.id, "GM001", "EASY", True, None, db_session)
        update_performance(user.id, topic.id, "GM001", "EASY", True, None, db_session)
        db_session.commit()

        record = db_session.query(UserPerformance).filter(
            UserPerformance.user_id == user.id,
        ).first()
        assert record.best_streak == 2

    def test_streak_resets_on_incorrect(self, db_session: Session):
        user, topic = _seed_user_topic(db_session, "perf6@test.com")
        update_performance(user.id, topic.id, "GM001", "EASY", True, None, db_session)
        update_performance(user.id, topic.id, "GM001", "EASY", False, None, db_session)
        db_session.commit()

        record = db_session.query(UserPerformance).filter(
            UserPerformance.user_id == user.id,
        ).first()
        assert record.best_streak == 0


class TestGetTopicAccuracy:

    def test_no_history_returns_none(self, db_session: Session):
        user, topic = _seed_user_topic(db_session, "acc1@test.com")
        acc = get_topic_accuracy(user.id, topic.id, "GM001", db_session)
        assert acc is None

    def test_returns_accuracy_after_attempts(self, db_session: Session):
        user, topic = _seed_user_topic(db_session, "acc2@test.com")
        update_performance(user.id, topic.id, "GM001", "EASY", True, None, db_session)
        update_performance(user.id, topic.id, "GM001", "EASY", False, None, db_session)
        db_session.commit()

        acc = get_topic_accuracy(user.id, topic.id, "GM001", db_session)
        assert acc == 0.5
