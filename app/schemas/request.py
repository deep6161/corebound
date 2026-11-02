from pydantic import BaseModel, Field


class QuestionRequest(BaseModel):
    subject: str
    topic: str
    difficulty: str




class SubjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = None


class TopicCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = None