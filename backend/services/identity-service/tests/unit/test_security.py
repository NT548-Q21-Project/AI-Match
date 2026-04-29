import uuid

from app.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_hash_password_should_not_equal_plain_password():
    plain_password = "123456"

    password_hash = hash_password(plain_password)

    assert password_hash != plain_password
    assert verify_password(plain_password, password_hash) is True


def test_verify_password_should_return_false_for_wrong_password():
    plain_password = "123456"
    wrong_password = "wrong-password"

    password_hash = hash_password(plain_password)

    assert verify_password(wrong_password, password_hash) is False


def test_create_and_decode_access_token():
    user_id = uuid.uuid4()
    auth_id = uuid.uuid4()

    token = create_access_token(
        user_id=user_id,
        auth_id=auth_id,
        email="test@example.com",
        role="candidate",
    )

    payload = decode_access_token(token)

    assert payload["sub"] == str(user_id)
    assert payload["auth_id"] == str(auth_id)
    assert payload["email"] == "test@example.com"
    assert payload["role"] == "candidate"
