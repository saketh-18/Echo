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
    return JWTStrategy(secret=SECRET, lifetime_seconds=36000) # validity = one hour

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

security = HTTPBearer(auto_error=False)

def get_token_payload(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict | None:
    """
    Extract and validate JWT token from Bearer credentials.
    Returns the decoded payload or None if credentials are missing/invalid.
    """
    
    if credentials is None:
        return None
    
    token = credentials.credentials
    
    try:
        # 1. Decode and validate the token signature and expiration
        # 'audience' param is usually 'fastapi-users:auth', but defaults often work without it 
        # unless you configured it specifically.
        payload = jwt.decode(token, SECRET, algorithms=["HS256"], audience="fastapi-users:auth")
        
        # 2. Return the raw payload (e.g., {'sub': 'uuid...', 'exp': ...})
        return payload
        
    except jwt.ExpiredSignatureError:
        # Token has expired
        return None
    except jwt.InvalidAudienceError:
        # Try without audience verification
        try:
            payload = jwt.decode(
                token, 
                SECRET, 
                algorithms=["HS256"],
                options={"verify_aud": False}
            )
            return payload
        except (jwt.ExpiredSignatureError, jwt.PyJWTError):
            return None
    except jwt.PyJWTError:
        # Invalid token signature or format
        return None
    


def decode_fastapi_users_jwt(token: str):
    """
    Decode JWT token from fastapi-users.
    Tries with audience first, then without if that fails.
    """
    try:
        # Try decoding with audience first (fastapi-users default)
        payload = jwt.decode(
            token, 
            SECRET, 
            algorithms=["HS256"], 
            audience="fastapi-users:auth"
        )
        return payload
    except jwt.InvalidAudienceError:
        # Token doesn't have the expected audience, try without audience check
        try:
            payload = jwt.decode(
                token, 
                SECRET, 
                algorithms=["HS256"],
                options={"verify_aud": False}
            )
            return payload
        except (jwt.ExpiredSignatureError, jwt.PyJWTError) as e:
            print(f"JWT decode error (without audience): {e}")
            return None
    except jwt.ExpiredSignatureError as e:
        print(f"JWT token expired: {e}")
        return None
    except jwt.PyJWTError as e:
        print(f"JWT decode error: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error decoding JWT: {e}")
        return None