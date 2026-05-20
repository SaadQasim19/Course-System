import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { SearchProvider } from './context/SearchContext';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { AuthPage } from './pages/AuthPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { StudentPortal } from './components/student/StudentPortal';
import { TeacherPortal } from './components/teacher/TeacherPortal';

function App() {
  const { currentUser, login, logout, updateUser } = useAuth();

  return (
    <BrowserRouter>
      <SearchProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Route>

          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/student"
            element={
              currentUser && currentUser.role === 'student' ? (
                <div className="portal-shell">
                  <StudentPortal
                    user={currentUser}
                    onLogout={logout}
                    onUpdateUser={updateUser}
                  />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/teacher"
            element={
              currentUser && currentUser.role === 'teacher' ? (
                <div className="portal-shell">
                  <TeacherPortal
                    user={currentUser}
                    onLogout={logout}
                    onUpdateUser={updateUser}
                  />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App;
