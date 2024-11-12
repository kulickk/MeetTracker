from datetime import datetime, timedelta

import jwt
from jwt import PyJWTError
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Request, HTTPException, status
from src.auth.user_service import UserService
from src.config import ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from src.database import User as DB_User
from sqlalchemy import update


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_service = UserService(db)

    @staticmethod
    async def create_access_token(data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    async def get_access_token(request: Request):
        token = request.cookies.get("access_token")
        if not token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
        return token

    async def authenticate_user(self, email: str, password: str):
        user: DB_User = await self.user_service.get_user_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Wrong email or password"
            )

        if not self.user_service.pwd_context.verify(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Wrong email or password"
            )
        return user

    async def get_current_user(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
            email = payload.get("sub")
            if email is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
            user = await self.user_service.get_user_by_email(email)
            if user is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
            return {
                "name": user.name,
                "surname": user.surname,
                "patronymic": user.patronymic,
                "email": user.email,
                "id": user.id,
                "is_active": user.is_active,
                "is_admin": user.is_admin,
                "is_banned": user.is_banned,
                "created_at": user.created_at,
                "updated_at": user.updated_at,
            }
        except PyJWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    async def change_password(self, old_password: str, new_password: str, email: str):
        user: DB_User = await self.authenticate_user(email=email, password=old_password)
        new_hashed_password = self.user_service.pwd_context.hash(new_password)
        update_password = (
            update(DB_User)
            .where(user.email == DB_User.email)
            .values(hashed_password=new_hashed_password)
        )
        update_time = (
            update(DB_User)
            .where(user.email == DB_User.email)
            .values(updated_at=datetime.utcnow())
        )
        await self.db.execute(update_password)
        await self.db.execute(update_time)
        await self.db.commit()
        return {"status": "success"}
