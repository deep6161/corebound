"""
Pydantic schemas for the Phase 2 gameplay session endpoints.

Playable responses NEVER expose canonical answers.
"""
import json
from typing import Any

from pydantic import BaseModel, ConfigDict, field_validator


# ──────────────────────────────────────────────
# Request schemas
# ──────────────────────────────────────────────

class GameplayStartRequest(BaseModel):
    mission_id: int


class AnswerSubmitRequest(BaseModel):
    """
    The user submits their answer.

    For GM001: answer is the chosen option string.
    For GM002: answer is a JSON-encoded dict {obj_id: slot_id}.
    For GM003: answer is a JSON-encoded list [item_id, ...].
    For GM004: answer is the typed text string.

    time_taken_ms is optional timing data from the client.
    """
    answer: str
    time_taken_ms: int | None = None

    @field_validator("answer")
    @classmethod
    def answer_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("answer must not be empty")
        return v


# ──────────────────────────────────────────────
# GM001 playable response — NO canonical answer
# ──────────────────────────────────────────────

class GM001PlayableContent(BaseModel):
    question: str
    options: list[str]
    # answer is intentionally absent


class GM001Response(BaseModel):
    gameplay_type: str = "GM001"
    difficulty: str
    content: GM001PlayableContent


# ──────────────────────────────────────────────
# GM002 playable response — NO canonical_mapping
# ──────────────────────────────────────────────

class GM002Item(BaseModel):
    id: str
    label: str


class GM002PlayableContent(BaseModel):
    objects: list[GM002Item]
    slots: list[GM002Item]
    instructions: str
    # canonical_mapping is intentionally absent


class GM002Response(BaseModel):
    gameplay_type: str = "GM002"
    difficulty: str
    content: GM002PlayableContent


# ──────────────────────────────────────────────
# GM003 playable response — NO canonical_order
# ──────────────────────────────────────────────

class GM003Item(BaseModel):
    id: str
    label: str


class GM003PlayableContent(BaseModel):
    items: list[GM003Item]   # Presented in shuffled order; canonical_order absent
    instructions: str
    # canonical_order is intentionally absent


class GM003Response(BaseModel):
    gameplay_type: str = "GM003"
    difficulty: str
    content: GM003PlayableContent


# ──────────────────────────────────────────────
# GM004 playable response — NO accepted_answers
# ──────────────────────────────────────────────

class GM004PlayableContent(BaseModel):
    question: str
    answer_type: str  # text | number | formula
    # accepted_answers is intentionally absent


class GM004Response(BaseModel):
    gameplay_type: str = "GM004"
    difficulty: str
    content: GM004PlayableContent


# ──────────────────────────────────────────────
# Session response wrapping gameplay-type content
# ──────────────────────────────────────────────

class GameplaySessionResponse(BaseModel):
    session_id: int
    mission_id: int
    gameplay_type: str
    difficulty: str
    # ISO-8601 UTC timestamp when the session was started (used by frontend timer)
    started_at: str | None = None
    # Whether the session is already completed (review mode)
    is_completed: bool = False
    # One of GM001Response / GM002Response / GM003Response / GM004Response
    playable: dict[str, Any]


# ──────────────────────────────────────────────
# Answer result — never exposes canonical answer
# ──────────────────────────────────────────────

class AnswerResultResponse(BaseModel):
    session_id: int
    is_correct: bool
    explanation: str
    score: int
    xp_earned: int
    credits_earned: int
    stars_earned: int
    mission_completed: bool
    next_mission_unlocked: bool
    phase_completed: int | None = None
    next_phase: int | None = None
    new_shield_pct: int | None = None


# ──────────────────────────────────────────────
# Internal Pydantic validators for Gemini output
# ──────────────────────────────────────────────

class GM001GeneratedContent(BaseModel):
    """Validates Gemini-generated GM001 content before storing."""
    question: str
    options: list[str]
    answer: str
    explanation: str

    @field_validator("options")
    @classmethod
    def must_have_four_options(cls, v: list[str]) -> list[str]:
        if len(v) != 4:
            raise ValueError(f"GM001 requires exactly 4 options, got {len(v)}")
        return v

    @field_validator("answer")
    @classmethod
    def answer_must_be_in_options(cls, v: str, info: Any) -> str:
        # Access other fields via info.data
        options = info.data.get("options", [])
        if options and v not in options:
            raise ValueError(f"GM001 answer '{v}' must be one of the options")
        return v

    @field_validator("question")
    @classmethod
    def question_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("question must not be empty")
        return v


class GM002Item_(BaseModel):
    id: str
    label: str


