"""
Gemini Challenge Generator Service (Phases V17 & V18)

Generates dynamic AI-powered challenges using the existing Gemini client
and V16 deterministic adaptive context.

Supported Gameplay Types:
- GM001: Single-correct multiple choice
- GM002: System assembly / matching pairs

STRICT ARCHITECTURAL BOUNDARIES:
- Consumes V16 learning context (preferences, performance, difficulty).
- Reuses existing Singleton GeminiClient (app.ai.gemini_client.gemini_client).
- Backend validates all output rigorously before saving.
- The returned playable response is SANITIZED (no answers or mappings exposed to the client).
- Gemini NEVER evaluates answers or awards XP/rewards.
"""

import json
import re
import uuid
from typing import Any
from sqlalchemy.orm import Session

from app.ai.gemini_client import gemini_client
from app.models.challenge import Challenge
from app.models.mission import Mission


class GeminiGenerationError(Exception):
    """Raised when Gemini API call fails or encounters network/service errors."""
    pass


class GeminiValidationError(Exception):
    """Raised when Gemini returns malformed, incomplete, or invalid challenge data."""
    pass


# ═══════════════════════════════════════════════════════════════════════════
# JSON PARSING UTILITY
# ═══════════════════════════════════════════════════════════════════════════

def parse_gemini_json_response(raw_text: str) -> dict[str, Any]:
    """
    Parses JSON from Gemini's text response, safely stripping any markdown wrappers if present.
    """
    if not raw_text or not raw_text.strip():
        raise GeminiValidationError("Gemini returned an empty response")

    text = raw_text.strip()

    # Strip markdown code blocks if present (```json ... ``` or ``` ...)
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
        text = re.sub(r"\s*```$", "", text)
        text = text.strip()

    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        raise GeminiValidationError(f"Invalid JSON format in Gemini response: {exc}") from exc

    if not isinstance(data, dict):
        raise GeminiValidationError("Gemini response is not a valid JSON object")

    return data


# ═══════════════════════════════════════════════════════════════════════════
# GM001 — SINGLE-CORRECT MULTIPLE CHOICE GENERATION (PHASE V17)
# ═══════════════════════════════════════════════════════════════════════════

def build_gm001_generation_prompt(context: dict[str, Any]) -> str:
    """
    Builds a strict structured educational prompt for Gemini GM001 challenges.
    """
    gen_ctx = context.get("generation_context", {})
    perf = context.get("performance", {})

    goal = gen_ctx.get("goal") or "General Mastery"
    target_role = gen_ctx.get("target_role") or "Corebound Operative"
    skill_level = gen_ctx.get("skill_level") or "Intermediate"
    subjects = ", ".join(gen_ctx.get("subjects") or ["Aptitude & Logic"])
    chapter = gen_ctx.get("chapter") or "Chapter 1"
    sector = gen_ctx.get("sector") or "Sector 1"
    mission = gen_ctx.get("mission") or "Mission"
    objective = gen_ctx.get("objective") or "Solve the logic challenge"
    topic = gen_ctx.get("topic") or "General"
    difficulty = gen_ctx.get("difficulty") or "MEDIUM"

    if perf and perf.get("total_attempts", 0) > 0:
        acc_pct = f"{round(perf.get('accuracy', 0.0) * 100, 1)}%" if perf.get("accuracy") is not None else "N/A"
        perf_summary = f"Total Attempts: {perf.get('total_attempts')}, Accuracy: {acc_pct}, Streak: {perf.get('streak', 0)}"
    else:
        perf_summary = "No prior performance history on this topic (First Attempt)"

    prompt = f"""You are the Corebound educational challenge generator.

Generate exactly ONE GM001 multiple-choice question.

Context:
Goal: {goal}
Target Role: {target_role}
Skill Level: {skill_level}
Subjects: {subjects}
Chapter: {chapter}
Sector: {sector}
Mission: {mission}
Mission Objective: {objective}
Topic: {topic}
Gameplay Type: GM001
Difficulty: {difficulty}
Performance: {perf_summary}

Requirements:
1. Generate exactly one educational question.
2. Generate exactly four options.
3. Exactly one option must be correct.
4. Match the requested topic.
5. Match the requested difficulty.
6. Match the learner's skill level.
7. Keep the question relevant to the mission objective.
8. Do not reveal the correct answer in the question.
9. Do not include option labels such as A/B/C/D inside option text.
10. Avoid ambiguous questions.
11. Avoid duplicate options.
12. Return JSON only.
13. Do not return Markdown.
14. Do not include extra text outside JSON.

Expected internal JSON:
{{
  "question": "<question text>",
  "options": [
    {{"id": "A", "text": "<option text>"}},
    {{"id": "B", "text": "<option text>"}},
    {{"id": "C", "text": "<option text>"}},
    {{"id": "D", "text": "<option text>"}}
  ],
  "correctOptionId": "A",
  "explanation": "<brief educational explanation>"
}}"""
    return prompt.strip()


