"""
Phase 14C Tests: Dynamic Question Personalization + Gemini Diversity.

Verifies:
1. User-context-aware prompt construction (learner profile, goals, skill level).
2. Controlled entropy tokens and diversity directives in PromptBuilder.
3. Previous challenge item avoidance.
4. GM002 curriculum-aligned sub-pattern variation.
5. User isolation and context separation.
6. Preservation of active session reuse (no regeneration on refresh).
7. Strict answer sanitization (no answer keys or user profile leak).
"""

import json
from unittest.mock import MagicMock, patch
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.ai.prompt_builder import PromptBuilder
from app.core.security import create_access_token
from app.models.challenge import Challenge
from app.models.gameplay_session import GameplaySession, SESSION_ACTIVE, SESSION_COMPLETED
from app.models.mission import Mission, GAMEPLAY_GM001, GAMEPLAY_GM002, GAMEPLAY_GM003, GAMEPLAY_GM004
from app.models.mission_progress import (
    MissionProgress,
    STATUS_AVAILABLE,
    STATUS_IN_PROGRESS,
    STATUS_COMPLETED as MISSION_COMPLETED,
)
from app.models.story import Story, Chapter, Sector
from app.models.subject import Subject
from app.models.topic import Topic
from app.models.user import User
from app.models.user_performance import UserPerformance
from app.models.user_profile import UserProfile
from app.services.gameplay_service import (
    _get_recent_challenge_avoid_items,
    _load_user_context,
    _pick_variation_directive,
    start_gameplay_session,
)


# ==============================================================================
# 1. PromptBuilder Unit Tests
# ==============================================================================

class TestPromptBuilderDiversity:

    def test_prompt_builder_backward_compatibility(self):
        """PromptBuilder still works with legacy 4-argument call signature."""
        prompt = PromptBuilder.build_gm002_prompt(
            topic_name="Simplification",
            subject_name="Quantitative Aptitude",
            difficulty="MEDIUM",
            story_context="Sector: Chrono",
        )
        assert "Topic: Simplification" in prompt
        assert "Difficulty: MEDIUM" in prompt
        assert "Story context: Sector: Chrono" in prompt
        assert "Learner Profile:" not in prompt

    def test_prompt_builder_user_context_injection(self):
        """Learner profile fields appear cleanly in the prompt."""
        user_context = {
            "skill_level": "Beginner",
            "target_role": "Software Developer",
            "goal": "Competitive Programming",
            "learning_preference": "Story-driven",
            "subjects": ["Aptitude & Logic", "Calculus"],
            "daily_time": "30 minutes",
            "accuracy_pct": "75.0%",
            "total_attempts": 8,
        }
        prompt = PromptBuilder.build_gm002_prompt(
            topic_name="Simplification",
            subject_name="Quantitative Aptitude",
            difficulty="EASY",
            user_context=user_context,
        )
        assert "Learner Profile:" in prompt
        assert "Skill Level: Beginner" in prompt
        assert "Target Role: Software Developer" in prompt
        assert "Primary Goal: Competitive Programming" in prompt
        assert "Learning Preference: Story-driven" in prompt
        assert "Focus Subjects: Aptitude & Logic, Calculus" in prompt
        assert "Daily Commitment: 30 minutes" in prompt
        assert "Topic Accuracy: 75.0% (Attempts: 8)" in prompt

    def test_prompt_builder_entropy_token(self):
        """Entropy seed token is included to ensure Gemini generation diversity."""
        prompt = PromptBuilder.build_gm002_prompt(
            topic_name="Simplification",
            subject_name="Quantitative Aptitude",
            difficulty="MEDIUM",
            entropy_seed="seed_abc123",
        )
        assert "Generation Entropy Token: seed_abc123" in prompt
        assert "Diversity Directive:" in prompt

    def test_prompt_builder_avoidance_directive(self):
        """Avoid items are formatted into the prompt to prevent repetitive questions."""
        avoid = ["12/18", "15/25", "14/21", "16/24"]
        prompt = PromptBuilder.build_gm002_prompt(
            topic_name="Simplification",
            subject_name="Quantitative Aptitude",
            difficulty="MEDIUM",
            avoid_items=avoid,
        )
        assert "Avoidance Directive:" in prompt
        assert "12/18" in prompt
        assert "15/25" in prompt

    def test_prompt_builder_variation_directive(self):
        """Variation focus directive is present in the prompt."""
        directive = "Radical and Square Root Simplification: Pair 4 square root expressions."
        prompt = PromptBuilder.build_gm002_prompt(
            topic_name="Simplification",
            subject_name="Quantitative Aptitude",
            difficulty="MEDIUM",
            variation_directive=directive,
        )
        assert "Variation Focus: Radical and Square Root Simplification" in prompt


