const API_URL = 'http://localhost:5000';

const buildCoursesUrl = (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.sort) searchParams.set('sort', params.sort);
    const query = searchParams.toString();
    return `${API_URL}/courses${query ? `?${query}` : ''}`;
};

export const courseApi = {
    // Fetch all courses (optional search / sort)
    fetchCourses: async (params = {}) => {
        const response = await fetch(buildCoursesUrl(params));
        if (!response.ok) throw new Error('Failed to fetch courses');
        return response.json();
    },

    fetchCourseByCode: async (code) => {
        const response = await fetch(`${API_URL}/courses/${encodeURIComponent(code)}`);
        if (!response.ok) throw new Error('Course not found');
        return response.json();
    },

    toggleLike: async (code, regNumber) => {
        const response = await fetch(`${API_URL}/courses/${encodeURIComponent(code)}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ regNumber })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update like');
        return data;
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

    // Login user (email or regNumber + password)
    login: async (credentials) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Invalid credentials');
        return data;
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
