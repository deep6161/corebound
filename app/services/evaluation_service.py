"""
AnswerEvaluationService

Deterministic server-side answer evaluation for all four gameplay types.

GM001 — Mission Quiz
    submitted option (string) == canonical option (string)

GM002 — System Assembly
    submitted mapping (dict) == canonical mapping (dict)
    Keys are object IDs, values are slot IDs.

GM003 — Sequence Builder
    submitted ordering (list of IDs) == canonical ordering (list of IDs)

GM004 — Input Answer
    submitted text matches ANY accepted answer after normalization:
    - strip surrounding whitespace
    - lowercase
    Numeric answers: attempt float parse before string compare.

Returns (is_correct: bool, explanation: str)
"""

import json
from dataclasses import dataclass

from app.models.mission import (
    GAMEPLAY_GM001,
    GAMEPLAY_GM002,
    GAMEPLAY_GM003,
    GAMEPLAY_GM004,
)


@dataclass
class EvaluationResult:
    is_correct: bool
    explanation: str


def _normalize_text(text: str) -> str:
    """Strip whitespace and lowercase for case-insensitive comparison."""
    return text.strip().lower()


def _normalize_numeric(text: str) -> str | None:
    """Try to parse as float and normalize to string. Returns None if not numeric."""
    try:
        return str(float(text.strip()))
    except ValueError:
        return None


def evaluate_gm001(submitted: str, canonical_content: dict) -> EvaluationResult:
    """
    GM001: submitted option must match the canonical answer string exactly.
    """
    canonical_answer = canonical_content.get("answer", "")
    explanation = canonical_content.get("explanation", "")
    is_correct = _normalize_text(submitted) == _normalize_text(canonical_answer)
    return EvaluationResult(is_correct=is_correct, explanation=explanation)


def evaluate_gm002(submitted: str | dict, canonical_content: dict) -> EvaluationResult:
    """
    GM002: submitted mapping (dict object_id → slot_id) must equal canonical mapping.
    """
    canonical_mapping = canonical_content.get("canonical_mapping", {})
    explanation = canonical_content.get("explanation", "")

    # Submitted may arrive as a JSON string
    if isinstance(submitted, str):
        try:
            submitted = json.loads(submitted)
        except json.JSONDecodeError:
            return EvaluationResult(is_correct=False, explanation=explanation)

    if not isinstance(submitted, dict):
        return EvaluationResult(is_correct=False, explanation=explanation)

    # Normalize keys/values to strings for comparison
    submitted_norm = {str(k): str(v) for k, v in submitted.items()}
    canonical_norm = {str(k): str(v) for k, v in canonical_mapping.items()}

    is_correct = submitted_norm == canonical_norm
    return EvaluationResult(is_correct=is_correct, explanation=explanation)


def evaluate_gm003(submitted: str | list, canonical_content: dict) -> EvaluationResult:
    """
    GM003: submitted ordering (list of item IDs) must equal canonical ordering.
    """
    canonical_order = canonical_content.get("canonical_order", [])
    explanation = canonical_content.get("explanation", "")

    # Submitted may arrive as a JSON string
    if isinstance(submitted, str):
        try:
            submitted = json.loads(submitted)
        except json.JSONDecodeError:
            return EvaluationResult(is_correct=False, explanation=explanation)

    if not isinstance(submitted, list):
        return EvaluationResult(is_correct=False, explanation=explanation)

    submitted_norm = [str(i) for i in submitted]
    canonical_norm = [str(i) for i in canonical_order]

    is_correct = submitted_norm == canonical_norm
    return EvaluationResult(is_correct=is_correct, explanation=explanation)


