const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
console.log("MONGO_URI:", process.env.MONGO_URI); // check if it's loaded

// ====== SCHEMAS ======
const houseSchema = new mongoose.Schema({
    name: String,
    coaches: [String],
    mentors: [String],
    players: [String],
});
const House = mongoose.model("House", houseSchema);

const activitySchema = new mongoose.Schema( {
    name: String,
    points: Number,
    description: String,
});
const Activity = mongoose.model("Activity", activitySchema);

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
});
const User = mongoose.model("User", userSchema);

// ====== SEED DATA ======
const houses = [
    {
        name: "Saturn House",
        coaches: ["Darshit Bhai Suratwala", "Harsh Bhai Patel"],
        mentors: ["Vinayak Bhai Laungani", "Akshat Bhai Gokani"],
        players: [
            "Akshay Kumavat", "Anant Sharma", "Aayush Dubey", "Daksh Kumavat", "Dhruv Vora", 
            "Heet Soni", "Jaypal Purohit", "Krish Kumavat", "Manav Soni", "Rahul Bhai Chaudhari", 
            "Nakul Kumavat", "Yash Panchal", "Deep Parmar"
        ],
    },
    {
        name: "Neptune House",
        coaches: ["Mayur Bhai Kava", "Dipesh Bhai Bhatt"],
        mentors: ["Het Bhai Panchamia", "Neel Bhai Chothani"],
        players: [
            "Aayush Thaker", "Alok Shukla", "Dev Gupta", "Dhairya Gajjar", "Dhruv Gadhiya", 
            "Grantham Suthar", "Harsh Sanghvi", "Manan Lakhani", "Nishant Bhutani", "Piyush Purohit", 
            "Shivansh Garg", "Yash Borad", "Krishna Gupta", "Mayank Mistry"
        ]
    },
    {
        name: "Venus House",
        coaches: ["Akshay Bhai Sayta", "Vijay Bhai Gohil"],
        mentors: ["Bhavya Doshi", "Sahil Bhai Modi"],
        players: [
            "Achal Thanvi", "Aarush Dudhat", "Dev Chudasama", "Dharmik Parmar", "Jignesh Parmar", 
            "Veer Chheda", "Prabodh Sawant", "Pruthavi Rathod", "Rachit Doshi", "Rajveer Solanki", 
            "Shlok Makwana", "Tirth Shah", "Vrutant Ajmera"
        ]
    },
    {
        name: "Jupiter House",
        coaches: ["Parth Bhai Darji", "Keyur Bhai Panchal"],
        mentors: ["Kunal Bhai Pandya", "Jay Bhai Darji"],
        players: [
            "Ansh Darji", "Ashish Darji", "Daksh Rathod", "Kartik Gupta", "Krishna Pitroda", 
            "Mayakrishna Yadav", "Naman Jugran", "Nirmal Boricha", "Rahul Kumavat", "Samarth T", 
            "Shavan Bhardwaj", "Yash Bhola", "Shivam Sharma"
        ]
    }
];

const activities = [
    { name: "Project", points: 100, description: "Completion of Assigned Project" },
    { name: "Bhajan Mandal Seva", points: 50, description: "Presence of 2 during Bhajan = 50" },
    { name: "Sabha Vyavastha Seva", points: 50, description: "Presence of 2 during seva = 50" },
    { name: "Marks >95%", points: 100, description: "Points will be awarded based on marksheet proof" },
    { name: "Marks >80%", points: 50, description: "Points will be awarded based on marksheet proof" },
    { name: "Marks >70%", points: 20, description: "Points will be awarded based on marksheet proof" },
    { name: "Any Sports/Cultural Achievement", points: 20, description: "Present Valid certificate or trophy to claim points" },
    { name: "No Instagram", points: 50, description: "Provide screen time" },
    { name: "No Mobile Games", points: 50, description: "Provide screen time" },
    { name: "No Snapchat", points: 50, description: "Provide screen time" },
    { name: "Sabha Attendance", points: 50, description: "Points will be awarded based on Attendance proof" },
    { name: "New Yuvak", points: 100, description: "The New Yuvak Must Attend min 3 sabha" },
    { name: "Daily Pooja", points: 50, description: "Must Provide Daily Pooja photo for 21 consecutive days." },
    { name: "Anchoring Seva", points: 50, description: "Each Team should nominate 2 Bhulkus" },
    { name: "Respect to Parents", points: 100, description: "Based on Verification with parents" },
    { name: "Saying Bad Words", points: -50, description: "Incident must be verified" },
    { name: "Fight", points: -100, description: "Incident must be verified" },
    { name: "Flyer", points: 50, description: "Judges Approved" }
];

// ====== SEED FUNCTION ======
async function seed() {
    try {
        const houseCount = await House.countDocuments();
        const activityCount = await Activity.countDocuments();
        const userCount = await User.countDocuments();

        if (houseCount === 0) {
            await House.insertMany(houses);
            console.log("✅ Houses seeded!");
        } else {
            console.log("⏩ Houses already exist, skipping...");
        }

        if (activityCount === 0) {
            await Activity.insertMany(activities);
            console.log("✅ Activities seeded!");
        } else {
            console.log("⏩ Activities already exist, skipping...");
        }

        if (userCount === 0) {
            const adminPassword = await bcrypt.hash("TuRajiTha1708", 10);
            await User.create({ username: "Nimit", password: adminPassword, role: "admin" });
            console.log("✅ Admin user created!");
        } else {
            console.log("⏩ Users already exist, skipping...");
        }
    } catch (err) {
        console.error("❌ Seeding error:", err);
    } finally {
        mongoose.disconnect();
    }
}

seed();
