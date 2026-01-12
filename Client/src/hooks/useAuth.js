import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            setCurrentUser(JSON.parse(stored));
        }
    }, []);

    const login = (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
    };

    const updateUser = (updatedUser) => {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
    };

    return { currentUser, login, logout, updateUser };
};
