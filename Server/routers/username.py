import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from services.user_service import UserService
from database.session import get_db
from routers.auth import get_token_payload;

router = APIRouter();
@router.get("/username")
# def test_route(payload : dict = Depends(get_token_payload)):
#     user_id = uuid.UUID(payload.get("sub"));
#     return {"user_id" : user_id};
async def get_username(payload: dict = Depends(get_token_payload), db: AsyncSession = Depends(get_db)):
    user_id = uuid.UUID(payload.get("sub"))
    username = await UserService.fetch_username(db, user_id)
    
    if not username:
        # 404 is better than returning a dict with an error string
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"username": username} # Consistent JSON object