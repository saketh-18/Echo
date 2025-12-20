import asyncio
from database.session import engine
from database.base import Base
from database.models.user import User
from database.models.connection import Connection
from database.models.messages import Messages

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # create_all => CREATE IF NOT EXISTS
        # Does not alter the table if changes were made

if __name__ == "__main__":
    asyncio.run(init_db())
