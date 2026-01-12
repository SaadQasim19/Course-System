import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { courseApi } from '../../api/courseApi';

export const LoginPage = ({ onLogin }) => {
    const [formData, setFormData] = useState({ regNumber: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.regNumber || !formData.password) {
            alert('Fill all fields');
            return;
        }

        try {
            const user = await courseApi.login(formData);
            onLogin(user);
            
            if (user.role === 'student') {
                navigate('/student');
            } else {
                navigate('/teacher');
            }
        } catch (err) {
            setError(true);
        }
    };

    return (
        <div className="page active">
            <div className="container">
                <h1>Course Management System</h1>
                <p className="department">Department of Computer Science</p>
                <p className="welcome">Welcome to BSCS Course Portal</p>
                
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Registration Number</label>
                            <input
                                type="text"
                                value={formData.regNumber}
                                onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                                placeholder="e.g., BSCS-2023-001"
                            />
                        </div>
                        
                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter your password"
                            />
                        </div>
                        
                        <button type="submit" className="login-btn">Login</button>
                        
                        {error && (
                            <div className="error-message">
                                <p><strong>Login Failed!</strong></p>
                                <p>No account found with these credentials.</p>
                                <p className="create-account-link">
                                    <Link to="/register" style={{color: '#3182ce', textDecoration: 'underline'}}>
                                        Click here to create a new account ...
                                    </Link>
                                </p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};
