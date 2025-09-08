const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schemas
const houseSchema = new mongoose.Schema({
  name: String,
  coaches: [String],
  mentors: [String],
  players: [String],
});
const House = mongoose.model("House", houseSchema);

const activitySchema = new mongoose.Schema({
  name: String,
  points: Number, // default points (can be positive or negative)
  description: String,
});
const Activity = mongoose.model("Activity", activitySchema);

const playerActivitySchema = new mongoose.Schema({
  player: String,
  house: String,
  activity: String, // store activity name
  points: Number,   // allow negative too
  date: { type: Date, default: Date.now },
});
const PlayerActivity = mongoose.model("PlayerActivity", playerActivitySchema);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});
const User = mongoose.model("User", userSchema);

//
// ==================== ROUTES ====================
//

// Get all houses with total points calculated
app.get("/api/houses", async (req, res) => {
  try {
    const houses = await House.find();

    // calculate total points for each house
    const results = [];
    for (const h of houses) {
      const agg = await PlayerActivity.aggregate([
        { $match: { house: h.name } },
        { $group: { _id: null, total: { $sum: "$points" } } },
      ]);
      const totalPoints = agg.length > 0 ? agg[0].total : 0;

      results.push({
        ...h.toObject(),
        totalPoints,
      });
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch houses" });
  }
});

// Get players of a house
app.get("/api/house/:name/players", async (req, res) => {
  const house = await House.findOne({ name: req.params.name });
  res.json(house ? house.players : []);
});

// Get activities for a player + total points
app.get("/api/player/:name/activities", async (req, res) => {
  try {
    const activities = await PlayerActivity.find({ player: req.params.name }).sort({ date: -1 });
    const totalPoints = activities.reduce((sum, a) => sum + a.points, 0);
    res.json({ activities, totalPoints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch player activities" });
  }
});

// Add new points for a player (positive or negative)
app.post("/api/points", async (req, res) => {
  try {
    const { player, house, activity, points } = req.body;
    if (!player || !house || !activity || typeof points !== "number") {
      return res.status(400).json({ error: "All fields required" });
    }

    const newRecord = new PlayerActivity({ player, house, activity, points });
    await newRecord.save();

    res.json({ message: "Points updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update points" });
  }
});

// ==================== ACTIVITIES ROUTES ====================

// Get all activities
app.get("/api/activities", async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new activity
app.post("/api/activities", async (req, res) => {
  try {
    const { name, points, description } = req.body;
    const activity = new Activity({ name, points, description });
    await activity.save();
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete activity
app.delete("/api/activities/:id", async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: "Activity deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== AUTH ROUTES ====================
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "User not found" });

  const bcrypt = require("bcryptjs");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid password" });

  const jwt = require("jsonwebtoken");
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
});

//
// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
