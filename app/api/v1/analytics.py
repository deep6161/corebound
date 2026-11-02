from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.mission_progress import MissionProgress, STATUS_COMPLETED
from app.models.question_attempt import QuestionAttempt
from app.models.subject import Subject
from app.models.topic import Topic
from app.models.user import User
from app.models.user_performance import UserPerformance
from app.models.user_profile import UserProfile
from app.schemas.analytics import (
    AnalyticsResponse,
    SubjectAnalyticsItem,
    TopicAnalyticsItem,
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get(
    "/me",
    response_model=AnalyticsResponse,
)
def get_my_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return analytics derived from actual database records for the current user.

    All values are backend-computed. No frontend-submitted values are used.
    """
    # --- Profile ---
    profile = (
        db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    )
    xp = profile.xp if profile else 0
    credits = profile.credits if profile else 0
    stars = profile.stars if profile else 0
    level = profile.level if profile else 1
    streak = profile.streak if profile else 0

    # --- Mission progress ---
    all_progress = (
        db.query(MissionProgress).filter(MissionProgress.user_id == current_user.id).all()
    )
    total_missions = len(all_progress)
    completed_missions = sum(1 for p in all_progress if p.status == STATUS_COMPLETED)
    in_progress = sum(1 for p in all_progress if p.status == "IN_PROGRESS")
    available = sum(1 for p in all_progress if p.status == "AVAILABLE")
    total_attempts_prog = sum(p.attempts for p in all_progress)

    # --- Question attempts ---
    all_attempts = (
        db.query(QuestionAttempt).filter(QuestionAttempt.user_id == current_user.id).all()
    )
    total_qa = len(all_attempts)
    correct_qa = sum(1 for a in all_attempts if a.is_correct is True)
    overall_accuracy = round(correct_qa / total_qa, 4) if total_qa > 0 else None

    # Use total_attempts from progress if no question attempts recorded yet
    total_attempts = total_qa if total_qa > 0 else total_attempts_prog

    # --- Performance by subject/topic ---
    perf_records = (
        db.query(UserPerformance).filter(UserPerformance.user_id == current_user.id).all()
    )

    # Build subject aggregations
    subject_map: dict[int, dict] = {}
    for r in perf_records:
        topic = db.query(Topic).filter(Topic.id == r.topic_id).first()
        if not topic:
            continue
        sid = topic.subject_id
        if sid not in subject_map:
            subj = db.query(Subject).filter(Subject.id == sid).first()
            subject_map[sid] = {
                "subject_id": sid,
                "subject_name": subj.name if subj else "Unknown",
                "total_attempts": 0,
                "correct_attempts": 0,
            }
        subject_map[sid]["total_attempts"] += r.total_attempts
        subject_map[sid]["correct_attempts"] += r.correct_attempts

    subject_perf = []
    for data in subject_map.values():
        total = data["total_attempts"]
        correct = data["correct_attempts"]
        acc = round(correct / total, 4) if total > 0 else None
        subject_perf.append(
            SubjectAnalyticsItem(
                subject_id=data["subject_id"],
                subject_name=data["subject_name"],
                total_attempts=total,
                correct_attempts=correct,
                accuracy=acc,
            )
        )

    # Build topic aggregations
    topic_map: dict[int, dict] = {}
    for r in perf_records:
        tid = r.topic_id
        if tid not in topic_map:
            topic = db.query(Topic).filter(Topic.id == tid).first()
            topic_map[tid] = {
                "topic_id": tid,
                "topic_name": topic.name if topic else "Unknown",
                "total_attempts": 0,
                "correct_attempts": 0,
            }
        topic_map[tid]["total_attempts"] += r.total_attempts
        topic_map[tid]["correct_attempts"] += r.correct_attempts

    topic_perf = []
    for data in topic_map.values():
        total = data["total_attempts"]
        correct = data["correct_attempts"]
        acc = round(correct / total, 4) if total > 0 else None
        topic_perf.append(
            TopicAnalyticsItem(
                topic_id=data["topic_id"],
                topic_name=data["topic_name"],
                total_attempts=total,
                correct_attempts=correct,
                accuracy=acc,
            )
        )

    return AnalyticsResponse(
        total_missions=total_missions,
        completed_missions=completed_missions,
        in_progress_missions=in_progress,
        available_missions=available,
        total_attempts=total_attempts,
        correct_attempts=correct_qa,
        overall_accuracy=overall_accuracy,
        xp=xp,
        credits=credits,
        stars=stars,
        level=level,
        streak=streak,
        subject_performance=subject_perf,
        topic_performance=topic_perf,
    )
