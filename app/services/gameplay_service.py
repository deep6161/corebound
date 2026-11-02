"""
GameplayService

Orchestrates POST /api/v1/gameplay/start.

Full flow:
1. Verify mission exists and is active
2. Verify mission is AVAILABLE or IN_PROGRESS for the user
3. Load topic + subject
4. Load user performance → adaptive difficulty selection
5. Load story context
6. Build correct Gemini prompt (per gameplay_type)
7. Call Gemini
8. Parse and validate JSON + gameplay-specific schema
9. Create Challenge (with canonical answer inside content)
10. Create GameplaySession (ACTIVE)
11. Return safe playable content (NO canonical answer)

Gemini is ONLY a content generator. It decides nothing about
correctness, rewards, completion, or difficulty.
"""

import json
import random
import uuid
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.ai.gemini_client import gemini_client
from app.ai.prompt_builder import PromptBuilder
from app.models.challenge import Challenge
from app.models.gameplay_session import GameplaySession, SESSION_ACTIVE, SESSION_COMPLETED
from app.models.mission import Mission, GAMEPLAY_GM001, GAMEPLAY_GM002, GAMEPLAY_GM003, GAMEPLAY_GM004
from app.models.mission_progress import (
    MissionProgress,
    STATUS_AVAILABLE,
    STATUS_IN_PROGRESS,
    STATUS_LOCKED,
    STATUS_COMPLETED,
)
from app.models.story import Sector, Chapter, Story
from app.models.subject import Subject
from app.models.topic import Topic
from app.models.user_performance import UserPerformance
from app.models.user_profile import UserProfile
from app.schemas.gameplay import (
    BossChallengeGeneratedContent,
    GM001GeneratedContent,
    GM002GeneratedContent,
    GM003GeneratedContent,
    GM004GeneratedContent,
    GameplaySessionResponse,
)
from app.services.adaptive_selector import select_difficulty
from app.services.performance_service import get_topic_accuracy


def _get_story_context(mission: Mission, db: Session) -> str:
    """Build a brief story context string from mission → sector → chapter → story."""
    try:
        sector = db.query(Sector).filter(Sector.id == mission.sector_id).first()
        if not sector:
            return ""
        chapter = db.query(Chapter).filter(Chapter.id == sector.chapter_id).first()
        if not chapter:
            return ""
        story = db.query(Story).filter(Story.id == chapter.story_id).first()
        parts = []
        if story:
            parts.append(story.title)
        if chapter:
            parts.append(chapter.title)
        if sector:
            parts.append(sector.title)
        if mission.objective:
            parts.append(f"Mission objective: {mission.objective}")
        return " | ".join(parts)
    except Exception:
        return ""


def _call_gemini(prompt: str) -> dict[str, Any]:
    """
    Call Gemini, parse JSON. Raises HTTPException 502 on any failure.
    """
    try:
        raw = gemini_client.generate(prompt)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI service unavailable. Please try again.",
        )

    if not raw or not raw.strip():
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI returned an empty response.",
        )

    # Strip markdown fences if present
    text = raw.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        text = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI returned malformed JSON.",
        )


def _load_user_context(user_id: int, topic_id: int, gameplay_type: str, db: Session) -> dict[str, Any]:
    """Extracts existing user profile and performance context from the database."""
    ctx = {
        "skill_level": None,
        "target_role": None,
        "goal": None,
        "learning_preference": None,
        "accuracy_pct": None,
        "total_attempts": 0,
    }
    try:
        profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if profile:
            ctx["skill_level"] = profile.skill_level
            ctx["target_role"] = profile.target_role
            ctx["goal"] = profile.goal
            ctx["learning_preference"] = profile.learning_preference
            if profile.subjects:
                ctx["subjects"] = profile.subjects
            if profile.daily_time:
                ctx["daily_time"] = profile.daily_time

        perf = (
            db.query(UserPerformance)
            .filter(
                UserPerformance.user_id == user_id,
                UserPerformance.topic_id == topic_id,
                UserPerformance.gameplay_type == gameplay_type,
            )
            .first()
        )
        if perf and perf.total_attempts > 0:
            ctx["total_attempts"] = perf.total_attempts
            if perf.accuracy is not None:
                ctx["accuracy_pct"] = f"{round(perf.accuracy * 100, 1)}%"
    except Exception:
        pass
    return ctx


