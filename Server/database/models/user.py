import uuid
from sqlalchemy import Column, String, Integer, DateTime, Boolean, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database.base import Base
from fastapi_users.db import SQLAlchemyBaseUserTableUUID

class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "users"

    username = Column(String, unique=True, nullable=False)

    connection_count = Column(Integer, default=5)

    created_at = Column(DateTime, server_default=func.now())
    last_seen = Column(DateTime, nullable=True)
    
    is_banned = Column(Boolean, default=False)   
    ban_expires_at = Column(DateTime, nullable=True)
    
    plan = Column(Integer, CheckConstraint("plan IN (0,1,2,3,4)", name="check_plan_details"), nullable=False,   default=0)
    
    # Indexes
    
    __table_args__ = (
        Index('idx_user_status', 'id', 'is_banned'),
    )

