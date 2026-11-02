from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

# Controlled difficulty values
DIFFICULTY_EASY = "EASY"
DIFFICULTY_MEDIUM = "MEDIUM"
DIFFICULTY_HARD = "HARD"
VALID_DIFFICULTIES = {DIFFICULTY_EASY, DIFFICULTY_MEDIUM, DIFFICULTY_HARD}

# Controlled gameplay type values (must match core/gameplay.py conventions)
GAMEPLAY_GM001 = "GM001"
GAMEPLAY_GM002 = "GM002"
GAMEPLAY_GM003 = "GM003"
GAMEPLAY_GM004 = "GM004"
VALID_GAMEPLAY_TYPES = {GAMEPLAY_GM001, GAMEPLAY_GM002, GAMEPLAY_GM003, GAMEPLAY_GM004}


class Mission(Base):
    """A playable mission within a sector, linked to a topic."""
    __tablename__ = "missions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    sector_id: Mapped[int] = mapped_column(
        ForeignKey("sectors.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    topic_id: Mapped[int] = mapped_column(
        ForeignKey("topics.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(String(200), nullable=False)

    objective: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Order within the sector (1-based)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    # EASY | MEDIUM | HARD
    difficulty: Mapped[str] = mapped_column(String(20), nullable=False, default=DIFFICULTY_MEDIUM)

    # GM001 | GM002 | GM003 | GM004
    gameplay_type: Mapped[str] = mapped_column(String(20), nullable=False, default=GAMEPLAY_GM001, index=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    sector = relationship("Sector", back_populates="missions")
    topic = relationship("Topic", back_populates="missions")
    progress_records = relationship("MissionProgress", back_populates="mission", cascade="all, delete-orphan")
    question_attempts = relationship("QuestionAttempt", back_populates="mission", cascade="all, delete-orphan")
    gameplay_sessions = relationship("GameplaySession", back_populates="mission", cascade="all, delete-orphan")
