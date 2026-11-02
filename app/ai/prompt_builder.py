from app.schemas.request import QuestionRequest


class PromptBuilder:

    @staticmethod
    def build_mcq_prompt(request: QuestionRequest) -> str:
        """Legacy prompt used by /ai/question. Unchanged."""
        return f"""
You are an expert educational content creator.

Generate exactly ONE multiple-choice question.

Subject: {request.subject}
Topic: {request.topic}
Difficulty: {request.difficulty}

Rules:
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include ```json.
- Provide exactly 4 options.
- Only one correct answer.
- Keep explanation under 50 words.

JSON format:

{{
    "question": "",
    "options": [
        "",
        "",
        "",
        ""
    ],
    "answer": "",
    "explanation": ""
}}
"""

    # ──────────────────────────────────────────────
    # Phase 2 & 14C: Mission-aware prompt builders
    # ──────────────────────────────────────────────

    @staticmethod
    def _build_context_additions(
        story_context: str = "",
        user_context: dict | None = None,
        entropy_seed: str | None = None,
        avoid_items: list[str] | None = None,
        variation_directive: str | None = None,
    ) -> str:
        blocks = []
        if story_context:
            blocks.append(f"Story context: {story_context}")

        if user_context:
            user_lines = ["Learner Profile:"]
            if user_context.get("skill_level"):
                user_lines.append(f"- Skill Level: {user_context['skill_level']}")
            if user_context.get("target_role"):
                user_lines.append(f"- Target Role: {user_context['target_role']}")
            if user_context.get("goal"):
                user_lines.append(f"- Primary Goal: {user_context['goal']}")
            if user_context.get("learning_preference"):
                user_lines.append(f"- Learning Preference: {user_context['learning_preference']}")
            if user_context.get("subjects"):
                subj_str = ", ".join(user_context["subjects"]) if isinstance(user_context["subjects"], list) else str(user_context["subjects"])
                user_lines.append(f"- Focus Subjects: {subj_str}")
            if user_context.get("daily_time"):
                user_lines.append(f"- Daily Commitment: {user_context['daily_time']}")
            if user_context.get("accuracy_pct") is not None:
                attempts = user_context.get("total_attempts", 0)
                user_lines.append(f"- Topic Accuracy: {user_context['accuracy_pct']} (Attempts: {attempts})")
            if len(user_lines) > 1:
                blocks.append("\n".join(user_lines))

        if entropy_seed:
            blocks.append(f"Generation Entropy Token: {entropy_seed}\nDiversity Directive: Produce novel expressions, values, and framing distinct from common textbook examples.")

        if variation_directive:
            blocks.append(f"Variation Focus: {variation_directive}")

        if avoid_items:
            avoid_str = ", ".join(avoid_items[:12])
            blocks.append(f"Avoidance Directive: Do NOT repeat these recently used items, expressions, or values: [{avoid_str}]. Generate novel items.")

        return ("\n" + "\n\n".join(blocks) + "\n") if blocks else ""

    @staticmethod
    def build_gm001_prompt(
        topic_name: str,
        subject_name: str,
        difficulty: str,
        story_context: str = "",
        user_context: dict | None = None,
        entropy_seed: str | None = None,
        avoid_items: list[str] | None = None,
        variation_directive: str | None = None,
    ) -> str:
        """
        GM001 — Mission Quiz
        Returns JSON: {question, options[4], answer, explanation}
        """
        context_block = PromptBuilder._build_context_additions(
            story_context=story_context,
            user_context=user_context,
            entropy_seed=entropy_seed,
            avoid_items=avoid_items,
            variation_directive=variation_directive,
        )
        return f"""You are an expert educational content creator for a sci-fi learning game called Corebound.

Generate exactly ONE multiple-choice question for an in-game mission.

Subject: {subject_name}
Topic: {topic_name}
Difficulty: {difficulty}
{context_block}
Rules:
- Return ONLY valid JSON. No markdown. No ```json wrapper.
- Provide exactly 4 distinct options.
- Exactly one option must be the correct answer.
- The "answer" field must be one of the 4 options verbatim.
- Keep explanation under 60 words.
- Frame the question in the Corebound sci-fi universe where appropriate.

JSON format:
{{
    "question": "<question text>",
    "options": ["<option 1>", "<option 2>", "<option 3>", "<option 4>"],
    "answer": "<one of the 4 options, verbatim>",
    "explanation": "<brief explanation>"
}}"""

    @staticmethod
    def build_gm002_prompt(
        topic_name: str,
        subject_name: str,
        difficulty: str,
        story_context: str = "",
        user_context: dict | None = None,
        entropy_seed: str | None = None,
        avoid_items: list[str] | None = None,
        variation_directive: str | None = None,
    ) -> str:
        """
        GM002 — System Assembly
        Returns JSON: {objects[{id, label}], slots[{id, label}], canonical_mapping{obj_id: slot_id}, instructions, explanation}
        """
        context_block = PromptBuilder._build_context_additions(
            story_context=story_context,
            user_context=user_context,
            entropy_seed=entropy_seed,
            avoid_items=avoid_items,
            variation_directive=variation_directive,
        )
        return f"""You are an expert educational content creator for a sci-fi learning game called Corebound.

Generate a SYSTEM ASSEMBLY challenge for an in-game mission.
The player must drag objects into the correct slots.

Subject: {subject_name}
Topic: {topic_name}
Difficulty: {difficulty}
{context_block}
Rules:
- Return ONLY valid JSON. No markdown. No ```json wrapper.
- Provide exactly 4 objects and exactly 4 slots.
- CRITICAL UNIQUENESS: ALL 4 OBJECT LABELS MUST BE UNIQUE, AND ALL 4 SLOT LABELS MUST BE UNIQUE.
- NEVER generate two mathematically equivalent values that result in duplicate slot labels (e.g. NEVER two slots with identical fractions like '1/6', or identical powers like '2⁶', or identical expressions).
- Each object must map to exactly one unique slot (strict one-to-one bijection).
- "canonical_mapping" maps object id (string) to slot id (string).
- IDs should be simple strings like "obj1", "slot1".
- Keep instructions under 50 words.
- Keep explanation under 60 words.
- Ensure all 4 pairings are mathematically and conceptually sound and distinct.

JSON format:
{{
    "objects": [
        {{"id": "obj1", "label": "<label>"}},
        {{"id": "obj2", "label": "<label>"}},
        {{"id": "obj3", "label": "<label>"}},
        {{"id": "obj4", "label": "<label>"}}
    ],
    "slots": [
        {{"id": "slot1", "label": "<label>"}},
        {{"id": "slot2", "label": "<label>"}},
        {{"id": "slot3", "label": "<label>"}},
        {{"id": "slot4", "label": "<label>"}}
    ],
    "canonical_mapping": {{"obj1": "slot1", "obj2": "slot2", "obj3": "slot3", "obj4": "slot4"}},
    "instructions": "<instructions for the player>",
    "explanation": "<brief explanation of the correct mapping>"
}}"""

    @staticmethod
    def build_gm003_prompt(
        topic_name: str,
        subject_name: str,
        difficulty: str,
        story_context: str = "",
        user_context: dict | None = None,
        entropy_seed: str | None = None,
        avoid_items: list[str] | None = None,
        variation_directive: str | None = None,
    ) -> str:
        """
        GM003 — Sequence Builder
        Returns JSON: {items[{id, label}], canonical_order[ids], instructions, explanation}
        """
        context_block = PromptBuilder._build_context_additions(
            story_context=story_context,
            user_context=user_context,
            entropy_seed=entropy_seed,
            avoid_items=avoid_items,
            variation_directive=variation_directive,
        )
        return f"""You are an expert educational content creator for a sci-fi learning game called Corebound.

Generate a SEQUENCE BUILDER challenge for an in-game mission.
The player must arrange items in the correct order.

Subject: {subject_name}
Topic: {topic_name}
Difficulty: {difficulty}
{context_block}
Rules:
- Return ONLY valid JSON. No markdown. No ```json wrapper.
- Provide exactly 4 items.
- "canonical_order" lists the item ids in the correct order.
- IDs should be simple strings like "item1".
- Keep instructions under 50 words.
- Keep explanation under 60 words.

JSON format:
{{
    "items": [
        {{"id": "item1", "label": "<label>"}},
        {{"id": "item2", "label": "<label>"}},
        {{"id": "item3", "label": "<label>"}},
        {{"id": "item4", "label": "<label>"}}
    ],
    "canonical_order": ["<id>", "<id>", "<id>", "<id>"],
    "instructions": "<instructions for the player>",
    "explanation": "<brief explanation of the correct order>"
}}"""

    @staticmethod
    def build_gm004_prompt(
        topic_name: str,
        subject_name: str,
        difficulty: str,
        story_context: str = "",
        user_context: dict | None = None,
        entropy_seed: str | None = None,
        avoid_items: list[str] | None = None,
        variation_directive: str | None = None,
    ) -> str:
        """
        GM004 — Input Answer
        Returns JSON: {question, answer_type, accepted_answers[str], explanation}
        """
        context_block = PromptBuilder._build_context_additions(
            story_context=story_context,
            user_context=user_context,
            entropy_seed=entropy_seed,
            avoid_items=avoid_items,
            variation_directive=variation_directive,
        )
        return f"""You are an expert educational content creator for a sci-fi learning game called Corebound.

Generate an INPUT ANSWER challenge for an in-game mission.
The player must type the correct answer.

Subject: {subject_name}
Topic: {topic_name}
Difficulty: {difficulty}
{context_block}
Rules:
- Return ONLY valid JSON. No markdown. No ```json wrapper.
- "accepted_answers" must be a list of 1-3 strings, all of which are correct.
- Include common abbreviations or alternate spellings as accepted answers where appropriate.
- "answer_type" must be one of: "text", "number", "formula".
- Keep explanation under 60 words.

JSON format:
{{
    "question": "<question text requiring a typed answer>",
    "answer_type": "<text|number|formula>",
    "accepted_answers": ["<primary answer>"],
    "explanation": "<brief explanation>"
}}"""