def _get_recent_challenge_avoid_items(user_id: int, topic_id: int, db: Session, limit: int = 5) -> list[str]:
    """Queries previous challenges for this user/topic to avoid deterministic repetition."""
    avoid_items: list[str] = []
    try:
        recent_sessions = (
            db.query(GameplaySession)
            .join(Challenge, GameplaySession.challenge_id == Challenge.id)
            .filter(
                GameplaySession.user_id == user_id,
                Challenge.topic_id == topic_id,
            )
            .order_by(GameplaySession.id.desc())
            .limit(limit)
            .all()
        )
        for s in recent_sessions:
            if not s.challenge or not s.challenge.content:
                continue
            try:
                content = json.loads(s.challenge.content)
                if isinstance(content, dict):
                    # For GM002: collect object labels
                    if "objects" in content and isinstance(content["objects"], list):
                        for obj in content["objects"]:
                            lbl = obj.get("label") or obj.get("text")
                            if lbl and str(lbl).strip() and str(lbl).strip() not in avoid_items:
                                avoid_items.append(str(lbl).strip())
                    # For GM001 / GM004: question snippet
                    elif "question" in content and isinstance(content["question"], str):
                        q = content["question"][:50].strip()
                        if q and q not in avoid_items:
                            avoid_items.append(q)
                    # For GM003: item labels
                    elif "items" in content and isinstance(content["items"], list):
                        for itm in content["items"]:
                            lbl = itm.get("label") or itm.get("text")
                            if lbl and str(lbl).strip() and str(lbl).strip() not in avoid_items:
                                avoid_items.append(str(lbl).strip())
            except Exception:
                continue
    except Exception:
        pass
    return avoid_items[:12]


def _pick_variation_directive(topic_name: str, gameplay_type: str, difficulty: str) -> str:
    """Provides controlled sub-pattern variation aligned strictly with topic and curriculum."""
    topic_lower = topic_name.strip().lower()
    if gameplay_type == GAMEPLAY_GM002:
        if "simplification" in topic_lower:
            patterns = [
                "Fraction Reduction: Pair 4 non-trivial fractions (e.g. 24/36, 35/84, 28/70, 18/48, 42/56, 45/60) with their lowest-term reduced forms. Avoid common 12/18 or 15/25 fractions.",
                "Percentage & Decimal Equivalence: Pair 4 decimal/percentage values (e.g. 0.375, 75%, 0.4, 62.5%, 0.85) with their simplified fractional representations.",
                "Algebraic Like-Term Simplification: Pair 4 algebraic expressions (e.g. 5x + 8x - 3x, 12a^2 / 4a, 3y * 4y, 14m - 6m + 2m) with their simplified monomial results.",
                "Exponent and Power Rules: Pair 4 exponent expressions (e.g. 2^3 * 2^2, (3^2)^2, 10^5 / 10^2, 4^3 / 4, 2^5 / 2^2) with their evaluated/simplified integer results.",
                "Radical and Square Root Simplification: Pair 4 square root expressions (e.g. sqrt(48), sqrt(72), sqrt(50), sqrt(18), sqrt(98)) with their simplified radical forms (e.g. 4*sqrt(3), 6*sqrt(2)).",
            ]
            return random.choice(patterns)
        elif "number system" in topic_lower or "number" in topic_lower:
            patterns = [
                "Classify 4 numbers (e.g. rational, irrational, integer, prime) into their matching mathematical categorization.",
                "Pair 4 base-system or place-value representations with their evaluated standard values.",
            ]
            return random.choice(patterns)
        else:
            return f"System assembly for {topic_name}: Match 4 distinct components or expressions with their corresponding target states. Ensure all 4 pairs have distinct and non-overlapping relationships."
    elif gameplay_type == GAMEPLAY_GM001:
        return f"Multiple choice for {topic_name}: Vary numerical values, real-world context, and calculation steps to provide a distinct problem formulation."
    elif gameplay_type == GAMEPLAY_GM003:
        return f"Sequence ordering for {topic_name}: Provide 4 distinct logical or chronological stages in a clear sequential progression."
    elif gameplay_type == GAMEPLAY_GM004:
        return f"Numerical/formula input for {topic_name}: Formulate a direct problem requiring exact calculation."
    return ""


def _generate_and_validate_gm001(
    topic: Topic,
    subject: Subject,
    difficulty: str,
    story_context: str,
    user_context: dict | None = None,
    entropy_seed: str | None = None,
    avoid_items: list[str] | None = None,
    variation_directive: str | None = None,
) -> tuple[dict, str]:
    """Returns (canonical_content dict, explanation)."""
    prompt = PromptBuilder.build_gm001_prompt(
        topic_name=topic.name,
        subject_name=subject.name,
        difficulty=difficulty,
        story_context=story_context,
        user_context=user_context,
        entropy_seed=entropy_seed,
        avoid_items=avoid_items,
        variation_directive=variation_directive,
    )
    raw = _call_gemini(prompt)
    try:
        validated = GM001GeneratedContent(**raw)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI generated invalid GM001 content: {e}",
        )
    canonical = validated.model_dump()
    return canonical, validated.explanation


