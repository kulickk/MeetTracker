from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class UserBaseSchema(BaseModel):
    username: str = Field(
        ...,
        min_length=5,
        max_length=20,
        pattern=r'^[A-Za-z0-9_]+$',
        description="Имя пользователя должно содержать только буквы, цифры и подчеркивания."
    )
    email: EmailStr


class UserLoginSchema(BaseModel):
    identifier: str
    password: str = Field(
        ...,
        min_length=8,
    )


class UserCreateSchema(UserBaseSchema):
    password: str = Field(
        ...,
        min_length=8,
    )


class UserReadSchema(UserBaseSchema):
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
    email: str | None = None


class ErrorResponse(BaseModel):
    detail: str