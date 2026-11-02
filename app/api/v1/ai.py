from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.ai.question_service import QuestionService
from app.db.session import get_db
from app.schemas.request import QuestionRequest
from app.schemas.response import QuestionResponse


router = APIRouter(
    prefix="/api/v1/ai",
    tags=["AI"],
)


@router.post(
    "/question",
    response_model=QuestionResponse,
)
def generate_question(
    request: QuestionRequest,
    db: Session = Depends(get_db),
):
    return QuestionService.generate_question(
        request,
        db,
    )