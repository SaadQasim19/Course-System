# Backend - Course Management System

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB
Make sure MongoDB is running on your system:
```bash
mongod
```

### 3. Seed the Database (First Time Only)
```bash
node seed.js
```

### 4. Start the Server

**Development Mode (with auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

## API Endpoints

- `GET /courses` - Fetch all courses
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /enroll` - Enroll in course
- `POST /drop` - Drop course
- `GET /analytics/high-credits` - Get high-credit courses

## Server Details

- **Port:** 5000
- **Database:** MongoDB (courseSystem)
- **CORS:** Enabled for all origins
