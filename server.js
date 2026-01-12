const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- Database Connection ---
// Abhi hum Local DB use kar rahe hain taake koi connection error na aaye
mongoose.connect('mongodb://127.0.0.1:27017/courseSystem')
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// --- Database Schemas ---

// 1. User Schema
const UserSchema = new mongoose.Schema({
    fullName: String,
    regNumber: { type: String, unique: true },
    password: String,
    role: String,
    semester: String,
    enrolledCourses: [] // Ismein enroll kiye hue courses save honge
});
const User = mongoose.model('User', UserSchema);

// 2. Course Schema
// server.js mein CourseSchema dhoondo aur ye line add karo:

const CourseSchema = new mongoose.Schema({
    code: String,
    title: String,
    credits: String,
    description: String,
    semester: String,
    videoLink: String  // <--- NEW: Ye line add karo
});
const Course = mongoose.model('Course', CourseSchema);

// --- API Routes ---

// GET: Fetch All Courses
app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- NEW: AGGREGATION ROUTE ---
app.get('/analytics/high-credits', async (req, res) => {
    try {
        const result = await Course.aggregate([
            {
                // Stage 1: Match (Filter)
                // Logic: Jo bhi credit '2' se lekar '9' tak kisi number se shuru ho raha hai.
                $match: {
                    credits: { $regex: /^[2-9]/ } 
                }
            },
            {
                // Stage 2: Project (Select specific fields)
                $project: {
                    _id: 0,
                    title: 1,
                    credits: 1,
                    code: 1
                }
            },
            {
                // Stage 3: Sort (High to Low)
                $sort: { credits: -1 }
            }
        ]);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// REGISTER Route
app.post('/register', async (req, res) => {
    try {
        const { fullName, regNumber, password, role, semester } = req.body;
        
        // Check duplicate user
        const existingUser = await User.findOne({ regNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User with this Reg Number already exists!" });
        }

        const newUser = new User({ fullName, regNumber, password, role, semester });
        await newUser.save();
        
        res.status(201).json({ message: "Account created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN Route
app.post('/login', async (req, res) => {
    try {
        const { regNumber, password } = req.body;
        const user = await User.findOne({ regNumber, password });
        
        if (user) {
            res.json(user);
        } else {
            res.status(401).json({ message: "Invalid Registration Number or Password" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ENROLL Route
app.post('/enroll', async (req, res) => {
    try {
        const { regNumber, course } = req.body;
        const user = await User.findOne({ regNumber });

        // Check if already enrolled
        const isEnrolled = user.enrolledCourses.some(c => c.code === course.code);
        if (isEnrolled) {
            return res.status(400).json({ message: "You are already enrolled in this course" });
        }

        user.enrolledCourses.push(course);
        await user.save();
        
        res.json({ message: "Enrolled successfully", enrolledCourses: user.enrolledCourses });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DROP Route
app.post('/drop', async (req, res) => {
    try {
        const { regNumber, courseCode } = req.body;
        
        await User.updateOne(
            { regNumber },
            { $pull: { enrolledCourses: { code: courseCode } } }
        );

        const updatedUser = await User.findOne({ regNumber });
        res.json({ message: "Dropped successfully", enrolledCourses: updatedUser.enrolledCourses });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});