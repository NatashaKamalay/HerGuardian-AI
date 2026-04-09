import os
import cv2
from datetime import datetime


def save_snapshot(frame):
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    snapshot_dir = os.path.join(base_dir, "storage", "snapshots")
    os.makedirs(snapshot_dir, exist_ok=True)

    filename = f"incident_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
    full_path = os.path.join(snapshot_dir, filename)

    cv2.imwrite(full_path, frame)

    return full_path