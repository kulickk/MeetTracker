from src.auth.auth_service import AuthService
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from src.auth.user_service import UserService
from src.database import User as DB_User
from sqlalchemy import update, select


class AdminService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_service = UserService(db)
        self.auth_service = AuthService(db)

    async def get_all_users(self):
        stmt = await self.db.execute(select(DB_User))
        users = stmt.scalars().all()

        users_array = [
            {
                "id": user.id,
                "name": user.name,
                "surname": user.surname,
                "patronymic": user.patronymic,
                "email": user.email,
                "is_admin": user.is_admin,
                "is_banned": user.is_banned
            }
            for user in users
        ]
        return users_array

    async def check_admin(self, token: str):
        current_user = await self.auth_service.get_current_user(token)
        if not current_user['is_admin']:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='You are not an admin')
        return True

    async def ban_user(self, email: str):
        if await self.user_service.check_user_admin(email):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You can't ban an admin")
        if await self.user_service.check_user_ban(email):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='User already banned')
        ban_user = (
            update(DB_User)
            .where(email == DB_User.email)
            .values(is_banned=True)
        )
        await self.db.execute(ban_user)
        await self.db.commit()
        return {"status": "success"}

    async def unban_user(self, email: str):
        if not await self.user_service.check_user_ban(email):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='User not banned')
        unban_user = (
            update(DB_User)
            .where(email == DB_User.email)
            .values(is_banned=False)
        )
        await self.db.execute(unban_user)
        await self.db.commit()
        return {"status": "success"}

    async def set_admin(self, email: str):
        if await self.user_service.check_user_admin(email):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='User already admin')
        if await self.user_service.check_user_ban(email):
            await self.unban_user(email)
        set_admin = (
            update(DB_User)
            .where(email == DB_User.email)
            .values(is_admin=True)
        )
        await self.db.execute(set_admin)
        await self.db.commit()
        return {"status": "success"}
