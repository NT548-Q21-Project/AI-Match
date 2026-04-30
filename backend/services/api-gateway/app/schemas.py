from typing import Literal
from uuid import UUID

from pydantic import BaseModel, EmailStr

UserRole = Literal["candidate", "recruiter"]


class TokenClaims(BaseModel):
    user_id: UUID
    auth_id: UUID
    email: EmailStr
    role: UserRole