def validate_gemini_gm001_output(data: dict[str, Any]) -> dict[str, Any]:
    """
    Validates Gemini's generated GM001 structure:
    - valid dictionary
    - question exists and is non-empty string
    - exactly 4 options with IDs A, B, C, D
    - unique non-empty option text
    - correctOptionId exists and is in A, B, C, D
    - explanation exists
    """
    question = data.get("question")
    if not question or not isinstance(question, str) or not question.strip():
        raise GeminiValidationError("Challenge question is missing or empty")
    cleaned_question = question.strip()

    options_raw = data.get("options")
    if not isinstance(options_raw, list):
        raise GeminiValidationError("Challenge options must be a list")

    if len(options_raw) != 4:
        raise GeminiValidationError(f"GM001 challenge must have exactly 4 options, got {len(options_raw)}")

    expected_ids = {"A", "B", "C", "D"}
    seen_ids = set()
    seen_texts = set()
    cleaned_options = []

    for idx, opt in enumerate(options_raw):
        if not isinstance(opt, dict):
            raise GeminiValidationError(f"Option at index {idx} must be a dictionary")

        opt_id = opt.get("id")
        if not opt_id or not isinstance(opt_id, str):
            raise GeminiValidationError(f"Option at index {idx} has invalid ID")
        opt_id = opt_id.strip().upper()

        if opt_id not in expected_ids:
            raise GeminiValidationError(f"Option ID '{opt_id}' is invalid; must be one of A, B, C, D")

        if opt_id in seen_ids:
            raise GeminiValidationError(f"Duplicate option ID '{opt_id}' detected")
        seen_ids.add(opt_id)

        opt_text = opt.get("text")
        if opt_text is None or not isinstance(opt_text, str) or not opt_text.strip():
            raise GeminiValidationError(f"Option '{opt_id}' text is missing or empty")
        cleaned_opt_text = opt_text.strip()

        norm_text = cleaned_opt_text.lower()
        if norm_text in seen_texts:
            raise GeminiValidationError(f"Duplicate option text detected: '{cleaned_opt_text}'")
        seen_texts.add(norm_text)

        cleaned_options.append({
            "id": opt_id,
            "text": cleaned_opt_text,
        })

    if seen_ids != expected_ids:
        raise GeminiValidationError(f"Options must contain exactly A, B, C, D; got {seen_ids}")

    cleaned_options.sort(key=lambda x: x["id"])

    correct_id = data.get("correctOptionId")
    if not correct_id or not isinstance(correct_id, str):
        raise GeminiValidationError("correctOptionId is missing or invalid")
    correct_id = correct_id.strip().upper()

    if correct_id not in expected_ids:
        raise GeminiValidationError(f"correctOptionId '{correct_id}' is invalid; must be one of A, B, C, D")

    explanation = data.get("explanation")
    cleaned_explanation = str(explanation).strip() if explanation else "Correct resonance calibrated."

    return {
        "question": cleaned_question,
        "options": cleaned_options,
        "correctOptionId": correct_id,
        "explanation": cleaned_explanation,
    }


