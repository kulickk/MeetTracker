from fastapi_users.authentication import CookieTransport
from fastapi_users.authentication import JWTStrategy, AuthenticationBackend
from src.config import JWT_SECRET

cookie_transport = CookieTransport(cookie_name='meet-tracker', cookie_max_age=36000)

SECRET = JWT_SECRET


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=36000)


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)
