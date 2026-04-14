import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import SafeTravelPage from "./pages/SafeTravelPage";
import AdminTravelMonitoringPage from "./pages/AdminTravelMonitoringPage";
import IncidentsPage from "./pages/IncidentsPage";
import AlertsPage from "./pages/AlertsPage";
import AIMonitoringPage from "./pages/AIMonitoringPage";
import AuthPage from "./pages/AuthPage";
import UserHomePage from "./pages/UserHomePage";
import ProfilePage from "./pages/ProfilePage";

function ProtectedLayout({ user, onLogout }) {
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="flex-1 overflow-auto p-6">
        <Routes>
          {isAdmin ? (
            <>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/travel-monitoring" element={<AdminTravelMonitoringPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/ai-monitoring" element={<AIMonitoringPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </>
          ) : (
            <>
              <Route path="/" element={<UserHomePage />} />
              <Route path="/safe-travel" element={<SafeTravelPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </>
          )}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("herguardian_user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("herguardian_user");
        localStorage.removeItem("herguardian_token");
      }
    }

    setAuthChecked(true);
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("herguardian_user");
    localStorage.removeItem("herguardian_token");
    setUser(null);
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-lg text-slate-300">Loading HerGuardian AI...</p>
      </div>
    );
  }

  return (
    <Routes>
      {!user ? (
        <>
          <Route
            path="/auth"
            element={<AuthPage onAuthSuccess={handleAuthSuccess} />}
          />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </>
      ) : (
        <>
          <Route
            path="/*"
            element={<ProtectedLayout user={user} onLogout={handleLogout} />}
          />
          <Route path="/auth" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}