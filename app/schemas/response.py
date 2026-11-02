from pydantic import BaseModel, Field, field_validator
from pydantic import BaseModel, ConfigDict


class QuestionResponse(BaseModel):
    question: str = Field(..., min_length=1)
    options: list[str] = Field(..., min_length=4, max_length=4)
    answer: str = Field(..., min_length=1)
    explanation: str = Field(..., min_length=1)

    @field_validator("options")
    @classmethod
    def validate_options(cls, value: list[str]) -> list[str]:
        if len(set(value)) != 4:
            raise ValueError("Options must be unique")

        if any(not option.strip() for option in value):
            raise ValueError("Options cannot be empty")

        return value

    @field_validator("answer")
    @classmethod
    def validate_answer(
        cls,
        value: str,
        info,
    ) -> str:
        options = info.data.get("options", [])

        if options and value not in options:
            raise ValueError("Answer must be one of the options")

        return value

class TopicResponse(BaseModel):
    id: int
    subject_id: int
    name: str
    description: str | None = None

    model_config = ConfigDict(from_attributes=True)


class SubjectResponse(BaseModel):
    id: int
    name: str
    description: str | None = None

    model_config = ConfigDict(from_attributes=True)


class SubjectWithTopicsResponse(SubjectResponse):
    topics: list[TopicResponse] = []