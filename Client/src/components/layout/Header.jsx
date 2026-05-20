import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
    { to: '/', label: 'HOME', end: true },
    { to: '/courses', label: 'COURSES' },
    { to: '/about', label: 'ABOUT VU' },
    { to: '/contact', label: 'CONTACT US' },
    { to: '/terms', label: 'TERMS OF USE' }
];

export const Header = () => {
    const { currentUser, logout } = useAuth();

    return (
        <header className="ocw-topnav">
            <div className="ocw-topnav-inner">
                <ul className="ocw-nav-links">
                    {navItems.map(({ to, label, end }) => (
                        <li key={to}>
                            <NavLink to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {currentUser ? (
                    <div className="ocw-user-menu">
                        <span>{currentUser.fullName || currentUser.email || currentUser.regNumber}</span>
                        {(currentUser.role === 'student' || currentUser.role === 'teacher') && (
                            <Link to={currentUser.role === 'student' ? '/student' : '/teacher'} className="ocw-auth-link">
                                Portal
                            </Link>
                        )}
                        <button type="button" onClick={logout}>Logout</button>
                    </div>
                ) : (
                    <Link to="/login" className="ocw-auth-link">LOG IN / REGISTER</Link>
                )}
            </div>
        </header>
    );
};
