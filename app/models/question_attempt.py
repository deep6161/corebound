from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class QuestionAttempt(Base):
    """
    Records each individual question answer submitted by a user during a mission.

    NOTE: canonical_answer is NEVER stored here to prevent leakage.
    The submitted_answer is stored for audit/evaluation purposes.
    is_correct is set by the server-side evaluation engine.
    """
    __tablename__ = "question_attempts"

    __table_args__ = (
        CheckConstraint("attempt_number >= 1", name="ck_question_attempts_attempt_number_positive"),
        CheckConstraint(
            "time_taken_ms IS NULL OR time_taken_ms >= 0",
            name="ck_question_attempts_time_non_negative",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    mission_id: Mapped[int] = mapped_column(
        ForeignKey("missions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    challenge_id: Mapped[int] = mapped_column(
        ForeignKey("challenges.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Integer FK to gameplay_sessions.id (replaces legacy String reference)
    gameplay_session_id: Mapped[int | None] = mapped_column(
        ForeignKey("gameplay_sessions.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # The answer submitted by the user. Stored as text; never exposes the correct answer.
    submitted_answer: Mapped[str] = mapped_column(Text, nullable=False)

    # Server-computed by evaluation engine
    is_correct: Mapped[bool | None] = mapped_column(Boolean, nullable=True)

    # Milliseconds the user took to answer
    time_taken_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Which attempt number for this challenge in this session (1-based)
    attempt_number: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    user = relationship("User", back_populates="question_attempts")
    mission = relationship("Mission", back_populates="question_attempts")
    challenge = relationship("Challenge", back_populates="question_attempts")
    gameplay_session = relationship("GameplaySession", back_populates="question_attempts")
