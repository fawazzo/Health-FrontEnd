import React from 'react';
import { Link } from 'react-router-dom';

const PharmacyAdminDashboard = ({ user }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pharmacy Admin Panel</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-blue-800 mb-2">My Pharmacy Details</h3>
                    <p className="text-gray-700">View and update information for your managed pharmacy.</p>
                    {/* This would link to /pharmacies/:id and allow editing */}
                    {user.profile?.managedPharmacyId && (
                        <Link to={`/pharmacies/${user.profile.managedPharmacyId}`} className="text-blue-600 hover:underline mt-2 inline-block">View Pharmacy</Link>
                    )}
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-green-800 mb-2">Prescription Orders</h3>
                    <p className="text-gray-700">Manage prescriptions sent to your pharmacy for fulfillment.</p>
                    <Link to="/admin/pharmacy-prescriptions" className="text-green-600 hover:underline mt-2 inline-block">View Orders</Link>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-purple-800 mb-2">Inventory Management</h3>
                    <p className="text-gray-700">Track and manage your pharmaceutical inventory.</p>
                    {/* This would be a new feature */}
                    {/* <Link to="/admin/pharmacy-inventory" className="text-purple-600 hover:underline mt-2 inline-block">Manage Inventory</Link> */}
                </div>
            </div>

            {user.profile && (
                <div className="mt-8 border-t pt-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">My Profile</h3>
                    {user.profile.firstName && <p><strong>First Name:</strong> {user.profile.firstName}</p>}
                    {user.profile.lastName && <p><strong>Last Name:</strong> {user.profile.lastName}</p>}
                    {user.profile.managedPharmacyId && <p><strong>Managed Pharmacy ID:</strong> {user.profile.managedPharmacyId}</p>}
                </div>
            )}
        </div>
    );
};

export default PharmacyAdminDashboard;