import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from services.user_service import UserService
from database.session import get_db
from routers.auth import get_token_payload;

router = APIRouter();
@router.get("/username")
async def get_username(payload: dict = Depends(get_token_payload), db: AsyncSession = Depends(get_db)):
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    
    try:
        user_id = uuid.UUID(payload.get("sub"))
    except (ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid token payload")

    username = await UserService.fetch_username(db, user_id)
    
    if not username:
        # 404 is better than returning a dict with an error string
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"username": username} # Consistent JSON object