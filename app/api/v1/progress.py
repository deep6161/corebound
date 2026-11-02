from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.mission_progress import MissionProgress, STATUS_COMPLETED
from app.models.user import User
from app.schemas.progress import (
    MissionProgressResponse,
    ProgressStatsResponse,
    ProgressSummaryResponse,
)

router = APIRouter(
    prefix="/progress",
    tags=["Progress"],
)


@router.get(
    "/me",
    response_model=list[MissionProgressResponse],
)
def get_my_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all mission progress records for the current user."""
    records = (
        db.query(MissionProgress)
        .filter(MissionProgress.user_id == current_user.id)
        .all()
    )
    return records


@router.get(
    "/missions",
    response_model=list[MissionProgressResponse],
)
def get_missions_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all mission progress records for the current user (alias of /me)."""
    return (
        db.query(MissionProgress)
        .filter(MissionProgress.user_id == current_user.id)
        .all()
    )


@router.get(
    "/missions/{mission_id}",
    response_model=MissionProgressResponse,
)
def get_mission_progress(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the current user's progress for a specific mission."""
    progress = (
        db.query(MissionProgress)
        .filter(
            MissionProgress.user_id == current_user.id,
            MissionProgress.mission_id == mission_id,
        )
        .first()
    )
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No progress record found for this mission",
        )
    return progress


@router.get(
    "/summary",
    response_model=ProgressSummaryResponse,
)
def get_progress_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return a summary count of mission statuses for the current user."""
    all_progress = (
        db.query(MissionProgress)
        .filter(MissionProgress.user_id == current_user.id)
        .all()
    )

    counts = {"LOCKED": 0, "AVAILABLE": 0, "IN_PROGRESS": 0, "COMPLETED": 0}
    for p in all_progress:
        counts[p.status] = counts.get(p.status, 0) + 1

    total = len(all_progress)
    completed = counts["COMPLETED"]
    completion_pct = round((completed / total * 100) if total > 0 else 0.0, 2)

    return ProgressSummaryResponse(
        total_missions=total,
        available_missions=counts["AVAILABLE"],
        in_progress_missions=counts["IN_PROGRESS"],
        completed_missions=completed,
        locked_missions=counts["LOCKED"],
        completion_percentage=completion_pct,
    )


@router.get(
    "/stats",
    response_model=ProgressStatsResponse,
)
def get_progress_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return detailed stats for the current user's mission progress."""
    all_progress = (
        db.query(MissionProgress)
        .filter(MissionProgress.user_id == current_user.id)
        .all()
    )

    total = len(all_progress)
    completed = sum(1 for p in all_progress if p.status == STATUS_COMPLETED)
    total_attempts = sum(p.attempts for p in all_progress)
    total_stars = sum(p.stars for p in all_progress)
    best_score = max((p.best_score for p in all_progress), default=0)
    completion_pct = round((completed / total * 100) if total > 0 else 0.0, 2)

    return ProgressStatsResponse(
        total_missions=total,
        completed_missions=completed,
        total_attempts=total_attempts,
        total_stars_earned=total_stars,
        best_score_overall=best_score,
        completion_percentage=completion_pct,
    )
