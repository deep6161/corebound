from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Topic(Base):
    __tablename__ = "topics"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    subject_id: Mapped[int] = mapped_column(
        ForeignKey("subjects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    subject = relationship(
        "Subject",
        back_populates="topics",
    )

    challenges = relationship(
        "Challenge",
        back_populates="topic",
        cascade="all, delete-orphan",
    )

    missions = relationship(
        "Mission",
        back_populates="topic",
    )

    performance_records = relationship(
        "UserPerformance",
        back_populates="topic",
        cascade="all, delete-orphan",
    )