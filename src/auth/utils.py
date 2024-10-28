from datetime import datetime, timedelta
from typing import Any, Optional

import jwt
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import validate_email
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from src.auth.custom_oauth2 import OAuth2PasswordBearerWithCookie
from src.auth.schemas import TokenData
from src.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from src.database import User as DB_User, get_db
from fastapi import HTTPException, status

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="auth/token")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


async def create_user(username: str, email: str, password: str, db_session: AsyncSession) -> dict[str, str]:
    result = await db_session.execute(select(DB_User).where(email == DB_User.email))
    existing_email_user = result.scalars().first()
    if existing_email_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    result = await db_session.execute(select(DB_User).where(username == DB_User.username))
    existing_username_user = result.scalars().first()
    if existing_username_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
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
        "status_code": "200",
        "detail": "Successfully registered"
    }


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_user_by_email(email: str, db: AsyncSession) -> Optional[DB_User]:
    result = await db.execute(select(DB_User).filter(email == DB_User.email))
    return result.scalars().first()


async def get_user_by_username(username: str, db: AsyncSession) -> Optional[DB_User]:
    result = await db.execute(select(DB_User).filter(username == DB_User.username))
    return result.scalars().first()


async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    payload = verify_token(token)
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token doesn't contains email",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token_data = TokenData(email=email)
    user = await get_user_by_email(email=token_data.email, db=db)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {
        'user_id': user.id,
        'email': user.email,
        'username': user.username,
        'is_active': user.is_active,
        'is_admin': user.is_admin,
        'created_at': user.created_at,
        'updated_at': user.updated_at,
    }

