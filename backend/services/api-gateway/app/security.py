from uuid import UUID

from fastapi import HTTPException, Request, status
from jose import JWTError, jwt

from app.core.config import settings
from app.schemas import TokenClaims


def decode_access_token(token: str) -> TokenClaims:
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return TokenClaims(
            user_id=UUID(payload["sub"]),
            auth_id=UUID(payload["auth_id"]),
            email=payload["email"],
            role=payload["role"],
        )
    except (JWTError, KeyError, ValueError) as err:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from err


def get_bearer_token(request: Request) -> str:
    authorization = request.headers.get("Authorization")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )
    return authorization.removeprefix("Bearer ").strip()
