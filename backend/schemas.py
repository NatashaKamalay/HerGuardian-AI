from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, Literal
from datetime import datetime


ALLOWED_SEVERITIES = {"low", "medium", "high", "critical"}
ALLOWED_ALERT_STATUSES = {"active", "acknowledged", "resolved"}
ALLOWED_SOURCE_MODULES = {"ai_monitoring", "safe_travel", "manual"}


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str

    class Config:
        from_attributes = True


class ContactCreate(BaseModel):
    name: str
    phone: str
    relation: Optional[str] = None


class ContactOut(BaseModel):
    id: int
    name: str
    phone: str
    relation: Optional[str] = None

    class Config:
        from_attributes = True


class TravelCreate(BaseModel):
    user_id: int
    source: str
    destination: str
    source_latitude: float = Field(..., ge=-90, le=90)
    source_longitude: float = Field(..., ge=-180, le=180)
    destination_latitude: float = Field(..., ge=-90, le=90)
    destination_longitude: float = Field(..., ge=-180, le=180)
    deviation_threshold_m: float = Field(default=120, gt=0, le=1000)


class TravelLocationUpdate(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class TravelEmergencyCreate(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    message: Optional[str] = "Emergency triggered during safe travel"


class TravelOut(BaseModel):
    id: int
    user_id: int
    source: str
    destination: str
    source_latitude: float
    source_longitude: float
    destination_latitude: float
    destination_longitude: float
    status: str
    last_latitude: Optional[float] = None
    last_longitude: Optional[float] = None
    deviation_flag: bool
    deviation_distance_m: float
    deviation_threshold_m: float
    emergency_triggered: bool
    auto_alert_sent: bool
    start_time: datetime
    end_time: Optional[datetime] = None

    class Config:
        from_attributes = True


class IncidentCreate(BaseModel):
    incident_type: str
    source_module: Literal["ai_monitoring", "safe_travel", "manual"] = "manual"
    severity: Literal["low", "medium", "high", "critical"]
    risk_score: float = Field(..., ge=0, le=10)
    location_name: Optional[str] = None
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)
    camera_id: Optional[str] = None
    summary: Optional[str] = None
    snapshot_path: Optional[str] = None
    clip_path: Optional[str] = None


class IncidentOut(BaseModel):
    id: int
    incident_type: str
    source_module: str
    severity: str
    risk_score: float
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    camera_id: Optional[str] = None
    summary: Optional[str] = None
    snapshot_path: Optional[str] = None
    clip_path: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True


class AlertCreate(BaseModel):
    user_id: Optional[int] = None
    incident_id: Optional[int] = None
    alert_type: str
    source_module: Literal["ai_monitoring", "safe_travel", "manual"] = "manual"
    message: str


class AlertOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    incident_id: Optional[int] = None
    alert_type: str
    source_module: str
    status: Literal["active", "acknowledged", "resolved"]
    message: str
    created_at: datetime

    class Config:
        from_attributes = True