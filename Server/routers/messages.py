from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from database.session import get_db
from routers.auth import get_token_payload
from services.message_service import MessageService

router = APIRouter();


@router.get("/messages")
async def get_messages(payload : dict = Depends(get_token_payload), connection_id : str | None = None, db : AsyncSession = Depends(get_db)):
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    
    if connection_id is None:
        raise HTTPException(status_code=400, detail="connection_id query parameter is required")
    
    try:
        connection_id_uuid = uuid.UUID(connection_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid connection_id format")
    
    msg_list = await MessageService.fetch_messages(
        db,
        connection_id_uuid,
        50,
    )
    return msg_list

    