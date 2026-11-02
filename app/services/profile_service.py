"""
Profile service: auto-creates a UserProfile when a User registers.
Also provides the deterministic mission unlock helper used by the
missions router.

Phase 2 will extend unlock_next_missions with full progression logic.
"""
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.mission import Mission
from app.models.mission_progress import (
    MissionProgress,
    STATUS_AVAILABLE,
    STATUS_COMPLETED,
    STATUS_LOCKED,
    STATUS_IN_PROGRESS,
)
from app.models.user_profile import UserProfile


def create_profile_for_user(user_id: int, db: Session) -> UserProfile:
    """
    Create a UserProfile for a newly registered user.
    Called from the auth registration endpoint.
    """
    existing = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if existing:
        return existing

    profile = UserProfile(user_id=user_id)
    db.add(profile)
    db.flush()  # Flush so profile.id is available; caller commits.
    return profile


def get_or_create_mission_progress(
    user_id: int,
    mission_id: int,
    db: Session,
) -> MissionProgress:
    """
    Return existing MissionProgress or create a LOCKED one.
    Does not commit — caller is responsible.
    """
    progress = (
        db.query(MissionProgress)
        .filter(
            MissionProgress.user_id == user_id,
            MissionProgress.mission_id == mission_id,
        )
        .first()
    )
    if progress:
        return progress

    progress = MissionProgress(
        user_id=user_id,
        mission_id=mission_id,
        status=STATUS_LOCKED,
    )
    db.add(progress)
    db.flush()
    return progress


def initialize_mission_progress_for_user(user_id: int, db: Session) -> None:
    """
    Seed initial MissionProgress rows for a new user.

    Rule:
    - The very first mission (lowest order_index in the first sector of
      the first chapter of the first story) → AVAILABLE.
    - All others → LOCKED.
    """
    from app.models.story import Sector, Chapter, Story

    # Get all missions ordered canonically via explicit ORM joins
    missions = (
        db.query(Mission)
        .join(Sector, Mission.sector_id == Sector.id)
        .join(Chapter, Sector.chapter_id == Chapter.id)
        .join(Story, Chapter.story_id == Story.id)
        .order_by(
            Story.id,
            Chapter.order_index,
            Sector.order_index,
            Mission.order_index,
        )
        .filter(Mission.is_active == True)
        .all()
    )

    if not missions:
        return

    first_mission_id = missions[0].id
    for mission in missions:
        existing = (
            db.query(MissionProgress)
            .filter(
                MissionProgress.user_id == user_id,
                MissionProgress.mission_id == mission.id,
            )
            .first()
        )
        if existing:
            continue
        status = STATUS_AVAILABLE if mission.id == first_mission_id else STATUS_LOCKED
        db.add(MissionProgress(user_id=user_id, mission_id=mission.id, status=status))

    db.flush()


def unlock_next_missions(user_id: int, completed_mission_id: int, db: Session) -> None:
    """
    After a mission is completed, unlock the next mission in the same sector.

    Phase 2 will call this from the reward/completion engine.
    Phase 1 exposes this as a reusable helper.
    """
    completed_mission = db.query(Mission).filter(Mission.id == completed_mission_id).first()
    if not completed_mission:
        return

    # Find the next mission in the same sector by order_index
    next_mission = (
        db.query(Mission)
        .filter(
            Mission.sector_id == completed_mission.sector_id,
            Mission.order_index > completed_mission.order_index,
            Mission.is_active == True,
        )
        .order_by(Mission.order_index)
        .first()
    )

    if not next_mission:
        return

    progress = get_or_create_mission_progress(user_id, next_mission.id, db)
    if progress.status == STATUS_LOCKED:
        progress.status = STATUS_AVAILABLE
    db.flush()
