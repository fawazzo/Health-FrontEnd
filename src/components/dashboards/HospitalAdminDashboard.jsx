import React from 'react';
import { Link } from 'react-router-dom';

const HospitalAdminDashboard = ({ user }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hospital Admin Panel</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-blue-800 mb-2">My Hospital Details</h3>
                    <p className="text-gray-700">View and update information for your managed hospital.</p>
                    <Link to={`/hospitals/${user.profile?.managedHospitalId}`} className="text-blue-600 hover:underline mt-2 inline-block">View Hospital</Link>
                    {/* Add an edit link if you create a specific edit page for hospital admin */}
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-green-800 mb-2">Manage Doctors</h3>
                    <p className="text-gray-700">Oversee doctors affiliated with your hospital.</p>
                    <Link to="/admin/hospital-doctors" className="text-green-600 hover:underline mt-2 inline-block">Manage Doctors</Link>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-purple-800 mb-2">Hospital Appointments</h3>
                    <p className="text-gray-700">View all appointments scheduled at your hospital.</p>
                    <Link to="/admin/hospital-appointments" className="text-purple-600 hover:underline mt-2 inline-block">View Appointments</Link>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-yellow-800 mb-2">Reports & Analytics</h3>
                    <p className="text-gray-700">Access performance reports for your hospital.</p>
                    {/* <Link to="/admin/hospital-reports" className="text-yellow-600 hover:underline mt-2 inline-block">View Reports</Link> */}
                </div>
            </div>

            {user.profile && (
                <div className="mt-8 border-t pt-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">My Profile</h3>
                    {user.profile.firstName && <p><strong>First Name:</strong> {user.profile.firstName}</p>}
                    {user.profile.lastName && <p><strong>Last Name:</strong> {user.profile.lastName}</p>}
                    {user.profile.managedHospitalId && <p><strong>Managed Hospital ID:</strong> {user.profile.managedHospitalId}</p>}
                    {/* In a real app, you'd populate the hospital name here */}
                </div>
            )}
        </div>
    );
};

export default HospitalAdminDashboard;