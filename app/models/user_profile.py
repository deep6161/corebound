from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    __table_args__ = (
        UniqueConstraint("user_id", name="uq_user_profiles_user_id"),
        CheckConstraint("xp >= 0", name="ck_user_profiles_xp_non_negative"),
        CheckConstraint("credits >= 0", name="ck_user_profiles_credits_non_negative"),
        CheckConstraint("stars >= 0", name="ck_user_profiles_stars_non_negative"),
        CheckConstraint("level >= 1", name="ck_user_profiles_level_positive"),
        CheckConstraint("streak >= 0", name="ck_user_profiles_streak_non_negative"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    display_name: Mapped[str | None] = mapped_column(String(100), nullable=True)

    bio: Mapped[str | None] = mapped_column(Text, nullable=True)

    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    level: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    xp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    credits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    stars: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Phase V14 Onboarding Preferences
    goal: Mapped[str | None] = mapped_column(String(100), nullable=True)

    target_role: Mapped[str | None] = mapped_column(String(100), nullable=True)

    skill_level: Mapped[str | None] = mapped_column(String(50), nullable=True)

    subjects: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)

    daily_time: Mapped[str | None] = mapped_column(String(50), nullable=True)

    difficulty_preference: Mapped[str | None] = mapped_column(String(50), nullable=True, default="Adaptive")

    learning_preference: Mapped[str | None] = mapped_column(String(50), nullable=True)

    preferences_updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

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

    # Relationship back to User
    user = relationship("User", back_populates="profile")
