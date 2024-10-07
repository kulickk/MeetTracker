from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional
import re


class UserBase(BaseModel):
    username: str = Field(
        ...,
        min_length=5,
        max_length=20,
        pattern=r'^[A-Za-z0-9_]+$',
        description="Имя пользователя должно содержать только буквы, цифры и подчеркивания."
    )
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(
        ...,
        min_length=8,
    )


class UserRead(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: Optional[str]
    updated_at: Optional[str]

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
