import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import { useAuth } from '../hooks/useAuth';

export const AuthPage = () => {
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
    const [tab, setTab] = useState(initialTab);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [registerForm, setRegisterForm] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [portalForm, setPortalForm] = useState({
        regNumber: '',
        password: '',
        role: 'student',
        semester: 'BCS-I'
    });
    const [showPortal, setShowPortal] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await courseApi.login({
                email: loginForm.email.trim(),
                password: loginForm.password
            });
            login(user);
            if (user.role === 'student') navigate('/student');
            else if (user.role === 'teacher') navigate('/teacher');
            else navigate('/courses');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (registerForm.password !== registerForm.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await courseApi.register({
                fullName: registerForm.fullName,
                email: registerForm.email.trim(),
                password: registerForm.password
            });
            alert('Account created successfully. Please log in.');
            setTab('login');
        } catch (err) {
            setError(err.message);
        }
    };

    const handlePortalLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await courseApi.login({
                regNumber: portalForm.regNumber.trim(),
                password: portalForm.password
            });
            login(user);
            navigate(user.role === 'student' ? '/student' : '/teacher');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="ocw-app">
            <div className="ocw-auth-wrap">
                <div className="ocw-auth-tabs">
                    <button
                        type="button"
                        className={tab === 'login' ? 'active' : ''}
                        onClick={() => { setTab('login'); setError(''); }}
                    >
                        Log In
                    </button>
                    <button
                        type="button"
                        className={tab === 'register' ? 'active' : ''}
                        onClick={() => { setTab('register'); setError(''); }}
                    >
                        Register
                    </button>
                </div>

                {error && <p style={{ color: '#c53030', marginBottom: 12, fontSize: 14 }}>{error}</p>}

                {tab === 'login' ? (
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="login-email">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                required
                                value={loginForm.email}
                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="login-password">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                required
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="ocw-btn-primary">Submit</button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <label htmlFor="reg-name">Name</label>
                            <input
                                id="reg-name"
                                type="text"
                                required
                                value={registerForm.fullName}
                                onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="reg-email">Email</label>
                            <input
                                id="reg-email"
                                type="email"
                                required
                                value={registerForm.email}
                                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="reg-password">Password</label>
                            <input
                                id="reg-password"
                                type="password"
                                required
                                value={registerForm.password}
                                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="reg-confirm">Confirm Password</label>
                            <input
                                id="reg-confirm"
                                type="password"
                                required
                                value={registerForm.confirmPassword}
                                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="ocw-btn-primary">Submit</button>
                    </form>
                )}

                <div className="ocw-portal-note">
                    <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: '#1a5fb4', cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => setShowPortal(!showPortal)}
                    >
                        {showPortal ? 'Hide' : 'Show'} BSCS Portal Login (Registration Number)
                    </button>
                    {showPortal && (
                        <form onSubmit={handlePortalLogin} style={{ marginTop: 16, textAlign: 'left' }}>
                            <div className="input-group">
                                <label>Registration Number</label>
                                <input
                                    type="text"
                                    value={portalForm.regNumber}
                                    onChange={(e) => setPortalForm({ ...portalForm, regNumber: e.target.value })}
                                    placeholder="e.g., BSCS-2023-001"
                                />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={portalForm.password}
                                    onChange={(e) => setPortalForm({ ...portalForm, password: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="ocw-btn-primary">Portal Login</button>
                        </form>
                    )}
                    <p style={{ marginTop: 12 }}>
                        Need a portal account with role? <Link to="/register">BSCS Register</Link> · <Link to="/">Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
