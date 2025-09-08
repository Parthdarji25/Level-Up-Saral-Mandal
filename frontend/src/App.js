// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import HousePoints from "./components/HousePoints";
import AdminCRUD from "./components/AdminCRUD";
import LoginModal from "./components/Login";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    setShowLogin(false);
  };

  return (
    <Router>
      <Header
        token={token}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
      />

      <div className="tabs">
        <Link to="/">Dashboard</Link>
        <Link to="/houses">House Points</Link>
        {token && <Link to="/admin">Admin CRUD</Link>}
      </div>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/houses" element={<HousePoints />} />
        <Route path="/admin" element={token ? <AdminCRUD /> : <Navigate to="/" />} />
      </Routes>

      {showLogin && <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
    </Router>
  );
}

export default App;
