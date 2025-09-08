// src/components/Header.js
import React from "react";
import saralLogo from "../Saral-Logo.png";
import swamijiLogo from "../Swamiji.png";
import guruhariLogo from "../Guruhari.png";

export default function Header({ token, onLogin, onLogout }) {
  return (
    <header className="header">

      {/* Auth button top-right */}
      <div className="auth-btn-container">
        {token ? (
          <button className="login-btn" onClick={onLogout}>Logout</button>
        ) : (
          <button className="login-btn" onClick={onLogin}>Login</button>
        )}
      </div>

      {/* Logo row */}
      <div className="logo-row">
        <img src={swamijiLogo} className="side-logo left" alt="Swamiji Logo" />
        <img src={saralLogo} className="main-logo" alt="Main Logo" />
        <img src={guruhariLogo} className="side-logo right" alt="Guruhari Logo" />
      </div>

      {/* Center text */}
      <div className="center-text">
        <h1>Saral Mandal Akshar Sena</h1>
        <h2>Level Up</h2>
        <p>Genius is Ever Genius</p>
      </div>
    </header>
  );
}
