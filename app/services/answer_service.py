"""
AnswerService

Handles POST /api/v1/gameplay/{session_id}/answer.

The entire operation is a single atomic business transaction:

evaluate answer
    → record QuestionAttempt
    → update UserPerformance
    → (if correct) grant reward
    → (if correct) complete mission
    → (if correct) unlock next mission

Session rules:
    ACTIVE   → accept answer, evaluate
    COMPLETED → reject (409 Conflict — duplicate submission)
    EXPIRED  → reject (410 Gone)
"""

import json
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.gameplay_session import GameplaySession, SESSION_ACTIVE, SESSION_COMPLETED
from app.models.mission_progress import (
    MissionProgress,
    STATUS_IN_PROGRESS,
    STATUS_COMPLETED as MISSION_COMPLETED,
)
from app.models.question_attempt import QuestionAttempt
from app.schemas.gameplay import AnswerResultResponse
from app.services.evaluation_service import evaluate
from app.services.performance_service import update_performance
from app.services.profile_service import unlock_next_missions
from app.services.reward_service import grant_reward, _calculate_stars, _calculate_score


def submit_answer(
    user_id: int,
    session_id: int,
    submitted_answer: str,
    time_taken_ms: int | None,
    db: Session,
) -> AnswerResultResponse:
    """
    Process one answer submission.

    Returns AnswerResultResponse — never exposes canonical answer.
    Raises HTTPException for ownership/session state violations.
    """
    # ── 1. Load and verify session ──────────────────────────────────
    session = db.query(GameplaySession).filter(GameplaySession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    if session.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    if session.status == SESSION_COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This session is already completed. No further answers accepted.",
        )
    if session.status != SESSION_ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="This session is no longer active.",
        )

    # ── 2. Load challenge and canonical content ──────────────────────
    challenge = session.challenge
    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Session challenge not found",
        )

    try:
        canonical_content = json.loads(challenge.content)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Session challenge content is corrupted",
        )

    # ── 3. Determine attempt number for this session ────────────────
    existing_attempt_count = (
        db.query(QuestionAttempt)
        .filter(QuestionAttempt.gameplay_session_id == session_id)
        .count()
    )
    attempt_number = existing_attempt_count + 1

    is_boss = isinstance(canonical_content, dict) and canonical_content.get("format") == "boss_3phase"
    current_phase = session.current_phase or 1

    # ── 4. Server-side evaluation ────────────────────────────────────
    result = evaluate(
        session.gameplay_type,
        submitted_answer,
        canonical_content,
        current_phase=current_phase if is_boss else None,
    )

    # ── 5. Record QuestionAttempt ────────────────────────────────────
    attempt = QuestionAttempt(
        user_id=user_id,
        mission_id=session.mission_id,
        challenge_id=challenge.id,
        gameplay_session_id=session_id,
        submitted_answer=submitted_answer,
        is_correct=result.is_correct,
        time_taken_ms=time_taken_ms,
        attempt_number=attempt_number,
    )
    db.add(attempt)

    # ── 6. Update MissionProgress.attempts (attempt = answer submission) ──
    progress = (
        db.query(MissionProgress)
        .filter(
            MissionProgress.user_id == user_id,
            MissionProgress.mission_id == session.mission_id,
        )
        .first()
    )
    if progress:
        progress.attempts += 1

    # ── 7. Update UserPerformance ─────────────────────────────────────
    topic_id = challenge.topic_id
    update_performance(
        user_id=user_id,
        topic_id=topic_id,
        gameplay_type=session.gameplay_type,
        difficulty=session.difficulty,
        is_correct=result.is_correct,
        time_taken_ms=time_taken_ms,
        db=db,
    )

    # ── 8. Stars and score ────────────────────────────────────────────
    stars = _calculate_stars(attempt_number, result.is_correct)
    score = _calculate_score(attempt_number, result.is_correct)

    xp_earned = 0
    credits_earned = 0
    mission_completed = False
    next_mission_unlocked = False

    # ── 8b. Boss Phase Progression Handling ──────────────────────────
    if is_boss:
        if result.is_correct:
            if current_phase < 3:
                # Advance to next phase — session remains ACTIVE, no final rewards yet
                session.current_phase = current_phase + 1
                session.is_correct = False
                db.commit()
                return AnswerResultResponse(
                    session_id=session_id,
                    is_correct=True,
                    explanation=result.explanation,
                    score=0,
                    xp_earned=0,
                    credits_earned=0,
                    stars_earned=0,
                    mission_completed=False,
                    next_mission_unlocked=False,
                    phase_completed=current_phase,
                    next_phase=current_phase + 1,
                    new_shield_pct=80 if current_phase == 1 else 30,
                )
            # If current_phase == 3, proceed to standard completion & reward grant below
        else:
            # Wrong boss strike — remains on current phase, shield unchanged
            session.is_correct = False
            db.commit()
            return AnswerResultResponse(
                session_id=session_id,
                is_correct=False,
                explanation=result.explanation,
                score=0,
                xp_earned=0,
                credits_earned=0,
                stars_earned=0,
                mission_completed=False,
                next_mission_unlocked=False,
                phase_completed=current_phase,
                next_phase=current_phase,
                new_shield_pct=100 if current_phase == 1 else (80 if current_phase == 2 else 30),
            )

    if result.is_correct:
        # ── 9. Update session to COMPLETED ──────────────────────────
        session.status = SESSION_COMPLETED
        session.is_correct = True
        session.score = score
        session.completed_at = datetime.now(timezone.utc)

        # ── 10. Grant reward (DB-level idempotency via UNIQUE constraint) ──
        try:
            reward_event = grant_reward(
                user_id=user_id,
                mission_id=session.mission_id,
                gameplay_session_id=session_id,
                difficulty=session.difficulty,
                attempt_number=attempt_number,
                is_correct=True,
                db=db,
            )
            if reward_event:
                xp_earned = reward_event.xp
                credits_earned = reward_event.credits
        except IntegrityError:
            # Reward already granted for this session — idempotent no-op
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Reward already granted for this session.",
            )

        # ── 11. Complete mission ──────────────────────────────────────
        if progress:
            best_stars = max(progress.stars, stars)
            best_score = max(progress.best_score, score)
            progress.status = MISSION_COMPLETED
            progress.stars = best_stars
            progress.best_score = best_score
            progress.completed_at = datetime.now(timezone.utc)
            mission_completed = True

        # ── 12. Unlock next mission ───────────────────────────────────
        unlock_next_missions(user_id, session.mission_id, db)
        # Check if unlock happened
        from app.models.mission import Mission
        from app.models.mission_progress import STATUS_AVAILABLE
        completed_mission = db.query(Mission).filter(Mission.id == session.mission_id).first()
        if completed_mission:
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
            if next_mission:
                next_progress = (
                    db.query(MissionProgress)
                    .filter(
                        MissionProgress.user_id == user_id,
                        MissionProgress.mission_id == next_mission.id,
                    )
                    .first()
                )
                next_mission_unlocked = next_progress is not None and next_progress.status == STATUS_AVAILABLE
    else:
        # Wrong answer — session stays ACTIVE for retry
        session.is_correct = False

    # ── 13. Commit entire transaction ────────────────────────────────
    db.commit()

    return AnswerResultResponse(
        session_id=session_id,
        is_correct=result.is_correct,
        explanation=result.explanation,
        score=score,
        xp_earned=xp_earned,
        credits_earned=credits_earned,
        stars_earned=stars,
        mission_completed=mission_completed,
        next_mission_unlocked=next_mission_unlocked,
        phase_completed=3 if is_boss else None,
        next_phase=None,
        new_shield_pct=0 if is_boss else None,
    )
