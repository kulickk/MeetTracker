from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.custom_oauth2 import OAuth2PasswordBearerWithCookie
from src.auth.schemas import UserCreateSchema, TokenData
from src.auth.utils import create_user, verify_password, get_user_by_email, \
    create_access_token, get_user_by_username, get_current_user, verify_token
from src.config import ACCESS_TOKEN_EXPIRE_MINUTES
from src.database import get_db
from src.auth.status_codes import register_status_codes, login_status_codes, read_user_info_status_codes

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)
oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="auth/token")


@router.post("/register", responses=register_status_codes)
async def register(user: UserCreateSchema, db: AsyncSession = Depends(get_db)):
    result = await create_user(username=user.username, email=user.email, password=user.password, db_session=db)
    return result


@router.post("/token", responses=login_status_codes)
async def login_for_access_token(response: Response, form_data: OAuth2PasswordRequestForm = Depends(),
                                 db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(form_data.username, db)
    if not user:
        user = await get_user_by_username(form_data.username, db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Wrong email or password"
            )
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Wrong email or password"
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    response.set_cookie(key="access_token", value=f"Bearer {access_token}", httponly=True)
    return {
        "access_token": access_token,
        'token_type': 'Bearer'
    }


@router.get("/users/me", responses=read_user_info_status_codes)
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
