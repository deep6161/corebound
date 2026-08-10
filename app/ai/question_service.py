import json

from app.ai.gemini_client import gemini_client
from app.ai.prompt_builder import PromptBuilder
from app.schemas.request import QuestionRequest
from app.schemas.response import QuestionResponse


class QuestionService:

    @staticmethod
    def generate_question(request: QuestionRequest) -> QuestionResponse:
        # Build prompt
        prompt = PromptBuilder.build_mcq_prompt(request)

        # Generate response from Gemini
        response = gemini_client.generate(prompt)

        # Convert JSON string to Python dictionary
        data = json.loads(response)

        # Convert dictionary to Pydantic model
        return QuestionResponse(**data)