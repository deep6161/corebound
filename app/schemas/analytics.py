from pydantic import BaseModel


class SubjectAnalyticsItem(BaseModel):
    subject_id: int
    subject_name: str
    total_attempts: int
    correct_attempts: int
    accuracy: float | None = None


class TopicAnalyticsItem(BaseModel):
    topic_id: int
    topic_name: str
    total_attempts: int
    correct_attempts: int
    accuracy: float | None = None


class AnalyticsResponse(BaseModel):
    # Mission stats
    total_missions: int
    completed_missions: int
    in_progress_missions: int
    available_missions: int

    # Attempt stats
    total_attempts: int
    correct_attempts: int
    overall_accuracy: float | None = None

    # Rewards
    xp: int
    credits: int
    stars: int
    level: int
    streak: int

    # Performance breakdown
    subject_performance: list[SubjectAnalyticsItem] = []
    topic_performance: list[TopicAnalyticsItem] = []
