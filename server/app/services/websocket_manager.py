from fastapi import WebSocket
from typing import Dict, List, Any
import json
import logging

logger = logging.getLogger("schoolcast.websocket")

class ConnectionManager:
    def __init__(self):
        # board_id -> WebSocket
        self.agent_connections: Dict[str, WebSocket] = {}
        # admin or dashboard monitoring clients
        self.admin_connections: List[WebSocket] = []

    async def connect_agent(self, board_id: str, websocket: WebSocket):
        await websocket.accept()
        self.agent_connections[board_id] = websocket
        logger.info(f"Smartboard Agent connected: {board_id}")
        await self.broadcast_admin_status()

    def disconnect_agent(self, board_id: str):
        if board_id in self.agent_connections:
            del self.agent_connections[board_id]
            logger.info(f"Smartboard Agent disconnected: {board_id}")

    async def connect_admin(self, websocket: WebSocket):
        await websocket.accept()
        self.admin_connections.append(websocket)

    def disconnect_admin(self, websocket: WebSocket):
        if websocket in self.admin_connections:
            self.admin_connections.remove(websocket)

    async def send_to_agent(self, board_id: str, message: dict):
        if board_id in self.agent_connections:
            ws = self.agent_connections[board_id]
            try:
                await ws.send_text(json.dumps(message))
                return True
            except Exception as e:
                logger.error(f"Error sending to agent {board_id}: {e}")
                self.disconnect_agent(board_id)
                return False
        return False

    async def broadcast_to_agents(self, board_ids: List[str], message: dict):
        results = {}
        for board_id in board_ids:
            success = await self.send_to_agent(board_id, message)
            results[board_id] = success
        return results

    async def broadcast_admin_status(self):
        status_data = {
            "type": "status_update",
            "connected_boards": list(self.agent_connections.keys())
        }
        for admin_ws in self.admin_connections:
            try:
                await admin_ws.send_text(json.dumps(status_data))
            except Exception:
                pass

manager = ConnectionManager()
