import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => {
    console.log("❌ MongoDB Connection Error:", err.message);
  });

// --- Database Schemas ---

// 1. User Schema
const UserSchema = new mongoose.Schema({
    fullName: String,
    regNumber: { type: String, unique: true },
    password: String,
    role: String,
    semester: String,
    enrolledCourses: []
});
const User = mongoose.model('User', UserSchema);

// 2. Course Schema
const CourseSchema = new mongoose.Schema({
    code: String,
    title: String,
    credits: String,
    description: String,
    semester: String,
    videoLink: String
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

// GET: Analytics - High Credits
app.get('/analytics/high-credits', async (req, res) => {
    try {
        const result = await Course.aggregate([
            {
                $match: {
                    credits: { $regex: /^[2-9]/ } 
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    credits: 1,
                    code: 1
                }
            },
            {
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
        console.log('📝 Registration attempt:', { fullName, regNumber, role, semester });
        
        // Check duplicate user
        const existingUser = await User.findOne({ regNumber });
        if (existingUser) {
            console.log('❌ Duplicate user found');
            return res.status(400).json({ message: "User with this Reg Number already exists!" });
        }

        const newUser = new User({ fullName, regNumber, password, role, semester });
        await newUser.save();
        console.log('✅ User created successfully:', regNumber);
        
        res.status(201).json({ message: "Account created successfully" });
    } catch (err) {
        console.log('❌ Registration error:', err);
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

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

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
