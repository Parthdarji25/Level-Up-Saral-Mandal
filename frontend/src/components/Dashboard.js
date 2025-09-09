import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    axios
      .get("https://level-up-saral-mandal.onrender.com/api/houses")
      .then((res) => setHouses(res.data))
      .catch((err) => console.error("Error fetching houses:", err));
  }, []);

  return (
    <div className="dashboard">
      {houses.map((house) => (
        <div key={house.name} className="house-card">
          <img
            src={`/images/${house.name}.jpg`}
            alt={house.name}
            className="house-logo"
          />
          <h3>{house.name}</h3>
          <p>Total Points: {house.totalPoints || 0}</p>
        </div>
      ))}
    </div>
  );
}
