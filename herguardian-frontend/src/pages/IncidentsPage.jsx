import React, { useEffect, useMemo, useState } from "react";
import { getIncidents } from "../api";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getIncidents();
      setIncidents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Incidents load error:", err);
      setError("Could not load incidents from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const getIncidentType = (incident) => {
    return incident.incident_type || incident.type || incident.category || "Incident";
  };

  const getIncidentSummary = (incident) => {
    return (
      incident.summary ||
      incident.message ||
      incident.description ||
      incident.details ||
      "No description available"
    );
  };

  const getIncidentSeverity = (incident) => {
    return (incident.severity || "unknown").toLowerCase();
  };

  const getIncidentLocation = (incident) => {
    return incident.location_name || incident.location || "Unknown location";
  };

  const getIncidentTime = (incident) => {
    return incident.timestamp || incident.created_at || incident.time || "N/A";
  };

  const filteredIncidents = useMemo(() => {
    if (filter === "all") return incidents;

    return incidents.filter((incident) => {
      const type = getIncidentType(incident).toLowerCase();
      const severity = getIncidentSeverity(incident);

      if (filter === "travel") {
        return type.includes("travel") || type.includes("deviation") || type.includes("route");
      }

      if (filter === "ai") {
        return (
          type.includes("ai") ||
          type.includes("gesture") ||
          type.includes("unsafe") ||
          type.includes("monitor")
        );
      }

      if (filter === "critical") {
        return severity === "critical" || severity === "high";
      }

      return true;
    });
  }, [incidents, filter]);

  const totalIncidents = incidents.length;
  const criticalCount = incidents.filter((incident) => {
    const sev = getIncidentSeverity(incident);
    return sev === "critical" || sev === "high";
  }).length;

  const travelCount = incidents.filter((incident) => {
    const type = getIncidentType(incident).toLowerCase();
    return type.includes("travel") || type.includes("deviation") || type.includes("route");
  }).length;

  const avgRiskScore = incidents.length
    ? (
        incidents.reduce((sum, incident) => sum + Number(incident.risk_score || 0), 0) /
        incidents.length
      ).toFixed(1)
    : "0.0";

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
    gridTemplateColumns: "1.4fr 1fr 1fr 1fr 2fr",
    gap: "16px",
    padding: "18px 20px",
    background: "#0d1d42",
    fontWeight: "700",
    color: "#dbe7ff",
    borderBottom: "1px solid #223a69",
  };

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr 1fr 1fr 2fr",
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

  const severityBadgeStyle = (severity) => {
    let bg = "#334155";
    if (severity === "critical") bg = "#b91c1c";
    else if (severity === "high") bg = "#d97706";
    else if (severity === "medium") bg = "#2563eb";
    else if (severity === "low") bg = "#15803d";

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
      <h1 style={titleStyle}>Incident Log</h1>
      <p style={subtitleStyle}>
        Full record of safety events captured across AI monitoring and safe travel workflows
      </p>

      <button style={buttonStyle} onClick={loadIncidents}>
        Refresh Incidents
      </button>

      {loading ? (
        <p>Loading incidents...</p>
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
              <div style={statLabelStyle}>Critical / High</div>
              <div style={statValueStyle}>{criticalCount}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Travel Related</div>
              <div style={statValueStyle}>{travelCount}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Average Risk Score</div>
              <div style={statValueStyle}>{avgRiskScore}</div>
            </div>
          </div>

          <div style={filterBarStyle}>
            <button style={filterButtonStyle(filter === "all")} onClick={() => setFilter("all")}>
              All
            </button>
            <button style={filterButtonStyle(filter === "critical")} onClick={() => setFilter("critical")}>
              Critical / High
            </button>
            <button style={filterButtonStyle(filter === "travel")} onClick={() => setFilter("travel")}>
              Travel
            </button>
            <button style={filterButtonStyle(filter === "ai")} onClick={() => setFilter("ai")}>
              AI / Monitoring
            </button>
          </div>

          <div style={tableWrapStyle}>
            <div style={tableHeaderStyle}>
              <div>Incident Type</div>
              <div>Severity</div>
              <div>Risk Score</div>
              <div>Location</div>
              <div>Summary</div>
            </div>

            {filteredIncidents.length === 0 ? (
              <div style={{ padding: "22px 20px", color: "#a9bddf" }}>
                No incidents found for this filter.
              </div>
            ) : (
              filteredIncidents.map((incident, index) => (
                <div key={incident.id || index} style={rowStyle}>
                  <div>
                    <div style={{ fontWeight: "700", marginBottom: "6px" }}>
                      {getIncidentType(incident)}
                    </div>
                    <div style={cellMutedStyle}>{getIncidentTime(incident)}</div>
                  </div>

                  <div>
                    <span style={severityBadgeStyle(getIncidentSeverity(incident))}>
                      {getIncidentSeverity(incident)}
                    </span>
                  </div>

                  <div style={cellMutedStyle}>{incident.risk_score ?? "N/A"}</div>

                  <div style={cellMutedStyle}>{getIncidentLocation(incident)}</div>

                  <div style={cellMutedStyle}>{getIncidentSummary(incident)}</div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}