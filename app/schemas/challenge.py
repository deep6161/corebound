from typing import Any, Union
from pydantic import BaseModel, ConfigDict, Field


class ChallengeGenerateRequest(BaseModel):
    """Request payload for generating an AI-powered challenge for a mission."""
    mission_id: int = Field(alias="missionId")

    model_config = ConfigDict(populate_by_name=True)


class GM001Option(BaseModel):
    id: str
    text: str


class GM002Object(BaseModel):
    id: str
    text: str


class GM002Slot(BaseModel):
    id: str
    label: str


class PlayableChallengeMetadata(BaseModel):
    chapter_id: int = Field(serialization_alias="chapterId")
    sector_id: int = Field(serialization_alias="sectorId")
    mission_id: int = Field(serialization_alias="missionId")
    topic_id: int = Field(serialization_alias="topicId")
    difficulty: str
    objective: str | None = None

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class PlayableGM001ChallengeResponse(BaseModel):
    """
    Sanitized playable GM001 challenge response sent to the frontend.
    STRICT SECURITY RULE: Never contains correctOptionId, answer, or solution.
    """
    id: str | None = None
    challenge_id: str = Field(serialization_alias="challengeId")
    gameplay_type: str = Field(default="GM001", serialization_alias="gameplayType")
    instruction: str = Field(default="Select exactly one calibration frequency.")
    question: str
    options: list[GM001Option]
    metadata: PlayableChallengeMetadata

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class PlayableGM002ChallengeResponse(BaseModel):
    """
    Sanitized playable GM002 challenge response sent to the frontend.
    STRICT SECURITY RULE: Never contains correctMapping, canonicalMapping, answerMap, or solutions.
    """
    id: str | None = None
    challenge_id: str = Field(serialization_alias="challengeId")
    gameplay_type: str = Field(default="GM002", serialization_alias="gameplayType")
    instruction: str
    objects: list[GM002Object]
    slots: list[GM002Slot]
    metadata: PlayableChallengeMetadata

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


PlayableChallengeResponse = Union[PlayableGM001ChallengeResponse, PlayableGM002ChallengeResponse]
