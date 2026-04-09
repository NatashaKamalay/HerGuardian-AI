import requests

ALERT_URL = "http://127.0.0.1:8000/alerts"


def send_alert(alert_data):
    try:
        response = requests.post(ALERT_URL, json=alert_data)
        print("Alert sent:", response.status_code)

        data = response.json()
        print(data)

        return data
    except Exception as e:
        print("Error sending alert:", e)
        return None