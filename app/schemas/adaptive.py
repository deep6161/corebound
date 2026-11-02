from pydantic import BaseModel, ConfigDict, Field


class AdaptivePerformanceResponse(BaseModel):
    total_attempts: int = Field(default=0, serialization_alias="totalAttempts")
    correct_attempts: int = Field(default=0, serialization_alias="correctAttempts")
    accuracy: float | None = None
    average_response_time: float | None = Field(default=None, serialization_alias="averageResponseTime")
    streak: int = 0

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class AdaptiveGenerationContext(BaseModel):
    goal: str | None = None
    target_role: str | None = Field(default=None, serialization_alias="targetRole")
    skill_level: str | None = Field(default=None, serialization_alias="skillLevel")
    subjects: list[str] = []
    daily_time: str | None = Field(default=None, serialization_alias="dailyTime")
    difficulty_preference: str | None = Field(default="Adaptive", serialization_alias="difficultyPreference")
    learning_preference: str | None = Field(default=None, serialization_alias="learningPreference")
    chapter: str
    sector: str
    mission: str
    objective: str | None = None
    topic: str
    gameplay_type: str = Field(serialization_alias="gameplayType")
    difficulty: str

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class AdaptiveMissionResponse(BaseModel):
    mission_id: int = Field(serialization_alias="missionId")
    chapter_id: int = Field(serialization_alias="chapterId")
    sector_id: int = Field(serialization_alias="sectorId")
    topic_id: int = Field(serialization_alias="topicId")
    gameplay_type: str = Field(serialization_alias="gameplayType")
    difficulty: str
    difficulty_source: str = Field(serialization_alias="difficultySource")
    performance: AdaptivePerformanceResponse
    generation_context: AdaptiveGenerationContext = Field(serialization_alias="generationContext")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
