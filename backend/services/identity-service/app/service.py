from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import AuthCredential, User
from app.schemas import LoginRequest, RegisterRequest
from app.security import create_access_token, hash_password, verify_password


def build_auth_response(user: User, auth: AuthCredential) -> dict:
    access_token = create_access_token(
        user_id=user.id,
        auth_id=auth.id,
        email=user.email,
        role=user.role,
    )

    return {
        "user": user,
        "access_token": access_token,
        "token_type": "bearer",
    }


def register_user(db: Session, payload: RegisterRequest):
    existing_auth = (
        db.query(AuthCredential).filter(AuthCredential.email == payload.email).first()
    )

    if existing_auth:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    auth = AuthCredential(
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
        status="active",
    )

    user = User(
        email=payload.email,
        full_name=payload.full_name,
        role=payload.role,
    )

    auth.user = user

    try:
        db.add(auth)
        db.commit()
    except IntegrityError as err:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists",
        ) from err

    db.refresh(auth)
    db.refresh(user)

    return build_auth_response(user, auth)


def login_user(db: Session, payload: LoginRequest):
    auth = (
        db.query(AuthCredential).filter(AuthCredential.email == payload.email).first()
    )

    if not auth:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if auth.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is not active",
        )

    if not verify_password(payload.password, auth.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user = auth.user

    if not user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User profile not found",
        )

    return build_auth_response(user, auth)
