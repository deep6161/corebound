from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.story import Chapter, Sector, Story
from app.models.mission import Mission
from app.schemas.story import (
    ChapterResponse,
    MissionBriefResponse,
    SectorResponse,
    StoryDetailResponse,
    StoryResponse,
)

router = APIRouter(
    prefix="/story",
    tags=["Story"],
)


@router.get(
    "",
    response_model=list[StoryResponse],
)
def get_stories(db: Session = Depends(get_db)):
    """Return all stories (typically one in Corebound)."""
    return db.query(Story).all()


@router.get(
    "/chapters",
    response_model=list[ChapterResponse],
)
def get_chapters(db: Session = Depends(get_db)):
    """Return all chapters ordered by index."""
    return db.query(Chapter).order_by(Chapter.order_index).all()


@router.get(
    "/chapters/{chapter_id}",
    response_model=ChapterResponse,
)
def get_chapter(
    chapter_id: int,
    db: Session = Depends(get_db),
):
    """Return a single chapter with its sectors and missions."""
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chapter not found",
        )
    return chapter


@router.get(
    "/sectors/{sector_id}",
    response_model=SectorResponse,
)
def get_sector(
    sector_id: int,
    db: Session = Depends(get_db),
):
    """Return a single sector with its missions."""
    sector = db.query(Sector).filter(Sector.id == sector_id).first()
    if not sector:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sector not found",
        )
    return sector


@router.get(
    "/missions/{mission_id}",
    response_model=MissionBriefResponse,
)
def get_story_mission(
    mission_id: int,
    db: Session = Depends(get_db),
):
    """Return a mission from the story structure (no user progress attached)."""
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found",
        )
    return mission
