from pydantic import BaseModel


class QuestionResponse(BaseModel):
    question: str
    options: list[str]
    answer: str
    explanation: str