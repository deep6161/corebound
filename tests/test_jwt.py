from datetime import timedelta
from app.core.security import create_access_token, decode_access_token


def test_jwt_valid_token():
    """Test standard token creation and successful decoding."""
    token = create_access_token(subject=42)
    payload = decode_access_token(token)
    assert payload is not None
    assert payload.get("sub") == "42"
    assert "exp" in payload


def test_jwt_expired_token():
    """Test expired token returns None when decoded."""
    expired_token = create_access_token(
        subject=42, expires_delta=timedelta(seconds=-10)
    )
    payload = decode_access_token(expired_token)
    assert payload is None


def test_jwt_malformed_token():
    """Test invalid token string returns None."""
    payload = decode_access_token("this.is.a.malformed.jwt.token")
    assert payload is None
