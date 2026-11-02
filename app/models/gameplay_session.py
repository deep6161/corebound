from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

# Session status values
SESSION_ACTIVE = "ACTIVE"
SESSION_COMPLETED = "COMPLETED"
SESSION_EXPIRED = "EXPIRED"
VALID_SESSION_STATUSES = {SESSION_ACTIVE, SESSION_COMPLETED, SESSION_EXPIRED}


class GameplaySession(Base):
    """
    Tracks one gameplay attempt: one user, one mission, one generated challenge.

    - ACTIVE: challenge generated, awaiting answer
    - COMPLETED: answer submitted and evaluated (correct)
    - EXPIRED: session was abandoned or replaced

    Canonical answer is stored in Challenge.content, NOT here.
    """
    __tablename__ = "gameplay_sessions"

    __table_args__ = (
        CheckConstraint("score IS NULL OR (score >= 0 AND score <= 100)", name="ck_gameplay_sessions_score_range"),
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

    # GM001 | GM002 | GM003 | GM004 (matches mission.gameplay_type)
    gameplay_type: Mapped[str] = mapped_column(String(20), nullable=False)

    # EASY | MEDIUM | HARD (may differ from mission baseline due to adaptive)
    difficulty: Mapped[str] = mapped_column(String(20), nullable=False)

    # ACTIVE | COMPLETED | EXPIRED
    status: Mapped[str] = mapped_column(String(20), nullable=False, default=SESSION_ACTIVE, index=True)

    # Whether the user answered correctly (null until evaluation)
    is_correct: Mapped[bool | None] = mapped_column(Boolean, nullable=True)

    # 0–100, set after evaluation
    score: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Multi-phase progression (e.g. Boss Battle Phase 1, 2, 3) — NULL for normal single-submission gameplay
    current_phase: Mapped[int | None] = mapped_column(Integer, nullable=True, default=None)

    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships
    user = relationship("User", back_populates="gameplay_sessions")
    mission = relationship("Mission", back_populates="gameplay_sessions")
    challenge = relationship("Challenge", back_populates="gameplay_sessions")
    reward_event = relationship("RewardEvent", back_populates="gameplay_session", uselist=False)
    question_attempts = relationship("QuestionAttempt", back_populates="gameplay_session", cascade="all, delete-orphan")
