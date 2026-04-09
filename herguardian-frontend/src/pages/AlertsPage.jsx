import React, { useEffect, useMemo, useState } from "react";
import { getAlerts } from "../api";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAlerts();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Alerts load error:", err);
      setError("Could not load alerts from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const getAlertType = (alert) => {
    return alert.alert_type || alert.type || alert.category || "Alert";
  };

  const getAlertMessage = (alert) => {
    return (
      alert.message ||
      alert.description ||
      alert.details ||
      "No message available"
    );
  };

  const getAlertStatus = (alert) => {
    return (alert.status || "active").toLowerCase();
  };

  const getAlertTime = (alert) => {
    return alert.created_at || alert.timestamp || alert.time || "N/A";
  };

  const filteredAlerts = useMemo(() => {
    if (filter === "all") return alerts;

    return alerts.filter((alert) => {
      const type = getAlertType(alert).toLowerCase();
      const status = getAlertStatus(alert);

      if (filter === "active") {
        return status === "active" || status === "open" || status === "pending";
      }

      if (filter === "emergency") {
        return type.includes("emergency") || getAlertMessage(alert).toLowerCase().includes("emergency");
      }

      if (filter === "travel") {
        return type.includes("travel") || type.includes("deviation") || type.includes("route");
      }

      return true;
    });
  }, [alerts, filter]);

  const totalAlerts = alerts.length;

  const activeAlerts = alerts.filter((alert) => {
    const status = getAlertStatus(alert);
    return status === "active" || status === "open" || status === "pending";
  }).length;

  const emergencyAlerts = alerts.filter((alert) => {
    const type = getAlertType(alert).toLowerCase();
    const msg = getAlertMessage(alert).toLowerCase();
    return type.includes("emergency") || msg.includes("emergency") || msg.includes("sos");
  }).length;

  const travelAlerts = alerts.filter((alert) => {
    const type = getAlertType(alert).toLowerCase();
    return type.includes("travel") || type.includes("deviation") || type.includes("route");
  }).length;

  const pageStyle = {
    minHeight: "100vh",
    background: "#020b24",
    color: "white",
    padding: "30px",
  };

  const titleStyle = {
    fontSize: "2.8rem",
    fontWeight: "700",
    marginBottom: "8px",
  };

  const subtitleStyle = {
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
    marginBottom: "26px",
  };

  const statCardStyle = {
    background: "#0b1736",
    border: "1px solid #1f3b74",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  };

  const statLabelStyle = {
    color: "#b5c7ec",
    fontSize: "0.95rem",
    marginBottom: "14px",
  };

  const statValueStyle = {
    fontSize: "2.3rem",
    fontWeight: "700",
    lineHeight: "1",
  };

  const filterBarStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "24px",
  };

  const filterButtonStyle = (active) => ({
    background: active ? "#ec4899" : "#1e2d4e",
    color: "white",
    border: "1px solid " + (active ? "#ec4899" : "#31476f"),
    borderRadius: "999px",
    padding: "10px 16px",
    fontWeight: "700",
    cursor: "pointer",
  });

  const tableWrapStyle = {
    background: "#0b1736",
    border: "1px solid #1f3b74",
    borderRadius: "22px",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  };

  const tableHeaderStyle = {
    display: "grid",
    gridTemplateColumns: "1.2fr 2.2fr 1fr 1fr 1fr",
    gap: "16px",
    padding: "18px 20px",
    background: "#0d1d42",
    fontWeight: "700",
    color: "#dbe7ff",
    borderBottom: "1px solid #223a69",
  };

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "1.2fr 2.2fr 1fr 1fr 1fr",
    gap: "16px",
    padding: "18px 20px",
    borderBottom: "1px solid #19325f",
    alignItems: "start",
  };

  const cellMutedStyle = {
    color: "#a9bddf",
    lineHeight: "1.5",
    wordBreak: "break-word",
  };

  const statusBadgeStyle = (status) => {
    let bg = "#2563eb";
    if (status === "active" || status === "open" || status === "pending") bg = "#d97706";
    else if (status === "resolved" || status === "closed") bg = "#15803d";

    return {
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: "999px",
      background: bg,
      color: "white",
      fontWeight: "700",
      fontSize: "0.85rem",
      textTransform: "capitalize",
    };
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Alert Center</h1>
      <p style={subtitleStyle}>
        Action-focused view of notifications raised by AI monitoring and safe travel events
      </p>

      <button style={buttonStyle} onClick={loadAlerts}>
        Refresh Alerts
      </button>

      {loading ? (
        <p>Loading alerts...</p>
      ) : error ? (
        <p style={{ color: "#ff7b7b", fontWeight: "600" }}>{error}</p>
      ) : (
        <>
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Total Alerts</div>
              <div style={statValueStyle}>{totalAlerts}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Active Alerts</div>
              <div style={statValueStyle}>{activeAlerts}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Emergency Alerts</div>
              <div style={statValueStyle}>{emergencyAlerts}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Travel Alerts</div>
              <div style={statValueStyle}>{travelAlerts}</div>
            </div>
          </div>

          <div style={filterBarStyle}>
            <button style={filterButtonStyle(filter === "all")} onClick={() => setFilter("all")}>
              All
            </button>
            <button style={filterButtonStyle(filter === "active")} onClick={() => setFilter("active")}>
              Active
            </button>
            <button style={filterButtonStyle(filter === "emergency")} onClick={() => setFilter("emergency")}>
              Emergency
            </button>
            <button style={filterButtonStyle(filter === "travel")} onClick={() => setFilter("travel")}>
              Travel
            </button>
          </div>

          <div style={tableWrapStyle}>
            <div style={tableHeaderStyle}>
              <div>Alert Type</div>
              <div>Message</div>
              <div>Status</div>
              <div>Incident ID</div>
              <div>Created At</div>
            </div>

            {filteredAlerts.length === 0 ? (
              <div style={{ padding: "22px 20px", color: "#a9bddf" }}>
                No alerts found for this filter.
              </div>
            ) : (
              filteredAlerts.map((alert, index) => (
                <div key={alert.id || index} style={rowStyle}>
                  <div>
                    <div style={{ fontWeight: "700", marginBottom: "6px" }}>
                      {getAlertType(alert)}
                    </div>
                    <div style={cellMutedStyle}>User ID: {alert.user_id ?? "N/A"}</div>
                  </div>

                  <div style={cellMutedStyle}>{getAlertMessage(alert)}</div>

                  <div>
                    <span style={statusBadgeStyle(getAlertStatus(alert))}>
                      {getAlertStatus(alert)}
                    </span>
                  </div>

                  <div style={cellMutedStyle}>{alert.incident_id ?? "N/A"}</div>

                  <div style={cellMutedStyle}>{getAlertTime(alert)}</div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}