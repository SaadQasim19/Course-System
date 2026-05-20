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
    email: { type: String, sparse: true },
    password: String,
    role: String,
    semester: String,
    enrolledCourses: [],
    likedCourses: [{ type: String }]
});
const User = mongoose.model('User', UserSchema);

const InstructorSchema = new mongoose.Schema({
    name: String,
    qualification: String,
    university: String
}, { _id: false });

// 2. Course Schema
const CourseSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    title: String,
    credits: String,
    description: String,
    semester: String,
    videoLink: String,
    category: String,
    level: String,
    prerequisites: String,
    instructor: InstructorSchema,
    contents: [String],
    overview: String,
    relatedLinks: [{ title: String, url: String }],
    referenceBooks: [String],
    lectureVideos: [{ title: String, url: String }],
    assignments: [String],
    gradingScheme: String,
    visitCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 }
});
const Course = mongoose.model('Course', CourseSchema);

// --- API Routes ---

// GET: Fetch All Courses (optional ?search= & ?sort=popular|visited)
app.get('/courses', async (req, res) => {
    try {
        const { search, sort } = req.query;
        let query = {};

        if (search && search.trim()) {
            const term = search.trim();
            const regex = new RegExp(term, 'i');
            query = {
                $or: [
                    { code: regex },
                    { title: regex },
                    { category: regex },
                    { semester: regex },
                    { description: regex }
                ]
            };
        }

        let courses = await Course.find(query);

        if (sort === 'popular') {
            courses = courses.sort((a, b) => (b.likedCount || 0) - (a.likedCount || 0));
        } else if (sort === 'visited') {
            courses = courses.sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0));
        } else {
            courses = courses.sort((a, b) => a.code.localeCompare(b.code));
        }

        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Single course by code
app.get('/courses/:code', async (req, res) => {
    try {
        const course = await Course.findOne({ code: req.params.code.toUpperCase() });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.visitCount = (course.visitCount || 0) + 1;
        await course.save();

        res.json(course);
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
        const { fullName, regNumber, email, password, role, semester } = req.body;
        const userRegNumber = regNumber || (email ? email.split('@')[0].toUpperCase() : null);

        if (!fullName || !password || (!userRegNumber && !email)) {
            return res.status(400).json({ message: 'Please provide name, password, and email or registration number.' });
        }

        const existingUser = await User.findOne({
            $or: [
                userRegNumber ? { regNumber: userRegNumber } : null,
                email ? { email } : null
            ].filter(Boolean)
        });

        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email or registration number already exists.' });
        }

        const newUser = new User({
            fullName,
            regNumber: userRegNumber,
            email: email || undefined,
            password,
            role: role || 'student',
            semester: semester || null
        });
        await newUser.save();

        res.status(201).json({ message: 'Account created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN Route (regNumber or email + password)
app.post('/login', async (req, res) => {
    try {
        const { regNumber, email, password } = req.body;
        const identifier = (email || regNumber || '').trim();

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({
            password,
            $or: [
                { regNumber: identifier },
                { email: identifier }
            ]
        });

        if (user) {
            res.json(user);
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TOGGLE like course
app.post('/courses/:code/like', async (req, res) => {
    try {
        const { regNumber } = req.body;
        const code = req.params.code.toUpperCase();

        const user = await User.findOne({ regNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const course = await Course.findOne({ code });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const liked = user.likedCourses || [];
        const index = liked.indexOf(code);
        let isLiked;

        if (index >= 0) {
            liked.splice(index, 1);
            isLiked = false;
            course.likeCount = Math.max(0, (course.likeCount || 0) - 1);
        } else {
            liked.push(code);
            isLiked = true;
            course.likeCount = (course.likeCount || 0) + 1;
        }

        user.likedCourses = liked;
        await user.save();
        await course.save();

        res.json({ isLiked, likedCourses: user.likedCourses });
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
