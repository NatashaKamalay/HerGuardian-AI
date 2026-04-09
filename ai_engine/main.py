import cv2
import time

from detector import detect_people
from gesture import detect_gesture
from risk import calculate_risk
from sender import send_incident
from alert_sender import send_alert
from save_utils import save_snapshot


def normalize_risk_score(score):
    """
    Normalize any incoming risk score to a clean 0-10 scale.
    This protects the backend contract and keeps dashboard metrics credible.
    """
    try:
        score = float(score)
    except (TypeError, ValueError):
        return 0.0

    # If old logic returns something like 60, convert it to 6.0
    if score > 10:
        score = score / 10.0

    score = max(0.0, min(score, 10.0))
    return round(score, 1)


def run():
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

    if not cap.isOpened():
        print("Error: Could not open webcam")
        return

    print("Webcam opened successfully")
    print("Raise both hands above head for SOS detection")
    print("Press 'i' for manual incident")
    print("Press 'q' to quit")

    ALERT_COOLDOWN = 10
    last_alert_time = 0

    while True:
        ret, frame = cap.read()

        if not ret or frame is None:
            print("Error: Could not read frame from webcam")
            break

        people_count, annotated_frame = detect_people(frame)
        gesture = detect_gesture(frame)

        female_count = 1 if people_count >= 1 else 0
        male_count = max(people_count - female_count, 0)

        raw_risk_score, severity, reasons = calculate_risk(
            female_count=female_count,
            male_count=male_count,
            gesture=gesture,
            people_count=people_count
        )

        risk_score = normalize_risk_score(raw_risk_score)

        current_time = time.time()
        cooldown_remaining = max(0, int(ALERT_COOLDOWN - (current_time - last_alert_time)))

        cv2.putText(
            annotated_frame,
            f"People Count: {people_count}",
            (20, 30),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 0, 0),
            2
        )

        cv2.putText(
            annotated_frame,
            f"Female Count: {female_count}",
            (20, 65),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 0, 255),
            2
        )

        cv2.putText(
            annotated_frame,
            f"Male Count: {male_count}",
            (20, 100),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 165, 255),
            2
        )

        cv2.putText(
            annotated_frame,
            f"Gesture: {gesture}",
            (20, 135),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 255),
            2
        )

        cv2.putText(
            annotated_frame,
            f"Risk: {risk_score} | Severity: {severity}",
            (20, 170),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 0, 255),
            2
        )

        cv2.putText(
            annotated_frame,
            f"Cooldown: {cooldown_remaining}s",
            (20, 205),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (128, 255, 128),
            2
        )

        cv2.imshow("HerGuardian AI - YOLO + Gesture Detection", annotated_frame)

        def create_incident_and_alert():
            nonlocal last_alert_time

            snapshot_path = save_snapshot(annotated_frame)

            incident_type = "woman_surrounded" if "woman_surrounded" in reasons else "normal_scene"
            if gesture == "SOS":
                incident_type = "distress_scene"

            summary = (
                f"Detected {people_count} people. "
                f"Female count={female_count}, male count={male_count}, "
                f"gesture={gesture}, reasons={reasons}"
            )

            incident = {
                "incident_type": incident_type,
                "source_module": "ai_monitoring",
                "severity": severity,
                "risk_score": risk_score,
                "location_name": "Zone A",
                "latitude": 17.3850,
                "longitude": 78.4867,
                "camera_id": "CAM01",
                "summary": summary,
                "snapshot_path": snapshot_path,
                "clip_path": ""
            }

            created_incident = send_incident(incident)

            if not created_incident or "id" not in created_incident:
                print("Incident creation failed or backend returned invalid response")
                print("Incident response:", created_incident)
                return

            print(f"Incident created successfully with ID: {created_incident['id']}")

            if severity in ["high", "critical"]:
                alert = {
                    "user_id": None,
                    "incident_id": created_incident["id"],
                    "alert_type": incident_type,
                    "source_module": "ai_monitoring",
                    "message": f"Alert: {incident_type} detected at Zone A with severity {severity}"
                }

                created_alert = send_alert(alert)

                if created_alert:
                    print("High-priority alert created")
                else:
                    print("Alert creation failed")

                last_alert_time = time.time()
            else:
                print(f"Incident created. No alert because severity is '{severity}'")

        if gesture == "SOS" and people_count >= 1 and severity in ["high", "critical"]:
            if current_time - last_alert_time >= ALERT_COOLDOWN:
                print("Auto-triggering SOS incident...")
                create_incident_and_alert()

        key = cv2.waitKey(1) & 0xFF

        if key == ord("i"):
            print("Manual incident trigger...")
            create_incident_and_alert()

        if key == ord("q"):
            print("Quitting...")
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run()