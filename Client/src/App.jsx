import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { StudentPortal } from './components/student/StudentPortal';
import { TeacherPortal } from './components/teacher/TeacherPortal';

function App() {
  const { currentUser, login, logout, updateUser } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            currentUser ? (
              currentUser.role === 'student' ? (
                <Navigate to="/student" replace />
              ) : (
                <Navigate to="/teacher" replace />
              )
            ) : (
              <LoginPage onLogin={login} />
            )
          } 
        />
        
        <Route 
          path="/register" 
          element={<RegisterPage />} 
        />
        
        <Route 
          path="/student" 
          element={
            currentUser && currentUser.role === 'student' ? (
              <StudentPortal 
                user={currentUser} 
                onLogout={logout} 
                onUpdateUser={updateUser}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/teacher" 
          element={
            currentUser && currentUser.role === 'teacher' ? (
              <TeacherPortal 
                user={currentUser} 
                onLogout={logout} 
                onUpdateUser={updateUser}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
