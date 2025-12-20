import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.models.messages import Messages
from database.models.connection import Connection


class MessageService:
    @staticmethod
    async def create_message(
        db: AsyncSession,
        connection_id: uuid.UUID,
        sender_id: uuid.UUID,
        contents: str
    ) -> Messages:
        """
        Persist a saved-chat message.
        This is ALWAYS called before attempting realtime delivery.
        """
        message = Messages(
            connection_id=connection_id,
            sender_id=sender_id,
            contents=contents
        )
        db.add(message)
        await db.commit()
        await db.refresh(message)
        return message

    @staticmethod
    async def get_other_user_id(
        db: AsyncSession,
        connection_id: uuid.UUID,
        sender_id: uuid.UUID
    ) -> uuid.UUID | None:
        """
        Given a connection and sender, return the other user's ID.
        """
        stmt = select(Connection).where(Connection.id == connection_id)
        result = await db.execute(stmt)
        connection = result.scalar_one_or_none()

        if not connection:
            return None

        if connection.user_a == sender_id:
            return connection.user_b
        if connection.user_b == sender_id:
            return connection.user_a

        return None

    @staticmethod
    async def fetch_messages(
        db: AsyncSession,
        connection_id: uuid.UUID,
        limit: int = 50,
        before=None
    ):
        """
        Fetch chat history (HTTP use only).
        """
        stmt = select(Messages).where(
            Messages.connection_id == connection_id
        ).order_by(Messages.created_at.desc()).limit(limit)

        if before:
            stmt = stmt.where(Messages.created_at < before)

        result = await db.execute(stmt)
        return list(reversed(result.scalars().all()))
