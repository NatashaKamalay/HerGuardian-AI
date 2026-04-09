from datetime import datetime
from math import radians, sin, cos, sqrt, atan2

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from models import User, TrustedContact, TravelSession, Incident, Alert
from auth import hash_password, verify_password


def create_user(db: Session, name: str, email: str, phone: str, password: str):
    existing_email = db.query(User).filter(User.email == email).first()
    if existing_email:
        raise ValueError("Email already registered")

    existing_phone = db.query(User).filter(User.phone == phone).first()
    if existing_phone:
        raise ValueError("Phone number already registered")

    user = User(
        name=name,
        email=email,
        phone=phone,
        hashed_password=hash_password(password)
    )
    db.add(user)

    try:
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        raise ValueError("Email or phone number already registered")


def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def add_contact(db: Session, user_id: int, name: str, phone: str, relation: str | None):
    contact = TrustedContact(user_id=user_id, name=name, phone=phone, relation=relation)
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


def get_contacts(db: Session, user_id: int):
    return db.query(TrustedContact).filter(TrustedContact.user_id == user_id).all()


def delete_contact(db: Session, contact_id: int):
    contact = db.query(TrustedContact).filter(TrustedContact.id == contact_id).first()
    if contact:
        db.delete(contact)
        db.commit()
    return contact


def haversine_distance_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    earth_radius = 6371000

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    )
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return earth_radius * c


def point_to_segment_distance_m(
    px: float, py: float,
    ax: float, ay: float,
    bx: float, by: float
) -> float:
    abx = bx - ax
    aby = by - ay
    apx = px - ax
    apy = py - ay

    ab_len_sq = abx * abx + aby * aby
    if ab_len_sq == 0:
        return haversine_distance_m(px, py, ax, ay)

    t = (apx * abx + apy * aby) / ab_len_sq
    t = max(0, min(1, t))

    closest_x = ax + t * abx
    closest_y = ay + t * aby

    return haversine_distance_m(px, py, closest_x, closest_y)


def create_incident(db: Session, data: dict):
    incident = Incident(**data)
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident


def get_incidents(db: Session):
    return db.query(Incident).order_by(Incident.timestamp.desc()).all()


def create_alert(db: Session, data: dict):
    alert = Alert(**data)
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


def get_alerts(db: Session):
    return db.query(Alert).order_by(Alert.created_at.desc()).all()


def get_travel_by_id(db: Session, travel_id: int):
    return db.query(TravelSession).filter(TravelSession.id == travel_id).first()


def get_all_travels(db: Session):
    return db.query(TravelSession).order_by(TravelSession.id.desc()).all()


