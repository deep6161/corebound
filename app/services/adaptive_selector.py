"""
AdaptiveGameplaySelector (Phase V16)

Determines deterministic difficulty and challenge-generation parameters for a mission
based on user preferences, mission metadata, and historical topic performance.

Strict Boundaries:
- NEVER generates questions.
- NEVER calls Gemini.
- NEVER mutates database records (no progress/reward/performance change).
- Gameplay type ALWAYS comes directly from Mission.gameplay_type.
"""

from typing import Any
from sqlalchemy.orm import Session

from app.models.mission import (
    Mission,
    DIFFICULTY_EASY,
    DIFFICULTY_HARD,
    DIFFICULTY_MEDIUM,
)
from app.models.story import Sector, Chapter
from app.models.topic import Topic
from app.models.user_performance import UserPerformance
from app.models.user_profile import UserProfile

# Difficulty sources
SOURCE_MISSION_BASELINE = "MISSION_BASELINE"
SOURCE_PERFORMANCE_ADAPTIVE = "PERFORMANCE_ADAPTIVE"
SOURCE_USER_PREFERENCE = "USER_PREFERENCE"

# Difficulty ordering for stepping (Phase 2 legacy)
_DIFFICULTY_ORDER = [DIFFICULTY_EASY, DIFFICULTY_MEDIUM, DIFFICULTY_HARD]


def _step_easier(difficulty: str) -> str:
    idx = _DIFFICULTY_ORDER.index(difficulty) if difficulty in _DIFFICULTY_ORDER else 1
    return _DIFFICULTY_ORDER[max(0, idx - 1)]


def _step_harder(difficulty: str) -> str:
    idx = _DIFFICULTY_ORDER.index(difficulty) if difficulty in _DIFFICULTY_ORDER else 1
    return _DIFFICULTY_ORDER[min(len(_DIFFICULTY_ORDER) - 1, idx + 1)]


def select_difficulty(
    mission_difficulty: str,
    topic_accuracy: float | None,
) -> str:
    """
    Legacy helper for Phase 2 gameplay service & test_adaptive.py.
    """
    if topic_accuracy is None:
        return mission_difficulty

    if topic_accuracy < 0.40:
        return _step_easier(mission_difficulty)
    elif topic_accuracy > 0.70:
        return _step_harder(mission_difficulty)
    else:
        return mission_difficulty


def determine_adaptive_difficulty(
    mission_difficulty: str,
    topic_accuracy: float | None,
    difficulty_preference: str | None = "Adaptive",
) -> tuple[str, str]:
    """
    Phase V16 Deterministic Difficulty Rule Engine.

    Rules:
    1. Explicit User Difficulty Preferences:
       - Easy -> EASY (SOURCE: USER_PREFERENCE)
       - Medium -> MEDIUM (SOURCE: USER_PREFERENCE)
       - Hard -> HARD (SOURCE: USER_PREFERENCE)

    2. Adaptive Mode (difficulty_preference == "Adaptive"):
       - No relevant performance history -> Mission baseline difficulty (SOURCE: MISSION_BASELINE)
       - accuracy < 40% -> EASY (SOURCE: PERFORMANCE_ADAPTIVE)
       - 40% <= accuracy <= 70% -> Mission baseline difficulty (SOURCE: MISSION_BASELINE)
       - accuracy > 70% -> HARD (SOURCE: PERFORMANCE_ADAPTIVE)

    Returns:
        tuple[selected_difficulty: str, difficulty_source: str]
    """
    pref = (difficulty_preference or "Adaptive").strip()
    baseline = (mission_difficulty or DIFFICULTY_MEDIUM).upper()

    # Explicit user preferences override performance
    if pref.upper() == "EASY":
        return DIFFICULTY_EASY, SOURCE_USER_PREFERENCE
    elif pref.upper() == "MEDIUM":
        return DIFFICULTY_MEDIUM, SOURCE_USER_PREFERENCE
    elif pref.upper() == "HARD":
        return DIFFICULTY_HARD, SOURCE_USER_PREFERENCE

    # Adaptive mode
    if pref.lower() == "adaptive":
        if topic_accuracy is None:
            return baseline, SOURCE_MISSION_BASELINE

        if topic_accuracy < 0.40:
            return DIFFICULTY_EASY, SOURCE_PERFORMANCE_ADAPTIVE
        elif topic_accuracy > 0.70:
            return DIFFICULTY_HARD, SOURCE_PERFORMANCE_ADAPTIVE
        else:
            return baseline, SOURCE_MISSION_BASELINE

    # Default fallback
    return baseline, SOURCE_MISSION_BASELINE


