"""
Controlled Live Gemini Integration Test (Phase V17)
Performs ONE real invocation of the configured Gemini client and validates the entire pipeline.
DO NOT PRINT API KEYS.
"""

import os
import sys

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

sys.path.insert(0, os.path.abspath("."))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.ai.gemini_client import gemini_client
from app.core.settings import settings
from app.db.base import Base
from app.models.mission import Mission
from app.models.user_performance import UserPerformance
from app.models.user_profile import UserProfile
from app.services.adaptive_selector import select_adaptive_mission_context
from app.services.gemini_question_generator import generate_gm001_challenge
from scripts.seed_curriculum import seed_curriculum


def run_live_test():
    print("==================================================")
    print("STARTING LIVE GEMINI INTEGRATION TEST (PHASE V17)")
    print("==================================================")

    # 1. Check if Gemini API key is configured
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY.strip() in ("", "YOUR_API_KEY", "your_gemini_api_key_here"):
        print("LIVE GEMINI TEST: BLOCKED — GEMINI CONFIGURATION NOT AVAILABLE")
        return False

    # 2. Setup SQLite in-memory test database
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # 3. Seed curriculum
        seed_curriculum(db)
        mission = db.query(Mission).filter(Mission.id == 1).first()
        if not mission:
            print("[FAIL] Mission 1 not found in seeded curriculum")
            return False

        # 4. Create mock profile & performance
        profile = UserProfile(
            user_id=1,
            goal="Placement Exam Prep",
            target_role="Software Engineer",
            skill_level="Intermediate",
            subjects=["Aptitude"],
            difficulty_preference="Adaptive",
        )
        perf = UserPerformance(
            user_id=1,
            topic_id=mission.topic_id,
            gameplay_type="GM001",
            difficulty="MEDIUM",
            total_attempts=6,
            correct_attempts=5,
            accuracy=0.8333,
        )

        # 5. Obtain V16 adaptive context
        adaptive_context = select_adaptive_mission_context(
            mission=mission,
            profile=profile,
            performance=perf,
            db=db,
        )
        print(f"[LIVE] V16 Adaptive Difficulty: {adaptive_context['difficulty']} (Source: {adaptive_context['difficulty_source']})")

        # 6. Perform live Gemini generation
        print("[LIVE] Invoking live Gemini model:", settings.GEMINI_MODEL)
        sanitized = generate_gm001_challenge(
            adaptive_context=adaptive_context,
            mission=mission,
            db=db,
        )

        # 7. Validate sanitized structure
        print("[LIVE] Received response. Validating...")
        assert sanitized["gameplay_type"] == "GM001"
        assert len(sanitized["options"]) == 4
        assert len(sanitized["question"]) > 5
        
        # 8. Security verification: Ensure answer is NOT exposed
        forbidden = ["correctOptionId", "correct_option_id", "answer", "correctAnswer", "solution", "canonicalAnswer"]
        for f in forbidden:
            assert f not in sanitized, f"Security violation: {f} present in root"
            for opt in sanitized["options"]:
                assert f not in opt, f"Security violation: {f} present in option"

        print("[LIVE] Question Generated Successfully:")
        print(f"       Question: {sanitized['question']}")
        print(f"       Options: {[opt['id'] + ': ' + opt['text'] for opt in sanitized['options']]}")
        print(f"       Challenge ID: {sanitized['challenge_id']}")
        print(f"       Security Check: PASS (No answer keys exposed)")
        print("\n==================================================")
        print("LIVE GEMINI TEST: SUCCESS")
        print("==================================================")
        return True

    except Exception as exc:
        print(f"[LIVE FAIL] Live Gemini generation failed: {exc}")
        return False
    finally:
        db.close()


if __name__ == "__main__":
    success = run_live_test()
    if not success:
        sys.exit(1)