# ==============================================================================
# 2. Sub-Pattern & Context Helpers
# ==============================================================================

class TestContextAndSubPatterns:

    def test_gm002_simplification_sub_patterns(self):
        """_pick_variation_directive returns valid educational sub-patterns for Simplification."""
        seen_patterns = set()
        for _ in range(50):
            directive = _pick_variation_directive("Simplification", GAMEPLAY_GM002, "MEDIUM")
            assert any(k in directive for k in [
                "Fraction Reduction",
                "Percentage & Decimal",
                "Algebraic Like-Term",
                "Exponent and Power",
                "Radical and Square Root",
            ])
            seen_patterns.add(directive.split(":")[0])
        # Ensure multiple distinct patterns are available
        assert len(seen_patterns) >= 3

    def test_load_user_context_from_db(self, db_session: Session):
        """_load_user_context queries existing UserProfile and UserPerformance."""
        # Create test user
        user = User(email="test_user_ctx@corebound.com", password_hash="dummy")
        db_session.add(user)
        db_session.flush()

        profile = UserProfile(
            user_id=user.id,
            skill_level="Advanced",
            target_role="Data Scientist",
            goal="Interview Preparation",
            learning_preference="Practical/Hands-on",
            subjects=["Quantitative Aptitude", "Data Structures"],
            daily_time="45 minutes",
        )
        db_session.add(profile)

        # Create topic & performance
        topic = Topic(name="Simplification_Test_Ctx", subject_id=1)
        db_session.add(topic)
        db_session.flush()

        perf = UserPerformance(
            user_id=user.id,
            topic_id=topic.id,
            gameplay_type=GAMEPLAY_GM002,
            total_attempts=5,
            correct_attempts=4,
            accuracy=0.80,
            best_streak=3,
        )
        db_session.add(perf)
        db_session.commit()

        ctx = _load_user_context(user.id, topic.id, GAMEPLAY_GM002, db_session)
        assert ctx["skill_level"] == "Advanced"
        assert ctx["target_role"] == "Data Scientist"
        assert ctx["goal"] == "Interview Preparation"
        assert ctx["learning_preference"] == "Practical/Hands-on"
        assert ctx["subjects"] == ["Quantitative Aptitude", "Data Structures"]
        assert ctx["daily_time"] == "45 minutes"
        assert ctx["accuracy_pct"] == "80.0%"
        assert ctx["total_attempts"] == 5

    def test_get_recent_challenge_avoid_items(self, db_session: Session):
        """_get_recent_challenge_avoid_items extracts previous object labels."""
        user = User(email="test_avoid_user@corebound.com", password_hash="dummy")
        db_session.add(user)
        db_session.flush()

        topic = Topic(name="Simplification_Avoid", subject_id=1)
        db_session.add(topic)
        db_session.flush()

        content = json.dumps({
            "objects": [{"id": "obj1", "label": "24/36"}, {"id": "obj2", "label": "35/84"}],
            "slots": [{"id": "slot1", "label": "2/3"}, {"id": "slot2", "label": "5/12"}],
            "canonical_mapping": {"obj1": "slot1", "obj2": "slot2"},
            "instructions": "Match",
            "explanation": "Exp",
        })
        challenge = Challenge(
            topic_id=topic.id,
            gameplay_type=GAMEPLAY_GM002,
            difficulty="MEDIUM",
            content=content,
            ai_generated=True,
            validated=True,
        )
        db_session.add(challenge)
        db_session.flush()

        # Session with challenge
        session = GameplaySession(
            user_id=user.id,
            mission_id=1,
            challenge_id=challenge.id,
            gameplay_type=GAMEPLAY_GM002,
            difficulty="MEDIUM",
            status=SESSION_COMPLETED,
        )
        db_session.add(session)
        db_session.commit()

        avoid = _get_recent_challenge_avoid_items(user.id, topic.id, db_session)
        assert "24/36" in avoid
        assert "35/84" in avoid


