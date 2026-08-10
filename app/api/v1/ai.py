from fastapi import APIRouter

from app.ai.question_service import QuestionService
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
def generate_question(request: QuestionRequest):
    return QuestionService.generate_question(request)