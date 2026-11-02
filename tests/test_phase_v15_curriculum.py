"""
Phase V15 Curriculum Backend Tests:
Tests verification of Story, 9 Chapters, 9 Sectors, Chapter 1 (10 Missions),
Topic mapping, gameplay_type mapping, and seed idempotency.
"""
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.story import Story, Chapter, Sector
from app.models.mission import Mission
from app.models.topic import Topic
from scripts.seed_curriculum import seed_curriculum, CHAPTER1_MISSIONS


EXPECTED_MAPPING = {
    1: "GM001",
    2: "GM001",
    3: "GM002",
    4: "GM001",
    5: "GM003",
    6: "GM004",
    7: "GM001",
    8: "GM002",
    9: "GM003",
    10: "GM004",
}


def test_story_exists(db_session: Session):
    """1. Corebound story exists."""
    seed_curriculum(db_session)
    story = db_session.query(Story).filter(Story.title == "COREBOUND").first()
    assert story is not None
    assert "Corebound Matrix" in story.description or "shattered realms" in story.description


def test_nine_chapters_exist(db_session: Session):
    """2. Exactly 9 chapters exist in story order."""
    seed_curriculum(db_session)
    story = db_session.query(Story).filter(Story.title == "COREBOUND").first()
    assert story is not None
    chapters = db_session.query(Chapter).filter(Chapter.story_id == story.id).order_by(Chapter.order_index).all()
    assert len(chapters) == 9
    assert chapters[0].title == "PATTERN OBSERVATORY"
    assert chapters[1].title == "LOGIC NEXUS"
    assert chapters[2].title == "PROGRAMMING DISTRICT"
    assert chapters[3].title == "ALGORITHM FORGE"
    assert chapters[4].title == "DATABASE VAULT"
    assert chapters[5].title == "NETWORK GRID"
    assert chapters[6].title == "SYSTEM CORE"
    assert chapters[7].title == "COMMUNICATION CITADEL"
    assert chapters[8].title == "PLACEMENT ARENA"


def test_nine_sectors_exist(db_session: Session):
    """3. Exactly 9 sectors exist, 1 per chapter."""
    seed_curriculum(db_session)
    story = db_session.query(Story).filter(Story.title == "COREBOUND").first()
    sectors = (
        db_session.query(Sector)
        .join(Chapter, Sector.chapter_id == Chapter.id)
        .filter(Chapter.story_id == story.id)
        .all()
    )
    assert len(sectors) == 9


def test_chapter1_ten_missions(db_session: Session):
    """4. Chapter 1 contains exactly 10 missions."""
    seed_curriculum(db_session)
    story = db_session.query(Story).filter(Story.title == "COREBOUND").first()
    ch1 = db_session.query(Chapter).filter(Chapter.story_id == story.id, Chapter.order_index == 1).first()
    sec1 = db_session.query(Sector).filter(Sector.chapter_id == ch1.id).first()
    missions = db_session.query(Mission).filter(Mission.sector_id == sec1.id).order_by(Mission.order_index).all()
    assert len(missions) == 10


def test_mission_ordering(db_session: Session):
    """5. Mission ordering is sequential 1 to 10."""
    seed_curriculum(db_session)
    story = db_session.query(Story).filter(Story.title == "COREBOUND").first()
    ch1 = db_session.query(Chapter).filter(Chapter.story_id == story.id, Chapter.order_index == 1).first()
    sec1 = db_session.query(Sector).filter(Sector.chapter_id == ch1.id).first()
    missions = db_session.query(Mission).filter(Mission.sector_id == sec1.id).order_by(Mission.order_index).all()
    for idx, m in enumerate(missions, start=1):
        assert m.order_index == idx


def test_mission_gameplay_types(db_session: Session):
    """6. gameplayType mapping matches specifications exactly (GM001-GM004)."""
    seed_curriculum(db_session)
    story = db_session.query(Story).filter(Story.title == "COREBOUND").first()
    ch1 = db_session.query(Chapter).filter(Chapter.story_id == story.id, Chapter.order_index == 1).first()
    sec1 = db_session.query(Sector).filter(Sector.chapter_id == ch1.id).first()
    missions = db_session.query(Mission).filter(Mission.sector_id == sec1.id).order_by(Mission.order_index).all()
    for m in missions:
        assert m.gameplay_type == EXPECTED_MAPPING[m.order_index]


def test_missions_reference_valid_sectors_and_topics(db_session: Session):
    """7 & 8. Missions reference valid sectors and valid topics."""
    seed_curriculum(db_session)
    missions = db_session.query(Mission).all()
    for m in missions:
        sector = db_session.query(Sector).filter(Sector.id == m.sector_id).first()
        assert sector is not None
        topic = db_session.query(Topic).filter(Topic.id == m.topic_id).first()
        assert topic is not None
        assert topic.name in ["Number Series", "Simplification", "Percentage", "Ratio & Proportion", "Average"]


def test_seed_idempotency(db_session: Session):
    """9. Running seed multiple times does not duplicate records."""
    seed_curriculum(db_session)
    c1 = db_session.query(Chapter).count()
    s1 = db_session.query(Sector).count()
    m1 = db_session.query(Mission).count()

    seed_curriculum(db_session)
    c2 = db_session.query(Chapter).count()
    s2 = db_session.query(Sector).count()
    m2 = db_session.query(Mission).count()

    assert c1 == c2
    assert s1 == s2
    assert m1 == m2


def test_api_story_and_chapters_endpoints(client: TestClient, db_session: Session):
    """10. Test GET /api/v1/story and /api/v1/story/chapters through FastAPI."""
    seed_curriculum(db_session)
    res_story = client.get("/api/v1/story")
    assert res_story.status_code == 200
    stories = res_story.json()
    assert any(s["title"] == "COREBOUND" for s in stories)

    res_chaps = client.get("/api/v1/story/chapters")
    assert res_chaps.status_code == 200
    chaps = res_chaps.json()
    assert len(chaps) >= 9

    res_missions = client.get("/api/v1/missions")
    assert res_missions.status_code == 200
    missions = res_missions.json()
    assert len(missions) >= 10
