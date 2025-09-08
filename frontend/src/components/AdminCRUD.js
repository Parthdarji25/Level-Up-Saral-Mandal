// src/components/AdminCRUD.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminCRUD() {
  const [houses, setHouses] = useState([]);
  const [players, setPlayers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({ house: "", player: "", activity: "", points: "" });
  const [error, setError] = useState("");

  // Fetch houses & activities on load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const housesRes = await axios.get("http://localhost:5000/api/houses");
      setHouses(housesRes.data);

      const activitiesRes = await axios.get("http://localhost:5000/api/activities");
      setActivities(activitiesRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // Fetch players when house changes
  useEffect(() => {
    if (form.house) {
      axios
        .get(`http://localhost:5000/api/house/${form.house}/players`)
        .then((res) => setPlayers(res.data))
        .catch((err) => console.error(err));
    } else {
      setPlayers([]);
    }
  }, [form.house]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.house || !form.player || !form.activity || !form.points) {
      setError("⚠️ Please fill all fields before submitting.");
      return;
    }
    setError("");

    try {
      await axios.post("http://localhost:5000/api/points", form);
      alert("✅ Points updated successfully!");

      // Refresh data so HousePoints sees updates
      fetchData();

      // Reset form
      setForm({ house: "", player: "", activity: "", points: "" });
    } catch (err) {
      console.error("Error updating points:", err);
      setError("❌ Failed to update points.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-crud-form">
      {error && <p className="error">{error}</p>}

      {/* House dropdown */}
      <select
        value={form.house}
        onChange={(e) => setForm({ ...form, house: e.target.value })}
        className="dropdown"
      >
        <option value="">Select House</option>
        {houses.map((h) => (
          <option key={h.name} value={h.name} className="dropdown-option">
            {h.name}
          </option>
        ))}
      </select>

      {/* Player dropdown */}
      <select
        value={form.player}
        onChange={(e) => setForm({ ...form, player: e.target.value })}
        className="dropdown"
      >
        <option value="">Select Player</option>
        {players.map((p) => (
          <option key={p} value={p} className="dropdown-option">
            {p}
          </option>
        ))}
      </select>

      {/* Activity dropdown */}
      <select
        value={form.activity}
        onChange={(e) => setForm({ ...form, activity: e.target.value })}
        className="dropdown"
      >
        <option value="">Select Activity</option>
        {activities.map((a) => (
          <option key={a.name} value={a.name} className="dropdown-option">
            {a.name}
          </option>
        ))}
      </select>

      {/* Points input */}
      <input
        type="number"
        placeholder="Enter points"
        value={form.points}
        onChange={(e) => setForm({ ...form, points: parseInt(e.target.value) || "" })}
        className="input-points"
      />

      <button type="submit" className="submit-btn">
        Update Points
      </button>
    </form>
  );
}
