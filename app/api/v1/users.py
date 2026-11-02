from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.user_profile import UserProfile
from app.schemas.user import UserResponse
from app.schemas.user_profile import (
    UserProfileResponse,
    UserProfileUpdate,
    UserPreferencesResponse,
    UserPreferencesUpdate,
)
from app.services.profile_service import create_profile_for_user

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


def _build_preferences_response(profile: UserProfile) -> UserPreferencesResponse:
    return UserPreferencesResponse(
        goal=profile.goal,
        target_role=profile.target_role,
        targetRole=profile.target_role,
        skill_level=profile.skill_level,
        skillLevel=profile.skill_level,
        subjects=profile.subjects if profile.subjects is not None else [],
        daily_time=profile.daily_time,
        dailyTime=profile.daily_time,
        difficulty_preference=profile.difficulty_preference or "Adaptive",
        difficultyPreference=profile.difficulty_preference or "Adaptive",
        learning_preference=profile.learning_preference,
        learningPreference=profile.learning_preference,
        preferences_updated_at=profile.preferences_updated_at,
        updated_at=profile.preferences_updated_at,
    )


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    """Return the currently authenticated user's account info."""
    return current_user


@router.patch(
    "/me",
    response_model=UserResponse,
)
def update_me(
    data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the currently authenticated user's display name via profile."""
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if profile and data.display_name is not None:
        profile.display_name = data.display_name
        db.commit()
    return current_user


@router.get(
    "/me/profile",
    response_model=UserProfileResponse,
)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the currently authenticated user's profile (XP, level, stats, preferences)."""
    profile = (
        db.query(UserProfile)
        .filter(UserProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        profile = create_profile_for_user(current_user.id, db)
        db.commit()
        db.refresh(profile)
    return profile


@router.patch(
    "/me/profile",
    response_model=UserProfileResponse,
)
def update_my_profile(
    data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the currently authenticated user's profile (display name, bio, avatar)."""
    profile = (
        db.query(UserProfile)
        .filter(UserProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        profile = create_profile_for_user(current_user.id, db)

    if data.display_name is not None:
        profile.display_name = data.display_name
    if data.bio is not None:
        profile.bio = data.bio
    if data.avatar_url is not None:
        profile.avatar_url = data.avatar_url

    db.commit()
    db.refresh(profile)
    return profile


@router.get(
    "/me/preferences",
    response_model=UserPreferencesResponse,
)
def get_my_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the currently authenticated user's onboarding preferences."""
    profile = (
        db.query(UserProfile)
        .filter(UserProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        profile = create_profile_for_user(current_user.id, db)
        db.commit()
        db.refresh(profile)

    return _build_preferences_response(profile)


@router.patch(
    "/me/preferences",
    response_model=UserPreferencesResponse,
)
def update_my_preferences(
    data: UserPreferencesUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the currently authenticated user's onboarding preferences (partial update supported)."""
    profile = (
        db.query(UserProfile)
        .filter(UserProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        profile = create_profile_for_user(current_user.id, db)

    update_dict = data.model_dump(exclude_unset=True)

    if "goal" in update_dict:
        profile.goal = update_dict["goal"]
    if "target_role" in update_dict:
        profile.target_role = update_dict["target_role"]
    if "skill_level" in update_dict:
        profile.skill_level = update_dict["skill_level"]
    if "subjects" in update_dict:
        profile.subjects = update_dict["subjects"]
    if "daily_time" in update_dict:
        profile.daily_time = update_dict["daily_time"]
    if "difficulty_preference" in update_dict:
        profile.difficulty_preference = update_dict["difficulty_preference"]
    if "learning_preference" in update_dict:
        profile.learning_preference = update_dict["learning_preference"]

    profile.preferences_updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(profile)
    return _build_preferences_response(profile)
