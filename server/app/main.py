from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base, SessionLocal
from app.models import AdminUser
from app.routers import auth, smartboards, broadcasts
from app.services.websocket_manager import manager
from passlib.context import CryptContext
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SchoolCast Server", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), "uploads")

app.include_router(auth.router)
app.include_router(smartboards.router)
app.include_router(broadcasts.router)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    admin = db.query(AdminUser).filter(AdminUser.username == "principal").first()
    if not admin:
        hashed_pw = pwd_context.hash("schoolcast2026")
        default_admin = AdminUser(username="principal", hashed_password=hashed_pw)
        db.add(default_admin)
        db.commit()
    db.close()

@app.websocket("/ws/agent/{board_id}")
async def agent_websocket_endpoint(websocket: WebSocket, board_id: str):
    await manager.connect_agent(board_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming agent telemetry / ping if needed
    except WebSocketDisconnect:
        manager.disconnect_agent(board_id)

@app.websocket("/ws/admin")
async def admin_websocket_endpoint(websocket: WebSocket):
    await manager.connect_admin(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_admin(websocket)

@app.get("/")
def read_root():
    return {"system": "SchoolCast Server", "status": "running", "version": "1.0.0"}
