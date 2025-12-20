from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from fastapi import Depends
from fastapi_users.db import SQLAlchemyUserDatabase
from database.models.user import User

DATABASE_URL = "postgresql+asyncpg://postgres:saketh@localhost:5432/Quirk"

engine = create_async_engine(
    DATABASE_URL,
    echo=True  # logs every sql query generated
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession, # sqlalchemy by default is synchronous, by using async we can await session.execute()...etc..
    expire_on_commit=False
)

# @asynccontextmanager
async def get_db(): # handles cleanup to be used as a dependency in fastapi server
    async with AsyncSessionLocal() as session:
        yield session
        
        
async def get_user_db(session: AsyncSession = Depends(get_db)):
    yield SQLAlchemyUserDatabase(session, User)