def _generate_and_validate_gm002(
    topic: Topic,
    subject: Subject,
    difficulty: str,
    story_context: str,
    user_context: dict | None = None,
    entropy_seed: str | None = None,
    avoid_items: list[str] | None = None,
    variation_directive: str | None = None,
) -> tuple[dict, str]:
    last_err = None
    for attempt in range(3):
        current_seed = f"{entropy_seed or 'gm002'}-retry{attempt}-{uuid.uuid4().hex[:4]}"
        prompt = PromptBuilder.build_gm002_prompt(
            topic_name=topic.name,
            subject_name=subject.name,
            difficulty=difficulty,
            story_context=story_context,
            user_context=user_context,
            entropy_seed=current_seed,
            avoid_items=avoid_items,
            variation_directive=variation_directive,
        )
        raw = _call_gemini(prompt)
        try:
            validated = GM002GeneratedContent(**raw)
            canonical = validated.model_dump()
            return canonical, validated.explanation
        except Exception as e:
            last_err = e
            continue

    raise HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail=f"AI generated invalid GM002 content after 3 attempts: {last_err}",
    )


def _generate_and_validate_gm003(
    topic: Topic,
    subject: Subject,
    difficulty: str,
    story_context: str,
    user_context: dict | None = None,
    entropy_seed: str | None = None,
    avoid_items: list[str] | None = None,
    variation_directive: str | None = None,
) -> tuple[dict, str]:
    prompt = PromptBuilder.build_gm003_prompt(
        topic_name=topic.name,
        subject_name=subject.name,
        difficulty=difficulty,
        story_context=story_context,
        user_context=user_context,
        entropy_seed=entropy_seed,
        avoid_items=avoid_items,
        variation_directive=variation_directive,
    )
    raw = _call_gemini(prompt)
    try:
        validated = GM003GeneratedContent(**raw)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI generated invalid GM003 content: {e}",
        )
    canonical = validated.model_dump()
    return canonical, validated.explanation


def _generate_and_validate_gm004(
    topic: Topic,
    subject: Subject,
    difficulty: str,
    story_context: str,
    user_context: dict | None = None,
    entropy_seed: str | None = None,
    avoid_items: list[str] | None = None,
    variation_directive: str | None = None,
) -> tuple[dict, str]:
    prompt = PromptBuilder.build_gm004_prompt(
        topic_name=topic.name,
        subject_name=subject.name,
        difficulty=difficulty,
        story_context=story_context,
        user_context=user_context,
        entropy_seed=entropy_seed,
        avoid_items=avoid_items,
        variation_directive=variation_directive,
    )
    raw = _call_gemini(prompt)
    try:
        validated = GM004GeneratedContent(**raw)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI generated invalid GM004 content: {e}",
        )
    canonical = validated.model_dump()
    return canonical, validated.explanation


def _generate_or_build_boss_challenge(
    user_context: dict | None = None,
    difficulty: str = "HARD",
) -> tuple[dict, str]:
    """
    Builds the authoritative 3-phase Guardian Atlas Climax Boss Challenge.
    Validates with BossChallengeGeneratedContent before returning.
    """
    boss_data = {
        "format": "boss_3phase",
        "boss_name": "Guardian Atlas",
        "phases": [
            {
                "phase": 1,
                "hero": "BLAZE",
                "equation": "[(18 × 4) - 22] ÷ 2",
                "accepted_answers": ["25", "25 GW", "25GW"],
                "presets": [15, 20, 25, 30],
                "shield_pct": 80,
            },
            {
                "phase": 2,
                "hero": "BYTE",
                "equation": "{[(25 × 3) + 45] ÷ 3} + 30",
                "accepted_answers": ["70", "70 GW", "70GW"],
                "presets": [50, 60, 70, 85],
                "shield_pct": 30,
            },
            {
                "phase": 3,
                "hero": "NOVA",
                "equation": "{[(70 × 2) - 40] ÷ 5} × 4 + 24",
                "accepted_answers": ["104", "104 GW", "104GW"],
                "presets": [84, 96, 104, 120],
                "shield_pct": 0,
            },
        ],
        "explanation": "Grand Overdrive neutralized the Null Shield and liberated Guardian Atlas.",
    }
    validated = BossChallengeGeneratedContent(**boss_data)
    return validated.model_dump(), validated.explanation


