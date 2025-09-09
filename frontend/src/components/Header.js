// src/components/Header.js
import React from "react";
import saralLogo from "../Saral-Logo.png";
import swamijiLogo from "../Swamiji.png";
import guruhariLogo from "../Guruhari.png";

export default function Header({ token, onLogin, onLogout }) {
  return (
    <header className="header">
      {/* Top-right auth button */}
      <div className="auth-btn-container">
        {token ? (
          <button className="login-btn" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <button className="login-btn" onClick={onLogin}>
            Login
          </button>
        )}
      </div>

      {/* Centered logos and text */}
      <div className="header-content">
        <div className="logo-row">
          <img
            src={swamijiLogo}
            className="side-logo left"
            alt="Swamiji Logo"
          />
          <img src={saralLogo} className="main-logo" alt="Main Logo" />
          <img
            src={guruhariLogo}
            className="side-logo right"
            alt="Guruhari Logo"
          />
        </div>

        <div className="center-text">
          <h1>Saral Mandal Akshar Sena</h1>
          <h2>Level Up</h2>
          <p>Genius is Ever Genius</p>
        </div>
      </div>

      {/* Space background */}
      <div className="space-bg">
        <div className="star" style={{ top: "10%", left: "5%" }}></div>
        <div className="star" style={{ top: "30%", left: "70%" }}></div>
        <div className="star" style={{ top: "60%", left: "40%" }}></div>
        <div className="star" style={{ top: "80%", left: "80%" }}></div>
        <div className="star" style={{ top: "8%", left: "30%" }}></div>
        <div className="star" style={{ top: "40%", left: "10%" }}></div>
        <div className="star" style={{ top: "55%", left: "20%" }}></div>
        <div className="star" style={{ top: "88%", left: "22%" }}></div>
        <div className="planet saturn"></div>
        <div className="planet jupiter"></div>
        <div className="planet venus"></div>
        <div className="planet neptune"></div>
      </div>
    </header>
  );
}
