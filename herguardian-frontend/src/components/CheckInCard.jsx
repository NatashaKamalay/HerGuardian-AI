import React, { useState } from "react";
import { Clock3, ShieldCheck } from "lucide-react";

export default function CheckInCard({ checkIns = [], onAddCheckIn }) {
  const [status, setStatus] = useState("I'm Safe");
  const [note, setNote] = useState("");
  const [locationText, setLocationText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onAddCheckIn({
      status,
      note,
      locationText,
    });

    setStatus("I'm Safe");
    setNote("");
    setLocationText("");
  };

  const formatDateTime = (value) => {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const wrapperStyle = {
    background: "#0b1736",
    borderRadius: "24px",
    padding: "24px",
    border: "1px solid #1f3b74",
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    marginBottom: "18px",
    color: "white",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #2b4b87",
    outline: "none",
    background: "#081126",
    color: "white",
    boxSizing: "border-box",
    fontSize: "0.95rem",
  };

  const buttonStyle = {
    background: "linear-gradient(90deg, #2563eb, #7c3aed)",
    color: "#ffffff",
    border: "none",
    borderRadius: "14px",
    padding: "13px 16px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "1rem",
  };

  const historyCardStyle = {
    border: "1px solid #1f3b74",
    borderRadius: "14px",
    padding: "14px",
    background: "#081126",
  };

  return (
    <div style={wrapperStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <ShieldCheck size={22} color="#34d399" />
        <h3 style={{ margin: 0, color: "white" }}>Quick Check-In</h3>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px", marginBottom: "22px" }}>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={inputStyle}
        >
          <option value="I'm Safe">I'm Safe</option>
          <option value="Reached Destination">Reached Destination</option>
          <option value="Need Attention">Need Attention</option>
        </select>

        <input
          type="text"
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Optional location label (Home / Office / Bus Stop)"
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Save Check-In
        </button>
      </form>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <Clock3 size={18} color="#93c5fd" />
          <h4 style={{ margin: 0, color: "white" }}>Recent Check-Ins</h4>
        </div>

        {checkIns.length === 0 ? (
          <p style={{ margin: 0, color: "#9fb0d0" }}>No check-ins yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {checkIns.map((item) => (
              <div key={item.id} style={historyCardStyle}>
                <div style={{ fontWeight: 700, marginBottom: "6px", color: "#ffffff", fontSize: "1rem" }}>
                  {item.status}
                </div>

                <div style={{ fontSize: "13px", color: "#9fb0d0", marginBottom: "6px" }}>
                  {formatDateTime(item.createdAt)}
                </div>

                {item.locationText ? (
                  <div style={{ fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>
                    Location: {item.locationText}
                  </div>
                ) : null}

                {item.note ? (
                  <div style={{ fontSize: "13px", color: "#cbd5e1" }}>
                    Note: {item.note}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}