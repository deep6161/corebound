"""Tests for AdaptiveGameplaySelector — deterministic, no DB needed."""
import pytest

from app.services.adaptive_selector import select_difficulty
from app.models.mission import DIFFICULTY_EASY, DIFFICULTY_MEDIUM, DIFFICULTY_HARD


class TestSelectDifficulty:
    """All boundary conditions from the Phase 2 spec."""

    # No history → baseline
    def test_no_history_easy_baseline(self):
        assert select_difficulty(DIFFICULTY_EASY, None) == DIFFICULTY_EASY

    def test_no_history_medium_baseline(self):
        assert select_difficulty(DIFFICULTY_MEDIUM, None) == DIFFICULTY_MEDIUM

    def test_no_history_hard_baseline(self):
        assert select_difficulty(DIFFICULTY_HARD, None) == DIFFICULTY_HARD

    # accuracy < 40% → one step easier
    def test_easy_weak_clamps_to_easy(self):
        assert select_difficulty(DIFFICULTY_EASY, 0.20) == DIFFICULTY_EASY

    def test_medium_weak_goes_to_easy(self):
        assert select_difficulty(DIFFICULTY_MEDIUM, 0.39) == DIFFICULTY_EASY

    def test_hard_weak_goes_to_medium(self):
        assert select_difficulty(DIFFICULTY_HARD, 0.10) == DIFFICULTY_MEDIUM

    # 40%–70% inclusive → baseline
    def test_easy_average_stays(self):
        assert select_difficulty(DIFFICULTY_EASY, 0.40) == DIFFICULTY_EASY

    def test_medium_average_stays(self):
        assert select_difficulty(DIFFICULTY_MEDIUM, 0.55) == DIFFICULTY_MEDIUM

    def test_hard_average_stays(self):
        assert select_difficulty(DIFFICULTY_HARD, 0.70) == DIFFICULTY_HARD

    def test_exact_lower_boundary_stays(self):
        assert select_difficulty(DIFFICULTY_MEDIUM, 0.40) == DIFFICULTY_MEDIUM

    def test_exact_upper_boundary_stays(self):
        assert select_difficulty(DIFFICULTY_MEDIUM, 0.70) == DIFFICULTY_MEDIUM

    # accuracy > 70% → one step harder
    def test_easy_strong_goes_to_medium(self):
        assert select_difficulty(DIFFICULTY_EASY, 0.71) == DIFFICULTY_MEDIUM

    def test_medium_strong_goes_to_hard(self):
        assert select_difficulty(DIFFICULTY_MEDIUM, 0.90) == DIFFICULTY_HARD

    def test_hard_strong_clamps_to_hard(self):
        assert select_difficulty(DIFFICULTY_HARD, 0.95) == DIFFICULTY_HARD

    # Edge: zero accuracy (has history but all wrong) → easier
    def test_zero_accuracy_medium_goes_to_easy(self):
        assert select_difficulty(DIFFICULTY_MEDIUM, 0.0) == DIFFICULTY_EASY

    # Edge: perfect accuracy → harder
    def test_perfect_accuracy_medium_goes_to_hard(self):
        assert select_difficulty(DIFFICULTY_MEDIUM, 1.0) == DIFFICULTY_HARD
