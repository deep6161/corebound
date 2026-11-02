from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.topic import Topic
from app.models.subject import Subject
from app.models.user import User
from app.models.user_performance import UserPerformance
from app.schemas.performance import (
    GameplayPerformanceResponse,
    PerformanceSummaryResponse,
    SubjectPerformanceResponse,
    TopicPerformanceResponse,
)

router = APIRouter(
    prefix="/performance",
    tags=["Performance"],
)


def _build_topic_performance(records: list[UserPerformance], db: Session) -> list[TopicPerformanceResponse]:
    result = []
    for r in records:
        topic = db.query(Topic).filter(Topic.id == r.topic_id).first()
        result.append(
            TopicPerformanceResponse(
                topic_id=r.topic_id,
                topic_name=topic.name if topic else "Unknown",
                gameplay_type=r.gameplay_type,
                total_attempts=r.total_attempts,
                correct_attempts=r.correct_attempts,
                accuracy=r.accuracy,
                avg_response_ms=r.avg_response_ms,
                best_streak=r.best_streak,
            )
        )
    return result


def _build_subject_performance(records: list[UserPerformance], db: Session) -> list[SubjectPerformanceResponse]:
    subject_map: dict[int, dict] = {}
    for r in records:
        topic = db.query(Topic).filter(Topic.id == r.topic_id).first()
        if not topic:
            continue
        sid = topic.subject_id
        if sid not in subject_map:
            subject = db.query(Subject).filter(Subject.id == sid).first()
            subject_map[sid] = {
                "subject_id": sid,
                "subject_name": subject.name if subject else "Unknown",
                "total_attempts": 0,
                "correct_attempts": 0,
            }
        subject_map[sid]["total_attempts"] += r.total_attempts
        subject_map[sid]["correct_attempts"] += r.correct_attempts

    result = []
    for data in subject_map.values():
        total = data["total_attempts"]
        correct = data["correct_attempts"]
        acc = round(correct / total, 4) if total > 0 else None
        result.append(
            SubjectPerformanceResponse(
                subject_id=data["subject_id"],
                subject_name=data["subject_name"],
                total_attempts=total,
                correct_attempts=correct,
                accuracy=acc,
            )
        )
    return result


def _build_gameplay_performance(records: list[UserPerformance]) -> list[GameplayPerformanceResponse]:
    gameplay_map: dict[str, dict] = {}
    for r in records:
        gtype = r.gameplay_type
        if gtype not in gameplay_map:
            gameplay_map[gtype] = {
                "gameplay_type": gtype,
                "total_attempts": 0,
                "correct_attempts": 0,
                "weighted_response_sum": 0.0,
                "response_count": 0,
            }
        gameplay_map[gtype]["total_attempts"] += r.total_attempts
        gameplay_map[gtype]["correct_attempts"] += r.correct_attempts
        if r.avg_response_ms and r.total_attempts:
            gameplay_map[gtype]["weighted_response_sum"] += r.avg_response_ms * r.total_attempts
            gameplay_map[gtype]["response_count"] += r.total_attempts

    result = []
    for data in gameplay_map.values():
        total = data["total_attempts"]
        correct = data["correct_attempts"]
        acc = round(correct / total, 4) if total > 0 else None
        rc = data["response_count"]
        avg_ms = round(data["weighted_response_sum"] / rc, 2) if rc > 0 else None
        result.append(
            GameplayPerformanceResponse(
                gameplay_type=data["gameplay_type"],
                total_attempts=total,
                correct_attempts=correct,
                accuracy=acc,
                avg_response_ms=avg_ms,
            )
        )
    return result


@router.get(
    "/me",
    response_model=PerformanceSummaryResponse,
)
def get_my_performance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the overall performance summary for the current user."""
    records = (
        db.query(UserPerformance)
        .filter(UserPerformance.user_id == current_user.id)
        .all()
    )

    total = sum(r.total_attempts for r in records)
    correct = sum(r.correct_attempts for r in records)
    acc = round(correct / total, 4) if total > 0 else None

    return PerformanceSummaryResponse(
        total_attempts=total,
        correct_attempts=correct,
        overall_accuracy=acc,
        by_topic=_build_topic_performance(records, db),
        by_subject=_build_subject_performance(records, db),
        by_gameplay=_build_gameplay_performance(records),
    )


@router.get(
    "/topics",
    response_model=list[TopicPerformanceResponse],
)
def get_topic_performance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return per-topic performance for the current user."""
    records = (
        db.query(UserPerformance)
        .filter(UserPerformance.user_id == current_user.id)
        .all()
    )
    return _build_topic_performance(records, db)


@router.get(
    "/subjects",
    response_model=list[SubjectPerformanceResponse],
)
def get_subject_performance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return per-subject performance for the current user."""
    records = (
        db.query(UserPerformance)
        .filter(UserPerformance.user_id == current_user.id)
        .all()
    )
    return _build_subject_performance(records, db)


@router.get(
    "/gameplay",
    response_model=list[GameplayPerformanceResponse],
)
def get_gameplay_performance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return per-gameplay-type performance for the current user."""
    records = (
        db.query(UserPerformance)
        .filter(UserPerformance.user_id == current_user.id)
        .all()
    )
    return _build_gameplay_performance(records)


@router.get(
    "/history",
    response_model=list[TopicPerformanceResponse],
)
def get_performance_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return performance history ordered by last_attempted_at desc.
    Phase 2 will populate this with real attempt data.
    """
    records = (
        db.query(UserPerformance)
        .filter(UserPerformance.user_id == current_user.id)
        .order_by(UserPerformance.last_attempted_at.desc().nulls_last())
        .all()
    )
    return _build_topic_performance(records, db)
