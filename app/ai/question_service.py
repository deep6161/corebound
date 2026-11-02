import json

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.ai.gemini_client import gemini_client
from app.ai.prompt_builder import PromptBuilder
from app.models.challenge import Challenge
from app.models.subject import Subject
from app.models.topic import Topic
from app.schemas.request import QuestionRequest
from app.schemas.response import QuestionResponse
from app.core.gameplay import GM001


class QuestionService:

    @staticmethod
    def generate_question(
        request: QuestionRequest,
        db: Session,
    ) -> QuestionResponse:

        # 1. Find the subject
        subject = (
            db.query(Subject)
            .filter(Subject.name == request.subject)
            .first()
        )

        if not subject:
            raise HTTPException(
                status_code=404,
                detail=f"Subject '{request.subject}' not found.",
            )

        # 2. Find the topic
        topic = (
            db.query(Topic)
            .filter(
                Topic.subject_id == subject.id,
                Topic.name == request.topic,
            )
            .first()
        )

        if not topic:
            raise HTTPException(
                status_code=404,
                detail=f"Topic '{request.topic}' not found for subject '{request.subject}'.",
            )

        # 3. Build AI prompt
        prompt = PromptBuilder.build_mcq_prompt(request)

        # 4. Ask Gemini
        try:
            response = gemini_client.generate(prompt)

        except Exception as e:
            print(f"Gemini API Error: {e}")

            raise HTTPException(
                status_code=502,
                detail="Unable to generate question from AI service.",
            )

        # 5. Check AI response
        if not response or not response.strip():
            raise HTTPException(
                status_code=502,
                detail="AI returned an empty response.",
            )

        # 6. Convert JSON text to Python
        try:
            data = json.loads(response)

        except json.JSONDecodeError:
            print(f"Invalid Gemini JSON: {response}")

            raise HTTPException(
                status_code=502,
                detail="AI returned an invalid question format.",
            )

        # 7. Validate AI response
        try:
            question = QuestionResponse(**data)

        except Exception as e:
            print(f"Question validation error: {e}")

            raise HTTPException(
                status_code=502,
                detail="AI generated an invalid question.",
            )

        # 8. Prepare challenge content
        challenge_content = json.dumps(
            {
                "question": question.question,
                "options": question.options,
                "answer": question.answer,
            }
        )

        # 9. Save challenge
        challenge = Challenge(
            topic_id=topic.id,
            gameplay_type=GM001,
            difficulty=request.difficulty,
            content=challenge_content,
            explanation=question.explanation,
            ai_generated=True,
            validated=True,
        )

        db.add(challenge)
        db.commit()
        db.refresh(challenge)

        # 10. Return generated question
        return question