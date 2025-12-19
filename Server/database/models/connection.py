import uuid
from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database.base import Base

class Connection(Base):
    __tablename__ = "connections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_a = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    user_b = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))

    status = Column(String, default="active")

    created_at = Column(DateTime, server_default=func.now())
    last_interaction = Column(DateTime)