class GM002GeneratedContent(BaseModel):
    """Validates Gemini-generated GM002 content before storing."""
    objects: list[GM002Item_]
    slots: list[GM002Item_]
    canonical_mapping: dict[str, str]
    instructions: str
    explanation: str

    @field_validator("objects")
    @classmethod
    def validate_objects(cls, v: list[GM002Item_]) -> list[GM002Item_]:
        if len(v) != 4:
            raise ValueError(f"GM002 requires exactly 4 objects, got {len(v)}")
        norm_labels = [o.label.strip().lower() for o in v]
        if len(set(norm_labels)) != 4:
            raise ValueError(f"GM002 objects must have 4 unique labels, found duplicates in: {norm_labels}")
        return v

    @field_validator("slots")
    @classmethod
    def validate_slots(cls, v: list[GM002Item_]) -> list[GM002Item_]:
        if len(v) != 4:
            raise ValueError(f"GM002 requires exactly 4 slots, got {len(v)}")
        norm_labels = [s.label.strip().lower() for s in v]
        if len(set(norm_labels)) != 4:
            raise ValueError(f"GM002 slots must have 4 unique labels, found duplicates in: {norm_labels}")
        return v

    @field_validator("canonical_mapping")
    @classmethod
    def mapping_must_be_complete_and_bijective(cls, v: dict, info: Any) -> dict:
        objects = info.data.get("objects", [])
        slots = info.data.get("slots", [])
        obj_ids = {o.id for o in objects} if objects else set()
        slot_ids = {s.id for s in slots} if slots else set()
        mapping_keys = set(v.keys())
        mapping_vals = set(v.values())

        if obj_ids and mapping_keys != obj_ids:
            raise ValueError("canonical_mapping keys must match object IDs exactly")
        if slot_ids and mapping_vals != slot_ids:
            raise ValueError("canonical_mapping values must match slot IDs exactly (one-to-one bijection)")
        if len(mapping_vals) != 4:
            raise ValueError(f"canonical_mapping must be 1-to-1: expected 4 distinct slot targets, got {len(mapping_vals)}")
        return v


class BossPhaseContent(BaseModel):
    phase: int
    hero: str
    equation: str
    accepted_answers: list[str]
    presets: list[int]
    shield_pct: int


class BossChallengeGeneratedContent(BaseModel):
    """Validates canonical Boss Challenge content before storing."""
    format: str = "boss_3phase"
    boss_name: str = "Guardian Atlas"
    phases: list[BossPhaseContent]
    explanation: str

    @field_validator("phases")
    @classmethod
    def validate_phases(cls, v: list[BossPhaseContent]) -> list[BossPhaseContent]:
        if len(v) != 3:
            raise ValueError(f"Boss challenge must contain exactly 3 phases, got {len(v)}")
        phase_nums = [p.phase for p in v]
        if phase_nums != [1, 2, 3]:
            raise ValueError(f"Boss phases must be sequentially numbered 1, 2, 3, got {phase_nums}")
        for p in v:
            if not p.hero or not p.equation or not p.accepted_answers or not p.presets:
                raise ValueError(f"Phase {p.phase} has missing required fields")
        return v


class GM003Item_(BaseModel):
    id: str
    label: str


class GM003GeneratedContent(BaseModel):
    """Validates Gemini-generated GM003 content before storing."""
    items: list[GM003Item_]
    canonical_order: list[str]
    instructions: str
    explanation: str

    @field_validator("items")
    @classmethod
    def must_have_four_items(cls, v: list) -> list:
        if len(v) != 4:
            raise ValueError(f"GM003 requires exactly 4 items, got {len(v)}")
        return v

    @field_validator("canonical_order")
    @classmethod
    def order_must_match_items(cls, v: list, info: Any) -> list:
        items = info.data.get("items", [])
        item_ids = {i.id for i in items} if items else set()
        if item_ids and set(v) != item_ids:
            raise ValueError("canonical_order must contain all item IDs exactly once")
        return v


class GM004GeneratedContent(BaseModel):
    """Validates Gemini-generated GM004 content before storing."""
    question: str
    answer_type: str
    accepted_answers: list[str]
    explanation: str

    @field_validator("answer_type")
    @classmethod
    def valid_answer_type(cls, v: str) -> str:
        if v not in ("text", "number", "formula"):
            raise ValueError(f"answer_type must be text|number|formula, got '{v}'")
        return v

    @field_validator("accepted_answers")
    @classmethod
    def must_have_at_least_one(cls, v: list) -> list:
        if not v:
            raise ValueError("accepted_answers must have at least one entry")
        return v

    @field_validator("question")
    @classmethod
    def question_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("question must not be empty")
        return v
