from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

# Controlled reward reason types
REWARD_REASON_MISSION_COMPLETE = "MISSION_COMPLETE"
REWARD_REASON_STREAK_BONUS = "STREAK_BONUS"
REWARD_REASON_FIRST_ATTEMPT = "FIRST_ATTEMPT_BONUS"
REWARD_REASON_PERFECT_SCORE = "PERFECT_SCORE_BONUS"
REWARD_REASON_ADMIN_GRANT = "ADMIN_GRANT"


class RewardEvent(Base):
    """
    Immutable server-side audit record of rewards granted.

    The frontend can READ these but must NEVER POST/PATCH reward events.
    XP/credits/stars are only modified by server-side logic (Phase 2 reward engine).

    gameplay_session_id has a UNIQUE constraint: one session → at most one reward event.
    """
    __tablename__ = "reward_events"

    __table_args__ = (
        CheckConstraint("xp >= 0", name="ck_reward_events_xp_non_negative"),
        CheckConstraint("credits >= 0", name="ck_reward_events_credits_non_negative"),
        CheckConstraint("stars >= 0", name="ck_reward_events_stars_non_negative"),
        UniqueConstraint("gameplay_session_id", name="uq_reward_events_gameplay_session"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    mission_id: Mapped[int | None] = mapped_column(
        ForeignKey("missions.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Links to the session that generated this reward.
    # UNIQUE — one session can produce at most one RewardEvent.
    gameplay_session_id: Mapped[int | None] = mapped_column(
        ForeignKey("gameplay_sessions.id", ondelete="SET NULL"),
        nullable=True,
        unique=True,
        index=True,
    )

    xp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    credits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    stars: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # MISSION_COMPLETE | STREAK_BONUS | FIRST_ATTEMPT_BONUS | etc.
    reason: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    user = relationship("User", back_populates="reward_events")
    mission = relationship("Mission")
    gameplay_session = relationship("GameplaySession", back_populates="reward_event")
