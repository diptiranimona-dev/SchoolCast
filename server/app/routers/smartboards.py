from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Smartboard
from app.schemas import SmartboardCreate, SmartboardResponse
from app.services.websocket_manager import manager
import secrets

router = APIRouter(prefix="/api/smartboards", tags=["Smartboards"])

@router.get("/", response_model=List[SmartboardResponse])
def get_smartboards(db: Session = Depends(get_db)):
    boards = db.query(Smartboard).all()
    # Update online status based on active WebSocket connections
    for board in boards:
        if board.board_id in manager.agent_connections:
            board.status = "online"
        else:
            if board.status == "online":
                board.status = "offline"
    db.commit()
    return boards

@router.post("/", response_model=SmartboardResponse)
def register_smartboard(board_in: SmartboardCreate, db: Session = Depends(get_db)):
    existing = db.query(Smartboard).filter(Smartboard.board_id == board_in.board_id).first()
    if existing:
        existing.classroom = board_in.classroom
        if board_in.ip_address:
            existing.ip_address = board_in.ip_address
        db.commit()
        db.refresh(existing)
        return existing

    auth_token = secrets.token_hex(32)
    new_board = Smartboard(
        board_id=board_in.board_id,
        classroom=board_in.classroom,
        ip_address=board_in.ip_address,
        status="offline",
        auth_token=auth_token
    )
    db.add(new_board)
    db.commit()
    db.refresh(new_board)
    return new_board

@router.delete("/{board_id}")
def delete_smartboard(board_id: str, db: Session = Depends(get_db)):
    board = db.query(Smartboard).filter(Smartboard.board_id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Smartboard not found")
    db.delete(board)
    db.commit()
    manager.disconnect_agent(board_id)
    return {"message": "Smartboard deleted successfully"}
