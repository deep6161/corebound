from pydantic import BaseModel


class QuestionRequest(BaseModel):
    subject: str
    topic: str
    difficulty: str