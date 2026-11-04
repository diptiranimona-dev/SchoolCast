import logging
import platform

logger = logging.getLogger("schoolcast.agent.audio")

class AudioManager:
    def __init__(self):
        self.muted_sessions = []
        self.is_windows = platform.system() == "Windows"

    def mute_other_applications(self):
        if not self.is_windows:
            return
        try:
            from pycaw.pycaw import AudioUtilities
            sessions = AudioUtilities.GetAllSessions()
            self.muted_sessions = []
            for session in sessions:
                volume = session.SimpleAudioVolume
                if volume:
                    # Check if muted already
                    is_muted = volume.GetMute()
                    process = session.Process
                    proc_name = process.name() if process else "Unknown"
                    # Do not mute SchoolCast itself or system sounds if possible
                    if proc_name.lower() not in ["schoolcast", "python.exe", "pythonw.exe"]:
                        if not is_muted:
                            volume.SetMute(1, None)
                            self.muted_sessions.append(volume)
                            logger.info(f"Muted audio session: {proc_name}")
        except Exception as e:
            logger.error(f"Failed to mute other audio sessions: {e}")

    def restore_applications(self):
        if not self.is_windows:
            return
        try:
            for volume in self.muted_sessions:
                try:
                    volume.SetMute(0, None)
                except Exception:
                    pass
            self.muted_sessions = []
            logger.info("Restored previous audio sessions.")
        except Exception as e:
            logger.error(f"Failed to restore audio sessions: {e}")
