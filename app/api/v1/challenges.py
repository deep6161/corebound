"""
Challenges API Endpoints (Phases V17 & V18)

Provides authenticated endpoints for generating AI-powered educational challenges
using the Gemini client and V16 deterministic adaptive context.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.mission import Mission
from app.models.user import User
from app.models.user_performance import UserPerformance
from app.models.user_profile import UserProfile
from app.schemas.challenge import (
    ChallengeGenerateRequest,
    PlayableChallengeResponse,
)
from app.services.adaptive_selector import select_adaptive_mission_context
from app.services.gemini_question_generator import (
    GeminiGenerationError,
    GeminiValidationError,
    generate_challenge_for_mission,
)
from app.services.profile_service import create_profile_for_user

router = APIRouter(
    prefix="/challenges",
    tags=["Challenges"],
)


@router.post(
    "/generate",
    response_model=PlayableChallengeResponse,
    status_code=status.HTTP_200_OK,
)
def generate_challenge(
    request: ChallengeGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Generates a dynamic AI-powered challenge for the requested mission.
    Supports GM001 (Phase V17) and GM002 (Phase V18).

    Flow:
    1. Authenticate user.
    2. Load mission from database & verify existence.
    3. Verify mission gameplay type is supported (GM001 or GM002).
    4. Obtain V16 adaptive context (preferences, performance, difficulty).
    5. Generate challenge with Gemini & validate output structure.
    6. Return sanitized playable response (no answers or mappings exposed).

    Does NOT start mission sessions, mutate progression, or award rewards.
    """
    # 1. Load mission
    mission = db.query(Mission).filter(Mission.id == request.mission_id).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mission with id {request.mission_id} not found",
        )

    # 2. Check gameplay type
    supported_types = {"GM001", "GM002"}
    if mission.gameplay_type not in supported_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"AI challenge generation currently supports {sorted(list(supported_types))}. Mission {mission.id} has gameplay type '{mission.gameplay_type}'.",
        )

    # 3. Load or create user profile for preferences
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = create_profile_for_user(current_user.id, db)
        db.commit()
        db.refresh(profile)

    # 4. Load user performance for this specific topic
    performance = (
        db.query(UserPerformance)
        .filter(
            UserPerformance.user_id == current_user.id,
            UserPerformance.topic_id == mission.topic_id,
        )
        .first()
    )

    # 5. Obtain V16 adaptive context
    adaptive_context = select_adaptive_mission_context(
        mission=mission,
        profile=profile,
        performance=performance,
        db=db,
    )

    # 6. Generate, validate & sanitize challenge via Gemini generator dispatcher
    try:
        playable_challenge = generate_challenge_for_mission(
            adaptive_context=adaptive_context,
            mission=mission,
            db=db,
        )
    except GeminiValidationError as err:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI challenge validation failed: {err}",
        )
    except GeminiGenerationError as err:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI challenge service error: {err}",
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error during challenge generation: {err}",
        )

    return playable_challenge
