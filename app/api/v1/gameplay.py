from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.gameplay import (
    AnswerResultResponse,
    AnswerSubmitRequest,
    GameplaySessionResponse,
    GameplayStartRequest,
)
from app.services.answer_service import submit_answer
from app.services.gameplay_service import start_gameplay_session

router = APIRouter(
    prefix="/gameplay",
    tags=["Gameplay"],
)


@router.post(
    "/start",
    response_model=GameplaySessionResponse,
    status_code=status.HTTP_201_CREATED,
)
def start_gameplay(
    request: GameplayStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Start a gameplay session for an unlocked mission.

    Backend:
    - Verifies mission unlock status
    - Selects difficulty adaptively (mission baseline + user performance)
    - Generates content via Gemini (GM001/GM002/GM003/GM004)
    - Validates the generated content
    - Creates GameplaySession (ACTIVE)
    - Returns safe playable content (canonical answer NOT exposed)

    Frontend must NOT send gameplay type, difficulty, XP, or rewards.
    """
    return start_gameplay_session(
        user_id=current_user.id,
        mission_id=request.mission_id,
        db=db,
    )


@router.post(
    "/{session_id}/answer",
    response_model=AnswerResultResponse,
)
def submit_gameplay_answer(
    session_id: int,
    request: AnswerSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Submit an answer for an active gameplay session.

    Backend:
    - Verifies session ownership and ACTIVE status
    - Evaluates answer server-side (deterministic)
    - Records QuestionAttempt
    - Updates UserPerformance
    - On correct answer: grants reward, completes mission, unlocks next
    - On incorrect answer: session stays ACTIVE for retry
    - Returns evaluation result (explanation, score, XP, stars) — NO canonical answer

    Frontend must NOT send correct/score/XP/credits/stars/completion in the request.
    """
    return submit_answer(
        user_id=current_user.id,
        session_id=session_id,
        submitted_answer=request.answer,
        time_taken_ms=request.time_taken_ms,
        db=db,
    )
