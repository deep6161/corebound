from datetime import datetime
from pydantic import BaseModel, ConfigDict


class StoryResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MissionBriefResponse(BaseModel):
    id: int
    title: str
    objective: str | None = None
    order_index: int
    difficulty: str
    gameplay_type: str
    is_active: bool
    topic_id: int
    sector_id: int

    model_config = ConfigDict(from_attributes=True)


class SectorResponse(BaseModel):
    id: int
    chapter_id: int
    title: str
    description: str | None = None
    order_index: int
    created_at: datetime
    missions: list[MissionBriefResponse] = []

    model_config = ConfigDict(from_attributes=True)


class ChapterResponse(BaseModel):
    id: int
    story_id: int
    title: str
    description: str | None = None
    order_index: int
    created_at: datetime
    sectors: list[SectorResponse] = []

    model_config = ConfigDict(from_attributes=True)


class StoryDetailResponse(StoryResponse):
    chapters: list[ChapterResponse] = []
