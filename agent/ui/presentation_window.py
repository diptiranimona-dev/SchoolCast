import sys
import json
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QLabel, QVBoxLayout, QHBoxLayout,
    QWidget, QPushButton, QStackedWidget, QScrollArea
)
from PySide6.QtCore import Qt, QUrl, Slot
from PySide6.QtGui import QPixmap, QColor, QPalette, QKeyEvent
from PySide6.QtWebEngineWidgets import QWebEngineView

class PresentationWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint | Qt.BypassWindowManagerHint)
        self.showFullScreen()

        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        self.layout = QVBoxLayout(self.central_widget)
        self.layout.setContentsMargins(0, 0, 0, 0)

        # Header bar with title and Exit/End indicator
        self.header_bar = QWidget()
        self.header_bar.setStyleSheet("background-color: #1e293b; color: white; padding: 12px;")
        header_layout = QHBoxLayout(self.header_bar)

        self.title_label = QLabel("SchoolCast Announcement")
        self.title_label.setStyleSheet("font-size: 18px; font-weight: bold; color: #f8fafc;")
        header_layout.addWidget(self.title_label)

        header_layout.addStretch()

        self.status_label = QLabel("LIVE BROADCAST")
        self.status_label.setStyleSheet("background-color: #ef4444; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold;")
        header_layout.addWidget(self.status_label)

        self.layout.addWidget(self.header_bar)

        # Content stack
        self.stack = QStackedWidget()
        self.layout.addWidget(self.stack)

        # Default placeholder view
        self.default_view = QWidget()
        self.default_layout = QVBoxLayout(self.default_view)
        self.content_label = QLabel("Loading Broadcast...")
        self.content_label.setAlignment(Qt.AlignCenter)
        self.content_label.setStyleSheet("font-size: 24px; color: #334155; font-weight: bold;")
        self.default_layout.addWidget(self.content_label)
        self.stack.addWidget(self.default_view)

    def load_content(self, content_type: str, title: str, content_data):
        self.title_label.setText(title)

        if content_type == "text":
            text_widget = QWidget()
            layout = QVBoxLayout(text_widget)
            layout.setAlignment(Qt.AlignCenter)

            heading = content_data.get("heading", title)
            body = content_data.get("body", "")

            heading_lbl = QLabel(heading)
            heading_lbl.setStyleSheet("font-size: 36px; font-weight: bold; color: #1e293b; margin-bottom: 20px;")
            heading_lbl.setAlignment(Qt.AlignCenter)

            body_lbl = QLabel(body)
            body_lbl.setStyleSheet("font-size: 24px; color: #475569;")
            body_lbl.setAlignment(Qt.AlignCenter)
            body_lbl.setWordWrap(True)

            layout.addWidget(heading_lbl)
            layout.addWidget(body_lbl)

            text_widget.setStyleSheet("background-color: #f8fafc;")
            self.stack.addWidget(text_widget)
            self.stack.setCurrentWidget(text_widget)

        elif content_type in ["website", "youtube", "screenshare"]:
            url = content_data if isinstance(content_data, str) else content_data.get("url", "https://www.google.com")
            web_view = QWebEngineView()
            web_view.setUrl(QUrl(url))
            self.stack.addWidget(web_view)
            self.stack.setCurrentWidget(web_view)

        elif content_type == "image":
            image_url = content_data if isinstance(content_data, str) else content_data.get("url", "")
            img_widget = QLabel()
            img_widget.setAlignment(Qt.AlignCenter)
            pixmap = QPixmap(image_url)
            if not pixmap.isNull():
                img_widget.setPixmap(pixmap.scaled(self.size(), Qt.KeepAspectRatio, Qt.SmoothTransformation))
            else:
                img_widget.setText(f"Unable to load image: {image_url}")
                img_widget.setStyleSheet("font-size: 20px; color: red;")
            self.stack.addWidget(img_widget)
            self.stack.setCurrentWidget(img_widget)

        else:
            self.content_label.setText(f"Broadcasting {content_type}: {title}")

    def keyPressEvent(self, event: QKeyEvent):
        # Prevent escaping broadcast via ESC unless authorized, but allow debugging if needed
        if event.key() == Qt.Key_Escape:
            event.ignore()
