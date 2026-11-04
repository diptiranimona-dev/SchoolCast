import sys
import os
import json
import asyncio
import websockets
import logging
import requests
from PySide6.QtWidgets import QApplication, QInputDialog, QMessageBox
from PySide6.QtCore import QThread, Signal
from services.audio_manager import AudioManager
from ui.presentation_window import PresentationWindow

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("schoolcast.agent")

CONFIG_FILE = os.path.join(os.path.expanduser("~"), ".schoolcast_config.json")

def get_or_create_config():
    server_ip = os.getenv("SCHOOLCAST_SERVER_IP", "127.0.0.1")
    server_port = os.getenv("SCHOOLCAST_SERVER_PORT", "8000")

    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r") as f:
                config = json.load(f)
                return config.get("server_ip", server_ip), config.get("server_port", server_port), config.get("board_id"), config.get("classroom")
        except Exception:
            pass
    return server_ip, server_port, None, None

def save_config(server_ip, server_port, board_id, classroom):
    config = {
        "server_ip": server_ip,
        "server_port": server_port,
        "board_id": board_id,
        "classroom": classroom
    }
    try:
        with open(CONFIG_FILE, "w") as f:
            json.dump(config, f)
    except Exception as e:
        logger.error(f"Failed to save config: {e}")

class AgentClientWorker(QThread):
    broadcast_received = Signal(dict)
    broadcast_stopped = Signal()

    def __init__(self, ws_url):
        super().__init__()
        self.ws_url = ws_url

    async def listen(self):
        while True:
            try:
                logger.info(f"Connecting to SchoolCast server at {self.ws_url}...")
                async with websockets.connect(self.ws_url) as websocket:
                    logger.info("Connected to SchoolCast server successfully.")
                    while True:
                        message_str = await websocket.recv()
                        data = json.loads(message_str)
                        action = data.get("action")
                        if action == "start_broadcast":
                            self.broadcast_received.emit(data)
                        elif action == "stop_broadcast":
                            self.broadcast_stopped.emit()
            except Exception as e:
                logger.error(f"WebSocket connection error: {e}. Reconnecting in 5 seconds...")
                await asyncio.sleep(5)

    def run(self):
        asyncio.run(self.listen())

class SmartboardAgentApp:
    def __init__(self):
        self.app = QApplication(sys.argv)

        server_ip, server_port, board_id, classroom = get_or_create_config()

        # If first run or unconfigured, prompt user/teacher for Classroom name
        if not board_id or not classroom:
            app_instance = QApplication.instance()
            cls_name, ok = QInputDialog.getText(None, "SchoolCast Agent Setup", "Enter Classroom Name (e.g. Class 6A):")
            if not ok or not cls_name:
                sys.exit(0)
            classroom = cls_name.strip()
            board_id = f"BOARD-{abs(hash(classroom)) % 9000 + 1000}"

            # Auto-register with server via REST API
            try:
                reg_url = f"http://{server_ip}:{server_port}/api/smartboards/"
                requests.post(reg_url, json={"board_id": board_id, "classroom": classroom}, timeout=5)
            except Exception as e:
                logger.error(f"Auto-registration warning: {e}")

            save_config(server_ip, server_port, board_id, classroom)

        self.audio_manager = AudioManager()
        self.presentation_window = None

        ws_url = f"ws://{server_ip}:{server_port}/ws/agent/{board_id}"
        self.worker = AgentClientWorker(ws_url)
        self.worker.broadcast_received.connect(self.handle_start_broadcast)
        self.worker.broadcast_stopped.connect(self.handle_stop_broadcast)
        self.worker.start()

    def handle_start_broadcast(self, data):
        logger.info(f"Starting broadcast: {data.get('title')}")
        self.audio_manager.mute_other_applications()

        if not self.presentation_window:
            self.presentation_window = PresentationWindow()

        content_type = data.get("content_type", "text")
        title = data.get("title", "Announcement")
        content_data = data.get("content_data", {})

        self.presentation_window.load_content(content_type, title, content_data)
        self.presentation_window.showFullScreen()

    def handle_stop_broadcast(self):
        logger.info("Stopping broadcast and restoring environment.")
        self.audio_manager.restore_applications()
        if self.presentation_window:
            self.presentation_window.close()
            self.presentation_window = None

    def run(self):
        sys.exit(self.app.exec())

if __name__ == "__main__":
    agent = SmartboardAgentApp()
    agent.run()
