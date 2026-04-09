import React, { useMemo, useState } from "react";
import { Eye, EyeOff, Shield, MapPinned, Siren, Activity } from "lucide-react";
import { loginUser, registerUser } from "../api";

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const isLogin = mode === "login";

  const heading = useMemo(() => {
    return isLogin
      ? role === "admin"
        ? "Admin access"
        : "Welcome back"
      : role === "admin"
      ? "Create admin access"
      : "Create your safety account";
  }, [isLogin, role]);

  const subheading = useMemo(() => {
    if (isLogin && role === "admin") {
      return "Sign in to access dashboard monitoring, incidents, alerts, and AI intelligence.";
    }
    if (isLogin && role === "user") {
      return "Sign in to access your safety tools, travel protection, and profile.";
    }
    if (!isLogin && role === "admin") {
      return "Register an admin/operator account for monitoring and operational visibility.";
    }
    return "Register a user account for safe travel, emergency access, and safety features.";
  }, [isLogin, role]);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    if (
      !registerForm.name.trim() ||
      !registerForm.email.trim() ||
      !registerForm.phone.trim() ||
      !registerForm.password.trim()
    ) {
      setMessage("Please fill all registration fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await registerUser(registerForm);

      setMessage("Registration successful. Please sign in to continue.");

      setMode("login");
      setLoginForm({
        email: registerForm.email,
        password: registerForm.password,
      });

      setRegisterForm({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (error) {
      console.error(error);

      if (error?.response?.data?.detail) {
        setMessage(
          typeof error.response.data.detail === "string"
            ? error.response.data.detail
            : "Registration failed. Please review the entered details."
        );
      } else {
        setMessage("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const result = await loginUser(loginForm);

      localStorage.setItem("herguardian_token", result.access_token);

      const sessionUser = {
        id: result.user?.id ?? null,
        name: result.user?.name || "User",
        email: result.user?.email || loginForm.email.trim(),
        phone: result.user?.phone || "",
        role,
        token_type: result.token_type,
    };

      localStorage.setItem("herguardian_user", JSON.stringify(sessionUser));

      if (onAuthSuccess) {
        onAuthSuccess(sessionUser);
      }
    } catch (error) {
      console.error(error);

      if (error?.response?.data?.detail) {
        setMessage(
          typeof error.response.data.detail === "string"
            ? error.response.data.detail
            : "Login failed. Please check your credentials."
        );
      } else {
        setMessage("Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const shellStyle = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(236,72,153,0.14), transparent 28%), radial-gradient(circle at bottom right, rgba(37,99,235,0.18), transparent 32%), #020617",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
  };

  const frameStyle = {
    width: "100%",
    maxWidth: "1180px",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: "28px",
  };

  const heroStyle = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "32px",
    padding: "40px",
    border: "1px solid rgba(148,163,184,0.16)",
    background:
      "linear-gradient(160deg, rgba(15,23,42,0.95), rgba(12,22,46,0.98))",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  };

  const cardStyle = {
    borderRadius: "32px",
    padding: "34px",
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(11,23,54,0.96)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  };

  const tabsStyle = {
    display: "inline-flex",
    gap: "10px",
    padding: "6px",
    borderRadius: "999px",
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(148,163,184,0.12)",
    marginBottom: "18px",
  };

  const tabStyle = (active) => ({
    border: "none",
    borderRadius: "999px",
    padding: "11px 18px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "0.95rem",
    color: active ? "white" : "#94a3b8",
    background: active ? "linear-gradient(90deg, #ec4899, #8b5cf6)" : "transparent",
  });

  const roleWrapStyle = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  };

  const roleStyle = (active) => ({
    border: "1px solid " + (active ? "#2563eb" : "#334155"),
    borderRadius: "16px",
    background: active ? "rgba(37,99,235,0.16)" : "#0f172a",
    color: "white",
    padding: "12px 14px",
    cursor: "pointer",
    fontWeight: "700",
    flex: 1,
  });

  const inputStyle = {
    width: "100%",
    borderRadius: "18px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    padding: "14px 16px",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const inputWrapStyle = {
    position: "relative",
  };

  const passwordInputStyle = {
    ...inputStyle,
    paddingRight: "52px",
  };

  const eyeButtonStyle = {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
  };

  const actionButtonStyle = {
    width: "100%",
    border: "none",
    borderRadius: "18px",
    background: "linear-gradient(90deg, #2563eb, #7c3aed)",
    color: "white",
    padding: "15px 18px",
    fontWeight: "800",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "6px",
  };

  const messageStyle = {
    marginTop: "18px",
    borderRadius: "18px",
    padding: "13px 15px",
    background: "rgba(236,72,153,0.12)",
    border: "1px solid rgba(236,72,153,0.32)",
    color: "#f9a8d4",
    lineHeight: "1.5",
  };

  return (
    <div style={shellStyle}>
      <div style={frameStyle}>
        <section style={heroStyle}>
          <div style={{ fontSize: "2.9rem", fontWeight: "800", marginBottom: "12px" }}>
            HerGuardian AI
          </div>
          <div style={{ color: "#cbd5e1", lineHeight: "1.8", maxWidth: "620px" }}>
            A women’s safety analytics prototype combining AI-based incident detection,
            alert generation, safe travel monitoring, route deviation handling,
            emergency escalation, and unified safety records.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "16px",
              marginTop: "28px",
            }}
          >
            <div style={{ background: "#0f172a", padding: "18px", borderRadius: "20px" }}>
              <MapPinned size={20} color="#60a5fa" />
              <div style={{ fontWeight: "700", marginTop: "12px" }}>Safe Travel</div>
              <div style={{ color: "#94a3b8", marginTop: "6px", lineHeight: "1.6" }}>
                Route tracking, deviation awareness, and emergency support.
              </div>
            </div>

            <div style={{ background: "#0f172a", padding: "18px", borderRadius: "20px" }}>
              <Activity size={20} color="#c084fc" />
              <div style={{ fontWeight: "700", marginTop: "12px" }}>AI Monitoring</div>
              <div style={{ color: "#94a3b8", marginTop: "6px", lineHeight: "1.6" }}>
                AI incidents, alerts, and risk intelligence for operators.
              </div>
            </div>

            <div style={{ background: "#0f172a", padding: "18px", borderRadius: "20px" }}>
              <Siren size={20} color="#fb7185" />
              <div style={{ fontWeight: "700", marginTop: "12px" }}>Alert Escalation</div>
              <div style={{ color: "#94a3b8", marginTop: "6px", lineHeight: "1.6" }}>
                Structured alerts linked to incidents for rapid action.
              </div>
            </div>

            <div style={{ background: "#0f172a", padding: "18px", borderRadius: "20px" }}>
              <Shield size={20} color="#34d399" />
              <div style={{ fontWeight: "700", marginTop: "12px" }}>Dual Experience</div>
              <div style={{ color: "#94a3b8", marginTop: "6px", lineHeight: "1.6" }}>
                User safety flow and admin monitoring flow inside one prototype.
              </div>
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <div style={tabsStyle}>
            <button
              style={tabStyle(isLogin)}
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
            >
              Login
            </button>
            <button
              style={tabStyle(!isLogin)}
              onClick={() => {
                setMode("register");
                setMessage("");
              }}
            >
              Register
            </button>
          </div>

          <div style={roleWrapStyle}>
            <button
              style={roleStyle(role === "user")}
              onClick={() => setRole("user")}
            >
              User Access
            </button>
            <button
              style={roleStyle(role === "admin")}
              onClick={() => setRole("admin")}
            >
              Admin Access
            </button>
          </div>

          <div style={{ fontSize: "1.85rem", fontWeight: "800", marginBottom: "8px" }}>
            {heading}
          </div>
          <div style={{ color: "#94a3b8", lineHeight: "1.7", marginBottom: "22px" }}>
            {subheading}
          </div>

          {isLogin ? (
            <div style={{ display: "grid", gap: "14px" }}>
              <input
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="Email address"
                style={inputStyle}
              />

              <div style={inputWrapStyle}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Password"
                  style={passwordInputStyle}
                />
                <button
                  type="button"
                  style={eyeButtonStyle}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                style={actionButtonStyle}
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Signing in..." : role === "admin" ? "Login as Admin" : "Login as User"}
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "14px" }}>
              <input
                type="text"
                name="name"
                value={registerForm.name}
                onChange={handleRegisterChange}
                placeholder="Full name"
                style={inputStyle}
              />
              <input
                type="email"
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                placeholder="Email address"
                style={inputStyle}
              />
              <input
                type="text"
                name="phone"
                value={registerForm.phone}
                onChange={handleRegisterChange}
                placeholder="Phone number"
                style={inputStyle}
              />

              <div style={inputWrapStyle}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  placeholder="Create password"
                  style={passwordInputStyle}
                />
                <button
                  type="button"
                  style={eyeButtonStyle}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                style={actionButtonStyle}
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Creating account..." : role === "admin" ? "Register as Admin" : "Register as User"}
              </button>
            </div>
          )}

          {message && <div style={messageStyle}>{message}</div>}
        </section>
      </div>
    </div>
  );
}