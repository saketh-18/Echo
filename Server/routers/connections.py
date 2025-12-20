from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import or_, select
from database.session import get_db
from database import models
from database.models.connection import Connection
from sqlalchemy.ext.asyncio import AsyncSession

from database import models
from routers.auth import get_token_payload

router = APIRouter();

@router.get("/connections")
async def get_connections(payload : dict = Depends(get_token_payload), db: AsyncSession = Depends(get_db)):
    user_id = payload.get("sub");
    
    query = select(Connection).where(
    or_(Connection.user_a == user_id, Connection.user_b == user_id)
    ) 
    result = await db.execute(query);
    
    return result.scalars().all()
    
    