import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Import role-specific dashboard components
import PatientDashboard from '../components/dashboards/PatientDashboard';
import DoctorDashboard from '../components/dashboards/DoctorDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import HospitalAdminDashboard from '../components/dashboards/HospitalAdminDashboard';
import PharmacyAdminDashboard from '../components/dashboards/PharmacyAdminDashboard';

const Dashboard = () => {
    const { user, logout, loading, fetchMe } = useAuth();

    useEffect(() => {
        // Fetch user data on mount to ensure it's fresh
        // Only fetch if user isn't already loaded and not currently loading, and if we have a token (to avoid unnecessary API calls)
        const token = localStorage.getItem('token');
        if (!user && !loading && token) {
            fetchMe();
        }
    }, [user, loading, fetchMe]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-700 bg-gray-50">
                <p>Loading user data...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">You are not logged in.</h2>
                <Link to="/login" className="text-blue-600 hover:underline">Go to Login</Link>
            </div>
        );
    }

    // Determine which dashboard component to render based on user role
    const renderDashboardContent = () => {
        switch (user.role) {
            case 'patient':
                return <PatientDashboard user={user} />;
            case 'doctor':
                return <DoctorDashboard user={user} />;
            case 'admin':
                return <AdminDashboard user={user} />;
            case 'hospital_admin':
                return <HospitalAdminDashboard user={user} />;
            case 'pharmacy_admin':
                return <PharmacyAdminDashboard user={user} />;
            default:
                return (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-700">Role-specific dashboard not available.</h2>
                        <p className="text-gray-600">Your role is: <span className="capitalize font-medium">{user.role.replace('_', ' ')}</span></p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-start">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl mt-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Dashboard</h1>
                {/* General User Info - always visible */}
                <div className="border-b pb-4 mb-6">
                    <p className="text-lg text-gray-700">Welcome, <span className="font-semibold">{user.profile?.firstName || user.email}</span>!</p>
                    <p className="text-gray-600">Your role: <span className="capitalize font-medium">{user.role.replace('_', ' ')}</span></p>
                </div>

                {/* Render the role-specific content */}
                {renderDashboardContent()}

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;