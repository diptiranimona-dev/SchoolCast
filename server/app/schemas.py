from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

class SmartboardBase(BaseModel):
    board_id: str
    classroom: str
    ip_address: Optional[str] = None

class SmartboardCreate(SmartboardBase):
    pass

class SmartboardResponse(SmartboardBase):
    id: int
    status: str
    last_seen: datetime

    class Config:
        from_attributes = True

class BroadcastCreate(BaseModel):
    title: str
    content_type: str
    content_data: Any
    selected_boards: List[str]

class BroadcastResponse(BaseModel):
    id: int
    title: str
    content_type: str
    start_time: datetime
    end_time: Optional[datetime] = None
    status: str
    successful_deliveries: int
    failed_deliveries: int

    class Config:
        from_attributes = True

class AdminLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
