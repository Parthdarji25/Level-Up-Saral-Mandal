// src/components/HousePoints.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function HousePoints() {
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerActivities, setPlayerActivities] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/houses")
      .then((res) => setHouses(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handlePlayerClick = async (playerName) => {
    setSelectedPlayer(playerName);
    setShowModal(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/player/${encodeURIComponent(
          playerName
        )}/activities`
      );
      setPlayerActivities(res.data.activities);
      setTotalPoints(res.data.totalPoints);

      const total = res.data.activities.reduce((acc, a) => acc + a.points, 0);
      setTotalPoints(total);
    } catch (err) {
      console.error(err);
      setPlayerActivities([]);
      setTotalPoints(0);
    }
  };

  return (
    <div className="house-points">
      {/* House selection */}
      <div className="house-list">
        {houses.map((h) => (
          <button
            key={h.name}
            onClick={() => {
              setSelectedHouse(h);
              setSelectedPlayer(null);
            }}
          >
            {h.name} ({h.totalPoints || 0} pts)
          </button>
        ))}
      </div>

      {/* Selected house details */}
      {selectedHouse && (
        <div className="house-details">
          <h3>{selectedHouse.name}</h3>
          <div className="house-total">
            Total Points: <span>{selectedHouse.totalPoints || 0}</span>
          </div>

          {/* Coaches inline */}
          <p className="inline-list">
            <span>Coaches:</span> {selectedHouse.coaches.join(", ")}
          </p>

          {/* Mentors inline */}
          <p className="inline-list">
            <span>Mentors:</span> {selectedHouse.mentors.join(", ")}
          </p>

          {/* Players clickable */}
          <h4 className="player-title">Players</h4>
          <ul>
            {selectedHouse.players.map((p) => (
              <li
                key={p}
                className="player clickable-player"
                onClick={() => handlePlayerClick(p)}
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal for player activities */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h4 className="modal-title">{selectedPlayer}'s Activities</h4>
            {playerActivities.length === 0 ? (
              <p>No activities found.</p>
            ) : (
              <ul>
                {playerActivities.map((act, idx) => (
                  <li key={idx}>
                    {act.activity} - {act.points} pts
                  </li>
                ))}
              </ul>
            )}
            <div className="modal-total">
              Total Points: <span>{totalPoints}</span>
            </div>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
