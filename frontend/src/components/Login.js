// src/components/LoginModal.js
import React, { useState } from "react";
import axios from "axios";

export default function Login({ onLogin, onClose }) {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://level-up-saral-mandal.onrender.com/api/login", form);
      onLogin(res.data.token);
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Admin Login</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit">Login</button>
          <button type="button" className="close-btn" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
}
