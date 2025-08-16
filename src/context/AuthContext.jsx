import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (storedUser && token) {
                try {
                    // Basic check for token validity, more robust check done by backend
                    // when making requests with the interceptor.
                    // For production, you might want to decode JWT and check expiration here.
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse user from localStorage", e);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token, ...userData } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            navigate('/dashboard'); // Redirect to dashboard or home after login
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const res = await api.post('/auth/register', userData);
            const { token, ...newUser } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);
            navigate('/dashboard'); // Redirect after registration
            return { success: true };
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            const errors = error.response?.data?.errors;
            const errorMessage = errors ? errors.map(err => Object.values(err)).join(', ') : error.response?.data?.message || 'Registration failed';
            return { success: false, message: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login'); // Redirect to login page after logout
    };

    // Fetch current user details from /api/auth/me to ensure state is fresh
    const fetchMe = async () => {
     try {
         setLoading(true);
         const res = await api.get('/auth/me');
         setUser(res.data);
         localStorage.setItem('user', JSON.stringify(res.data)); // Update localStorage
         setLoading(false);
         return { success: true };
     } catch (error) {
         console.error('Failed to fetch user data:', error);
         logout(); // Log out if fetching fails (e.g., token invalid)
         setLoading(false);
         return { success: false, message: 'Failed to load user profile' };
     }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout, fetchMe }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);   
