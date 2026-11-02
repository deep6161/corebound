"""Tests for AnswerEvaluationService — deterministic, no DB or Gemini needed."""
import json
import pytest

from app.services.evaluation_service import (
    evaluate,
    evaluate_gm001,
    evaluate_gm002,
    evaluate_gm003,
    evaluate_gm004,
)
from app.models.mission import GAMEPLAY_GM001, GAMEPLAY_GM002, GAMEPLAY_GM003, GAMEPLAY_GM004


# ──────────────────────────────────────────────
# GM001
# ──────────────────────────────────────────────

class TestGM001Evaluation:
    CANONICAL = {
        "question": "What is 2+2?",
        "options": ["3", "4", "5", "6"],
        "answer": "4",
        "explanation": "Basic addition.",
    }

    def test_correct_answer(self):
        result = evaluate_gm001("4", self.CANONICAL)
        assert result.is_correct is True

    def test_incorrect_answer(self):
        result = evaluate_gm001("3", self.CANONICAL)
        assert result.is_correct is False

    def test_case_insensitive(self):
        canon = {**self.CANONICAL, "answer": "Paris"}
        result = evaluate_gm001("paris", canon)
        assert result.is_correct is True

    def test_whitespace_trimmed(self):
        result = evaluate_gm001("  4  ", self.CANONICAL)
        assert result.is_correct is True

    def test_empty_answer(self):
        result = evaluate_gm001("", self.CANONICAL)
        assert result.is_correct is False

    def test_explanation_returned(self):
        result = evaluate_gm001("4", self.CANONICAL)
        assert result.explanation == "Basic addition."

    def test_dispatch_gm001(self):
        result = evaluate(GAMEPLAY_GM001, "4", self.CANONICAL)
        assert result.is_correct is True


# ──────────────────────────────────────────────
# GM002
# ──────────────────────────────────────────────

class TestGM002Evaluation:
    CANONICAL = {
        "objects": [{"id": "obj1", "label": "A"}, {"id": "obj2", "label": "B"},
                    {"id": "obj3", "label": "C"}, {"id": "obj4", "label": "D"}],
        "slots": [{"id": "slot1", "label": "X"}, {"id": "slot2", "label": "Y"},
                  {"id": "slot3", "label": "Z"}, {"id": "slot4", "label": "W"}],
        "canonical_mapping": {"obj1": "slot1", "obj2": "slot2", "obj3": "slot3", "obj4": "slot4"},
        "instructions": "Map objects to slots.",
        "explanation": "Correct mapping.",
    }

    def test_correct_mapping_dict(self):
        submitted = {"obj1": "slot1", "obj2": "slot2", "obj3": "slot3", "obj4": "slot4"}
        result = evaluate_gm002(submitted, self.CANONICAL)
        assert result.is_correct is True

    def test_correct_mapping_json_string(self):
        submitted = json.dumps({"obj1": "slot1", "obj2": "slot2", "obj3": "slot3", "obj4": "slot4"})
        result = evaluate_gm002(submitted, self.CANONICAL)
        assert result.is_correct is True

    def test_incorrect_mapping(self):
        submitted = {"obj1": "slot2", "obj2": "slot1", "obj3": "slot3", "obj4": "slot4"}
        result = evaluate_gm002(submitted, self.CANONICAL)
        assert result.is_correct is False

    def test_malformed_json_string(self):
        result = evaluate_gm002("not-json", self.CANONICAL)
        assert result.is_correct is False

    def test_wrong_type(self):
        result = evaluate_gm002("just a string", self.CANONICAL)
        assert result.is_correct is False

    def test_dispatch_gm002(self):
        submitted = json.dumps({"obj1": "slot1", "obj2": "slot2", "obj3": "slot3", "obj4": "slot4"})
        result = evaluate(GAMEPLAY_GM002, submitted, self.CANONICAL)
        assert result.is_correct is True


# ──────────────────────────────────────────────
# GM003
# ──────────────────────────────────────────────

class TestGM003Evaluation:
    CANONICAL = {
        "items": [{"id": "item1", "label": "A"}, {"id": "item2", "label": "B"},
                  {"id": "item3", "label": "C"}, {"id": "item4", "label": "D"}],
        "canonical_order": ["item1", "item2", "item3", "item4"],
        "instructions": "Order the items.",
        "explanation": "Correct order.",
    }

    def test_correct_order_list(self):
        result = evaluate_gm003(["item1", "item2", "item3", "item4"], self.CANONICAL)
        assert result.is_correct is True

    def test_correct_order_json_string(self):
        submitted = json.dumps(["item1", "item2", "item3", "item4"])
        result = evaluate_gm003(submitted, self.CANONICAL)
        assert result.is_correct is True

    def test_incorrect_order(self):
        result = evaluate_gm003(["item4", "item3", "item2", "item1"], self.CANONICAL)
        assert result.is_correct is False

    def test_partially_correct_order(self):
        result = evaluate_gm003(["item1", "item3", "item2", "item4"], self.CANONICAL)
        assert result.is_correct is False

    def test_malformed_json_string(self):
        result = evaluate_gm003("not-json", self.CANONICAL)
        assert result.is_correct is False

    def test_dispatch_gm003(self):
        submitted = json.dumps(["item1", "item2", "item3", "item4"])
        result = evaluate(GAMEPLAY_GM003, submitted, self.CANONICAL)
        assert result.is_correct is True


# ──────────────────────────────────────────────
# GM004
# ──────────────────────────────────────────────

class TestGM004Evaluation:
    CANONICAL_TEXT = {
        "question": "What is the capital of France?",
        "answer_type": "text",
        "accepted_answers": ["Paris", "paris"],
        "explanation": "France's capital is Paris.",
    }
    CANONICAL_NUM = {
        "question": "What is 2+2?",
        "answer_type": "number",
        "accepted_answers": ["4"],
        "explanation": "2+2=4.",
    }

    def test_exact_match(self):
        result = evaluate_gm004("Paris", self.CANONICAL_TEXT)
        assert result.is_correct is True

    def test_case_insensitive_match(self):
        result = evaluate_gm004("PARIS", self.CANONICAL_TEXT)
        assert result.is_correct is True

    def test_trimmed_whitespace_match(self):
        result = evaluate_gm004("  paris  ", self.CANONICAL_TEXT)
        assert result.is_correct is True

    def test_incorrect_answer(self):
        result = evaluate_gm004("London", self.CANONICAL_TEXT)
        assert result.is_correct is False

    def test_numeric_match(self):
        result = evaluate_gm004("4", self.CANONICAL_NUM)
        assert result.is_correct is True

    def test_numeric_float_match(self):
        result = evaluate_gm004("4.0", self.CANONICAL_NUM)
        assert result.is_correct is True

    def test_incorrect_numeric(self):
        result = evaluate_gm004("5", self.CANONICAL_NUM)
        assert result.is_correct is False

    def test_empty_not_accepted(self):
        result = evaluate_gm004("", self.CANONICAL_TEXT)
        assert result.is_correct is False

    def test_dispatch_gm004(self):
        result = evaluate(GAMEPLAY_GM004, "Paris", self.CANONICAL_TEXT)
        assert result.is_correct is True

    def test_explanation_returned_on_correct(self):
        result = evaluate_gm004("Paris", self.CANONICAL_TEXT)
        assert "Paris" in result.explanation or "capital" in result.explanation.lower()


# ──────────────────────────────────────────────
# Unknown gameplay type
# ──────────────────────────────────────────────

def test_unknown_gameplay_type_returns_incorrect():
    result = evaluate("GM999", "anything", {})
    assert result.is_correct is False
