from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.mission import Mission
from app.models.mission_progress import (
    MissionProgress,
    STATUS_AVAILABLE,
    STATUS_IN_PROGRESS,
    STATUS_LOCKED,
)
from app.models.user import User
from app.schemas.mission import (
    MissionDetailResponse,
    MissionStartResponse,
    MissionStatusResponse,
)
from app.schemas.story import MissionBriefResponse
from app.services.profile_service import get_or_create_mission_progress

router = APIRouter(
    prefix="/missions",
    tags=["Missions"],
)


@router.get(
    "",
    response_model=list[MissionBriefResponse],
)
def list_missions(db: Session = Depends(get_db)):
    """Return all active missions."""
    return (
        db.query(Mission)
        .filter(Mission.is_active == True)
        .order_by(Mission.order_index)
        .all()
    )


@router.get(
    "/available",
    response_model=list[MissionBriefResponse],
)
def list_available_missions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return missions that are AVAILABLE for the current user."""
    available_ids = (
        db.query(MissionProgress.mission_id)
        .filter(
            MissionProgress.user_id == current_user.id,
            MissionProgress.status == STATUS_AVAILABLE,
        )
        .all()
    )
    ids = [r.mission_id for r in available_ids]

    if not ids:
        return []

    return (
        db.query(Mission)
        .filter(Mission.id.in_(ids), Mission.is_active == True)
        .order_by(Mission.order_index)
        .all()
    )


@router.get(
    "/{mission_id}",
    response_model=MissionDetailResponse,
)
def get_mission(
    mission_id: int,
    db: Session = Depends(get_db),
):
    """Return mission details."""
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found",
        )
    return mission


@router.get(
    "/{mission_id}/status",
    response_model=MissionStatusResponse,
)
def get_mission_status(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the current user's progress status for a mission."""
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found",
        )

    progress = (
        db.query(MissionProgress)
        .filter(
            MissionProgress.user_id == current_user.id,
            MissionProgress.mission_id == mission_id,
        )
        .first()
    )

    if not progress:
        # No progress record → treat as LOCKED
        return MissionStatusResponse(
            mission_id=mission_id,
            status=STATUS_LOCKED,
            attempts=0,
            best_score=0,
            stars=0,
        )

    return MissionStatusResponse(
        mission_id=mission_id,
        status=progress.status,
        attempts=progress.attempts,
        best_score=progress.best_score,
        stars=progress.stars,
        started_at=progress.started_at,
        completed_at=progress.completed_at,
    )


@router.post(
    "/{mission_id}/start",
    response_model=MissionStartResponse,
)
def start_mission(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Start a mission for the current user.

    Phase 1: Only transitions AVAILABLE → IN_PROGRESS.
    Does NOT generate gameplay content, call Gemini, or calculate rewards.
    Phase 2 will build on top of this state.
    """
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found",
        )
    if not mission.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mission is not active",
        )

    progress = get_or_create_mission_progress(current_user.id, mission_id, db)

    if progress.status == STATUS_LOCKED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Mission is locked. Complete the previous mission to unlock.",
        )

    # Transition AVAILABLE → IN_PROGRESS on first start
    if progress.status == STATUS_AVAILABLE:
        progress.status = STATUS_IN_PROGRESS
        progress.started_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(progress)

    # Note: attempts are NOT incremented here.
    # An "attempt" = an answer submission (POST /gameplay/{session_id}/answer).

    return MissionStartResponse(
        mission_id=mission_id,
        status=progress.status,
        started_at=progress.started_at,
        message="Mission started. Use POST /api/v1/gameplay/start to begin gameplay.",
    )