def _build_playable(
    gameplay_type: str,
    difficulty: str,
    canonical: dict,
    current_phase: int = 1,
) -> dict:
    """Strip canonical answer fields before returning to frontend."""
    if canonical.get("format") == "boss_3phase":
        phases_playable = []
        for p in canonical.get("phases", []):
            phases_playable.append({
                "phase": p["phase"],
                "hero": p["hero"],
                "equation": p["equation"],
                "presets": p["presets"],
                "shield_pct": p["shield_pct"],
                # "accepted_answers" strictly stripped!
            })
        boss_payload = {
            "format": "boss_3phase",
            "boss_name": canonical.get("boss_name", "Guardian Atlas"),
            "current_phase": current_phase or 1,
            "phases_playable": phases_playable,
        }
        return {
            "gameplay_type": gameplay_type,
            "difficulty": difficulty,
            "format": "boss_3phase",
            "boss_name": canonical.get("boss_name", "Guardian Atlas"),
            "current_phase": current_phase or 1,
            "phases_playable": phases_playable,
            "content": boss_payload,
        }

    if gameplay_type == GAMEPLAY_GM001:
        return {
            "gameplay_type": gameplay_type,
            "difficulty": difficulty,
            "content": {
                "question": canonical["question"],
                "options": canonical["options"],
                # "answer" intentionally absent
            },
        }
    elif gameplay_type == GAMEPLAY_GM002:
        return {
            "gameplay_type": gameplay_type,
            "difficulty": difficulty,
            "content": {
                "objects": canonical["objects"],
                "slots": canonical["slots"],
                "instructions": canonical["instructions"],
                # "canonical_mapping" intentionally absent
            },
        }
    elif gameplay_type == GAMEPLAY_GM003:
        # Shuffle items so canonical order is not implied by position
        items = list(canonical["items"])
        random.shuffle(items)
        return {
            "gameplay_type": gameplay_type,
            "difficulty": difficulty,
            "content": {
                "items": items,
                "instructions": canonical["instructions"],
                # "canonical_order" intentionally absent
            },
        }
    elif gameplay_type == GAMEPLAY_GM004:
        return {
            "gameplay_type": gameplay_type,
            "difficulty": difficulty,
            "content": {
                "question": canonical["question"],
                "answer_type": canonical["answer_type"],
                # "accepted_answers" intentionally absent
            },
        }
    else:
        raise HTTPException(status_code=400, detail=f"Unknown gameplay type: {gameplay_type}")


