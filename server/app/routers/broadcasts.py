from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import os
import shutil
from datetime import datetime
from app.database import get_db
from app.models import BroadcastSession, Smartboard
from app.schemas import BroadcastCreate, BroadcastResponse
from app.services.websocket_manager import manager

router = APIRouter(prefix="/api/broadcasts", tags=["Broadcasts"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/start", response_model=BroadcastResponse)
async def start_broadcast(broadcast_in: BroadcastCreate, db: Session = Depends(get_db)):
    # Create broadcast record
    session = BroadcastSession(
        title=broadcast_in.title,
        content_type=broadcast_in.content_type,
        content_data=json.dumps(broadcast_in.content_data) if isinstance(broadcast_in.content_data, (dict, list)) else str(broadcast_in.content_data),
        selected_boards=json.dumps(broadcast_in.selected_boards),
        status="broadcasting",
        start_time=datetime.utcnow()
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Prepare command message for agents
    message = {
        "action": "start_broadcast",
        "session_id": session.id,
        "title": session.title,
        "content_type": session.content_type,
        "content_data": broadcast_in.content_data
    }

    # Dispatch to selected boards via WebSocket
    results = await manager.broadcast_to_agents(broadcast_in.selected_boards, message)

    success_count = sum(1 for k, v in results.items() if v)
    fail_count = len(broadcast_in.selected_boards) - success_count

    session.successful_deliveries = success_count
    session.failed_deliveries = fail_count
    db.commit()

    return session

@router.post("/stop/{session_id}")
async def stop_broadcast(session_id: int, db: Session = Depends(get_db)):
    session = db.query(BroadcastSession).filter(BroadcastSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Broadcast session not found")

    session.status = "ended"
    session.end_time = datetime.utcnow()
    db.commit()

    selected_boards = json.loads(session.selected_boards)
    message = {
        "action": "stop_broadcast",
        "session_id": session.id
    }
    await manager.broadcast_to_agents(selected_boards, message)

    return {"message": "Broadcast stopped successfully"}

@router.get("/active", response_model=List[BroadcastResponse])
def get_active_broadcasts(db: Session = Depends(get_db)):
    return db.query(BroadcastSession).filter(BroadcastSession.status == "broadcasting").all()

@router.get("/history", response_model=List[BroadcastResponse])
def get_broadcast_history(db: Session = Depends(get_db)):
    return db.query(BroadcastSession).order_by(BroadcastSession.start_time.desc()).all()

@router.post("/upload")
async def upload_media_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "url": f"/uploads/{file.filename}"}