def start_travel(
    db: Session,
    user_id: int,
    source: str,
    destination: str,
    source_latitude: float,
    source_longitude: float,
    destination_latitude: float,
    destination_longitude: float,
    deviation_threshold_m: float = 120.0
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    travel = TravelSession(
        user_id=user_id,
        source=source,
        destination=destination,
        source_latitude=source_latitude,
        source_longitude=source_longitude,
        destination_latitude=destination_latitude,
        destination_longitude=destination_longitude,
        deviation_threshold_m=deviation_threshold_m,
        status="active",
        deviation_flag=False,
        deviation_distance_m=0.0,
        emergency_triggered=False,
        auto_alert_sent=False
    )
    db.add(travel)
    db.commit()
    db.refresh(travel)
    return travel


def update_travel_location(db: Session, travel_id: int, latitude: float, longitude: float):
    travel = db.query(TravelSession).filter(TravelSession.id == travel_id).first()
    if not travel:
        return None

    if travel.status != "active":
        return {"error": "Travel session is not active"}

    travel.last_latitude = latitude
    travel.last_longitude = longitude

    deviation_distance = point_to_segment_distance_m(
        latitude,
        longitude,
        travel.source_latitude,
        travel.source_longitude,
        travel.destination_latitude,
        travel.destination_longitude
    )

    destination_distance = haversine_distance_m(
        latitude,
        longitude,
        travel.destination_latitude,
        travel.destination_longitude
    )

    travel.deviation_distance_m = round(deviation_distance, 2)
    travel.deviation_flag = deviation_distance > travel.deviation_threshold_m

    auto_incident = None
    auto_alert = None
    destination_reached = False

    if destination_distance <= 50:
        travel.status = "completed"
        travel.end_time = datetime.utcnow()
        destination_reached = True

    elif (
        travel.deviation_flag
        and deviation_distance > (travel.deviation_threshold_m * 2)
        and not travel.auto_alert_sent
    ):
        auto_incident = Incident(
            incident_type="route_deviation",
            source_module="safe_travel",
            severity="high",
            risk_score=8.5,
            location_name="Safe Travel Route",
            latitude=latitude,
            longitude=longitude,
            summary=f"Major route deviation detected during travel from {travel.source} to {travel.destination}"
        )
        db.add(auto_incident)
        db.flush()

        auto_alert = Alert(
            user_id=travel.user_id,
            incident_id=auto_incident.id,
            alert_type="travel_deviation",
            source_module="safe_travel",
            status="active",
            message=f"Major deviation detected for travel session {travel.id}"
        )
        db.add(auto_alert)

        travel.auto_alert_sent = True

    db.commit()

    if auto_incident:
        db.refresh(auto_incident)
    if auto_alert:
        db.refresh(auto_alert)
    db.refresh(travel)

    response = {
        "travel_id": travel.id,
        "status": travel.status,
        "last_latitude": travel.last_latitude,
        "last_longitude": travel.last_longitude,
        "deviation_flag": travel.deviation_flag,
        "deviation_distance_m": travel.deviation_distance_m,
        "deviation_threshold_m": travel.deviation_threshold_m,
        "destination_distance_m": round(destination_distance, 2),
        "destination_reached": destination_reached,
        "auto_alert_sent": travel.auto_alert_sent,
        "emergency_triggered": travel.emergency_triggered
    }

    if auto_incident:
        response["auto_incident"] = {
            "id": auto_incident.id,
            "incident_type": auto_incident.incident_type,
            "source_module": auto_incident.source_module,
            "severity": auto_incident.severity,
            "risk_score": auto_incident.risk_score
        }

    if auto_alert:
        response["auto_alert"] = {
            "id": auto_alert.id,
            "alert_type": auto_alert.alert_type,
            "source_module": auto_alert.source_module,
            "message": auto_alert.message,
            "status": auto_alert.status
        }

    return response


def trigger_travel_emergency(db: Session, travel_id: int, latitude: float, longitude: float, message: str):
    travel = db.query(TravelSession).filter(TravelSession.id == travel_id).first()
    if not travel:
        return None

    if travel.status != "active":
        return {"error": "Travel session is not active"}

    travel.last_latitude = latitude
    travel.last_longitude = longitude
    travel.emergency_triggered = True

    incident = Incident(
        incident_type="travel_emergency",
        source_module="safe_travel",
        severity="critical",
        risk_score=10.0,
        location_name="Safe Travel Emergency",
        latitude=latitude,
        longitude=longitude,
        summary=message
    )
    db.add(incident)
    db.flush()

    alert = Alert(
        user_id=travel.user_id,
        incident_id=incident.id,
        alert_type="travel_emergency",
        source_module="safe_travel",
        status="active",
        message=message
    )
    db.add(alert)

    db.commit()
    db.refresh(travel)
    db.refresh(incident)
    db.refresh(alert)

    return {
        "message": "Emergency triggered successfully",
        "travel_id": travel.id,
        "status": travel.status,
        "emergency_triggered": travel.emergency_triggered,
        "incident": {
            "id": incident.id,
            "incident_type": incident.incident_type,
            "source_module": incident.source_module,
            "severity": incident.severity,
            "risk_score": incident.risk_score
        },
        "alert": {
            "id": alert.id,
            "alert_type": alert.alert_type,
            "source_module": alert.source_module,
            "message": alert.message,
            "status": alert.status
        }
    }


def end_travel(db: Session, travel_id: int):
    travel = db.query(TravelSession).filter(TravelSession.id == travel_id).first()
    if not travel:
        return None

    travel.status = "completed"
    travel.end_time = datetime.utcnow()
    db.commit()
    db.refresh(travel)
    return travel