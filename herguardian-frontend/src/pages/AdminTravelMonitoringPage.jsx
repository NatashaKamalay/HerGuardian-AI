import React, { useEffect, useState } from "react";
import { getTravels } from "../api";

export default function AdminTravelMonitoringPage() {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTravels = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getTravels();
      setTravels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Travel monitoring load error:", err);
      setError("Could not load travel monitoring data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTravels();
  }, []);

  const activeTravels = travels.filter((travel) => {
    const status = String(travel.status || "").toLowerCase();
    return status === "active" || status === "started" || status === "ongoing";
  });

  const completedTravels = travels.filter((travel) => {
    const status = String(travel.status || "").toLowerCase();
    return status === "completed" || status === "ended";
  });

  const pageStyle = {
    minHeight: "100vh",
    background: "#020b24",
    color: "white",
    padding: "30px",
  };

  const headingStyle = {
    fontSize: "2.8rem",
    fontWeight: "700",
    marginBottom: "8px",
  };

  const subHeadingStyle = {
    color: "#9fb0d0",
    marginBottom: "24px",
    fontSize: "1rem",
  };

  const buttonStyle = {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "14px",
    padding: "14px 22px",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    marginBottom: "24px",
  };

  const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
    marginBottom: "28px",
  };

  const statCardStyle = {
    background: "#0b1736",
    border: "1px solid #1f3b74",
    borderRadius: "22px",
    padding: "28px",
    minHeight: "120px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  };

  const statLabelStyle = {
    color: "#b5c7ec",
    fontSize: "0.95rem",
    marginBottom: "18px",
  };

  const statValueStyle = {
    fontSize: "2.5rem",
    fontWeight: "700",
    lineHeight: "1",
  };

  const sectionStyle = {
    marginBottom: "28px",
  };

  const sectionHeadingStyle = {
    fontSize: "1.3rem",
    fontWeight: "700",
    marginBottom: "16px",
  };

  const tableWrapStyle = {
    background: "#0b1736",
    border: "1px solid #1f3b74",
    borderRadius: "22px",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle = {
    textAlign: "left",
    padding: "16px",
    color: "#9fb0d0",
    fontSize: "0.9rem",
    borderBottom: "1px solid #1f3b74",
    background: "#081126",
  };

  const tdStyle = {
    padding: "16px",
    borderBottom: "1px solid #19325f",
    color: "white",
    verticalAlign: "top",
  };

  const badgeStyle = (type) => {
    const styles = {
      active: {
        background: "rgba(37,99,235,0.18)",
        color: "#bfdbfe",
      },
      completed: {
        background: "rgba(16,185,129,0.18)",
        color: "#bbf7d0",
      },
      deviation: {
        background: "rgba(245,158,11,0.18)",
        color: "#fde68a",
      },
      emergency: {
        background: "rgba(239,68,68,0.18)",
        color: "#fecaca",
      },
      normal: {
        background: "rgba(148,163,184,0.18)",
        color: "#e2e8f0",
      },
    };

    return {
      display: "inline-flex",
      padding: "6px 10px",
      borderRadius: "999px",
      fontSize: "0.8rem",
      fontWeight: "700",
      ...styles[type],
    };
  };

  const renderRows = (items) => {
    if (!items.length) {
      return (
        <tr>
          <td style={tdStyle} colSpan={7}>
            <span style={{ color: "#9fb0d0" }}>No travel sessions available.</span>
          </td>
        </tr>
      );
    }

    return items.map((travel) => (
      <tr key={travel.id}>
        <td style={tdStyle}>{travel.user_id}</td>
        <td style={tdStyle}>{travel.source}</td>
        <td style={tdStyle}>{travel.destination}</td>
        <td style={tdStyle}>
          <span
            style={badgeStyle(
              String(travel.status || "").toLowerCase() === "completed"
                ? "completed"
                : "active"
            )}
          >
            {travel.status || "unknown"}
          </span>
        </td>
        <td style={tdStyle}>
          <span style={badgeStyle(travel.deviation_flag ? "deviation" : "normal")}>
            {travel.deviation_flag ? "Deviation Detected" : "On Track"}
          </span>
        </td>
        <td style={tdStyle}>
          {travel.deviation_distance_m != null ? `${travel.deviation_distance_m} m` : "0 m"}
        </td>
        <td style={tdStyle}>
          <span style={badgeStyle(travel.emergency_triggered ? "emergency" : "normal")}>
            {travel.emergency_triggered ? "Triggered" : "Normal"}
          </span>
        </td>
      </tr>
    ));
  };

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Travel Monitoring</h1>
      <p style={subHeadingStyle}>
        Supervise user travel sessions, route deviations, and emergency states in real time.
      </p>

      <button style={buttonStyle} onClick={loadTravels}>
        Refresh Travel Monitoring
      </button>

      {loading ? (
        <p>Loading travel monitoring data...</p>
      ) : error ? (
        <p style={{ color: "#ff7b7b", fontWeight: "600" }}>{error}</p>
      ) : (
        <>
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Total Travel Sessions</div>
              <div style={statValueStyle}>{travels.length}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Active Sessions</div>
              <div style={statValueStyle}>{activeTravels.length}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Completed Sessions</div>
              <div style={statValueStyle}>{completedTravels.length}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Emergency Trips</div>
              <div style={statValueStyle}>
                {travels.filter((travel) => travel.emergency_triggered).length}
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>Travel Sessions</h2>

            <div style={tableWrapStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>User ID</th>
                    <th style={thStyle}>Source</th>
                    <th style={thStyle}>Destination</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Route Safety</th>
                    <th style={thStyle}>Deviation Distance</th>
                    <th style={thStyle}>Emergency State</th>
                  </tr>
                </thead>
                <tbody>{renderRows(travels)}</tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}