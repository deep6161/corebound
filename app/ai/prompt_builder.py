from app.schemas.request import QuestionRequest


class PromptBuilder:

    @staticmethod
    def build_mcq_prompt(request: QuestionRequest) -> str:
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