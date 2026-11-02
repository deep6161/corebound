from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.schemas.story import MissionBriefResponse


class MissionDetailResponse(BaseModel):
    id: int
    title: str
    objective: str | None = None
    order_index: int
    difficulty: str
    gameplay_type: str
    is_active: bool
    topic_id: int
    sector_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MissionStatusResponse(BaseModel):
    mission_id: int
    status: str  # LOCKED | AVAILABLE | IN_PROGRESS | COMPLETED
    attempts: int
    best_score: int
    stars: int
    started_at: datetime | None = None
    completed_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class MissionStartResponse(BaseModel):
    mission_id: int
    status: str
    started_at: datetime | None = None
    message: str
