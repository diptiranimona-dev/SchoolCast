from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float
from datetime import datetime
from app.database import Base

class Smartboard(Base):
    __tablename__ = "smartboards"

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(String, unique=True, index=True, nullable=False)
    classroom = Column(String, nullable=False)
    ip_address = Column(String, nullable=True)
    status = Column(String, default="offline") # online, offline, broadcasting, warning
    last_seen = Column(DateTime, default=datetime.utcnow)
    auth_token = Column(String, nullable=False)

class BroadcastSession(Base):
    __tablename__ = "broadcast_sessions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content_type = Column(String, nullable=False) # text, image, pdf, website, youtube, video, ppt, screenshare
    content_data = Column(Text, nullable=True) # JSON or URL or text content
    selected_boards = Column(Text, nullable=False) # JSON list of board_ids
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    status = Column(String, default="preparing") # preparing, starting, broadcasting, ending, ended, failed
    successful_deliveries = Column(Integer, default=0)
    failed_deliveries = Column(Integer, default=0)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    username = Column(String, nullable=False)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String, nullable=True)

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
