import React from "react";

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("herguardian_user") || "null");

  const pageStyle = {
    minHeight: "100vh",
    background: "#020b24",
    color: "white",
    padding: "30px",
  };

  const cardStyle = {
    background: "#0b1736",
    border: "1px solid #1f3b74",
    borderRadius: "24px",
    padding: "28px",
    maxWidth: "760px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
  };

  const rowStyle = {
    padding: "14px 0",
    borderBottom: "1px solid #19325f",
  };

  const labelStyle = {
    color: "#94a3b8",
    fontSize: "0.95rem",
    marginBottom: "6px",
  };

  const valueStyle = {
    fontSize: "1.05rem",
    fontWeight: "700",
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ fontSize: "2.8rem", fontWeight: "800", marginBottom: "8px" }}>
        Profile
      </h1>

      <p style={{ color: "#9fb0d0", marginBottom: "24px" }}>
        Personal account information for the HerGuardian AI prototype
      </p>

      <div style={cardStyle}>
        <div style={rowStyle}>
          <div style={labelStyle}>Full Name</div>
          <div style={valueStyle}>{user?.name || "N/A"}</div>
        </div>

        <div style={rowStyle}>
          <div style={labelStyle}>Email</div>
          <div style={valueStyle}>{user?.email || "N/A"}</div>
        </div>

        <div style={rowStyle}>
          <div style={labelStyle}>Phone</div>
          <div style={valueStyle}>{user?.phone || "N/A"}</div>
        </div>

        <div style={{ paddingTop: "14px" }}>
          <div style={labelStyle}>Role</div>
          <div style={valueStyle}>{user?.role || "user"}</div>
        </div>
      </div>
    </div>
  );
}