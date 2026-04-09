import React from "react";
import { Shield, ShieldAlert, ShieldCheck, Radio } from "lucide-react";

const toneStyles = {
  success: {
    border: "1px solid #cfead6",
    background: "#f4fff7",
    color: "#1f6b36",
    icon: <ShieldCheck size={22} />,
  },
  warning: {
    border: "1px solid #f3dfb0",
    background: "#fffaf0",
    color: "#8a6116",
    icon: <Shield size={22} />,
  },
  critical: {
    border: "1px solid #f2c0c0",
    background: "#fff5f5",
    color: "#a12626",
    icon: <ShieldAlert size={22} />,
  },
  info: {
    border: "1px solid #c9d7ff",
    background: "#f5f8ff",
    color: "#234a9b",
    icon: <Radio size={22} />,
  },
};

export default function SafetyStatusCard({ status }) {
  const selectedTone = toneStyles[status?.tone] || toneStyles.info;

  return (
    <div
      style={{
        borderRadius: "16px",
        padding: "18px",
        marginBottom: "18px",
        ...selectedTone,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        {selectedTone.icon}
        <h3 style={{ margin: 0, fontSize: "18px" }}>Safety Status: {status?.label || "Unknown"}</h3>
      </div>

      <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.5 }}>
        {status?.description || "Safety information not available."}
      </p>
    </div>
  );
}