const API_URL = 'http://localhost:5000';

export const courseApi = {
    // Fetch all courses
    fetchCourses: async () => {
        const response = await fetch(`${API_URL}/courses`);
        if (!response.ok) throw new Error('Failed to fetch courses');
        return response.json();
    },

    // Register new user
    register: async (userData) => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        return data;
    },

    // Login user
    login: async (credentials) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (!response.ok) throw new Error('Invalid credentials');
        return response.json();
    },

    // Enroll in course
    enroll: async (regNumber, course) => {
        const response = await fetch(`${API_URL}/enroll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ regNumber, course })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Enrollment failed');
        return data;
    },

    // Drop course
    drop: async (regNumber, courseCode) => {
        const response = await fetch(`${API_URL}/drop`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ regNumber, courseCode })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Drop failed');
        return data;
    }
};