# ==============================================================================
# 3. Active Session Reuse & Answer Security
# ==============================================================================

class TestSessionReuseAndSecurity:

    def test_active_session_reused_without_gemini_call(self, client: TestClient, db_session: Session):
        """Refreshing or repeating start for an active mission reuses session without calling Gemini."""
        user = User(email="reuse_test_user@corebound.com", password_hash="dummy")
        db_session.add(user)
        db_session.flush()

        # Set up story and mission
        story = Story(title="S_Reuse")
        db_session.add(story)
        db_session.flush()
        chapter = Chapter(story_id=story.id, title="C_Reuse", order_index=9)
        db_session.add(chapter)
        db_session.flush()
        sector = Sector(chapter_id=chapter.id, title="Sec_Reuse", order_index=9)
        db_session.add(sector)
        db_session.flush()
        subject = Subject(name="QA_Reuse")
        db_session.add(subject)
        db_session.flush()
        topic = Topic(name="Simplification_Reuse", subject_id=subject.id)
        db_session.add(topic)
        db_session.flush()

        mission = Mission(
            sector_id=sector.id,
            topic_id=topic.id,
            title="M_Reuse",
            order_index=1,
            gameplay_type=GAMEPLAY_GM002,
            difficulty="MEDIUM",
            is_active=True,
        )
        db_session.add(mission)
        db_session.flush()

        progress = MissionProgress(
            user_id=user.id,
            mission_id=mission.id,
            status=STATUS_AVAILABLE,
        )
        db_session.add(progress)
        db_session.commit()

        gemini_mock_output = json.dumps({
            "objects": [{"id": "obj1", "label": "A"}, {"id": "obj2", "label": "B"}, {"id": "obj3", "label": "C"}, {"id": "obj4", "label": "D"}],
            "slots": [{"id": "slot1", "label": "1"}, {"id": "slot2", "label": "2"}, {"id": "slot3", "label": "3"}, {"id": "slot4", "label": "4"}],
            "canonical_mapping": {"obj1": "slot1", "obj2": "slot2", "obj3": "slot3", "obj4": "slot4"},
            "instructions": "Match items",
            "explanation": "Explanation",
        })

        token = create_access_token(subject=user.id)
        headers = {"Authorization": f"Bearer {token}"}

        with patch("app.services.gameplay_service.gemini_client.generate", return_value=gemini_mock_output) as mock_gemini:
            # First start: calls Gemini
            res1 = client.post("/api/v1/gameplay/start", json={"mission_id": mission.id}, headers=headers)
            assert res1.status_code == 201
            data1 = res1.json()
            session_id_1 = data1["session_id"]
            assert mock_gemini.call_count == 1

            # Second start (refresh): reuses session, ZERO new Gemini calls
            res2 = client.post("/api/v1/gameplay/start", json={"mission_id": mission.id}, headers=headers)
            assert res2.status_code == 201
            data2 = res2.json()
            assert data2["session_id"] == session_id_1
            assert mock_gemini.call_count == 1  # Still 1!

            # Security verification: no canonical answer or mapping in playable response
            playable = data2["playable"]
            assert "canonical_mapping" not in playable["content"]
            assert "canonical_order" not in playable["content"]
            assert "answer" not in playable["content"]
            assert "accepted_answers" not in playable["content"]
            assert "user_context" not in playable
            assert "profile" not in playable
