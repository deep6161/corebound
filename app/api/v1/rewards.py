from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.reward_event import RewardEvent
from app.models.user import User
from app.models.user_profile import UserProfile
from app.schemas.reward import (
    RewardHistoryItemResponse,
    RewardMeResponse,
    RewardSummaryResponse,
)

router = APIRouter(
    prefix="/rewards",
    tags=["Rewards"],
)


@router.get(
    "/me",
    response_model=RewardMeResponse,
)
def get_my_rewards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return current reward totals (XP, credits, stars) from user profile."""
    profile = (
        db.query(UserProfile)
        .filter(UserProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        return RewardMeResponse(xp=0, credits=0, stars=0, level=1, streak=0)

    return RewardMeResponse(
        xp=profile.xp,
        credits=profile.credits,
        stars=profile.stars,
        level=profile.level,
        streak=profile.streak,
    )


@router.get(
    "/history",
    response_model=list[RewardHistoryItemResponse],
)
def get_reward_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return audit log of reward events for the current user."""
    events = (
        db.query(RewardEvent)
        .filter(RewardEvent.user_id == current_user.id)
        .order_by(RewardEvent.created_at.desc())
        .all()
    )
    return events


@router.get(
    "/summary",
    response_model=RewardSummaryResponse,
)
def get_reward_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return aggregate totals from all reward events for the current user."""
    events = (
        db.query(RewardEvent)
        .filter(RewardEvent.user_id == current_user.id)
        .all()
    )

    total_xp = sum(e.xp for e in events)
    total_credits = sum(e.credits for e in events)
    total_stars = sum(e.stars for e in events)

    return RewardSummaryResponse(
        total_xp=total_xp,
        total_credits=total_credits,
        total_stars=total_stars,
        total_events=len(events),
    )