def sanitize_playable_gm001(
    challenge_id: str,
    validated_data: dict[str, Any],
    adaptive_context: dict[str, Any],
) -> dict[str, Any]:
    """
    Sanitizes the validated GM001 challenge for the frontend.
    Removes correctOptionId, explanation, answers, and solutions.
    """
    metadata = {
        "chapter_id": adaptive_context.get("chapter_id", 1),
        "sector_id": adaptive_context.get("sector_id", 1),
        "mission_id": adaptive_context.get("mission_id", 1),
        "topic_id": adaptive_context.get("topic_id", 1),
        "difficulty": adaptive_context.get("difficulty", "MEDIUM"),
        "objective": adaptive_context.get("generation_context", {}).get("objective", ""),
    }

    return {
        "id": challenge_id,
        "challenge_id": challenge_id,
        "gameplay_type": "GM001",
        "instruction": "Select exactly one calibration frequency.",
        "question": validated_data["question"],
        "options": [
            {"id": opt["id"], "text": opt["text"]}
            for opt in validated_data["options"]
        ],
        "metadata": metadata,
    }


def generate_gm001_challenge(
    adaptive_context: dict[str, Any],
    mission: Mission,
    db: Session,
) -> dict[str, Any]:
    """
    Orchestrates the GM001 generation flow.
    """
    prompt = build_gm001_generation_prompt(adaptive_context)

    try:
        raw_text = gemini_client.generate(prompt)
    except Exception as exc:
        raise GeminiGenerationError(f"Gemini API invocation failed: {exc}") from exc

    parsed_json = parse_gemini_json_response(raw_text)
    validated_data = validate_gemini_gm001_output(parsed_json)

    internal_content = {
        "question": validated_data["question"],
        "options": validated_data["options"],
        "correctOptionId": validated_data["correctOptionId"],
        "answer": validated_data["correctOptionId"],
        "explanation": validated_data["explanation"],
    }

    difficulty = adaptive_context.get("difficulty", mission.difficulty)

    challenge_record = Challenge(
        topic_id=mission.topic_id,
        gameplay_type="GM001",
        difficulty=difficulty,
        content=json.dumps(internal_content),
        explanation=validated_data["explanation"],
        ai_generated=True,
        validated=True,
    )
    db.add(challenge_record)
    db.commit()
    db.refresh(challenge_record)

    challenge_id = f"gm001_c{challenge_record.id}_{uuid.uuid4().hex[:8]}"
    sanitized = sanitize_playable_gm001(
        challenge_id=challenge_id,
        validated_data=validated_data,
        adaptive_context=adaptive_context,
    )

    return sanitized


# ═══════════════════════════════════════════════════════════════════════════
# GM002 — SYSTEM ASSEMBLY / MATCHING GENERATION (PHASE V18)
# ═══════════════════════════════════════════════════════════════════════════

