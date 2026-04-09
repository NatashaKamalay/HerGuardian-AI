## HerGuardian AI

AI-Powered Women Safety Monitoring & Safe Travel Intelligence System
HerGuardian AI is a full-stack intelligent women’s safety platform that combines safe travel tracking, AI-based incident detection, route deviation monitoring, and real-time emergency escalation with a role-based admin monitoring dashboard.
The system simulates a real-world safety infrastructure where users can start protected journeys while administrators monitor risks, alerts, and incidents in real time.

## Key Highlights
• Real-time Safe Travel tracking
• Route deviation detection engine
• Emergency escalation pipeline
• AI monitoring incident ingestion
• Risk score normalization (0–10)
• Severity classification (low → critical)
• Role-based User/Admin dashboards
• Live map visualization
• Alert & Incident management system
• Modular full-stack architecture

## System Architecture
User App (React)
        │
        │ REST API
        ▼
FastAPI Backend
        │
        ├── Travel Engine
        ├── Alert Engine
        ├── Incident Engine
        │
        ▼
AI Monitoring Engine
        │
        ▼
Incident + Alert Generation
        │
        ▼
Admin Monitoring Dashboard


## User Flow

User → Start Safe Travel → Live Tracking → Deviation Detection → Emergency Trigger → Alert

## Admin Flow

AI Engine / Travel Engine → Incident Creation → Alert → Admin Dashboard Monitoring

## Features
## User Safety Application
- Safe Travel Monitoring
- Start protected trip
- Destination based tracking
- Live route visualization
- Real-time location sync
- Trip completion detection

## Route Deviation Detection
- Distance-from-route calculation
- Threshold-based alert generation
- Automatic incident creation
- Auto escalation to admin

## Emergency Trigger
- One-click emergency alert
- Location attached
- Critical severity classification
- Admin notification pipeline

## Safety Status Indicators
- On Track
- Deviation Detected
- Emergency Triggered
- Trip Completed

## Admin Monitoring Dashboard
## Dashboard
- System overview
- Incident statistics
- Alert visibility
- Travel monitoring
  
## AI Monitoring
- AI-generated incidents
- Risk score tracking
- Severity filtering
- Source module classification

## Incident Log
- Full incident history
- Location + summary
- Timestamped events
- Severity tagging

## Alert Center
- Active alerts
- Acknowledged alerts
- Resolved alerts
- Alert lifecycle tracking

## AI Monitoring Engine
The AI engine simulates real-time safety analytics.
Capabilities:
• Gesture-based unsafe detection
• Risk scoring logic
• Incident creation
• Alert generation
• Backend ingestion
• Source tagging (ai_monitoring)

Risk Score Range-
0 — Safe
3 — Low risk
5 — Medium risk
8 — High risk
10 — Critical risk

Severity Levels-
low
medium
high
critical

## Safe Travel Intelligence Engine
The safe travel module includes-

## Travel Session
- User trip initialization
- Source & destination tracking
- Status lifecycle management

## Deviation Engine
Uses point-to-segment distance calculation to detect route deviation.

If deviation > threshold-
Auto Incident → severity- high
Auto Alert → admin notification

## Emergency Engine
User-triggered emergency generates-
Incident- travel_emergency
Severity- critical
Risk Score- 10
Alert- active

## Technology Stack
## Frontend
• React
• Vite
• Tailwind UI styling
• Leaflet Maps
• Lucide Icons

## Backend
• FastAPI
• SQLAlchemy
• Pydantic
• SQLite Database

## AI Engine
• Python
• OpenCV
• YOLO-based detection
• Risk scoring engine

## Communication
• REST APIs
• JSON payloads
• Role-based session handling

## Project Structure
HerGuardian-AI

── backend
   ── auth.py
   ── models.py
   ── services.py
   ── routes.py
   ── schemas.py
   ── main.py

── ai_engine
   ── detector.py
   ── gesture.py
   ── risk.py
   ── sender.py
   ── main.py

── herguardian-frontend
   ── src
      ── pages
      ── components
      ── utils
   ── package.json

## Implementation Overview
## Authentication System
• Register user
• Login user
• Role-based routing
• Session storage

## Safe Travel Workflow
• User logs in
• Location detected
• Destination selected
• Travel session created
• Route tracking begins
• Deviation monitored
• Emergency trigger available
• Trip ends

## Real-World Use Cases
- Women safety mobile applications
- Smart campus safety monitoring
- Night travel protection systems
- Public transport safety analytics
- Emergency response dashboards
- Security control room monitoring

## Future Enhancements
• Live GPS tracking (continuous polling)
• Google Maps route integration
• Trusted contacts notifications
• SMS alert integration
• Mobile app (React Native)
• AI pose detection upgrade
• Audio distress detection
• Police integration APIs
• Geo-fencing alerts
• Trip sharing links

## Demo Flow
User Side
Login → Start Travel → Sync Location → Emergency → End Trip

## Admin Side
Dashboard → Incident Log → Alert Center → AI Monitoring


