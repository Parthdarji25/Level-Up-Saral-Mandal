// src/components/Header.js
import React from "react";
import saralLogo from "../Saral-Logo.png";
import swamijiLogo from "../Swamiji.png";
import guruhariLogo from "../Guruhari.png";

export default function Header({ token, onLogin, onLogout }) {
  return (
    <header className="header">
      {/* 🔹 Background Video */}
      <video autoPlay muted loop playsInline className="bg-video">
        <source src="/video/spacevideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔹 Overlay for readability */}
      <div className="overlay"></div>

      {/* 🔹 Auth button (top-right) */}
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

      {/* 🔹 Centered content */}
      <div className="header-content">
        <div className="logo-row">
          <img src={swamijiLogo} className="side-logo left" alt="Swamiji Logo" />
          <img src={saralLogo} className="main-logo" alt="Main Logo" />
          <img src={guruhariLogo} className="side-logo right" alt="Guruhari Logo" />
        </div>

        <div className="center-text">
          <h1>Saral Mandal Akshar Sena</h1>
          <h2>Level Up</h2>
          <p>Genius is Ever Genius</p>
        </div>
      </div>
    </header>
  );
}
