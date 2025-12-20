from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.models.connection import Connection

class ConnectionService:
    @staticmethod
    async def create_connection(
        db: AsyncSession,
        user_a: str,
        user_b: str
    ) -> Connection:
        connection = Connection(
            user_a=user_a,
            user_b=user_b
        )
        db.add(connection)
        await db.commit()
        await db.refresh(connection)
        return connection
