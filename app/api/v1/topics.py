from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.mission import Mission
from app.models.topic import Topic
from app.schemas.response import TopicResponse
from app.schemas.story import MissionBriefResponse

router = APIRouter(
    prefix="/topics",
    tags=["Topics"],
)


@router.get(
    "/{topic_id}",
    response_model=TopicResponse,
)
def get_topic(
    topic_id: int,
    db: Session = Depends(get_db),
):
    """Return a single topic by ID."""
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found",
        )
    return topic


@router.get(
    "/{topic_id}/missions",
    response_model=list[MissionBriefResponse],
)
def get_topic_missions(
    topic_id: int,
    db: Session = Depends(get_db),
):
    """Return all active missions associated with a topic."""
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found",
        )

    missions = (
        db.query(Mission)
        .filter(
            Mission.topic_id == topic_id,
            Mission.is_active == True,
        )
        .order_by(Mission.order_index)
        .all()
    )
    return missions