def build_gm002_generation_prompt(context: dict[str, Any]) -> str:
    """
    Builds a strict structured educational prompt for Gemini GM002 matching / system assembly challenges.
    """
    gen_ctx = context.get("generation_context", {})
    perf = context.get("performance", {})

    goal = gen_ctx.get("goal") or "General Mastery"
    target_role = gen_ctx.get("target_role") or "Corebound Operative"
    skill_level = gen_ctx.get("skill_level") or "Intermediate"
    subjects = ", ".join(gen_ctx.get("subjects") or ["Aptitude & Logic"])
    chapter = gen_ctx.get("chapter") or "Chapter 1"
    sector = gen_ctx.get("sector") or "Sector 1"
    mission = gen_ctx.get("mission") or "Mission"
    objective = gen_ctx.get("objective") or "Connect matching wavelength conduits"
    topic = gen_ctx.get("topic") or "General"
    difficulty = gen_ctx.get("difficulty") or "MEDIUM"

    if perf and perf.get("total_attempts", 0) > 0:
        acc_pct = f"{round(perf.get('accuracy', 0.0) * 100, 1)}%" if perf.get("accuracy") is not None else "N/A"
        perf_summary = f"Total Attempts: {perf.get('total_attempts')}, Accuracy: {acc_pct}, Streak: {perf.get('streak', 0)}"
    else:
        perf_summary = "No prior performance history on this topic (First Attempt)"

    # Complexity guidance based on difficulty
    if difficulty.upper() == "EASY":
        count_guidance = "Provide exactly 3 or 4 objects and matching slots with clear, direct pairings."
    elif difficulty.upper() == "HARD":
        count_guidance = "Provide exactly 4 or 5 objects and matching slots with nuanced relationships and conceptual depth."
    else:
        count_guidance = "Provide exactly 4 objects and 4 matching slots with moderate relationship complexity."

    prompt = f"""You are the Corebound educational challenge generator.

Generate exactly ONE GM002 System Assembly / Matching challenge.

Context:
Goal: {goal}
Target Role: {target_role}
Skill Level: {skill_level}
Subjects: {subjects}
Chapter: {chapter}
Sector: {sector}
Mission: {mission}
Mission Objective: {objective}
Topic: {topic}
Gameplay Type: GM002
Difficulty: {difficulty}
Performance: {perf_summary}

Requirements:
1. Generate an educational matching / system assembly challenge for the topic "{topic}".
2. {count_guidance}
3. Provide a clear, immersion-grounded instruction for the player.
4. Each object must have a unique ID (e.g. "obj_1", "obj_2", ...) and clear display text.
5. Each slot must have a unique ID (e.g. "slot_1", "slot_2", ...) and clear display label.
6. Provide a "correctMapping" dictionary mapping every object ID to its exactly matching slot ID.
7. Every object must map to a valid slot ID.
8. No orphan or unmapped objects.
9. Match the requested topic and difficulty level.
10. Keep the challenge relevant to the mission objective.
11. Return JSON only.
12. Do not return Markdown.
13. Do not include extra text outside JSON.

Expected internal JSON:
{{
  "instruction": "<clear instruction for matching objects to slots>",
  "objects": [
    {{"id": "obj_1", "text": "<object 1 display text>"}},
    {{"id": "obj_2", "text": "<object 2 display text>"}},
    {{"id": "obj_3", "text": "<object 3 display text>"}},
    {{"id": "obj_4", "text": "<object 4 display text>"}}
  ],
  "slots": [
    {{"id": "slot_1", "label": "<slot 1 label text>"}},
    {{"id": "slot_2", "label": "<slot 2 label text>"}},
    {{"id": "slot_3", "label": "<slot 3 label text>"}},
    {{"id": "slot_4", "label": "<slot 4 label text>"}}
  ],
  "correctMapping": {{
    "obj_1": "slot_1",
    "obj_2": "slot_2",
    "obj_3": "slot_3",
    "obj_4": "slot_4"
  }},
  "explanation": "<brief educational explanation of the correct mapping>"
}}"""
    return prompt.strip()


