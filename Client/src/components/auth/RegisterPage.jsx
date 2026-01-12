import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { courseApi } from '../../api/courseApi';

export const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        regNumber: '',
        password: '',
        confirmPassword: '',
        role: '',
        semester: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.fullName || !formData.regNumber || !formData.password) {
            alert('Fill all details');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const userData = {
            fullName: formData.fullName,
            regNumber: formData.regNumber,
            password: formData.password,
            role: formData.role,
            semester: formData.role === 'student' ? formData.semester : null
        };

        try {
            await courseApi.register(userData);
            alert('Account Created');
            navigate('/');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="page active">
            <div className="container">
                <h1>Course Management System</h1>
                
                <div className="form-container">
                    <h2>Create Account</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="Enter your full name"
                            />
                        </div>
                        
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
                                placeholder="Create a password"
                            />
                        </div>
                        
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="Confirm your password"
                            />
                        </div>
                        
                        <div className="input-group">
                            <label>I am a</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="" disabled>Select role</option>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>

                        {formData.role === 'student' && (
                            <div className="input-group">
                                <label>Select Semester</label>
                                <select
                                    value={formData.semester}
                                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                >
                                    <option value="" disabled>Select semester</option>
                                    <option value="BCS-I">Semester 1</option>
                                    <option value="BCS-II">Semester 2</option>
                                    <option value="BCS-III">Semester 3</option>
                                    <option value="BCS-IV">Semester 4</option>
                                    <option value="BCS-V">Semester 5</option>
                                    <option value="BCS-VI">Semester 6</option>
                                    <option value="BCS-VII">Semester 7</option>
                                    <option value="BCS-VIII">Semester 8</option>
                                </select>
                            </div>
                        )}
                        
                        <button type="submit" className="login-btn">Create Account</button>
                        
                        <p className="switch-page">
                            Already have an account? <Link to="/">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
