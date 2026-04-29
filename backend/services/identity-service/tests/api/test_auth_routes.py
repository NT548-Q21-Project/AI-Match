def test_register_should_create_user_and_return_token(client):
    response = client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "123456",
            "full_name": "Test User",
            "role": "candidate",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["token_type"] == "bearer"
    assert data["access_token"]
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["full_name"] == "Test User"
    assert data["user"]["role"] == "candidate"


def test_register_should_reject_duplicate_email(client):
    payload = {
        "email": "test@example.com",
        "password": "123456",
        "full_name": "Test User",
        "role": "candidate",
    }

    first_response = client.post("/auth/register", json=payload)
    second_response = client.post("/auth/register", json=payload)

    assert first_response.status_code == 200
    assert second_response.status_code == 409
    assert second_response.json()["detail"] == "Email already registered"


def test_login_should_return_token(client):
    register_payload = {
        "email": "test@example.com",
        "password": "123456",
        "full_name": "Test User",
        "role": "candidate",
    }

    client.post("/auth/register", json=register_payload)

    response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "123456",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["access_token"]
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "test@example.com"


def test_login_should_reject_wrong_password(client):
    client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "123456",
            "full_name": "Test User",
            "role": "candidate",
        },
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrong-password",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_me_should_return_current_user(client):
    register_response = client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "123456",
            "full_name": "Test User",
            "role": "candidate",
        },
    )

    token = register_response.json()["access_token"]

    response = client.get(
        "/auth/me",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200
    assert response.json()["user"]["email"] == "test@example.com"


def test_me_should_reject_missing_token(client):
    response = client.get("/auth/me")

    assert response.status_code == 401
