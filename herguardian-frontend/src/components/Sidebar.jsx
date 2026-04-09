import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Route,
  ShieldAlert,
  BellRing,
  Activity,
  Home,
  UserCircle2,
  LogOut,
} from "lucide-react";

export default function Sidebar({ user, onLogout }) {
  const isAdmin = user?.role === "admin";

  const shellStyle = {
    width: "290px",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #08142f, #0b1736)",
    borderRight: "1px solid rgba(148,163,184,0.12)",
    padding: "24px 18px",
    boxSizing: "border-box",
  };

  const brandStyle = {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#f472b6",
    marginBottom: "10px",
  };

  const subStyle = {
    color: "#9fb0d0",
    lineHeight: "1.6",
    fontSize: "0.98rem",
    marginBottom: "26px",
  };

  const userCardStyle = {
    background: "rgba(15,23,42,0.86)",
    border: "1px solid rgba(148,163,184,0.12)",
    borderRadius: "20px",
    padding: "16px",
    marginBottom: "22px",
  };

  const sectionStyle = {
    color: "#64748b",
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    margin: "18px 10px 10px",
  };

  const navWrapStyle = {
    display: "grid",
    gap: "10px",
  };

  const logoutButtonStyle = {
    width: "100%",
    marginTop: "18px",
    border: "1px solid rgba(248,113,113,0.24)",
    background: "rgba(127,29,29,0.18)",
    color: "#fecaca",
    borderRadius: "18px",
    padding: "12px 14px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center",
  };

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    borderRadius: "18px",
    textDecoration: "none",
    color: "white",
    fontWeight: "700",
    background: isActive
      ? "linear-gradient(90deg, rgba(236,72,153,0.96), rgba(168,85,247,0.96))"
      : "#1e2d4e",
    border: isActive
      ? "1px solid rgba(244,114,182,0.5)"
      : "1px solid rgba(148,163,184,0.08)",
    boxShadow: isActive ? "0 10px 20px rgba(236,72,153,0.16)" : "none",
  });

  const adminLinks = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={19} /> },
    { to: "/safe-travel", label: "Safe Travel", icon: <Route size={19} /> },
    { to: "/ai-monitoring", label: "AI Monitoring", icon: <Activity size={19} /> },
    { to: "/incidents", label: "Incident Log", icon: <ShieldAlert size={19} /> },
    { to: "/alerts", label: "Alert Center", icon: <BellRing size={19} /> },
    { to: "/profile", label: "Profile", icon: <UserCircle2 size={19} /> },
  ];

  const userLinks = [
    { to: "/", label: "Home", icon: <Home size={19} /> },
    { to: "/safe-travel", label: "Safe Travel", icon: <Route size={19} /> },
    { to: "/profile", label: "Profile", icon: <UserCircle2 size={19} /> },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside style={shellStyle}>
      <div style={brandStyle}>HerGuardian AI</div>
      <div style={subStyle}>
        {isAdmin
          ? "Monitoring console for incidents, alerts, AI intelligence, and travel supervision."
          : "Personal safety interface for travel protection, emergency access, and quick safety actions."}
      </div>

      <div style={userCardStyle}>
        <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "8px" }}>
          Signed in as
        </div>
        <div style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "4px" }}>
          {user?.name || "User"}
        </div>
        <div style={{ color: "#9fb0d0", fontSize: "0.92rem", marginBottom: "8px" }}>
          {user?.email || "No email"}
        </div>
        <div
          style={{
            display: "inline-flex",
            padding: "7px 12px",
            borderRadius: "999px",
            background: isAdmin ? "rgba(236,72,153,0.14)" : "rgba(37,99,235,0.16)",
            color: isAdmin ? "#f9a8d4" : "#bfdbfe",
            fontSize: "0.85rem",
            fontWeight: "700",
          }}
        >
          {isAdmin ? "Admin Access" : "User Access"}
        </div>
      </div>

      <div style={sectionStyle}>{isAdmin ? "Operator Navigation" : "Safety Navigation"}</div>

      <nav style={navWrapStyle}>
        {links.map((item) => (
          <NavLink key={item.to} to={item.to} style={linkStyle}>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button style={logoutButtonStyle} onClick={onLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}