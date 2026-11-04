# SchoolCast — One Command. Every Classroom.

SchoolCast is a professional LAN-based school smartboard broadcasting and screen-sharing system designed for Windows environments (20–50 smartboards). It allows principals and authorised administrators to instantly display announcements, images, PDFs, websites, YouTube livestreams, and live screen shares on selected classroom smartboards **without closing or destroying the teacher's ongoing work**.

---

## Architecture

SchoolCast consists of three integrated components:
1. **SchoolCast Server (`server/`)**: FastAPI backend managing smartboard registrations, WebSockets, broadcast orchestration, SQLite database, and audit logs.
2. **SchoolCast Agent (`agent/`)**: PySide6 Windows application running on smartboards. Connects via WebSocket, manages Windows Core Audio sessions (muting other apps during announcements), displays fullscreen overlays, and preserves underlying teacher applications.
3. **SchoolCast Admin (`admin/`)**: React + TypeScript + Vite + Tailwind CSS principal dashboard for targeting specific classrooms, initiating broadcasts, and monitoring connection status.

---

## How to Run the Application

### A. Install Dependencies

1. **Python Dependencies (Server & Agent)**:
   ```powershell
   cd server
   pip install -r requirements.txt
   
   cd ../agent
   pip install -r requirements.txt
   ```

2. **Frontend Admin Dependencies**:
   ```powershell
   cd ../admin
   npm install
   ```

### B. Start the Server
```powershell
cd server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### C. Start the Principal Dashboard
```powershell
cd admin
npm run dev
```
Open your browser at `http://localhost:3000`.

### D. Build the Windows Smartboard Installer (PyInstaller)
To package the SchoolCast Agent into a standalone `.exe` for smartboard deployment:
```powershell
cd agent
pip install pyinstaller
pyinstaller --noconsole --onefile main.py -n SchoolCastAgent
```
The compiled executable will be in `agent/dist/SchoolCastAgent.exe`.

### E. Install and Configure Agent on Smartboards
1. Copy `SchoolCastAgent.exe` to the smartboard.
2. Configure environment variables or configuration file to point to the server IP (e.g. `SCHOOLCAST_SERVER_WS=ws://192.168.1.100:8000/ws/agent/BOARD-01`).
3. Set the agent to start automatically on Windows user login (via Windows Task Scheduler or Startup folder).

### F. Configure Server IP & Firewall
* Ensure TCP port `8000` is allowed in Windows Firewall on the server machine:
  ```powershell
  New-NetFirewallRule -DisplayName "SchoolCast Server" -Direction Inbound -Protocol TCP -LocalPort 8000 -Action Allow
  ```

### G. Authentication Credentials
* Default Principal Admin Username: `principal`
* Default Principal Admin Password: `schoolcast2026`
