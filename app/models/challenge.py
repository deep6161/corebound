from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Challenge(Base):
    __tablename__ = "challenges"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    topic_id: Mapped[int] = mapped_column(
        ForeignKey("topics.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    gameplay_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    difficulty: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    explanation: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    ai_generated: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    validated: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    topic = relationship(
        "Topic",
        back_populates="challenges",
    )

    question_attempts = relationship(
        "QuestionAttempt",
        back_populates="challenge",
        cascade="all, delete-orphan",
    )

    gameplay_sessions = relationship(
        "GameplaySession",
        back_populates="challenge",
        cascade="all, delete-orphan",
    )