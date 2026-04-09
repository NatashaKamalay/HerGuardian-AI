import React, { useEffect, useState } from "react";
import { MapPinned, Siren } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SafetyStatusBanner from "../components/SafetyStatusBanner";
import SafetyStatusCard from "../components/SafetyStatusCard";
import CheckInCard from "../components/CheckInCard";
import { getCheckIns, addCheckIn } from "../utils/checkInStorage";
import {
  deriveOverallSafetyState,
  getInternetStatus,
  getLocationStatus,
} from "../utils/safetyStatus";

export default function UserHomePage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("herguardian_user") || "null");

  const [checkIns, setCheckIns] = useState([]);
  const [isOnline, setIsOnline] = useState(getInternetStatus());
  const [hasLocation, setHasLocation] = useState(true);

  const [isEmergency, setIsEmergency] = useState(
    localStorage.getItem("herguardian_emergency_active") === "true"
  );

  const [isTraveling, setIsTraveling] = useState(
    localStorage.getItem("herguardian_travel_active") === "true"
  );

  useEffect(() => {
    setCheckIns(getCheckIns());

    const updateInternetStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", updateInternetStatus);
    window.addEventListener("offline", updateInternetStatus);

    const loadStatus = async () => {
      const location = await getLocationStatus();
      setHasLocation(location.available);
    };

    loadStatus();

    return () => {
      window.removeEventListener("online", updateInternetStatus);
      window.removeEventListener("offline", updateInternetStatus);
    };
  }, []);

  const handleAddCheckIn = (payload) => {
    addCheckIn(payload);
    setCheckIns(getCheckIns());
  };

  const handleEmergency = () => {
    localStorage.setItem("herguardian_emergency_active", "true");
    setIsEmergency(true);
    navigate("/safe-travel");
  };

  const overallStatus = deriveOverallSafetyState({
    isEmergency,
    isTraveling,
    isOnline,
    hasLocation,
  });

  const activeBanners = [];
  if (!isOnline) activeBanners.push("offline");
  if (!hasLocation) activeBanners.push("location");
  if (isEmergency) activeBanners.push("emergency");

  const pageStyle = {
    minHeight: "100vh",
    background: "#020b24",
    color: "white",
    padding: "30px",
  };

  const titleStyle = {
    fontSize: "2.8rem",
    fontWeight: "800",
    marginBottom: "8px",
  };

  const subtitleStyle = {
    color: "#9fb0d0",
    fontSize: "1rem",
    marginBottom: "28px",
  };

  const heroStyle = {
    borderRadius: "28px",
    padding: "28px",
    background:
      "linear-gradient(135deg, rgba(236,72,153,0.14), rgba(37,99,235,0.16), rgba(11,23,54,1))",
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.28)",
    marginBottom: "24px",
  };

  const heroHeadingStyle = {
    fontSize: "1.8rem",
    fontWeight: "800",
    marginBottom: "10px",
  };

  const heroTextStyle = {
    color: "#cbd5e1",
    fontSize: "1rem",
    lineHeight: "1.8",
    maxWidth: "760px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "22px",
    marginBottom: "24px",
  };

  const cardStyle = {
    background: "#0b1736",
    border: "1px solid #1f3b74",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
  };

  const cardTitleStyle = {
    fontSize: "1.1rem",
    fontWeight: "700",
    marginTop: "14px",
    marginBottom: "8px",
  };

  const cardTextStyle = {
    color: "#9fb0d0",
    lineHeight: "1.6",
    fontSize: "0.95rem",
    marginBottom: "16px",
  };

  const buttonStyle = {
    border: "none",
    borderRadius: "16px",
    padding: "12px 16px",
    fontWeight: "700",
    cursor: "pointer",
    color: "white",
    background: "linear-gradient(90deg, #2563eb, #7c3aed)",
    width: "100%",
  };

  const emergencyStyle = {
    ...buttonStyle,
    background: "linear-gradient(90deg, #ef4444, #dc2626)",
  };

  const miniGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  };

  const miniCardStyle = {
    background: "#0b1736",
    border: "1px solid #1f3b74",
    borderRadius: "20px",
    padding: "20px",
  };

  const miniLabelStyle = {
    color: "#94a3b8",
    fontSize: "0.95rem",
    marginBottom: "10px",
  };

  const miniValueStyle = {
    fontSize: "1.15rem",
    fontWeight: "800",
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>User Home</h1>
      <p style={subtitleStyle}>
        Personal safety space for travel protection, emergency access, and quick check-ins
      </p>

      <div style={heroStyle}>
        <div style={heroHeadingStyle}>
          Welcome{currentUser?.name ? `, ${currentUser.name}` : ""}
        </div>
        <div style={heroTextStyle}>
          This user view is designed for essential safety actions only.
        </div>
      </div>

      <SafetyStatusBanner banners={activeBanners} />
      <SafetyStatusCard status={overallStatus} />

      <div style={gridStyle}>
        <div style={cardStyle}>
          <MapPinned size={24} color="#60a5fa" />
          <div style={cardTitleStyle}>Start Safe Travel</div>
          <div style={cardTextStyle}>
            Begin a monitored trip with live route tracking, deviation awareness,
            and emergency protection.
          </div>
          <button
            style={buttonStyle}
            onClick={() => {
              localStorage.setItem("herguardian_travel_active", "true");
              setIsTraveling(true);
              navigate("/safe-travel");
            }}
          >
            Open Safe Travel
          </button>
        </div>

        <div style={cardStyle}>
          <Siren size={24} color="#fb7185" />
          <div style={cardTitleStyle}>Emergency</div>
          <div style={cardTextStyle}>
            Use emergency support for rapid escalation during unsafe situations
            or active distress.
          </div>
          <button style={emergencyStyle} onClick={handleEmergency}>
            Open Emergency Flow
          </button>
        </div>
      </div>

      <div style={miniGridStyle}>
        <div style={miniCardStyle}>
          <div style={miniLabelStyle}>Device Readiness</div>
          <div style={miniValueStyle}>
            {isOnline && hasLocation ? "Ready" : "Attention Needed"}
          </div>
        </div>

        <div style={miniCardStyle}>
          <div style={miniLabelStyle}>Travel Monitoring</div>
          <div style={miniValueStyle}>
            {isTraveling ? "Active" : "Inactive"}
          </div>
        </div>
      </div>

      <CheckInCard checkIns={checkIns} onAddCheckIn={handleAddCheckIn} />
    </div>
  );
}