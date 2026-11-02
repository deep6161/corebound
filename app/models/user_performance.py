from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class UserPerformance(Base):
    """
    Aggregated per-user performance stats per topic and gameplay type.

    Phase 2 updates this after each completed attempt.
    Phase 1 creates the foundation; initial values are zeroed.

    Unique per (user_id, topic_id, gameplay_type) — Phase 2 upserts rows.
    """
    __tablename__ = "user_performance"

    __table_args__ = (
        UniqueConstraint(
            "user_id", "topic_id", "gameplay_type",
            name="uq_user_performance_user_topic_gameplay",
        ),
        CheckConstraint("total_attempts >= 0", name="ck_user_performance_attempts_non_negative"),
        CheckConstraint("correct_attempts >= 0", name="ck_user_performance_correct_non_negative"),
        CheckConstraint(
            "correct_attempts <= total_attempts",
            name="ck_user_performance_correct_lte_total",
        ),
        CheckConstraint(
            "accuracy IS NULL OR (accuracy >= 0.0 AND accuracy <= 1.0)",
            name="ck_user_performance_accuracy_range",
        ),
        CheckConstraint(
            "avg_response_ms IS NULL OR avg_response_ms >= 0",
            name="ck_user_performance_response_ms_non_negative",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    topic_id: Mapped[int] = mapped_column(
        ForeignKey("topics.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # GM001 | GM002 | GM003 | GM004
    gameplay_type: Mapped[str] = mapped_column(String(20), nullable=False)

    # EASY | MEDIUM | HARD (nullable — can aggregate across difficulties)
    difficulty: Mapped[str | None] = mapped_column(String(20), nullable=True)

    total_attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    correct_attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Computed as correct_attempts / total_attempts; updated by Phase 2
    accuracy: Mapped[float | None] = mapped_column(Float, nullable=True)

    # Average response time in milliseconds
    avg_response_ms: Mapped[float | None] = mapped_column(Float, nullable=True)

    # Best consecutive correct answers
    best_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    last_attempted_at: Mapped[datetime | None] = mapped_column(
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
    user = relationship("User", back_populates="performance_records")
    topic = relationship("Topic", back_populates="performance_records")
