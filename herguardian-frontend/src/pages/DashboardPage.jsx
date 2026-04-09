import React, { useEffect, useState } from "react";
import { getIncidents, getAlerts, getTravels } from "../api";

const DashboardPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [incidentsData, alertsData, travelsData] = await Promise.all([
        getIncidents(),
        getAlerts(),
        getTravels(),
      ]);

      setIncidents(Array.isArray(incidentsData) ? incidentsData : []);
      setAlerts(Array.isArray(alertsData) ? alertsData : []);
      setTravels(Array.isArray(travelsData) ? travelsData : []);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError("Could not load dashboard data from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalIncidents = incidents.length;
  const totalAlerts = alerts.length;

  const activeTravels = travels.filter((travel) => {
    const status = String(travel.status || "").toLowerCase();
    return status === "active" || status === "started" || status === "ongoing";
  }).length;

  const emergencyAlerts = alerts.filter((alert) => {
    const text =
      `${alert.alert_type || ""} ${alert.type || ""} ${alert.message || ""}`.toLowerCase();
    return text.includes("emergency") || text.includes("sos");
  }).length;

  const latestIncident = incidents.length > 0 ? incidents[0] : null;
  const latestAlert = alerts.length > 0 ? alerts[0] : null;

  const getIncidentTitle = (incident) => {
    return (
      incident.incident_type ||
      incident.type ||
      incident.category ||
      "Incident"
    );
  };

  const getIncidentMessage = (incident) => {
    return (
      incident.summary ||
      incident.message ||
      incident.description ||
      incident.details ||
      "No description available"
    );
  };

  const getAlertTitle = (alert) => {
    return alert.alert_type || alert.type || "Alert";
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

  const sectionGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "24px",
  };

  const cardStyle = {
    background: "#0b1736",
    border: "1px solid #1f3b74",
    borderRadius: "22px",
    padding: "26px",
    minHeight: "250px",
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

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Dashboard</h1>
      <p style={subHeadingStyle}>
        Overall system overview for incidents, alerts, and safe travel activity
      </p>

      <button style={buttonStyle} onClick={loadDashboardData}>
        Refresh Dashboard
      </button>

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : error ? (
        <p style={{ color: "#ff7b7b", fontWeight: "600" }}>{error}</p>
      ) : (
        <>
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Total Incidents</div>
              <div style={statValueStyle}>{totalIncidents}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Total Alerts</div>
              <div style={statValueStyle}>{totalAlerts}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Active Travel Sessions</div>
              <div style={statValueStyle}>{activeTravels}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Emergency Alerts</div>
              <div style={statValueStyle}>{emergencyAlerts}</div>
            </div>
          </div>

          <div style={sectionGridStyle}>
            <div style={cardStyle}>
              <h2 style={cardHeadingStyle}>Latest Incident</h2>
              {latestIncident ? (
                <>
                  <div style={titleTextStyle}>{getIncidentTitle(latestIncident)}</div>
                  <div style={bodyTextStyle}>{getIncidentMessage(latestIncident)}</div>
                </>
              ) : (
                <p style={bodyTextStyle}>No incidents available.</p>
              )}
            </div>

            <div style={cardStyle}>
              <h2 style={cardHeadingStyle}>Latest Alert</h2>
              {latestAlert ? (
                <>
                  <div style={titleTextStyle}>{getAlertTitle(latestAlert)}</div>
                  <div style={bodyTextStyle}>{getAlertMessage(latestAlert)}</div>
                </>
              ) : (
                <p style={bodyTextStyle}>No alerts available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;