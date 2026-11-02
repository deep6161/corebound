from datetime import datetime
from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

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

    # Phase 1 back-references
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    mission_progress_records = relationship("MissionProgress", back_populates="user", cascade="all, delete-orphan")
    question_attempts = relationship("QuestionAttempt", back_populates="user", cascade="all, delete-orphan")
    reward_events = relationship("RewardEvent", back_populates="user", cascade="all, delete-orphan")
    performance_records = relationship("UserPerformance", back_populates="user", cascade="all, delete-orphan")

    # Phase 2 back-references
    gameplay_sessions = relationship("GameplaySession", back_populates="user", cascade="all, delete-orphan")
