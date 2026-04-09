import React, { useEffect, useMemo, useState } from "react";
import { getIncidents, getAlerts } from "../api";

export default function AIMonitoringPage() {
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAIMonitoringData = async () => {
    try {
      setLoading(true);
      setError("");

      const [incidentsData, alertsData] = await Promise.all([
        getIncidents(),
        getAlerts(),
      ]);

      setIncidents(Array.isArray(incidentsData) ? incidentsData : []);
      setAlerts(Array.isArray(alertsData) ? alertsData : []);
    } catch (err) {
      console.error("AI Monitoring load error:", err);
      setError("Could not load AI monitoring data from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAIMonitoringData();
  }, []);

  const aiIncidents = useMemo(() => {
    return incidents.filter(
      (incident) => incident.source_module === "ai_monitoring"
    );
  }, [incidents]);

  const aiAlerts = useMemo(() => {
    return alerts.filter(
      (alert) => alert.source_module === "ai_monitoring"
    );
  }, [alerts]);

  const latestAIIncident = aiIncidents.length > 0 ? aiIncidents[0] : null;
  const latestAIAlert = aiAlerts.length > 0 ? aiAlerts[0] : null;

  const highOrCriticalCount = aiIncidents.filter((incident) => {
    const sev = String(incident.severity || "").toLowerCase();
    return sev === "high" || sev === "critical";
  }).length;

  const avgRiskScore = aiIncidents.length
    ? (
        aiIncidents.reduce((sum, item) => sum + Number(item.risk_score || 0), 0) /
        aiIncidents.length
      ).toFixed(1)
    : "0.0";

  const recentAIIncidents = aiIncidents.slice(0, 5);
  const recentAIAlerts = aiAlerts.slice(0, 5);

  const getIncidentTitle = (incident) => {
    return incident.incident_type || incident.type || "AI Incident";
  };

  const getIncidentMessage = (incident) => {
    return (
      incident.summary ||
      incident.message ||
      incident.description ||
      "No description available"
    );
  };

  const getAlertTitle = (alert) => {
    return alert.alert_type || alert.type || "AI Alert";
  };

  const getAlertMessage = (alert) => {
    return (
      alert.message ||
      alert.description ||
      alert.details ||
      "No message available"
    );
  };

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
    marginBottom: "28px",
  };

  const statCardStyle = {
    background: "#0b1736",
    border: "1px solid #1f3b74",
    borderRadius: "22px",
    padding: "26px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  };

  const statLabelStyle = {
    color: "#b5c7ec",
    fontSize: "0.95rem",
    marginBottom: "16px",
  };

  const statValueStyle = {
    fontSize: "2.4rem",
    fontWeight: "700",
    lineHeight: "1",
  };

  const sectionGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "24px",
    marginBottom: "24px",
  };

  const cardStyle = {
    background: "#0b1736",
    border: "1px solid #1f3b74",
    borderRadius: "22px",
    padding: "26px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  };

  const cardHeadingStyle = {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "1.15rem",
    fontWeight: "700",
  };

  const titleTextStyle = {
    fontSize: "1.05rem",
    fontWeight: "700",
    marginBottom: "8px",
  };

  const bodyTextStyle = {
    color: "#a9bddf",
    lineHeight: "1.6",
    fontSize: "0.97rem",
  };

  const listItemStyle = {
    padding: "14px 0",
    borderBottom: "1px solid #19325f",
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>AI Monitoring</h1>
      <p style={subtitleStyle}>
        AI-specific view of surveillance detections, alert severity, and risk intelligence
      </p>

      <button style={buttonStyle} onClick={loadAIMonitoringData}>
        Refresh AI Monitoring
      </button>

      {loading ? (
        <p>Loading AI monitoring data...</p>
      ) : error ? (
        <p style={{ color: "#ff7b7b", fontWeight: "600" }}>{error}</p>
      ) : (
        <>
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>AI Related Incidents</div>
              <div style={statValueStyle}>{aiIncidents.length}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>AI Related Alerts</div>
              <div style={statValueStyle}>{aiAlerts.length}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>High / Critical Incidents</div>
              <div style={statValueStyle}>{highOrCriticalCount}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Average Risk Score</div>
              <div style={statValueStyle}>{avgRiskScore}</div>
            </div>
          </div>

          <div style={sectionGridStyle}>
            <div style={cardStyle}>
              <h2 style={cardHeadingStyle}>Latest AI Incident</h2>
              {latestAIIncident ? (
                <>
                  <div style={titleTextStyle}>{getIncidentTitle(latestAIIncident)}</div>
                  <div style={bodyTextStyle}>{getIncidentMessage(latestAIIncident)}</div>
                  <div style={{ ...bodyTextStyle, marginTop: "10px" }}>
                    Severity: {latestAIIncident.severity || "N/A"}
                  </div>
                  <div style={bodyTextStyle}>
                    Risk Score: {latestAIIncident.risk_score ?? "N/A"}
                  </div>
                  <div style={bodyTextStyle}>
                    Location: {latestAIIncident.location_name || "N/A"}
                  </div>
                </>
              ) : (
                <p style={bodyTextStyle}>No AI incidents available.</p>
              )}
            </div>

            <div style={cardStyle}>
              <h2 style={cardHeadingStyle}>Latest AI Alert</h2>
              {latestAIAlert ? (
                <>
                  <div style={titleTextStyle}>{getAlertTitle(latestAIAlert)}</div>
                  <div style={bodyTextStyle}>{getAlertMessage(latestAIAlert)}</div>
                  <div style={{ ...bodyTextStyle, marginTop: "10px" }}>
                    Status: {latestAIAlert.status || "N/A"}
                  </div>
                  <div style={bodyTextStyle}>
                    User ID: {latestAIAlert.user_id ?? "N/A"}
                  </div>
                </>
              ) : (
                <p style={bodyTextStyle}>No AI alerts available.</p>
              )}
            </div>
          </div>

          <div style={sectionGridStyle}>
            <div style={cardStyle}>
              <h2 style={cardHeadingStyle}>Recent AI Incidents</h2>
              {recentAIIncidents.length === 0 ? (
                <p style={bodyTextStyle}>No AI incidents found.</p>
              ) : (
                recentAIIncidents.map((incident, index) => (
                  <div key={incident.id || index} style={listItemStyle}>
                    <div style={titleTextStyle}>{getIncidentTitle(incident)}</div>
                    <div style={bodyTextStyle}>{getIncidentMessage(incident)}</div>
                  </div>
                ))
              )}
            </div>

            <div style={cardStyle}>
              <h2 style={cardHeadingStyle}>Recent AI Alerts</h2>
              {recentAIAlerts.length === 0 ? (
                <p style={bodyTextStyle}>No AI alerts found.</p>
              ) : (
                recentAIAlerts.map((alert, index) => (
                  <div key={alert.id || index} style={listItemStyle}>
                    <div style={titleTextStyle}>{getAlertTitle(alert)}</div>
                    <div style={bodyTextStyle}>{getAlertMessage(alert)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}