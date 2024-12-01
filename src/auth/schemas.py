from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class UserBaseSchema(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=20,
        pattern=r'^[А-ЯЁ][а-яё]+$',
        description="Имя пользователя должно содержать только русские буквы."
    )
    surname: str = Field(
        ...,
        min_length=2,
        max_length=20,
        pattern=r'^[А-ЯЁ][а-яё]+$',
        description="Имя пользователя должно содержать только русские буквы."
    )
    patronymic: str = Field(
        ...,
        min_length=2,
        max_length=20,
        pattern=r'^^[А-ЯЁ][а-яё]+$',
        description="Имя пользователя должно содержать только русские буквы."
    )
    email: EmailStr


class UserCreateSchema(UserBaseSchema):
    password: str = Field(
        ...,
        min_length=8,
    )


class UserChangePasswordSchema(BaseModel):
    old_password: str = Field(
        ...,
        min_length=8,
    )
    new_password: str = Field(
        ...,
        min_length=8,
    )


class UserReadSchema(UserBaseSchema):
    id: int
    is_active: bool
    is_admin: bool
    is_banned: bool
    created_at: Optional[str]
    updated_at: Optional[str]

    class Config:
        from_attributes = True


class UpdateUserInfo(BaseModel):
    old_password: str | None = Field(None, description="Старый пароль", min_length=8)
    new_password: str | None = Field(None, description="Новый пароль", min_length=8)
    name: str | None = Field(
        None,
        min_length=2,
        max_length=20,
        pattern=r'^[А-ЯЁ][а-яё]+$',
        description="Имя пользователя должно содержать только русские буквы."
    )
    surname: str | None = Field(
        None,
        min_length=2,
        max_length=20,
        pattern=r'^[А-ЯЁ][а-яё]+$',
        description="Имя пользователя должно содержать только русские буквы."
    )
    patronymic: str | None = Field(
        None,
        min_length=2,
        max_length=20,
        pattern=r'^^[А-ЯЁ][а-яё]+$',
        description="Имя пользователя должно содержать только русские буквы."
    )


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None


class ErrorResponse(BaseModel):
    detail: str
