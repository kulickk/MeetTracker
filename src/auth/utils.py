from datetime import datetime

from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from src.database import User as DB_User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


async def create_user(username: str, email: str, password: str, db_session: AsyncSession) -> dict[str, str]:
    result = await db_session.execute(select(DB_User).where((username == DB_User.username) | (DB_User.email == email)))
    existing_user = result.scalars().first()
    if existing_user:
        return {
            'status': 'Failed',
            'description': 'Пользователь с таким именем пользователя или email уже существует.'
        }
    hashed_password = get_password_hash(password)

    new_user = DB_User(
        username=username,
        email=email,
        hashed_password=hashed_password,
        is_active=True,
        is_admin=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db_session.add(new_user)
    await db_session.commit()
    await db_session.refresh(new_user)

    return {
        'status': 'OK',
        'username': username,
        'email': email,
        'id': new_user.id
    }
