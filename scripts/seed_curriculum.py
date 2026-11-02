"""
Seed script for Corebound Curriculum:
Story -> 9 Chapters -> 9 Sectors -> Chapter 1 (10 Missions)

Grounded in canonical curriculum.js metadata.
Idempotent: safe to run multiple times without duplicating rows.
"""
import sys
from pathlib import Path

# Ensure backend root is in sys.path
backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from app.db.database import SessionLocal
from app.models.story import Story, Chapter, Sector
from app.models.mission import Mission, DIFFICULTY_EASY, DIFFICULTY_MEDIUM, DIFFICULTY_HARD
from app.models.topic import Topic


STORY_DATA = {
    "title": "COREBOUND",
    "description": "Restore the shattered realms of the Corebound Matrix through tactical computational challenges."
}

CHAPTERS_DATA = [
    {
        "order_index": 1,
        "title": "PATTERN OBSERVATORY",
        "description": "Awaken the ancient observatory atop Mount Lumina. Restore the 5 core systems of the Prediction Engine across 10 tactical missions.",
        "sector_title": "PATTERN OBSERVATORY",
        "sector_description": "Sector 01: Mount Lumina Observatory."
    },
    {
        "order_index": 2,
        "title": "LOGIC NEXUS",
        "description": "Harmonize Boolean circuits, digital logic gates, and branch prediction engines.",
        "sector_title": "LOGIC NEXUS",
        "sector_description": "Sector 02: Logic Nexus."
    },
    {
        "order_index": 3,
        "title": "PROGRAMMING DISTRICT",
        "description": "Re-ignite compiler sub-grids, variable registers, and function invocation lattices.",
        "sector_title": "PROGRAMMING DISTRICT",
        "sector_description": "Sector 03: Programming District."
    },
    {
        "order_index": 4,
        "title": "ALGORITHM FORGE",
        "description": "Master algorithmic time complexities, sorting lattices, and graph traversal matrices.",
        "sector_title": "ALGORITHM FORGE",
        "sector_description": "Sector 04: Algorithm Forge."
    },
    {
        "order_index": 5,
        "title": "DATABASE VAULT",
        "description": "Decrypt relational schemas, indexing trees, and distributed transaction locks.",
        "sector_title": "DATABASE VAULT",
        "sector_description": "Sector 05: Database Vault."
    },
    {
        "order_index": 6,
        "title": "NETWORK GRID",
        "description": "Re-route high-voltage packet conduits, OSI layer streams, and socket channels.",
        "sector_title": "NETWORK GRID",
        "sector_description": "Sector 06: Network Grid."
    },
    {
        "order_index": 7,
        "title": "SYSTEM CORE",
        "description": "Breach central mainframe firewalls, kernel memory spaces, and concurrency locks.",
        "sector_title": "SYSTEM CORE",
        "sector_description": "Sector 07: System Core."
    },
    {
        "order_index": 8,
        "title": "COMMUNICATION CITADEL",
        "description": "Restore sub-space relay transmissions and distributed consensus mechanisms.",
        "sector_title": "COMMUNICATION CITADEL",
        "sector_description": "Sector 08: Communication Citadel."
    },
    {
        "order_index": 9,
        "title": "PLACEMENT ARENA",
        "description": "The ultimate proving ground. Solve full-scale industrial challenges and system interviews.",
        "sector_title": "PLACEMENT ARENA",
        "sector_description": "Sector 09: Placement Arena."
    }
]

