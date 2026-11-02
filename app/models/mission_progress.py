from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

# Controlled status values
STATUS_LOCKED = "LOCKED"
STATUS_AVAILABLE = "AVAILABLE"
STATUS_IN_PROGRESS = "IN_PROGRESS"
STATUS_COMPLETED = "COMPLETED"
VALID_STATUSES = {STATUS_LOCKED, STATUS_AVAILABLE, STATUS_IN_PROGRESS, STATUS_COMPLETED}


class MissionProgress(Base):
    """Per-user per-mission progress record."""
    __tablename__ = "mission_progress"

    __table_args__ = (
        UniqueConstraint("user_id", "mission_id", name="uq_mission_progress_user_mission"),
        CheckConstraint("attempts >= 0", name="ck_mission_progress_attempts_non_negative"),
        CheckConstraint("best_score >= 0", name="ck_mission_progress_score_non_negative"),
        CheckConstraint("stars >= 0 AND stars <= 3", name="ck_mission_progress_stars_range"),
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

    # LOCKED | AVAILABLE | IN_PROGRESS | COMPLETED
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default=STATUS_LOCKED,
        index=True,
    )

    attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    best_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # 0-3 stars awarded on best run
    stars: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    user = relationship("User", back_populates="mission_progress_records")
    mission = relationship("Mission", back_populates="progress_records")
