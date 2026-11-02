from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.subject import Subject


def test_get_subjects_empty(client: TestClient):
    """Test GET /api/v1/subjects returns empty list when no subjects exist."""
    response = client.get("/api/v1/subjects")
    assert response.status_code == 200
    assert response.json() == []


def test_create_and_get_subject(client: TestClient, db_session: Session):
    """Test POST /api/v1/subjects and GET /api/v1/subjects/{id}."""
    create_res = client.post(
        "/api/v1/subjects",
        json={"name": "Computer Science", "description": "Core CS Topics"},
    )
    assert create_res.status_code == 201
    subject_id = create_res.json()["id"]

    get_res = client.get(f"/api/v1/subjects/{subject_id}")
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["name"] == "Computer Science"
    assert data["topics"] == []


def test_create_subject_topic(client: TestClient):
    """Test POST /api/v1/subjects/{id}/topics and GET /api/v1/subjects/{id}/topics."""
    sub_res = client.post(
        "/api/v1/subjects",
        json={"name": "Data Structures", "description": "DS & Algo"},
    )
    subject_id = sub_res.json()["id"]

    topic_res = client.post(
        f"/api/v1/subjects/{subject_id}/topics",
        json={"name": "Arrays", "description": "Array Data Structure"},
    )
    assert topic_res.status_code == 201

    get_topics = client.get(f"/api/v1/subjects/{subject_id}/topics")
    assert get_topics.status_code == 200
    topics = get_topics.json()
    assert len(topics) == 1
    assert topics[0]["name"] == "Arrays"
