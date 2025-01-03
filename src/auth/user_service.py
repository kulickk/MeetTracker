from datetime import datetime

from fastapi import HTTPException, status
from passlib.context import CryptContext

from src.auth.schemas import UserCreateSchema
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.database import User as DB_User


class UserService:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_email(self, email: str) -> DB_User:
        result = await self.db.execute(select(DB_User).filter(email == DB_User.email))
        return result.scalars().first()

    async def create_user(self, user_data: UserCreateSchema):
        result = await self.db.execute(select(DB_User).where(user_data.email == DB_User.email))
        existing_email_user = result.scalars().first()
        if existing_email_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        hashed_password = self.pwd_context.hash(user_data.password)

        new_user = DB_User(
            name=user_data.name,
            surname=user_data.surname,
            patronymic=user_data.patronymic,
            email=user_data.email,
            hashed_password=hashed_password,
            is_active=True,
            is_admin=False,
            is_banned=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)

        return {
            "status_code": "200",
            "detail": "Successfully registered"
        }

    async def check_user_ban(self, email: str):
        user = await self.get_user_by_email(email)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Email not found')
        return user.is_banned

    async def check_user_admin(self, email: str):
        user = await self.get_user_by_email(email)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Email not found')
        return user.is_admin
