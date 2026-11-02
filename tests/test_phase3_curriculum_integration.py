"""
Test Phase 3: Real Story / Curriculum / Mission Data Integration
Verifies that:
1. corebound-api.js exports getStory, getChapters, getChapter, getSector, getMissions, getAvailableMissions, getMission, getMissionStatus, getMissionProgress, getProgressSummary, getProgressStats.
2. level.html and sub_missions.html include corebound-api.js.
3. level.js consumes backend curriculum & user progress.
4. sub_missions.js consumes backend missions, maps IDs, respects backend progress states, and navigates with backend mission ID.
5. All backend curriculum, mission, and progress API endpoints return expected responses.
6. Chapter 1 contains all 10 expected missions with exact GM001-GM004 gameplay mappings.
"""

from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from scripts.seed_curriculum import seed_curriculum

FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "COREBOUNDV1" / "COREBOUNDV1" / "COREBOUND"


def test_api_client_has_curriculum_methods():
    """Verify corebound-api.js defines story, chapter, sector, mission, and progress methods."""
    api_file = FRONTEND_DIR / "corebound-api.js"
    assert api_file.exists()
    content = api_file.read_text(encoding="utf-8")

    assert "getStory(" in content
    assert "getChapters(" in content
    assert "getChapter(" in content
    assert "getSector(" in content
    assert "getMissions(" in content
    assert "getAvailableMissions(" in content
    assert "getMission(" in content
    assert "getMissionStatus(" in content
    assert "getMissionProgress(" in content
    assert "getProgressSummary(" in content
    assert "getProgressStats(" in content

    # Verify route paths
    assert "/api/v1/story" in content
    assert "/api/v1/story/chapters" in content
    assert "/api/v1/story/sectors" in content
    assert "/api/v1/missions" in content
    assert "/api/v1/progress/missions" in content
    assert "/api/v1/progress/summary" in content


def test_level_html_and_js_integration():
    """Verify level.html and level.js properly connect to corebound-api.js."""
    level_html = (FRONTEND_DIR / "level.html").read_text(encoding="utf-8")
    level_js = (FRONTEND_DIR / "level.js").read_text(encoding="utf-8")

    assert "corebound-api.js" in level_html
    assert "initBackendCurriculum" in level_js
    assert "window.cbApi.getChapters" in level_js
    assert "window.cbApi.getProgressSummary" in level_js


def test_sub_missions_html_and_js_integration():
    """Verify sub_missions.html and sub_missions.js properly connect to backend curriculum."""
    sub_html = (FRONTEND_DIR / "sub_missions.html").read_text(encoding="utf-8")
    sub_js = (FRONTEND_DIR / "sub_missions.js").read_text(encoding="utf-8")

    assert "corebound-api.js" in sub_html
    assert "loadBackendMissionsAndProgress" in sub_js
    assert "window.cbApi.getMissions" in sub_js
    assert "window.cbApi.getMissionProgress" in sub_js
    assert "ch1_missions.html?mission=" in sub_js
    assert "activeProgress" in sub_js


def test_backend_curriculum_endpoints(client: TestClient, db_session: Session):
    """Verify story, chapter, sector, and mission backend endpoints return valid data."""
    seed_curriculum(db_session)

    # 1. Story
    story_res = client.get("/api/v1/story")
    assert story_res.status_code == 200
    stories = story_res.json()
    assert len(stories) >= 1
    assert stories[0]["title"] == "COREBOUND"

    # 2. Chapters
    ch_res = client.get("/api/v1/story/chapters")
    assert ch_res.status_code == 200
    chapters = ch_res.json()
    assert len(chapters) == 9
    assert chapters[0]["order_index"] == 1
    assert chapters[0]["title"] == "PATTERN OBSERVATORY"

    # 3. Chapter 1 Detail
    ch1_id = chapters[0]["id"]
    ch1_res = client.get(f"/api/v1/story/chapters/{ch1_id}")
    assert ch1_res.status_code == 200
    ch1_data = ch1_res.json()
    assert len(ch1_data["sectors"]) >= 1

    # 4. Sector Detail
    sec1_id = ch1_data["sectors"][0]["id"]
    sec_res = client.get(f"/api/v1/story/sectors/{sec1_id}")
    assert sec_res.status_code == 200
    sec_data = sec_res.json()
    assert len(sec_data["missions"]) == 10

    # 5. Missions List
    missions_res = client.get("/api/v1/missions")
    assert missions_res.status_code == 200
    missions = missions_res.json()
    assert len(missions) == 10

    # 6. Mission 1 Detail
    m1_id = missions[0]["id"]
    m1_res = client.get(f"/api/v1/missions/{m1_id}")
    assert m1_res.status_code == 200
    m1_data = m1_res.json()
    assert m1_data["title"] == "AWAKEN THE PATTERN LENS"
    assert m1_data["gameplay_type"] == "GM001"


def test_backend_user_progress_endpoints(client: TestClient, db_session: Session):
    """Verify authenticated user progress endpoints function as expected."""
    seed_curriculum(db_session)

    email = f"sentinel.phase3.{Path(__file__).stat().st_mtime_ns}@corebound.io"
    password = "QuantumPassword#2026"

    # 1. Register & Login
    reg_res = client.post("/api/v1/auth/register", json={"email": email, "password": password})
    assert reg_res.status_code == 201

    login_res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get mission progress list
    prog_res = client.get("/api/v1/progress/missions", headers=headers)
    assert prog_res.status_code == 200
    prog_data = prog_res.json()
    assert isinstance(prog_data, list)

    # 3. Get progress summary
    sum_res = client.get("/api/v1/progress/summary", headers=headers)
    assert sum_res.status_code == 200
    sum_data = sum_res.json()
    assert "total_missions" in sum_data
    assert "completed_missions" in sum_data
    assert "completion_percentage" in sum_data

    # 4. Get progress stats
    stats_res = client.get("/api/v1/progress/stats", headers=headers)
    assert stats_res.status_code == 200
    stats_data = stats_res.json()
    assert "total_attempts" in stats_data
    assert "total_stars_earned" in stats_data


def test_chapter1_mission_gameplay_mappings(db_session: Session):
    """
    Verify Chapter 1 has 10 missions with the required gameplay type mappings:
    Mission 1 -> GM001
    Mission 2 -> GM001
    Mission 3 -> GM002
    Mission 4 -> GM001
    Mission 5 -> GM003
    Mission 6 -> GM004
    Mission 7 -> GM001
    Mission 8 -> GM002
    Mission 9 -> GM003
    Mission 10 -> GM004
    """
    seed_curriculum(db_session)

    from app.models.mission import Mission
    missions = db_session.query(Mission).order_by(Mission.order_index).all()
    assert len(missions) == 10, f"Expected 10 Chapter 1 missions, found {len(missions)}"

    expected_mappings = {
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

    for m in missions:
        expected_gm = expected_mappings[m.order_index]
        assert m.gameplay_type == expected_gm, (
            f"Mission {m.order_index} ({m.title}) has gameplay_type '{m.gameplay_type}', expected '{expected_gm}'"
        )
