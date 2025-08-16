import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = ({ user }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admin Panel</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Manage Users</h3>
                    <p className="text-gray-700">View, create, update, and delete user accounts.</p>
                    <Link to="/admin/users" className="text-blue-600 hover:underline mt-2 inline-block">Go to User Management</Link>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Manage Hospitals</h3>
                    <p className="text-gray-700">Add, edit, or remove hospital entities.</p>
                    <Link to="/admin/hospitals" className="text-blue-600 hover:underline mt-2 inline-block">Go to Hospital Management</Link>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Manage Specialties</h3>
                    <p className="text-gray-700">Define and update medical specialties.</p>
                    <Link to="/admin/specialties" className="text-blue-600 hover:underline mt-2 inline-block">Go to Specialty Management</Link>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Manage Pharmacies</h3>
                    <p className="text-gray-700">Add, edit, or remove pharmacy listings.</p>
                    <Link to="/admin/pharmacies" className="text-blue-600 hover:underline mt-2 inline-block">Go to Pharmacy Management</Link>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">System Statistics</h3>
                    <p className="text-gray-700">View overall system metrics and health.</p>
                    {/* <Link to="/admin/stats" className="text-blue-600 hover:underline mt-2 inline-block">View Statistics</Link> */}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Content Moderation</h3>
                    <p className="text-gray-700">Oversee and manage user-generated content (reviews, records).</p>
                    {/* <Link to="/admin/moderation" className="text-blue-600 hover:underline mt-2 inline-block">Go to Moderation</Link> */}
                </div>
            </div>

            {/* Admin profile (minimal) */}
            {user.profile && Object.keys(user.profile).length > 0 && (
                <div className="mt-8 border-t pt-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">My Profile</h3>
                    {user.profile.firstName && <p><strong>First Name:</strong> {user.profile.firstName}</p>}
                    {user.profile.lastName && <p><strong>Last Name:</strong> {user.profile.lastName}</p>}
                    {/* Add more admin-specific profile fields if any */}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;