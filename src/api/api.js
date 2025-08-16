import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to attach token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle token expiration/unauthorized responses
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loops
            // Optionally, attempt to refresh token if you implement that on backend
            // For now, just log out if 401 (unauthorized) occurs
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login page - this would typically be done by a global state/context
            // or by pushing history directly, but it's cleaner to handle in context.
            console.error("Authentication expired or invalid. Please log in again.");
            // window.location.href = '/login'; // This is a blunt way, better managed by AuthContext
        }
        return Promise.reject(error);
    }
);

export default api;