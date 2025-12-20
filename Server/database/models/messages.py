import uuid
from sqlalchemy import Column, DateTime, ForeignKey, Index, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database.base import Base


class Messages(Base):
    __tablename__ = "messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    connection_id = Column(UUID(as_uuid=True), ForeignKey("connections.id", ondelete="CASCADE"), nullable=False)
    
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    contents = Column(Text, nullable=False)
    
    created_at = Column(DateTime, server_default=func.now())
    
    __table_args__ = (
        # for getting messages of a particular connection sorted by time
        Index("idx_chat_history", 'connection_id' , 'created_at'),
        
        Index("idx_sender_history", 'sender_id')
    )