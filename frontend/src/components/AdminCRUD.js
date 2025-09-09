import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminCRUD() {
  const [houses, setHouses] = useState([]);
  const [players, setPlayers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({
    house: "",
    player: "",
    activity: "",
    points: "",
    bonus: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const housesRes = await axios.get(
        "https://level-up-saral-mandal.onrender.com/api/houses"
      );
      setHouses(housesRes.data);

      const activitiesRes = await axios.get(
        "https://level-up-saral-mandal.onrender.com/api/activities"
      );
      setActivities(activitiesRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    if (form.house) {
      axios
        .get(
          `https://level-up-saral-mandal.onrender.com/api/house/${form.house}/players`
        )
        .then((res) => setPlayers(res.data))
        .catch((err) => console.error(err));
    } else {
      setPlayers([]);
    }
  }, [form.house]);

  const handleActivityChange = (activityName) => {
    const activity = activities.find((a) => a.name === activityName);
    setForm({
      ...form,
      activity: activityName,
      points: activity ? activity.points : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.house || !form.player || !form.activity) {
      setError("⚠️ Please fill all required fields before submitting.");
      return;
    }

    setError("");

    try {
      // total points = activity points + optional bonus
      const totalPoints = parseInt(form.points) + (parseInt(form.bonus) || 0);

      await axios.post(
        "https://level-up-saral-mandal.onrender.com/api/points",
        {
          player: form.player,
          house: form.house,
          activity: form.activity,
          points: totalPoints,
          bonus: parseInt(form.bonus) || 0,
        }
      );

      alert("✅ Points updated successfully!");
      fetchData();
      setForm({ house: "", player: "", activity: "", points: "", bonus: "" });
    } catch (err) {
      console.error("Error updating points:", err);
      setError("❌ Failed to update points.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-crud-form">
      {error && <p className="error">{error}</p>}

      <select
        value={form.house}
        onChange={(e) => setForm({ ...form, house: e.target.value })}
        className="dropdown"
      >
        <option value="">Select House</option>
        {houses.map((h) => (
          <option key={h.name} value={h.name}>
            {h.name}
          </option>
        ))}
      </select>

      <select
        value={form.player}
        onChange={(e) => setForm({ ...form, player: e.target.value })}
        className="dropdown"
      >
        <option value="">Select Player</option>
        {players.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        value={form.activity}
        onChange={(e) => handleActivityChange(e.target.value)}
        className="dropdown"
      >
        <option value="">Select Activity</option>
        {activities.map((a) => (
          <option key={a.name} value={a.name}>
            {a.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Points (auto-filled)"
        value={form.points}
        onChange={(e) =>
          setForm({ ...form, points: parseInt(e.target.value) || "" })
        }
        readOnly // make it non-editable
        className="input-points"
      />

      <input
        type="number"
        placeholder="Bonus points (optional)"
        value={form.bonus}
        onChange={(e) =>
          setForm({ ...form, bonus: parseInt(e.target.value) || "" })
        }
        className="input-bonus"
      />

      <button type="submit" className="submit-btn">
        Update Points
      </button>
    </form>
  );
}
