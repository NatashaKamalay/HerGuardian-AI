from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    contacts = relationship("TrustedContact", back_populates="user", cascade="all, delete")
    travels = relationship("TravelSession", back_populates="user", cascade="all, delete")


class TrustedContact(Base):
    __tablename__ = "trusted_contacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    relation = Column(String, nullable=True)

    user = relationship("User", back_populates="contacts")


class TravelSession(Base):
    __tablename__ = "travel_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    source = Column(String, nullable=False)
    destination = Column(String, nullable=False)

    source_latitude = Column(Float, nullable=False)
    source_longitude = Column(Float, nullable=False)
    destination_latitude = Column(Float, nullable=False)
    destination_longitude = Column(Float, nullable=False)

    last_latitude = Column(Float, nullable=True)
    last_longitude = Column(Float, nullable=True)

    status = Column(String, default="active")
    deviation_flag = Column(Boolean, default=False)
    deviation_distance_m = Column(Float, default=0.0)

    deviation_threshold_m = Column(Float, default=120.0)
    emergency_triggered = Column(Boolean, default=False)
    auto_alert_sent = Column(Boolean, default=False)

    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="travels")


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_type = Column(String, nullable=False)
    source_module = Column(String, default="manual", nullable=False)
    severity = Column(String, nullable=False)
    risk_score = Column(Float, nullable=False)

    location_name = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    camera_id = Column(String, nullable=True)
    summary = Column(String, nullable=True)
    snapshot_path = Column(String, nullable=True)
    clip_path = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    alert_type = Column(String, nullable=False)
    source_module = Column(String, default="manual", nullable=False)
    status = Column(String, default="active")
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)