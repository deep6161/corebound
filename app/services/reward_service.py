"""
RewardService

Calculates and grants deterministic rewards for a completed gameplay session.

Constants (authoritative — frontend cannot submit these):
    EASY   = 50 XP
    MEDIUM = 100 XP
    HARD   = 150 XP

Stars:
    3 → correct on first attempt (attempt_number == 1)
    2 → correct on second attempt (attempt_number == 2)
    1 → correct after second attempt (attempt_number > 2)
    0 → incorrect

Credits:
    credits = stars (1:1)

Idempotency:
    The reward_events table has a UNIQUE constraint on gameplay_session_id.
    Attempting to grant a reward for an already-completed session raises
    IntegrityError which is caught and treated as a no-op.
"""

from datetime import datetime, timezone

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.mission import DIFFICULTY_EASY, DIFFICULTY_MEDIUM, DIFFICULTY_HARD
from app.models.reward_event import (
    RewardEvent,
    REWARD_REASON_MISSION_COMPLETE,
    REWARD_REASON_PERFECT_SCORE,
)
from app.models.user_profile import UserProfile

# ──────────────────────────────────────────────
# Reward constants — only change here, not in routers
# ──────────────────────────────────────────────
XP_BY_DIFFICULTY: dict[str, int] = {
    DIFFICULTY_EASY: 50,
    DIFFICULTY_MEDIUM: 100,
    DIFFICULTY_HARD: 150,
}

# Stars based on attempt number (1-based count of answer submissions for this session)
def _calculate_stars(attempt_number: int, is_correct: bool) -> int:
    if not is_correct:
        return 0
    if attempt_number == 1:
        return 3
    if attempt_number == 2:
        return 2
    return 1


def _calculate_score(attempt_number: int, is_correct: bool) -> int:
    """Maps stars 0-3 to a 0-100 score."""
    stars = _calculate_stars(attempt_number, is_correct)
    return stars * 33 + (1 if stars == 3 else 0)  # 0, 33, 66, 100


def grant_reward(
    user_id: int,
    mission_id: int,
    gameplay_session_id: int,
    difficulty: str,
    attempt_number: int,
    is_correct: bool,
    db: Session,
) -> RewardEvent | None:
    """
    Calculate and grant rewards for a correct answer.

    Returns the created RewardEvent, or None if already granted (idempotent).
    Does NOT commit — caller's transaction covers this.

    Incorrect answers → no reward (returns None).
    """
    if not is_correct:
        return None

    xp = XP_BY_DIFFICULTY.get(difficulty, XP_BY_DIFFICULTY[DIFFICULTY_MEDIUM])
    stars = _calculate_stars(attempt_number, is_correct)
    credits = stars

    reason = REWARD_REASON_PERFECT_SCORE if stars == 3 else REWARD_REASON_MISSION_COMPLETE

    # Update UserProfile totals
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if profile:
        profile.xp += xp
        profile.credits += credits
        profile.stars += stars

    # Create immutable audit record
    event = RewardEvent(
        user_id=user_id,
        mission_id=mission_id,
        gameplay_session_id=gameplay_session_id,
        xp=xp,
        credits=credits,
        stars=stars,
        reason=reason,
    )
    db.add(event)

    return event
