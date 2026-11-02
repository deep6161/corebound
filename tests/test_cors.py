from fastapi.testclient import TestClient


def test_cors_allowed_origin(client: TestClient):
    """Test CORS response headers for configured origin http://localhost:5173."""
    response = client.options(
        "/api/v1/auth/login",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"


def test_cors_disallowed_origin(client: TestClient):
    """Test CORS response headers for unconfigured origin."""
    response = client.options(
        "/api/v1/auth/login",
        headers={
            "Origin": "http://untrusted-site.com",
            "Access-Control-Request-Method": "POST",
        },
    )
    # FastAPI CORSMiddleware does not include access-control-allow-origin header for disallowed origins
    assert response.headers.get("access-control-allow-origin") != "http://untrusted-site.com"