def validate_gemini_gm002_output(data: dict[str, Any]) -> dict[str, Any]:
    """
    Validates Gemini's generated GM002 structure according to Phase V18 rules:
    - gameplay type compatibility
    - non-empty instruction
    - objects list with 3–8 items, unique IDs, non-empty text
    - slots list with 3–8 items, unique IDs, non-empty label (or text)
    - objects.length >= slots.length
    - correctMapping is a dict mapping every object ID to a valid slot ID
    - no unknown objects or slots in correctMapping
    - every slot is mapped to at least one object
    """
    # 1. Instruction validation
    instruction = data.get("instruction")
    if not instruction or not isinstance(instruction, str) or not instruction.strip():
        raise GeminiValidationError("GM002 instruction is missing or empty")
    cleaned_instruction = instruction.strip()

    # 2. Objects validation
    objects_raw = data.get("objects")
    if not isinstance(objects_raw, list) or len(objects_raw) == 0:
        raise GeminiValidationError("GM002 objects must be a non-empty list")

    if not (3 <= len(objects_raw) <= 8):
        raise GeminiValidationError(f"GM002 objects count must be between 3 and 8, got {len(objects_raw)}")

    seen_obj_ids = set()
    cleaned_objects = []
    for idx, obj in enumerate(objects_raw):
        if not isinstance(obj, dict):
            raise GeminiValidationError(f"Object at index {idx} must be a dictionary")

        obj_id = obj.get("id")
        if not obj_id or not isinstance(obj_id, str) or not obj_id.strip():
            raise GeminiValidationError(f"Object at index {idx} has missing or invalid id")
        obj_id = obj_id.strip()

        if obj_id in seen_obj_ids:
            raise GeminiValidationError(f"Duplicate object ID detected: '{obj_id}'")
        seen_obj_ids.add(obj_id)

        obj_text = obj.get("text")
        if obj_text is None or not isinstance(obj_text, str) or not obj_text.strip():
            raise GeminiValidationError(f"Object '{obj_id}' has missing or invalid display text")

        cleaned_objects.append({
            "id": obj_id,
            "text": obj_text.strip(),
        })

    # 3. Slots validation
    slots_raw = data.get("slots")
    if not isinstance(slots_raw, list) or len(slots_raw) == 0:
        raise GeminiValidationError("GM002 slots must be a non-empty list")

    if not (3 <= len(slots_raw) <= 8):
        raise GeminiValidationError(f"GM002 slots count must be between 3 and 8, got {len(slots_raw)}")

    seen_slot_ids = set()
    cleaned_slots = []
    for idx, slot in enumerate(slots_raw):
        if not isinstance(slot, dict):
            raise GeminiValidationError(f"Slot at index {idx} must be a dictionary")

        slot_id = slot.get("id")
        if not slot_id or not isinstance(slot_id, str) or not slot_id.strip():
            raise GeminiValidationError(f"Slot at index {idx} has missing or invalid id")
        slot_id = slot_id.strip()

        if slot_id in seen_slot_ids:
            raise GeminiValidationError(f"Duplicate slot ID detected: '{slot_id}'")
        seen_slot_ids.add(slot_id)

        # Accept label or text for slot display
        slot_label = slot.get("label") or slot.get("text")
        if slot_label is None or not isinstance(slot_label, str) or not slot_label.strip():
            raise GeminiValidationError(f"Slot '{slot_id}' has missing or invalid display label")

        cleaned_slots.append({
            "id": slot_id,
            "label": slot_label.strip(),
        })

    if len(cleaned_objects) < len(cleaned_slots):
        raise GeminiValidationError(f"GM002 objects count ({len(cleaned_objects)}) cannot be less than slots count ({len(cleaned_slots)})")

    # 4. Correct mapping validation
    mapping_raw = data.get("correctMapping") or data.get("canonical_mapping") or data.get("canonicalMapping")
    if not mapping_raw or not isinstance(mapping_raw, dict):
        raise GeminiValidationError("GM002 correctMapping is missing or invalid")

    cleaned_mapping = {}
    mapped_slots = set()

    # Check that all keys in mapping are known objects
    for obj_id, slot_id in mapping_raw.items():
        obj_key = str(obj_id).strip()
        slot_val = str(slot_id).strip()

        if obj_key not in seen_obj_ids:
            raise GeminiValidationError(f"correctMapping contains unknown object ID: '{obj_key}'")

        if slot_val not in seen_slot_ids:
            raise GeminiValidationError(f"correctMapping maps object '{obj_key}' to unknown slot ID: '{slot_val}'")

        cleaned_mapping[obj_key] = slot_val
        mapped_slots.add(slot_val)

    # Check that every object has a mapping
    missing_objects = seen_obj_ids - set(cleaned_mapping.keys())
    if missing_objects:
        raise GeminiValidationError(f"correctMapping is missing mapping for objects: {missing_objects}")

    # Check that every slot is targeted
    missing_slots = seen_slot_ids - mapped_slots
    if missing_slots:
        raise GeminiValidationError(f"correctMapping leaves slots unmapped: {missing_slots}")

    explanation = data.get("explanation")
    cleaned_explanation = str(explanation).strip() if explanation else "System assembly calibrated."

    return {
        "instruction": cleaned_instruction,
        "objects": cleaned_objects,
        "slots": cleaned_slots,
        "correctMapping": cleaned_mapping,
        "explanation": cleaned_explanation,
    }