def select_adaptive_mission_context(
    mission: Mission,
    profile: UserProfile | None,
    performance: UserPerformance | None,
    db: Session,
) -> dict[str, Any]:
    """
    Gathers and normalizes the full challenge generation context for a mission.
    Deterministic, read-only, non-mutating.
    """
    # 1. Resolve Sector and Chapter metadata
    sector = db.query(Sector).filter(Sector.id == mission.sector_id).first()
    chapter = db.query(Chapter).filter(Chapter.id == sector.chapter_id).first() if sector else None
    topic = db.query(Topic).filter(Topic.id == mission.topic_id).first()

    chapter_title = chapter.title if chapter else "PATTERN OBSERVATORY"
    chapter_id = chapter.id if chapter else 1
    sector_title = sector.title if sector else "PATTERN OBSERVATORY"
    sector_id = sector.id if sector else 1
    topic_title = topic.name if topic else "General"

    # 2. Extract and sanitize performance metrics for this specific topic
    if performance and performance.total_attempts > 0:
        total_attempts = performance.total_attempts
        correct_attempts = performance.correct_attempts
        accuracy = performance.accuracy if performance.accuracy is not None else (
            correct_attempts / total_attempts if total_attempts > 0 else None
        )
        avg_response = performance.avg_response_ms
        streak = performance.best_streak
    else:
        total_attempts = 0
        correct_attempts = 0
        accuracy = None
        avg_response = None
        streak = 0

    # 3. Extract user preferences
    goal = profile.goal if profile else None
    target_role = profile.target_role if profile else None
    skill_level = profile.skill_level if profile else None
    subjects = profile.subjects if (profile and profile.subjects is not None) else []
    daily_time = profile.daily_time if profile else None
    difficulty_preference = profile.difficulty_preference if profile else "Adaptive"
    learning_preference = profile.learning_preference if profile else None

    # 4. Calculate adaptive difficulty
    selected_difficulty, difficulty_source = determine_adaptive_difficulty(
        mission_difficulty=mission.difficulty,
        topic_accuracy=accuracy,
        difficulty_preference=difficulty_preference,
    )

    # 5. Build normalized response dictionary
    # Gameplay type is ALWAYS strictly from mission.gameplay_type
    gameplay_type = mission.gameplay_type

    return {
        "mission_id": mission.id,
        "chapter_id": chapter_id,
        "sector_id": sector_id,
        "topic_id": mission.topic_id,
        "gameplay_type": gameplay_type,
        "difficulty": selected_difficulty,
        "difficulty_source": difficulty_source,
        "performance": {
            "total_attempts": total_attempts,
            "correct_attempts": correct_attempts,
            "accuracy": round(accuracy, 4) if accuracy is not None else None,
            "average_response_time": avg_response,
            "streak": streak,
        },
        "generation_context": {
            "goal": goal,
            "target_role": target_role,
            "skill_level": skill_level,
            "subjects": subjects,
            "daily_time": daily_time,
            "difficulty_preference": difficulty_preference,
            "learning_preference": learning_preference,
            "chapter": chapter_title,
            "sector": sector_title,
            "mission": mission.title,
            "objective": mission.objective,
            "topic": topic_title,
            "gameplay_type": gameplay_type,
            "difficulty": selected_difficulty,
        },
    }
