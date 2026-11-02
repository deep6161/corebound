# COREBOUND BACKEND — PHASE 2 REPORT

## Status: COMPLETE ✅

**pytest:** 177 passed, 0 failed  
**alembic upgrade head:** HEAD at `372ab790561d`  
**app import:** OK  
**Canonical answer exposure:** Verified — no answer/mapping/order/accepted_answers in any playable API response  

---

## 1. Gameplay Session Model

**New table:** `gameplay_sessions`

| Column | Type | Description |
|---|---|---|
| id | INTEGER PK | Session identifier |
| user_id | FK → users | Owner |
| mission_id | FK → missions | Mission being played |
| challenge_id | FK → challenges | Generated challenge |
| gameplay_type | VARCHAR(20) | GM001–GM004 (matches mission) |
| difficulty | VARCHAR(20) | EASY/MEDIUM/HARD (adaptive) |
| status | VARCHAR(20) | ACTIVE/COMPLETED/EXPIRED |
| is_correct | BOOLEAN | Null until evaluation |
| score | INTEGER | 0–100, null until evaluation |
| started_at | TIMESTAMP | Session creation time |
| completed_at | TIMESTAMP | Null until completed |

`QuestionAttempt.gameplay_session_id` — migrated from `VARCHAR(100)` to `INTEGER FK → gameplay_sessions.id` (PostgreSQL `USING` clause handled the cast safely)

`RewardEvent.gameplay_session_id` — new `INTEGER FK → gameplay_sessions.id` with `UNIQUE` constraint (DB-level idempotency)

---

## 2. GM001 — Mission Quiz

- Prompt: `PromptBuilder.build_gm001_prompt()` — mission-aware, sci-fi themed
- Validation: `GM001GeneratedContent` — exactly 4 options, answer must be one of options, non-empty question
- Playable response: question + options (answer stripped)
- Evaluation: case-insensitive string comparison

## 3. GM002 — System Assembly

- Prompt: `PromptBuilder.build_gm002_prompt()` — drag objects to slots
- Validation: `GM002GeneratedContent` — exactly 4 objects + 4 slots, canonical_mapping keys match object IDs
- Playable response: objects + slots + instructions (canonical_mapping stripped)
- Evaluation: submitted mapping dict == canonical mapping dict (string-normalized keys/values)

## 4. GM003 — Sequence Builder

- Prompt: `PromptBuilder.build_gm003_prompt()` — arrange items in order
- Validation: `GM003GeneratedContent` — exactly 4 items, canonical_order must contain all item IDs exactly once
- Playable response: items shuffled (canonical_order stripped)
- Evaluation: submitted list == canonical_order list (string-normalized)

## 5. GM004 — Input Answer

- Prompt: `PromptBuilder.build_gm004_prompt()` — typed answer
- Validation: `GM004GeneratedContent` — valid answer_type (text/number/formula), at least 1 accepted answer
- Playable response: question + answer_type (accepted_answers stripped)
- Evaluation: normalize (strip + lowercase) submitted vs all accepted answers; numeric float-parse attempted

---

## 6. Answer Evaluation

**Service:** `app/services/evaluation_service.py` — `AnswerEvaluationService`

- Single `evaluate(gameplay_type, submitted, canonical_content)` dispatcher
- Deterministic — no Gemini involvement
- Returns `EvaluationResult(is_correct, explanation)`
- GM004: safe normalization only (no over-permissive matching)

---

## 7. Reward Engine

**Service:** `app/services/reward_service.py` — `RewardService`

**Constants (documented in service, not in routers):**

| Difficulty | XP |
|---|---|
| EASY | 50 |
| MEDIUM | 100 |
| HARD | 150 |

| Attempt # (correct) | Stars | Credits |
|---|---|---|
| 1st | 3 | 3 |
| 2nd | 2 | 2 |
| ≥3rd | 1 | 1 |
| Incorrect | 0 | 0 |

**Idempotency:** `reward_events.gameplay_session_id` UNIQUE constraint prevents double-reward at DB level. Application layer also skips reward for incorrect answers. `IntegrityError` caught and returned as 409.

---

## 8. Progress Engine