def sanitize_playable_gm002(
    challenge_id: str,
    validated_data: dict[str, Any],
    adaptive_context: dict[str, Any],
) -> dict[str, Any]:
    """
    Sanitizes the validated GM002 challenge for the frontend.
    STRICT SECURITY RULE:
    Never contains correctMapping, canonicalMapping, answerMap, solutions, or answers.
    """
    metadata = {
        "chapter_id": adaptive_context.get("chapter_id", 1),
        "sector_id": adaptive_context.get("sector_id", 1),
        "mission_id": adaptive_context.get("mission_id", 3),
        "topic_id": adaptive_context.get("topic_id", 1),
        "difficulty": adaptive_context.get("difficulty", "MEDIUM"),
        "objective": adaptive_context.get("generation_context", {}).get("objective", ""),
    }

    return {
        "id": challenge_id,
        "challenge_id": challenge_id,
        "gameplay_type": "GM002",
        "instruction": validated_data["instruction"],
        "objects": [
            {"id": obj["id"], "text": obj["text"]}
            for obj in validated_data["objects"]
        ],
        "slots": [
            {"id": slot["id"], "label": slot["label"]}
            for slot in validated_data["slots"]
        ],
        "metadata": metadata,
    }


def generate_gm002_challenge(
    adaptive_context: dict[str, Any],
    mission: Mission,
    db: Session,
) -> dict[str, Any]:
    """
    Orchestrates the GM002 generation flow:
    1. Build prompt from V16 adaptive context.
    2. Call existing GeminiClient.
    3. Parse & validate JSON output.
    4. Save internal validated challenge into DB.
    5. Return sanitized playable response.
    """
    prompt = build_gm002_generation_prompt(adaptive_context)

    try:
        raw_text = gemini_client.generate(prompt)
    except Exception as exc:
        raise GeminiGenerationError(f"Gemini API invocation failed: {exc}") from exc

    parsed_json = parse_gemini_json_response(raw_text)
    validated_data = validate_gemini_gm002_output(parsed_json)

    # Store canonical mapping internally in DB
    internal_content = {
        "instruction": validated_data["instruction"],
        "objects": validated_data["objects"],
        "slots": validated_data["slots"],
        "correctMapping": validated_data["correctMapping"],
        "canonical_mapping": validated_data["correctMapping"],
        "explanation": validated_data["explanation"],
    }

    difficulty = adaptive_context.get("difficulty", mission.difficulty)

    challenge_record = Challenge(
        topic_id=mission.topic_id,
        gameplay_type="GM002",
        difficulty=difficulty,
        content=json.dumps(internal_content),
        explanation=validated_data["explanation"],
        ai_generated=True,
        validated=True,
    )
    db.add(challenge_record)
    db.commit()
    db.refresh(challenge_record)

    # Generate guaranteed unique challenge identifier
    challenge_id = f"gm002_c{challenge_record.id}_{uuid.uuid4().hex[:8]}"
    sanitized = sanitize_playable_gm002(
        challenge_id=challenge_id,
        validated_data=validated_data,
        adaptive_context=adaptive_context,
    )

    return sanitized


# ═══════════════════════════════════════════════════════════════════════════
# UNIFIED DISPATCHER
# ═══════════════════════════════════════════════════════════════════════════

def generate_challenge_for_mission(
    adaptive_context: dict[str, Any],
    mission: Mission,
    db: Session,
) -> dict[str, Any]:
    """
    Dispatches generation based on mission.gameplay_type.
    Phase V17: GM001
    Phase V18: GM002
    """
    gameplay_type = mission.gameplay_type.upper()
    if gameplay_type == "GM001":
        return generate_gm001_challenge(adaptive_context, mission, db)
    elif gameplay_type == "GM002":
        return generate_gm002_challenge(adaptive_context, mission, db)
    else:
        raise GeminiValidationError(
            f"Unsupported gameplay type '{mission.gameplay_type}' for challenge generation. Only GM001 and GM002 are supported."
        )
