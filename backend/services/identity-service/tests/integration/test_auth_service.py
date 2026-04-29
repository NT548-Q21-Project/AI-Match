import pytest
from fastapi import HTTPException

from app.schemas import LoginRequest, RegisterRequest
from app.service import login_user, register_user


def test_register_user_should_create_auth_and_user(db_session):
    payload = RegisterRequest(
        email="test@example.com",
        password="123456",
        full_name="Test User",
        role="candidate",
    )

    response = register_user(db_session, payload)

    assert response["access_token"]
    assert response["token_type"] == "bearer"
    assert response["user"].email == "test@example.com"
    assert response["user"].full_name == "Test User"
    assert response["user"].role == "candidate"


def test_register_user_should_reject_duplicate_email(db_session):
    payload = RegisterRequest(
        email="test@example.com",
        password="123456",
        full_name="Test User",
        role="candidate",
    )

    register_user(db_session, payload)

    with pytest.raises(HTTPException) as exc_info:
        register_user(db_session, payload)

    assert exc_info.value.status_code == 409
    assert exc_info.value.detail == "Email already registered"


def test_login_user_should_return_token(db_session):
    register_payload = RegisterRequest(
        email="test@example.com",
        password="123456",
        full_name="Test User",
        role="candidate",
    )

    register_user(db_session, register_payload)

    login_payload = LoginRequest(
        email="test@example.com",
        password="123456",
    )

    response = login_user(db_session, login_payload)

    assert response["access_token"]
    assert response["token_type"] == "bearer"
    assert response["user"].email == "test@example.com"


def test_login_user_should_reject_wrong_password(db_session):
    register_payload = RegisterRequest(
        email="test@example.com",
        password="123456",
        full_name="Test User",
        role="candidate",
    )

    register_user(db_session, register_payload)

    login_payload = LoginRequest(
        email="test@example.com",
        password="wrong-password",
    )

    with pytest.raises(HTTPException) as exc_info:
        login_user(db_session, login_payload)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Invalid email or password"