**Service:** `app/services/profile_service.py::unlock_next_missions()` (Phase 1, reused)

- On correct answer: `MissionProgress.status` → COMPLETED
- `stars` = max(previous best, current stars)
- `best_score` = max(previous best, current score)
- `completed_at` = server timestamp
- `unlock_next_missions()` called — sets next mission in sector to AVAILABLE

**Attempt semantics corrected:**
- `POST /missions/{id}/start` → does NOT increment `attempts`
- `POST /gameplay/{session_id}/answer` → increments `attempts` once per submission

---

## 9. Performance Engine

**Service:** `app/services/performance_service.py` — `PerformanceService`

- Upserts `UserPerformance` for `(user_id, topic_id, gameplay_type)`
- Updates: `total_attempts`, `correct_attempts`, `accuracy` (recomputed), `avg_response_ms` (rolling weighted avg), `best_streak`, `last_attempted_at`
- `get_topic_accuracy()` returns `None` if no history (adaptive selector treats None as baseline, not 0%)

---

## 10. Adaptive Difficulty Selector

**Service:** `app/services/adaptive_selector.py` — `AdaptiveGameplaySelector`

| Topic accuracy | Difficulty change |
|---|---|
| None (no history) | Mission baseline — NOT treated as 0% |
| < 40% | One step easier (clamped at EASY) |
| 40%–70% | Mission baseline |
| > 70% | One step harder (clamped at HARD) |

Mission `gameplay_type` is authoritative — selector NEVER changes it.

---

## 11. Security Protections

| Protection | Implementation |
|---|---|
| Canonical GM001 answer not exposed | `answer` key stripped from playable response |
| Canonical GM002 mapping not exposed | `canonical_mapping` stripped |
| Canonical GM003 ordering not exposed | `canonical_order` stripped; items shuffled |
| Canonical GM004 answers not exposed | `accepted_answers` stripped |
| Frontend cannot submit XP/credits/stars | Not in `AnswerSubmitRequest` schema |
| Frontend cannot manipulate rewards | No POST/PATCH reward endpoint |
| Frontend cannot manipulate progress | No progress mutation endpoint |
| Cross-user session access rejected | `session.user_id != user_id` → 403 |
| Completed session duplicate rejection | status == COMPLETED → 409 |
| DB-level reward idempotency | UNIQUE on `reward_events.gameplay_session_id` |

---

## 12. Tests

**Total: 177 passed, 0 failed**

| Test file | Tests | Coverage |
|---|---|---|
| test_adaptive.py | 16 | All boundary conditions |
| test_evaluation.py | 26 | GM001–GM004, dispatch, normalization, malformed |
| test_reward_engine.py | 11 | Constants, stars, XP, profile update, session link |
| test_performance_engine.py | 9 | Upsert, accuracy, rolling avg, streak, get_accuracy |
| test_gameplay_session.py | 23 | Start/answer for all 4 types, security, DB state |
| test_integration.py | 1 | Full 16-step end-to-end pipeline, DB verification |
| Phase 1 tests (79) | 79 | All still passing |

---

## 13. Migration

**Migration:** `372ab790561d_phase2_gameplay_sessions`  
**Chain:** `1101dd0a5b79` → `372ab790561d` (HEAD)

Changes:
- Created `gameplay_sessions` table
- `question_attempts.gameplay_session_id`: `VARCHAR(100)` → `INTEGER FK` (safe USING cast)
- `reward_events.gameplay_session_id`: new INTEGER FK + UNIQUE constraint

---

## 14. Final Verification

```
pytest:         177 passed, 0 failed ✅
alembic:        HEAD at 372ab790561d ✅
app import:     OK ✅
canonical answers not exposed: Verified in test_gameplay_session.py ✅
```

---

## 15. Remaining Issues

| Issue | Status |
|---|---|
| SQLAlchemy `utcnow()` deprecation warnings | Non-critical; pre-existing in Phase 1 Challenge model (uses `datetime.utcnow`) |
| `httpx` / starlette testclient deprecation | Non-critical; upstream dependency issue |
| GM003 shuffle is random per request | Items are shuffled at session start. Client ordering is independent. |

---

**PHASE 2 COMPLETE. Awaiting Phase 3 instructions.**
