import React from "react";
import { AlertTriangle, BatteryLow, ShieldAlert, MapPinned, WifiOff } from "lucide-react";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "18px",
  },
  banner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderRadius: "12px",
    padding: "12px 14px",
    border: "1px solid #f1c7c7",
    background: "#fff5f5",
    color: "#8a1c1c",
    fontSize: "14px",
    fontWeight: 500,
  },
};

const iconMap = {
  offline: <WifiOff size={18} />,
  location: <MapPinned size={18} />,
  battery: <BatteryLow size={18} />,
  emergency: <ShieldAlert size={18} />,
  deviation: <AlertTriangle size={18} />,
};

const textMap = {
  offline: "No internet connection. Some live safety features may be delayed.",
  location: "Location unavailable. Live safety tracking may not work properly.",
  battery: "Low battery detected. Continuous tracking may be interrupted.",
  emergency: "Emergency state active. Alert and response flow should be prioritized.",
  deviation: "Route deviation detected. Please review the travel status.",
};

export default function SafetyStatusBanner({ banners = [] }) {
  if (!banners.length) return null;

  return (
    <div style={styles.container}>
      {banners.map((key) => (
        <div key={key} style={styles.banner}>
          {iconMap[key] || <AlertTriangle size={18} />}
          <span>{textMap[key] || "Safety state detected."}</span>
        </div>
      ))}
    </div>
  );
}