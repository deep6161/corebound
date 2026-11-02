from datetime import datetime
from pydantic import BaseModel, ConfigDict


class TopicPerformanceResponse(BaseModel):
    topic_id: int
    topic_name: str
    gameplay_type: str
    total_attempts: int
    correct_attempts: int
    accuracy: float | None = None
    avg_response_ms: float | None = None
    best_streak: int

    model_config = ConfigDict(from_attributes=True)


class SubjectPerformanceResponse(BaseModel):
    subject_id: int
    subject_name: str
    total_attempts: int
    correct_attempts: int
    accuracy: float | None = None


class GameplayPerformanceResponse(BaseModel):
    gameplay_type: str
    total_attempts: int
    correct_attempts: int
    accuracy: float | None = None
    avg_response_ms: float | None = None


class PerformanceSummaryResponse(BaseModel):
    total_attempts: int
    correct_attempts: int
    overall_accuracy: float | None = None
    by_topic: list[TopicPerformanceResponse] = []
    by_subject: list[SubjectPerformanceResponse] = []
    by_gameplay: list[GameplayPerformanceResponse] = []
