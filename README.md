# Course Management System

A full-stack web application for managing courses, students, and teachers. The system provides distinct portals for students and teachers with features like course enrollment, course creation, student profiles, and PDF export capabilities.

## 🎯 Features

- **User Authentication**: Secure login and registration system
- **Role-Based Access**: Separate portals for students and teachers
- **Course Management**: Create, view, and manage courses
- **Student Portal**: View enrolled courses, manage profile, export course materials as PDF
- **Teacher Portal**: Create courses, manage students, view course details
- **Responsive Design**: Works across different devices and screen sizes

## 🛠️ Technology Stack

### Frontend
- **React 19.2** - UI library
- **Vite 7.2** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **jsPDF** - PDF generation and export
- **CSS** - Styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.2** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 9.1** - MongoDB object modeling
- **CORS** - Cross-Origin Resource Sharing
- **Dotenv** - Environment variable management

## 📁 Project Structure

```
├── Backend/                    # Backend server
│   ├── server.js              # Express server setup
│   ├── package.json           # Backend dependencies
│   ├── seed.js                # Database seeding
│   └── data.txt               # Initial data
├── Client/                    # React frontend
│   ├── src/
│   │   ├── App.jsx            # Main application component
│   │   ├── main.jsx           # Entry point
│   │   ├── components/        # React components
│   │   │   ├── auth/          # Login & Registration
│   │   │   ├── student/       # Student portal components
│   │   │   ├── teacher/       # Teacher portal components
│   │   │   └── shared/        # Shared components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── api/               # API calls
│   │   └── utils/             # Utility functions
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
├── CourseMan/                 # Legacy course management interface
└── package.json               # Root package.json
```

## ⚙️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/course-management
NODE_ENV=development
```

4. (Optional) Seed the database:
```bash
node seed.js
```

### Frontend Setup

1. Navigate to the Client directory:
```bash
cd Client
```

2. Install dependencies:
```bash
npm install
```

## 🚀 Running the Application

### Start Backend Server

From the Backend directory:
```bash
node server.js
```

Or with auto-reload (development mode):
```bash
npm run dev
```

The backend will run on `http://localhost:5000` (or the PORT specified in `.env`)

### Start Frontend Development Server

From the Client directory:
```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173` (check the terminal output for the exact URL)

### Building for Production

Frontend build:
```bash
cd Client
npm run build
```

## 🔐 Authentication

The application uses:
- **Student Role**: Access to view enrolled courses, personal profile, and export materials
- **Teacher Role**: Access to create courses, manage students, and view detailed analytics

## 📝 API Endpoints

The backend provides REST API endpoints for:
- User authentication (login/register)
- Course CRUD operations
- Student enrollment management
- User profile management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📧 Support

For issues or questions, please open an issue on the GitHub repository.

---

**Last Updated**: April 2026
