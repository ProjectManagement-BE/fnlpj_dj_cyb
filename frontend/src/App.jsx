


import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Detect from "./pages/Detect";
import NetworkMonitor from "./pages/NetworkMonitor";
import DarkWebSearch from "./pages/DarkWebSearch";
import Chatbot from "./pages/Chatbot";
import Login from "./pages/Login";
import Register from "./pages/Register";
import IPThreat from "./pages/IPThreat";

function App() {
  // Validate auth on load; if token missing, redirect happens via routes
  const isAuthed = Boolean(localStorage.getItem("access"));

  const isTokenValid = () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) return false;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp > now;
    } catch {
      return false;
    }
  };

  const RequireAuth = ({ children }) => {
    return isAuthed && isTokenValid() ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isTokenValid() ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/detect"
          element={
            <RequireAuth>
              <Detect />
            </RequireAuth>
          }
        />
        <Route
          path="/network"
          element={
            <RequireAuth>
              <NetworkMonitor />
            </RequireAuth>
          }
        />
        <Route
          path="/ip-threat"
          element={
            <RequireAuth>
              <IPThreat />
            </RequireAuth>
          }
        />
        <Route
          path="/darkweb"
          element={
            <RequireAuth>
              <DarkWebSearch />
            </RequireAuth>
          }
        />
        <Route
          path="/chatbot"
          element={
            <RequireAuth>
              <Chatbot />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
