from ultralytics import YOLO
import cv2

model = YOLO("yolov8n.pt")


def detect_people(frame):
    results = model(frame, verbose=False)

    people_count = 0
    annotated_frame = frame.copy()

    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])

            # COCO class 0 = person
            if cls == 0:
                people_count += 1

                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = float(box.conf[0])

                cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(
                    annotated_frame,
                    f"Person {conf:.2f}",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 255, 0),
                    2
                )

    return people_count, annotated_frame