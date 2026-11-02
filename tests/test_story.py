from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.story import Story, Chapter, Sector
from app.models.mission import Mission
from app.models.subject import Subject
from app.models.topic import Topic


def _seed_story(db: Session):
    """Seed a minimal story structure for testing."""
    subject = Subject(name="Test Subject", description="A subject for testing")
    db.add(subject)
    db.flush()

    topic = Topic(subject_id=subject.id, name="Test Topic", description="A test topic")
    db.add(topic)
    db.flush()

    story = Story(title="Corebound: The Beginning", description="The origin story")
    db.add(story)
    db.flush()

    chapter = Chapter(story_id=story.id, title="Chapter 1: Awakening", order_index=1)
    db.add(chapter)
    db.flush()

    sector = Sector(chapter_id=chapter.id, title="Sector Alpha", order_index=1)
    db.add(sector)
    db.flush()

    mission = Mission(
        sector_id=sector.id,
        topic_id=topic.id,
        title="Mission 1",
        objective="Complete the intro",
        order_index=1,
        difficulty="EASY",
        gameplay_type="GM001",
        is_active=True,
    )
    db.add(mission)
    db.commit()
    return story, chapter, sector, mission


def test_get_stories_empty(client: TestClient):
    """GET /story returns empty list when no stories exist."""
    response = client.get("/api/v1/story")
    assert response.status_code == 200
    assert response.json() == []


def test_get_stories(client: TestClient, db_session: Session):
    """GET /story returns the story list."""
    story, _, _, _ = _seed_story(db_session)
    response = client.get("/api/v1/story")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Corebound: The Beginning"


def test_get_chapters(client: TestClient, db_session: Session):
    """GET /story/chapters returns chapters in order."""
    _, chapter, _, _ = _seed_story(db_session)
    response = client.get("/api/v1/story/chapters")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Chapter 1: Awakening"
    assert data[0]["order_index"] == 1


def test_get_chapter_by_id(client: TestClient, db_session: Session):
    """GET /story/chapters/{id} returns a chapter with sectors."""
    _, chapter, sector, _ = _seed_story(db_session)
    response = client.get(f"/api/v1/story/chapters/{chapter.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == chapter.id
    assert len(data["sectors"]) == 1
    assert data["sectors"][0]["title"] == "Sector Alpha"


def test_get_chapter_not_found(client: TestClient):
    """GET /story/chapters/999 returns 404."""
    response = client.get("/api/v1/story/chapters/999")
    assert response.status_code == 404


def test_get_sector_by_id(client: TestClient, db_session: Session):
    """GET /story/sectors/{id} returns a sector with missions."""
    _, _, sector, mission = _seed_story(db_session)
    response = client.get(f"/api/v1/story/sectors/{sector.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == sector.id
    assert len(data["missions"]) == 1
    assert data["missions"][0]["title"] == "Mission 1"


def test_get_sector_not_found(client: TestClient):
    """GET /story/sectors/999 returns 404."""
    response = client.get("/api/v1/story/sectors/999")
    assert response.status_code == 404


def test_get_story_mission(client: TestClient, db_session: Session):
    """GET /story/missions/{id} returns mission detail."""
    _, _, _, mission = _seed_story(db_session)
    response = client.get(f"/api/v1/story/missions/{mission.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == mission.id
    assert data["difficulty"] == "EASY"
    assert data["gameplay_type"] == "GM001"


def test_get_story_mission_not_found(client: TestClient):
    """GET /story/missions/999 returns 404."""
    response = client.get("/api/v1/story/missions/999")
    assert response.status_code == 404
