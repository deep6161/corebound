from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.subject import Subject
from app.models.topic import Topic
from app.schemas.request import SubjectCreate, TopicCreate
from app.schemas.response import (
    SubjectResponse,
    SubjectWithTopicsResponse,
    TopicResponse,
)


router = APIRouter(
    prefix="/subjects",
    tags=["Subjects"],
)


@router.get(
    "",
    response_model=list[SubjectResponse],
)
def get_subjects(
    db: Session = Depends(get_db),
):
    return db.query(Subject).all()


@router.get(
    "/{subject_id}",
    response_model=SubjectWithTopicsResponse,
)
def get_subject(
    subject_id: int,
    db: Session = Depends(get_db),
):
    subject = (
        db.query(Subject)
        .filter(Subject.id == subject_id)
        .first()
    )

    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found",
        )

    return subject


@router.post(
    "",
    response_model=SubjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_subject(
    data: SubjectCreate,
    db: Session = Depends(get_db),
):
    existing_subject = (
        db.query(Subject)
        .filter(Subject.name == data.name)
        .first()
    )

    if existing_subject:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Subject already exists",
        )

    subject = Subject(
        name=data.name,
        description=data.description,
    )

    db.add(subject)
    db.commit()
    db.refresh(subject)

    return subject


@router.get(
    "/{subject_id}/topics",
    response_model=list[TopicResponse],
)
def get_subject_topics(
    subject_id: int,
    db: Session = Depends(get_db),
):
    subject = (
        db.query(Subject)
        .filter(Subject.id == subject_id)
        .first()
    )

    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found",
        )

    return (
        db.query(Topic)
        .filter(Topic.subject_id == subject_id)
        .all()
    )


@router.post(
    "/{subject_id}/topics",
    response_model=TopicResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_topic(
    subject_id: int,
    data: TopicCreate,
    db: Session = Depends(get_db),
):
    subject = (
        db.query(Subject)
        .filter(Subject.id == subject_id)
        .first()
    )

    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found",
        )

    topic = Topic(
        subject_id=subject_id,
        name=data.name,
        description=data.description,
    )

    db.add(topic)
    db.commit()
    db.refresh(topic)

    return topic