def evaluate_gm004(submitted: str, canonical_content: dict) -> EvaluationResult:
    """
    GM004: submitted text must match ANY of the accepted answers after normalization.
    Normalization: strip + lowercase.
    Numeric: try float parse first.
    """
    accepted_answers = canonical_content.get("accepted_answers", [])
    explanation = canonical_content.get("explanation", "")

    submitted_norm = _normalize_text(submitted)
    submitted_num = _normalize_numeric(submitted)

    for accepted in accepted_answers:
        accepted_norm = _normalize_text(str(accepted))
        if submitted_norm == accepted_norm:
            return EvaluationResult(is_correct=True, explanation=explanation)
        # Try numeric comparison
        if submitted_num is not None:
            accepted_num = _normalize_numeric(str(accepted))
            if accepted_num is not None and submitted_num == accepted_num:
                return EvaluationResult(is_correct=True, explanation=explanation)

    return EvaluationResult(is_correct=False, explanation=explanation)


def evaluate_boss_phase(
    submitted_answer: str,
    canonical_content: dict,
    current_phase: int,
) -> EvaluationResult:
    """
    GM004 Boss Battle (3-phase progressive):
    Evaluates submitted power for the current active phase.
    Accepts raw string '25' or JSON '{"phase": 1, "power": "25"}'.
    """
    phases = canonical_content.get("phases", [])
    if not (1 <= current_phase <= len(phases)):
        return EvaluationResult(
            is_correct=False,
            explanation=f"Invalid boss phase: {current_phase}",
        )

    phase_data = phases[current_phase - 1]
    accepted_answers = phase_data.get("accepted_answers", [])
    explanation = canonical_content.get("explanation", "")
    hero = phase_data.get("hero", "HERO")

    power_str = submitted_answer.strip()
    if power_str.startswith("{"):
        try:
            parsed = json.loads(power_str)
            if isinstance(parsed, dict):
                req_phase = parsed.get("phase")
                if req_phase is not None and int(req_phase) != current_phase:
                    return EvaluationResult(
                        is_correct=False,
                        explanation=f"Phase mismatch: active phase is {current_phase}, but submitted {req_phase}.",
                    )
                power_str = str(parsed.get("power", parsed.get("answer", ""))).strip()
        except Exception:
            pass

    submitted_clean = _normalize_text(power_str).replace("gw", "").strip()
    submitted_num = _normalize_numeric(submitted_clean)

    for accepted in accepted_answers:
        accepted_clean = _normalize_text(str(accepted)).replace("gw", "").strip()
        if submitted_clean == accepted_clean:
            return EvaluationResult(is_correct=True, explanation=explanation)
        if submitted_num is not None:
            accepted_num = _normalize_numeric(accepted_clean)
            if accepted_num is not None and submitted_num == accepted_num:
                return EvaluationResult(is_correct=True, explanation=explanation)

    return EvaluationResult(
        is_correct=False,
        explanation=f"{power_str} GW deflected by Null Shield. Re-calibrate {hero}'s harmonic power!",
    )


def evaluate(
    gameplay_type: str,
    submitted_answer: str,
    canonical_content: dict,
    current_phase: int | None = None,
) -> EvaluationResult:
    """
    Dispatch to the appropriate evaluator.

    Args:
        gameplay_type: GM001 | GM002 | GM003 | GM004
        submitted_answer: Raw string from the user's request.
        canonical_content: Parsed dict from Challenge.content.
        current_phase: Optional 1-based index for multi-phase boss challenges.

    Returns:
        EvaluationResult with is_correct and explanation.
    """
    if canonical_content.get("format") == "boss_3phase":
        return evaluate_boss_phase(submitted_answer, canonical_content, current_phase or 1)
    if gameplay_type == GAMEPLAY_GM001:
        return evaluate_gm001(submitted_answer, canonical_content)
    elif gameplay_type == GAMEPLAY_GM002:
        return evaluate_gm002(submitted_answer, canonical_content)
    elif gameplay_type == GAMEPLAY_GM003:
        return evaluate_gm003(submitted_answer, canonical_content)
    elif gameplay_type == GAMEPLAY_GM004:
        return evaluate_gm004(submitted_answer, canonical_content)
    else:
        return EvaluationResult(
            is_correct=False,
            explanation=f"Unknown gameplay type: {gameplay_type}",
        )
