from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import get_current_user
from app.models import User
from app.schemas import (
    AuthResponse,
    LoginRequest,
    MeResponse,
    MessageResponse,
    RegisterRequest,
)
from app.service import login_user, register_user

router = APIRouter(prefix="/auth", tags=["Identity"])


@router.post("/register", response_model=AuthResponse)
def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
):
    return register_user(db, payload)


@router.post("/login", response_model=AuthResponse)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
):
    return login_user(db, payload)


@router.get("/me", response_model=MeResponse)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {"user": current_user}


@router.post("/logout", response_model=MessageResponse)
def logout():
    return {"message": "Logged out successfully. Please remove token on client side."}
