from pydantic import EmailStr
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.admin.admin_service import AdminService
from src.database import get_db
from src.auth.status_codes import StatusCodes as status_code
from src.auth.routers import oauth2_scheme, register
from src.auth.schemas import UserCreateSchema

router = APIRouter(
    prefix='/admin',
    tags=['admin']
)


@router.post("/register", responses=status_code.register)
async def register_admin(user: UserCreateSchema, token: str = Depends(oauth2_scheme),
                         db: AsyncSession = Depends(get_db)):
    admin_service = AdminService(db)
    await admin_service.check_admin(token)
    return await register(user, db)


@router.get('/get_users')
async def get_all_users(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    admin_service = AdminService(db)
    await admin_service.check_admin(token)
    return await admin_service.get_all_users()


@router.post('/ban_user')
async def ban_user(email: EmailStr, token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    admin_service = AdminService(db)
    await admin_service.check_admin(token)
    return await admin_service.ban_user(email)


@router.post('/unban_user')
async def unban_user(email: EmailStr, token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    admin_service = AdminService(db)
    await admin_service.check_admin(token)
    return await admin_service.unban_user(email)


@router.post('/set_admin')
async def set_admin(email: EmailStr, token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    admin_service = AdminService(db)
    await admin_service.check_admin(token)
    return await admin_service.set_admin(email)
