from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.auth_service import AuthService
from src.auth.custom_oauth2 import OAuth2PasswordBearerWithCookie
from src.auth.schemas import UserCreateSchema
from src.auth.user_service import UserService
from src.database import get_db
from src.auth.status_codes import StatusCodes as status_code
from src.notifications.gmail_sender import GmailSender

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)
oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="auth/token")


@router.post("/register", responses=status_code.register)
async def register(user: UserCreateSchema, db: AsyncSession = Depends(get_db)):
    user_service = UserService(db)
    result = await user_service.create_user(user)
    email_info = GmailSender(user.email, user.password)
    email_info.send_email(user.email)
    return result


@router.post("/token", responses=status_code.login)
async def login_for_access_token(response: Response, form_data: OAuth2PasswordRequestForm = Depends(),
                                 db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    user = await auth_service.authenticate_user(form_data.username, form_data.password)
    if user:
        access_token = await auth_service.create_access_token(
            data={"sub": user.email},
        )
        response.set_cookie(key="access_token", value=f"Bearer {access_token}", httponly=True)
        return {
            "access_token": access_token,
            'token_type': 'Bearer'
        }


@router.get("/users/me", responses=status_code.read_user_info)
async def read_users_me(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    user = await auth_service.get_current_user(token)
    return user
