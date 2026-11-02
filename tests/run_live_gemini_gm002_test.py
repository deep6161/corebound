"""
Controlled Live Gemini Integration Test for GM002 (Phase V18)
Performs ONE real invocation of the configured Gemini client for Mission 3.
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
from app.models.challenge import Challenge
from app.models.mission import Mission
from app.models.user_performance import UserPerformance
from app.models.user_profile import UserProfile
from app.services.adaptive_selector import select_adaptive_mission_context
from app.services.gemini_question_generator import generate_gm002_challenge
from scripts.seed_curriculum import seed_curriculum


def run_live_gm002_test():
    print("==================================================")
    print("STARTING LIVE GEMINI GM002 INTEGRATION TEST (PHASE V18)")
    print("==================================================")

    # 1. Check if Gemini API key is configured
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY.strip() in ("", "YOUR_API_KEY", "your_gemini_api_key_here"):
        print("LIVE GEMINI TEST: NOT RUN — GEMINI_API_KEY unavailable")
        return False

    # 2. Setup SQLite in-memory test database
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # 3. Seed curriculum
        seed_curriculum(db)
        mission = db.query(Mission).filter(Mission.id == 3).first()
        if not mission:
            print("[FAIL] Mission 3 not found in seeded curriculum")
            return False

        # 4. Create mock profile & performance
        profile = UserProfile(
            user_id=1,
            goal="Data Engineering",
            target_role="Platform Engineer",
            skill_level="Intermediate",
            subjects=["Aptitude"],
            difficulty_preference="Adaptive",
        )
        perf = UserPerformance(
            user_id=1,
            topic_id=mission.topic_id,
            gameplay_type="GM002",
            difficulty="MEDIUM",
            total_attempts=8,
            correct_attempts=7,
            accuracy=0.875,
        )

        # 5. Obtain V16 adaptive context
        adaptive_context = select_adaptive_mission_context(
            mission=mission,
            profile=profile,
            performance=perf,
            db=db,
        )
        print(f"[LIVE] Mission: {mission.title} ({mission.gameplay_type})")
        print(f"[LIVE] V16 Adaptive Difficulty: {adaptive_context['difficulty']} (Source: {adaptive_context['difficulty_source']})")

        # 6. Perform live Gemini generation
        print("[LIVE] Invoking live Gemini model:", settings.GEMINI_MODEL)
        sanitized = generate_gm002_challenge(
            adaptive_context=adaptive_context,
            mission=mission,
            db=db,
        )

        # 7. Validate sanitized structure
        print("[LIVE] Received response. Validating...")
        assert sanitized["gameplay_type"] == "GM002"
        assert 3 <= len(sanitized["objects"]) <= 8, f"Object count {len(sanitized['objects'])} out of bounds"
        assert 3 <= len(sanitized["slots"]) <= 8, f"Slot count {len(sanitized['slots'])} out of bounds"
        assert len(sanitized["instruction"]) > 5

        # 8. Verify challenge persistence in DB
        db_record = db.query(Challenge).filter(Challenge.gameplay_type == "GM002").order_by(Challenge.id.desc()).first()
        assert db_record is not None, "Challenge record must be saved in database"
        assert db_record.ai_generated is True
        assert db_record.validated is True

        # 9. Security verification: Ensure mapping/answers are NOT exposed
        forbidden = [
            "correctMapping", "canonicalMapping", "canonical_mapping", "correct_mapping",
            "answerMap", "solution", "solutions", "answer", "correctAnswer", "correctAnswers",
            "mapping", "solutionMap", "expectedPairs", "expectedMapping", "correctSlot", "correctSlotId", "answerKey"
        ]
        for f in forbidden:
            assert f not in sanitized, f"Security violation: '{f}' present in root"
            for obj in sanitized["objects"]:
                assert f not in obj, f"Security violation: '{f}' present in object"
            for slot in sanitized["slots"]:
                assert f not in slot, f"Security violation: '{f}' present in slot"

        print("[LIVE] GM002 Challenge Generated Successfully:")
        print(f"       Instruction: {sanitized['instruction']}")
        print(f"       Objects ({len(sanitized['objects'])}): {[o['id'] + ': ' + o['text'] for o in sanitized['objects']]}")
        print(f"       Slots ({len(sanitized['slots'])}): {[s['id'] + ': ' + s['label'] for s in sanitized['slots']]}")
        print(f"       Challenge ID: {sanitized['challenge_id']}")
        print(f"       Security Check: PASS (No canonical mapping or answer keys exposed)")
        print("\n==================================================")
        print("LIVE GEMINI GM002 TEST: SUCCESS")
        print("==================================================")
        return True

    except Exception as exc:
        print(f"[LIVE FAIL] Live Gemini GM002 generation failed: {exc}")
        return False
    finally:
        db.close()


if __name__ == "__main__":
    success = run_live_gm002_test()
    if not success:
        sys.exit(1)
