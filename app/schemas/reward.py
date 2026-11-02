from datetime import datetime
from pydantic import BaseModel, ConfigDict


class RewardHistoryItemResponse(BaseModel):
    id: int
    mission_id: int | None = None
    xp: int
    credits: int
    stars: int
    reason: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RewardSummaryResponse(BaseModel):
    total_xp: int
    total_credits: int
    total_stars: int
    total_events: int


class RewardMeResponse(BaseModel):
    xp: int
    credits: int
    stars: int
    level: int
    streak: int
