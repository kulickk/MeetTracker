import random
import string
from pydantic import EmailStr
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.admin.admin_service import AdminService
from src.database import get_db
from src.auth.status_codes import StatusCodes as status_code
from src.auth.routers import oauth2_scheme, register
from src.auth.schemas import UserCreateSchema, UserBaseSchema

router = APIRouter(
    prefix='/admin',
    tags=['admin']
)


async def generate_random_password():
    length = random.randint(8, 15)
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choices(characters, k=length))
    return password


@router.post("/register", responses=status_code.register)
async def register_admin(user: UserBaseSchema, token: str = Depends(oauth2_scheme),
                         db: AsyncSession = Depends(get_db)):
    admin_service = AdminService(db)
    await admin_service.check_admin(token)
    random_password = await generate_random_password()
    new_user = UserCreateSchema(
        name=user.name,
        surname=user.surname,
        patronymic=user.patronymic,
        email=user.email,
        password=random_password)

    return await register(new_user, db)


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