# Canonical 10 Chapter 1 Missions mapped to topics & gameplay types
CHAPTER1_MISSIONS = [
    {
        "id": 1,
        "order_index": 1,
        "title": "AWAKEN THE PATTERN LENS",
        "objective": "Identify the hidden arithmetic progression sequence to awaken the crystalline Pattern Lens.",
        "gameplay_type": "GM001",
        "difficulty": DIFFICULTY_EASY,
        "topic_name": "Number Series"
    },
    {
        "id": 2,
        "order_index": 2,
        "title": "ALIGN THE CRYSTAL RINGS",
        "objective": "Align concentric optical crystal rings to harmonious frequencies to focus the starlight beam.",
        "gameplay_type": "GM001",
        "difficulty": DIFFICULTY_EASY,
        "topic_name": "Number Series"
    },
    {
        "id": 3,
        "order_index": 3,
        "title": "RESTART THE ENERGY CHANNELS",
        "objective": "Connect each wavelength input node to its matching harmonic resonant frequency across distribution conduits.",
        "gameplay_type": "GM002",
        "difficulty": DIFFICULTY_MEDIUM,
        "topic_name": "Simplification"
    },
    {
        "id": 4,
        "order_index": 4,
        "title": "STABILIZE THE ENERGY CORE",
        "objective": "Calculate the exact order of operations to calibrate energy core flux throughput.",
        "gameplay_type": "GM001",
        "difficulty": DIFFICULTY_MEDIUM,
        "topic_name": "Simplification"
    },
    {
        "id": 5,
        "order_index": 5,
        "title": "RECONNECT THE CRYSTAL NETWORK",
        "objective": "Calculate percentage capacity and insert the calibrated restoration power cell into the relay socket.",
        "gameplay_type": "GM003",
        "difficulty": DIFFICULTY_MEDIUM,
        "topic_name": "Percentage"
    },
    {
        "id": 6,
        "order_index": 6,
        "title": "PURGE THE CORRUPTED NODES",
        "objective": "Compute percentage degradation loss to identify and purge corrupted data nodes.",
        "gameplay_type": "GM004",
        "difficulty": DIFFICULTY_MEDIUM,
        "topic_name": "Percentage"
    },
    {
        "id": 7,
        "order_index": 7,
        "title": "ENTER THE ANALYSIS CORE",
        "objective": "Equalize proportion streams to unlock the ancient Analysis Core memory archive.",
        "gameplay_type": "GM001",
        "difficulty": DIFFICULTY_MEDIUM,
        "topic_name": "Ratio & Proportion"
    },
    {
        "id": 8,
        "order_index": 8,
        "title": "DECODE THE LOST MEMORIES",
        "objective": "Compute the 2-digit security override formula to decrypt distorted historical fragments.",
        "gameplay_type": "GM002",
        "difficulty": DIFFICULTY_MEDIUM,
        "topic_name": "Simplification"
    },
    {
        "id": 9,
        "order_index": 9,
        "title": "SYNCHRONIZE PREDICTION ENGINE",
        "objective": "Calculate the uniform average data flux across memory cubes to synchronize the Prediction Engine.",
        "gameplay_type": "GM003",
        "difficulty": DIFFICULTY_HARD,
        "topic_name": "Average"
    },
    {
        "id": 10,
        "order_index": 10,
        "title": "GUARDIAN ATLAS // THE CORRUPTED SENTINEL",
        "objective": "Execute multi-phase combat algorithms to purge NULL's corruption from Guardian Atlas.",
        "gameplay_type": "GM004",
        "difficulty": DIFFICULTY_HARD,
        "topic_name": "Simplification"
    }
]


