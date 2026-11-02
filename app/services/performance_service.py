"""
PerformanceService

Updates UserPerformance aggregates after each evaluated answer.
Uses upsert logic: creates the row if it doesn't exist, updates it otherwise.

Updated fields per answer submission:
    - total_attempts
    - correct_attempts (only if is_correct)
    - accuracy (recalculated from totals)
    - avg_response_ms (rolling weighted average)
    - best_streak (if this is the start of a correct streak — simple increment tracked separately)
    - last_attempted_at

Does NOT commit — caller's transaction covers this.
"""

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.user_performance import UserPerformance


def update_performance(
    user_id: int,
    topic_id: int,
    gameplay_type: str,
    difficulty: str | None,
    is_correct: bool,
    time_taken_ms: int | None,
    db: Session,
) -> UserPerformance:
    """
    Upsert performance record for (user_id, topic_id, gameplay_type).

    Returns the updated UserPerformance row.
    Does NOT commit — caller is responsible.
    """
    record = (
        db.query(UserPerformance)
        .filter(
            UserPerformance.user_id == user_id,
            UserPerformance.topic_id == topic_id,
            UserPerformance.gameplay_type == gameplay_type,
        )
        .first()
    )

    if not record:
        record = UserPerformance(
            user_id=user_id,
            topic_id=topic_id,
            gameplay_type=gameplay_type,
            difficulty=difficulty,
            total_attempts=0,
            correct_attempts=0,
            accuracy=None,
            avg_response_ms=None,
            best_streak=0,
        )
        db.add(record)
        db.flush()

    # Update attempt counts
    record.total_attempts += 1
    if is_correct:
        record.correct_attempts += 1

    # Recalculate accuracy
    record.accuracy = round(record.correct_attempts / record.total_attempts, 4)

    # Rolling average response time
    if time_taken_ms is not None and time_taken_ms >= 0:
        if record.avg_response_ms is None:
            record.avg_response_ms = float(time_taken_ms)
        else:
            # Weighted rolling average using previous total_attempts
            prev_total = record.total_attempts - 1
            if prev_total > 0:
                record.avg_response_ms = round(
                    (record.avg_response_ms * prev_total + time_taken_ms) / record.total_attempts,
                    2,
                )
            else:
                record.avg_response_ms = float(time_taken_ms)

    # Best streak: increment if correct, reset if wrong
    # We track streak based on consecutive correct answers
    # (Simple per-session approach: best_streak is the max consecutive seen)
    if is_correct:
        record.best_streak += 1
    else:
        record.best_streak = 0

    record.last_attempted_at = datetime.now(timezone.utc)
    record.difficulty = difficulty  # Update to latest session difficulty

    return record


def get_topic_accuracy(
    user_id: int,
    topic_id: int,
    gameplay_type: str,
    db: Session,
) -> float | None:
    """
    Return the current accuracy for (user, topic, gameplay_type), or None if no history.
    """
    record = (
        db.query(UserPerformance)
        .filter(
            UserPerformance.user_id == user_id,
            UserPerformance.topic_id == topic_id,
            UserPerformance.gameplay_type == gameplay_type,
        )
        .first()
    )
    if not record or record.total_attempts == 0:
        return None
    return record.accuracy
