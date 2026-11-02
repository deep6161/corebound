from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.mission import Mission
from app.models.user import User
from app.models.user_performance import UserPerformance
from app.models.user_profile import UserProfile
from app.schemas.adaptive import AdaptiveMissionResponse
from app.services.adaptive_selector import select_adaptive_mission_context
from app.services.profile_service import create_profile_for_user

router = APIRouter(
    prefix="/adaptive",
    tags=["Adaptive"],
)


@router.get(
    "/mission/{mission_id}",
    response_model=AdaptiveMissionResponse,
)
def get_adaptive_mission(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns deterministic challenge generation parameters and difficulty
    for the specified mission based on the authenticated user's preferences
    and topic-specific performance history.

    Does NOT generate questions or start/mutate gameplay sessions.
    """
    # 1. Load mission and verify existence
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found",
        )

    # 2. Load or create user profile for preferences
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = create_profile_for_user(current_user.id, db)
        db.commit()
        db.refresh(profile)

    # 3. Load user performance for this specific topic
    # Note: query by user_id and topic_id (and optionally matching mission's gameplay_type if specific, or general topic performance)
    performance = (
        db.query(UserPerformance)
        .filter(
            UserPerformance.user_id == current_user.id,
            UserPerformance.topic_id == mission.topic_id,
        )
        .first()
    )

    # 4. Run deterministic Adaptive Selector
    context_data = select_adaptive_mission_context(
        mission=mission,
        profile=profile,
        performance=performance,
        db=db,
    )

    return context_data
