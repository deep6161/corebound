from datetime import datetime
from pydantic import BaseModel, ConfigDict


class MissionProgressResponse(BaseModel):
    mission_id: int
    status: str
    attempts: int
    best_score: int
    stars: int
    started_at: datetime | None = None
    completed_at: datetime | None = None
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProgressSummaryResponse(BaseModel):
    total_missions: int
    available_missions: int
    in_progress_missions: int
    completed_missions: int
    locked_missions: int
    completion_percentage: float


class ProgressStatsResponse(BaseModel):
    total_missions: int
    completed_missions: int
    total_attempts: int
    total_stars_earned: int
    best_score_overall: int
    completion_percentage: float
