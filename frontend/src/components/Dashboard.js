import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    // fetch houses initially
    axios
      .get("https://level-up-saral-mandal.onrender.com/api/houses")
      .then((res) => setHouses(res.data))
      .catch((err) => console.error("Error fetching houses:", err));

    // set interval to ping backend every 5 mins
    const interval = setInterval(() => {
      axios
        .get("https://level-up-saral-mandal.onrender.com/api/houses")
        .then(() => console.log("Keep-alive ping success"))
        .catch((err) => console.error("Keep-alive ping failed:", err));
    }, 5 * 60 * 1000);

    // cleanup on unmount
    return () => clearInterval(interval);
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
