import requests

BACKEND_URL = "http://127.0.0.1:8000/incidents"


def send_incident(incident_data):
    try:
        response = requests.post(BACKEND_URL, json=incident_data)
        print("Sent to backend:", response.status_code)

        data = response.json()
        print(data)

        return data
    except Exception as e:
        print("Error sending incident:", e)
        return None