def seed_curriculum(db=None):
    close_on_finish = False
    if db is None:
        db = SessionLocal()
        close_on_finish = True

    try:
        # 0. Ensure subjects & topics exist if in a fresh/in-memory test db
        from app.models.subject import Subject
        aptitude_sub = db.query(Subject).filter(Subject.name == "Aptitude").first()
        if not aptitude_sub:
            aptitude_sub = Subject(name="Aptitude", description="Aptitude preparation")
            db.add(aptitude_sub)
            db.flush()

        for topic_name in ["Number Series", "Simplification", "Percentage", "Ratio & Proportion", "Average"]:
            t = db.query(Topic).filter(Topic.name == topic_name).first()
            if not t:
                t = Topic(subject_id=aptitude_sub.id, name=topic_name, description=f"{topic_name} topic")
                db.add(t)
                db.flush()

        # 1. Seed / Verify Story
        story = db.query(Story).filter(Story.title == STORY_DATA["title"]).first()
        if not story:
            story = Story(
                title=STORY_DATA["title"],
                description=STORY_DATA["description"]
            )
            db.add(story)
            db.flush()
            print(f"[Seed] Created Story: {story.title} (ID: {story.id})")
        else:
            story.description = STORY_DATA["description"]
            db.flush()
            print(f"[Seed] Story exists: {story.title} (ID: {story.id})")

        # 2. Seed / Verify 9 Chapters and 9 Sectors
        chapter_map = {}
        sector_map = {}
        for c_data in CHAPTERS_DATA:
            chapter = (
                db.query(Chapter)
                .filter(Chapter.story_id == story.id, Chapter.order_index == c_data["order_index"])
                .first()
            )
            if not chapter:
                chapter = Chapter(
                    story_id=story.id,
                    title=c_data["title"],
                    description=c_data["description"],
                    order_index=c_data["order_index"]
                )
                db.add(chapter)
                db.flush()
                print(f"[Seed]   Created Chapter {chapter.order_index}: {chapter.title} (ID: {chapter.id})")
            else:
                chapter.title = c_data["title"]
                chapter.description = c_data["description"]
                db.flush()
                print(f"[Seed]   Chapter exists: {chapter.order_index} - {chapter.title} (ID: {chapter.id})")

            chapter_map[chapter.order_index] = chapter

            # 1 Sector per Chapter
            sector = (
                db.query(Sector)
                .filter(Sector.chapter_id == chapter.id, Sector.order_index == 1)
                .first()
            )
            if not sector:
                sector = Sector(
                    chapter_id=chapter.id,
                    title=c_data["sector_title"],
                    description=c_data["sector_description"],
                    order_index=1
                )
                db.add(sector)
                db.flush()
                print(f"[Seed]     Created Sector for Chapter {chapter.order_index}: {sector.title} (ID: {sector.id})")
            else:
                sector.title = c_data["sector_title"]
                sector.description = c_data["sector_description"]
                db.flush()
                print(f"[Seed]     Sector exists: {sector.title} (ID: {sector.id})")

            sector_map[chapter.order_index] = sector

        # 3. Seed / Verify Chapter 1 Missions (10 tactical missions)
        sector_1 = sector_map[1]
        for m_data in CHAPTER1_MISSIONS:
            # Find topic
            topic = db.query(Topic).filter(Topic.name == m_data["topic_name"]).first()
            if not topic:
                raise ValueError(f"Topic '{m_data['topic_name']}' not found in database! Seed subjects first.")

            mission = (
                db.query(Mission)
                .filter(Mission.sector_id == sector_1.id, Mission.order_index == m_data["order_index"])
                .first()
            )
            if not mission:
                mission = Mission(
                    sector_id=sector_1.id,
                    topic_id=topic.id,
                    title=m_data["title"],
                    objective=m_data["objective"],
                    order_index=m_data["order_index"],
                    difficulty=m_data["difficulty"],
                    gameplay_type=m_data["gameplay_type"],
                    is_active=True
                )
                db.add(mission)
                db.flush()
                print(f"[Seed]       Created Mission {mission.order_index}: {mission.title} [{mission.gameplay_type}] (ID: {mission.id})")
            else:
                mission.title = m_data["title"]
                mission.objective = m_data["objective"]
                mission.difficulty = m_data["difficulty"]
                mission.gameplay_type = m_data["gameplay_type"]
                mission.topic_id = topic.id
                mission.is_active = True
                db.flush()
                print(f"[Seed]       Updated/Verified Mission {mission.order_index}: {mission.title} [{mission.gameplay_type}] (ID: {mission.id})")

        db.commit()
        print("\n[Seed] Curriculum seeding completed successfully.")

    except Exception as e:
        db.rollback()
        print(f"[Seed] Error seeding curriculum: {e}")
        raise
    finally:
        if close_on_finish:
            db.close()


if __name__ == "__main__":
    seed_curriculum()
