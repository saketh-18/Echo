from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from database.session import get_db
from routers.auth import get_token_payload
from services.message_service import MessageService

router = APIRouter();


@router.get("/messages")
async def get_messages(payload : dict = Depends(get_token_payload), connection_id : str | None = None, db : AsyncSession = Depends(get_db)):
    if payload:
        if connection_id:
            connection_id_uuid = uuid.UUID(connection_id)
            msg_list = await MessageService.fetch_messages(
                db,
                connection_id_uuid,
                50,
            )
            return msg_list
        else:
            return {
                "message" : "wrong connection id"
            }
    else:
        return {
        "message" : "you need to login first"
    }

    