def start_gameplay_session(
    user_id: int,
    mission_id: int,
    db: Session,
) -> GameplaySessionResponse:
    """
    Full orchestration of POST /gameplay/start.
    Returns a GameplaySessionResponse with safe playable content.
    """
    # 1. Load and verify mission
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mission not found")
    if not mission.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mission is not active")

    # 2. Verify mission unlock status
    progress = (
        db.query(MissionProgress)
        .filter(
            MissionProgress.user_id == user_id,
            MissionProgress.mission_id == mission_id,
        )
        .first()
    )
    if not progress or progress.status == STATUS_LOCKED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Mission is locked. Complete the previous mission to unlock.",
        )

    # Transition to IN_PROGRESS if still AVAILABLE
    if progress.status == STATUS_AVAILABLE:
        from datetime import datetime, timezone
        progress.status = STATUS_IN_PROGRESS
        progress.started_at = datetime.now(timezone.utc)
        db.flush()

    # 2a. Check for existing ACTIVE session (idempotency / resume)
    active_session = (
        db.query(GameplaySession)
        .filter(
            GameplaySession.user_id == user_id,
            GameplaySession.mission_id == mission_id,
            GameplaySession.status == SESSION_ACTIVE,
        )
        .order_by(GameplaySession.started_at.desc(), GameplaySession.id.desc())
        .first()
    )
    if active_session and active_session.challenge:
        canonical = json.loads(active_session.challenge.content)
        curr_phase = active_session.current_phase or 1
        playable = _build_playable(active_session.gameplay_type, active_session.difficulty, canonical, current_phase=curr_phase)
        started_at_iso = active_session.started_at.isoformat() if active_session.started_at else None
        return GameplaySessionResponse(
            session_id=active_session.id,
            mission_id=mission_id,
            gameplay_type=active_session.gameplay_type,
            difficulty=active_session.difficulty,
            started_at=started_at_iso,
            is_completed=False,
            playable=playable,
        )

    # 2b. Check if mission is already COMPLETED (safe review mode, no new generation)
    if progress.status == STATUS_COMPLETED:
        completed_session = (
            db.query(GameplaySession)
            .filter(
                GameplaySession.user_id == user_id,
                GameplaySession.mission_id == mission_id,
                GameplaySession.status == SESSION_COMPLETED,
            )
            .order_by(GameplaySession.completed_at.desc(), GameplaySession.id.desc())
            .first()
        )
        if completed_session and completed_session.challenge:
            canonical = json.loads(completed_session.challenge.content)
            curr_phase = completed_session.current_phase or 3
            playable = _build_playable(completed_session.gameplay_type, completed_session.difficulty, canonical, current_phase=curr_phase)
            started_at_iso = completed_session.started_at.isoformat() if completed_session.started_at else None
            return GameplaySessionResponse(
                session_id=completed_session.id,
                mission_id=mission_id,
                gameplay_type=completed_session.gameplay_type,
                difficulty=completed_session.difficulty,
                started_at=started_at_iso,
                is_completed=True,
                playable=playable,
            )

    # 3. Load topic and subject
    topic = db.query(Topic).filter(Topic.id == mission.topic_id).first()
    if not topic:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Topic not found")
    subject = db.query(Subject).filter(Subject.id == topic.subject_id).first()
    if not subject:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Subject not found")

    # 4. Adaptive difficulty selection
    topic_accuracy = get_topic_accuracy(user_id, topic.id, mission.gameplay_type, db)
    selected_difficulty = select_difficulty(mission.difficulty, topic_accuracy)

    # 5. Story context
    story_context = _get_story_context(mission, db)

    # 6-8. Generate and validate content via Gemini with user context & entropy
    gameplay_type = mission.gameplay_type  # Authoritative from mission
    user_context = _load_user_context(user_id, topic.id, gameplay_type, db)
    entropy_seed = uuid.uuid4().hex[:8]
    avoid_items = _get_recent_challenge_avoid_items(user_id, topic.id, db)
    variation_directive = _pick_variation_directive(topic.name, gameplay_type, selected_difficulty)

    if mission_id == 10 or mission.order_index == 10:
        canonical, explanation = _generate_or_build_boss_challenge(
            user_context=user_context,
            difficulty=selected_difficulty,
        )
    elif gameplay_type == GAMEPLAY_GM001:
        canonical, explanation = _generate_and_validate_gm001(
            topic, subject, selected_difficulty, story_context,
            user_context=user_context, entropy_seed=entropy_seed,
            avoid_items=avoid_items, variation_directive=variation_directive,
        )
    elif gameplay_type == GAMEPLAY_GM002:
        canonical, explanation = _generate_and_validate_gm002(
            topic, subject, selected_difficulty, story_context,
            user_context=user_context, entropy_seed=entropy_seed,
            avoid_items=avoid_items, variation_directive=variation_directive,
        )
    elif gameplay_type == GAMEPLAY_GM003:
        canonical, explanation = _generate_and_validate_gm003(
            topic, subject, selected_difficulty, story_context,
            user_context=user_context, entropy_seed=entropy_seed,
            avoid_items=avoid_items, variation_directive=variation_directive,
        )
    elif gameplay_type == GAMEPLAY_GM004:
        canonical, explanation = _generate_and_validate_gm004(
            topic, subject, selected_difficulty, story_context,
            user_context=user_context, entropy_seed=entropy_seed,
            avoid_items=avoid_items, variation_directive=variation_directive,
        )
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported gameplay type: {gameplay_type}")

    # 9. Create Challenge with canonical content (includes answer)
    challenge = Challenge(
        topic_id=topic.id,
        gameplay_type=gameplay_type,
        difficulty=selected_difficulty,
        content=json.dumps(canonical),
        explanation=explanation,
        ai_generated=True,
        validated=True,
    )
    db.add(challenge)
    db.flush()  # Get challenge.id

    # 10. Create GameplaySession (ACTIVE)
    is_boss = canonical.get("format") == "boss_3phase"
    session = GameplaySession(
        user_id=user_id,
        mission_id=mission_id,
        challenge_id=challenge.id,
        gameplay_type=gameplay_type,
        difficulty=selected_difficulty,
        status=SESSION_ACTIVE,
        current_phase=1 if is_boss else None,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # 11. Build safe playable response
    playable = _build_playable(
        gameplay_type,
        selected_difficulty,
        canonical,
        current_phase=session.current_phase or 1,
    )

    return GameplaySessionResponse(
        session_id=session.id,
        mission_id=mission_id,
        gameplay_type=gameplay_type,
        difficulty=selected_difficulty,
        started_at=session.started_at.isoformat() if session.started_at else None,
        is_completed=False,
        playable=playable,
    )
