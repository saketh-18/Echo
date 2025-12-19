import uuid
from typing import Optional
from fastapi import Depends, Request, HTTPException, status
from fastapi_users import BaseUserManager, UUIDIDMixin, FastAPIUsers, schemas
from fastapi_users.authentication import AuthenticationBackend, BearerTransport, JWTStrategy
from fastapi_users.db import SQLAlchemyUserDatabase
from database.models.user import User
from database.session import get_user_db
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt

SECRET = "YOUR_SECRET_KEY" # strong key later

# instead of pydantic models
class UserRead(schemas.BaseUser[uuid.UUID]):
    username: str
    connection_count: int

class UserCreate(schemas.BaseUserCreate):
    username: str
    # email and password are required by default

class UserUpdate(schemas.BaseUserUpdate):
    username: Optional[str] = None

# 2. DEFINE DATABASE ADAPTER
# async def get_user_db(session=Depends(get_db)):
#     yield SQLAlchemyUserDatabase(session, User)

# 3. DEFINE MANAGER (Handles the logic you were writing manually)
class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"User {user.username} has registered.")

async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)

# 4. DEFINE JWT SETTINGS
bearer_transport = BearerTransport(tokenUrl="auth/login")

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

# 5. EXPORT THE APP
fastapi_users = FastAPIUsers[User, uuid.UUID](
    get_user_manager,
    [auth_backend],
)

# current_active_user = fastapi_users.current_user(active=True)

security = HTTPBearer()

def get_token_payload(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    
    try:
        # 1. Decode and validate the token signature and expiration
        # 'audience' param is usually 'fastapi-users:auth', but defaults often work without it 
        # unless you configured it specifically.
        payload = jwt.decode(token, SECRET, algorithms=["HS256"], audience="fastapi-users:auth")
        
        # 2. Return the raw payload (e.g., {'sub': 'uuid...', 'exp': ...})
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    
    