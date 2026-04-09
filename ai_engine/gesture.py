import cv2
import mediapipe as mp

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()


def detect_gesture(frame):
    image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)

    if not results.pose_landmarks:
        return "NONE"

    landmarks = results.pose_landmarks.landmark

    left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST]
    right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST]
    nose = landmarks[mp_pose.PoseLandmark.NOSE]

    h, w, _ = frame.shape

    lw_y = int(left_wrist.y * h)
    rw_y = int(right_wrist.y * h)
    nose_y = int(nose.y * h)

    if lw_y < nose_y and rw_y < nose_y:
        return "SOS"

    return "NONE"