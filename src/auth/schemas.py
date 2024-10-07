from typing import Optional

from fastapi_users import schemas, models
from pydantic import EmailStr, BaseModel


class UserRead(schemas.BaseUser[int]):
    id: models.ID
    email: EmailStr
    username: str
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False

    class Config:
        from_attributes = True


class UserCreate(schemas.BaseUserCreate):
    email: EmailStr
    password: str
    username: str

    class Config:
        extra = "forbid"


class UserUpdate(schemas.BaseUserUpdate):
    password: Optional[str] = None
    email: Optional[EmailStr] = None

    class Config:
        extra = "forbid"
