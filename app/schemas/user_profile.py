from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator, AliasChoices

# Exact V5 Frontend Preference Option Sets
VALID_GOALS = {
    "Placement Preparation",
    "Interview Preparation",
    "Skill Improvement",
    "Competitive Programming",
    "Academic Preparation",
    "Other",
}

VALID_TARGET_ROLES = {
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Software Developer",
    "Data Analyst",
    "Data Scientist",
    "QA / Testing",
    "DevOps / Cloud",
    "Other",
}

VALID_SKILL_LEVELS = {
    "Beginner",
    "Intermediate",
    "Advanced",
}

VALID_SUBJECTS = {
    "Data Structures & Algorithms",
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "SQL",
    "HTML / CSS",
    "Backend Development",
    "Frontend Development",
    "Databases",
    "Aptitude",
    "Problem Solving",
}

VALID_DAILY_TIMES = {
    "15 minutes",
    "30 minutes",
    "1 hour",
    "2 hours",
    "3+ hours",
}

VALID_DIFFICULTIES = {
    "Adaptive",
    "Easy",
    "Medium",
    "Hard",
}

VALID_LEARNING_PREFERENCES = {
    "Story-driven",
    "Practice-heavy",
    "Balanced",
    "Challenge-heavy",
}


class UserPreferencesUpdate(BaseModel):
    goal: str | None = Field(None)
    target_role: str | None = Field(None, validation_alias=AliasChoices("target_role", "targetRole"))
    skill_level: str | None = Field(None, validation_alias=AliasChoices("skill_level", "skillLevel"))
    subjects: list[str] | None = Field(None)
    daily_time: str | None = Field(None, validation_alias=AliasChoices("daily_time", "dailyTime"))
    difficulty_preference: str | None = Field(None, validation_alias=AliasChoices("difficulty_preference", "difficultyPreference"))
    learning_preference: str | None = Field(None, validation_alias=AliasChoices("learning_preference", "learningPreference"))

    model_config = ConfigDict(populate_by_name=True)

    @field_validator("goal")
    @classmethod
    def validate_goal(cls, v: str | None) -> str | None:
        if v is not None:
            if not isinstance(v, str) or not v.strip():
                raise ValueError("goal must be a non-empty string.")
            if v not in VALID_GOALS:
                raise ValueError(f"Invalid goal '{v}'. Must be one of: {sorted(VALID_GOALS)}")
        return v

    @field_validator("target_role")
    @classmethod
    def validate_target_role(cls, v: str | None) -> str | None:
        if v is not None:
            if not isinstance(v, str) or not v.strip():
                raise ValueError("target_role must be a non-empty string.")
            if v not in VALID_TARGET_ROLES:
                raise ValueError(f"Invalid target_role '{v}'. Must be one of: {sorted(VALID_TARGET_ROLES)}")
        return v

    @field_validator("skill_level")
    @classmethod
    def validate_skill_level(cls, v: str | None) -> str | None:
        if v is not None:
            if not isinstance(v, str) or not v.strip():
                raise ValueError("skill_level must be a non-empty string.")
            if v not in VALID_SKILL_LEVELS:
                raise ValueError(f"Invalid skill_level '{v}'. Must be one of: {sorted(VALID_SKILL_LEVELS)}")
        return v

    @field_validator("subjects")
    @classmethod
    def validate_subjects(cls, v: list[str] | None) -> list[str] | None:
        if v is not None:
            if not isinstance(v, list) or len(v) == 0:
                raise ValueError("subjects must be a non-empty list of valid subjects.")
            for s in v:
                if not isinstance(s, str) or not s.strip():
                    raise ValueError("Each subject must be a non-empty string.")
                if s not in VALID_SUBJECTS:
                    raise ValueError(f"Invalid subject '{s}'. Allowed subjects: {sorted(VALID_SUBJECTS)}")
        return v

    @field_validator("daily_time")
    @classmethod
    def validate_daily_time(cls, v: str | None) -> str | None:
        if v is not None:
            if not isinstance(v, str) or not v.strip():
                raise ValueError("daily_time must be a non-empty string.")
            if v not in VALID_DAILY_TIMES:
                raise ValueError(f"Invalid daily_time '{v}'. Must be one of: {sorted(VALID_DAILY_TIMES)}")
        return v

    @field_validator("difficulty_preference")
    @classmethod
    def validate_difficulty_preference(cls, v: str | None) -> str | None:
        if v is not None:
            if not isinstance(v, str) or not v.strip():
                raise ValueError("difficulty_preference must be a non-empty string.")
            if v not in VALID_DIFFICULTIES:
                raise ValueError(f"Invalid difficulty_preference '{v}'. Must be one of: {sorted(VALID_DIFFICULTIES)}")
        return v

    @field_validator("learning_preference")
    @classmethod
    def validate_learning_preference(cls, v: str | None) -> str | None:
        if v is not None:
            if not isinstance(v, str) or not v.strip():
                raise ValueError("learning_preference must be a non-empty string.")
            if v not in VALID_LEARNING_PREFERENCES:
                raise ValueError(f"Invalid learning_preference '{v}'. Must be one of: {sorted(VALID_LEARNING_PREFERENCES)}")
        return v


class UserPreferencesResponse(BaseModel):
    goal: str | None = None
    target_role: str | None = None
    targetRole: str | None = None
    skill_level: str | None = None
    skillLevel: str | None = None
    subjects: list[str] = Field(default_factory=list)
    daily_time: str | None = None
    dailyTime: str | None = None
    difficulty_preference: str | None = "Adaptive"
    difficultyPreference: str | None = "Adaptive"
    learning_preference: str | None = None
    learningPreference: str | None = None
    preferences_updated_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class UserProfileResponse(BaseModel):
    id: int
    user_id: int
    display_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    level: int
    xp: int
    credits: int
    stars: int
    streak: int
    # Preferences attached to profile
    goal: str | None = None
    target_role: str | None = None
    skill_level: str | None = None
    subjects: list[str] | None = None
    daily_time: str | None = None
    difficulty_preference: str | None = None
    learning_preference: str | None = None
    preferences_updated_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class UserProfileUpdate(BaseModel):
    display_name: str | None = Field(None, min_length=1, max_length=100)
    bio: str | None = Field(None, max_length=500)
    avatar_url: str | None = Field(None, max_length=500)


class UserMeUpdate(BaseModel):
    """Fields on the core User that can be updated."""
    display_name: str | None = Field(None, min_length=1, max_length=100)
