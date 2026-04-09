from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from schemas import (
    UserCreate, UserLogin, ContactCreate,
    TravelCreate, TravelLocationUpdate, TravelEmergencyCreate,
    IncidentCreate, AlertCreate
)
from services import (
    create_user, authenticate_user, add_contact, get_contacts, delete_contact,
    start_travel, update_travel_location, end_travel, trigger_travel_emergency,
    get_travel_by_id, get_all_travels,
    create_incident, get_incidents, create_alert, get_alerts
)
from auth import create_access_token

router = APIRouter()


@router.post("/auth/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        created = create_user(db, user.name, user.email, user.phone, user.password)
        return {
            "message": "User registered",
            "user": {
                "id": created.id,
                "name": created.name,
                "email": created.email,
                "phone": created.phone,
            },
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing = authenticate_user(db, user.email, user.password)
    if not existing:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(existing.id), "email": existing.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": existing.id,
            "name": existing.name,
            "email": existing.email,
            "phone": existing.phone,
        },
    }


@router.post("/contacts/{user_id}")
def create_contact(user_id: int, contact: ContactCreate, db: Session = Depends(get_db)):
    return add_contact(db, user_id, contact.name, contact.phone, contact.relation)


@router.get("/contacts/{user_id}")
def list_contacts(user_id: int, db: Session = Depends(get_db)):
    return get_contacts(db, user_id)


@router.delete("/contacts/delete/{contact_id}")
def remove_contact(contact_id: int, db: Session = Depends(get_db)):
    deleted = delete_contact(db, contact_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted"}


@router.post("/travel/start")
def begin_travel(payload: TravelCreate, db: Session = Depends(get_db)):
    travel = start_travel(
        db,
        payload.user_id,
        payload.source,
        payload.destination,
        payload.source_latitude,
        payload.source_longitude,
        payload.destination_latitude,
        payload.destination_longitude,
        payload.deviation_threshold_m,
    )
    if not travel:
        raise HTTPException(status_code=404, detail="User not found")
    return travel


@router.get("/travel")
def list_travels(db: Session = Depends(get_db)):
    return get_all_travels(db)


@router.get("/travel/{travel_id}")
def get_travel(travel_id: int, db: Session = Depends(get_db)):
    travel = get_travel_by_id(db, travel_id)
    if not travel:
        raise HTTPException(status_code=404, detail="Travel session not found")
    return travel


@router.post("/travel/update/{travel_id}")
def update_location(travel_id: int, payload: TravelLocationUpdate, db: Session = Depends(get_db)):
    updated = update_travel_location(db, travel_id, payload.latitude, payload.longitude)
    if not updated:
        raise HTTPException(status_code=404, detail="Travel session not found")
    if isinstance(updated, dict) and updated.get("error"):
        raise HTTPException(status_code=400, detail=updated["error"])
    return updated


@router.post("/travel/emergency/{travel_id}")
def trigger_emergency(travel_id: int, payload: TravelEmergencyCreate, db: Session = Depends(get_db)):
    result = trigger_travel_emergency(db, travel_id, payload.latitude, payload.longitude, payload.message)
    if not result:
        raise HTTPException(status_code=404, detail="Travel session not found")
    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.post("/travel/end/{travel_id}")
def finish_travel(travel_id: int, db: Session = Depends(get_db)):
    ended = end_travel(db, travel_id)
    if not ended:
        raise HTTPException(status_code=404, detail="Travel session not found")
    return ended


@router.post("/incidents")
def add_incident(payload: IncidentCreate, db: Session = Depends(get_db)):
    return create_incident(db, payload.model_dump())


@router.get("/incidents")
def list_incidents(db: Session = Depends(get_db)):
    return get_incidents(db)


@router.post("/alerts")
def add_alert(payload: AlertCreate, db: Session = Depends(get_db)):
    return create_alert(db, payload.model_dump())


@router.get("/alerts")
def list_alerts(db: Session = Depends(get_db)):
    return get_alerts(db)