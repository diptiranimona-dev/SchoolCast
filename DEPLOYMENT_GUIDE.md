# SchoolCast — Master Deployment & Execution Manual

This document is your complete, step-by-step guide to preparing SchoolCast at home, pushing it to GitHub, and setting it up at school **without using a pen drive**.

---

## PART 1: What to Do at Home (Before Going to School)

### Step 1: Package the Smartboard Agent into a Standalone `.exe`
You need to compile the Python agent into a standalone Windows executable so classroom smartboards don't need Python installed.
1. Open PowerShell on your home computer and navigate to the agent directory:
   ```powershell
   cd "C:\Users\VISHNU NAYAK\SchoolCast\agent"
   ```
2. Install PyInstaller (if not already installed):
   ```powershell
   pip install pyinstaller
   ```
3. Build the executable:
   ```powershell
   pyinstaller --noconsole --onefile main.py -n SchoolCastAgent
   ```
4. Find your generated `.exe` file here:
   `C:\Users\VISHNU NAYAK\SchoolCast\agent\dist\SchoolCastAgent.exe`

### Step 2: Push Your Code & Upload the `.exe` to GitHub
1. Open PowerShell in your project root:
   ```powershell
   cd "C:\Users\VISHNU NAYAK\SchoolCast"
   ```
2. Initialize git, commit your files, and push to GitHub (replace `YOUR_USERNAME` with your GitHub username):
   ```powershell
   git init
   git add .
   git commit -m "Initial commit: SchoolCast System"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/schoolcast.git
   git push -u origin main
   ```
3. **Upload the `.exe`**:
   - Go to your GitHub repository in your browser (`https://github.com/YOUR_USERNAME/schoolcast`).
   - Click on **Releases** on the right side -> **Create a new release**.
   - Tag version: `v1.0.0`
   - Drag and drop `SchoolCastAgent.exe` into the assets box and click **Publish release**.
   - Copy the direct download link for `SchoolCastAgent.exe` (you will type this link into smartboard browsers at school).

---

## PART 2: What to Do When You Arrive at School

When you arrive at school, you have **no pen drive**. Everything is deployed over the school LAN and GitHub.

### Step 1: Set Up the SchoolCast Server (The Hub)
1. Plug a designated server PC (or the Principal's office PC) into the school network (Ethernet/Wi-Fi).
2. Open PowerShell on that PC and find its local IP address:
   ```powershell
   ipconfig
   ```
   *Note down the **IPv4 Address** (for example: `192.168.1.50`).*
3. Copy your `SchoolCast` project folder onto this PC (via network share, OneDrive, or cloning from your GitHub repository).
4. Open PowerShell in `SchoolCast\server`:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
   *(Keep this terminal window running!)*
5. **Allow Windows Firewall**: Open PowerShell as Administrator on the server PC and run:
   ```powershell
   New-NetFirewallRule -DisplayName "SchoolCast Server" -Direction Inbound -Protocol TCP -LocalPort 8000 -Action Allow
   ```

### Step 2: Open the Principal Admin Dashboard
1. On the Principal's computer (or your laptop connected to the school network), open a web browser.
2. Go to the Admin Dashboard (if running locally: `http://localhost:3000`, or host it on the server).
3. Log in with:
   - **Username**: `principal`
   - **Password**: `schoolcast2026`

### Step 3: Deploy to Classroom Smartboards (No Pen Drive!)
Walk into each classroom (e.g., Class 6A, Class 6B):
1. Open Microsoft Edge or Chrome on the classroom smartboard.
2. Type your GitHub Release direct download link for the agent:
   `https://github.com/YOUR_USERNAME/schoolcast/releases/download/v1.0.0/SchoolCastAgent.exe`
3. Download and run `SchoolCastAgent.exe`.
4. A prompt will appear asking: *"Enter Classroom Name (e.g. Class 6A):"*
   - Type the classroom name and click **OK**.
   - The app automatically registers itself with your server (`192.168.1.50:8000`) in the background!
5. **Make it Auto-Start on Windows Login**:
   - Press `Win + R`, type `shell:startup`, and press Enter.
   - Place a shortcut of `SchoolCastAgent.exe` inside that Startup folder.

---

## PART 3: Where to Open Everything Summary

| Component | Where it Runs | How to Open / Access |
| :--- | :--- | :--- |
| **SchoolCast Server** | Server PC in Office | PowerShell in `server/`, run `uvicorn app.main:app --host 0.0.0.0 --port 8000` |
| **Admin Dashboard** | Principal's PC / Laptop | Browser at `http://localhost:3000` (or server IP) |
| **Smartboard Agent** | Classroom Smartboards | Downloaded from GitHub link, runs automatically on Windows startup |
