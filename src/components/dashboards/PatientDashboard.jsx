import React from 'react';
import { Link } from 'react-router-dom';

const PatientDashboard = ({ user }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Patient Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-blue-800 mb-2">My Appointments</h3>
                    <p className="text-gray-700">View and manage your scheduled medical appointments.</p>
                    <Link to="/my-appointments" className="text-blue-600 hover:underline mt-2 inline-block">Go to Appointments</Link>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-green-800 mb-2">Medical Records</h3>
                    <p className="text-gray-700">Access your health history and uploaded documents.</p>
                    <Link to="/medicalrecords" className="text-green-600 hover:underline mt-2 inline-block">View Records</Link>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-purple-800 mb-2">Prescriptions</h3>
                    <p className="text-gray-700">Review your active and past prescriptions.</p>
                    <Link to="/prescriptions" className="text-purple-600 hover:underline mt-2 inline-block">View Prescriptions</Link>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-yellow-800 mb-2">My Reviews</h3>
                    <p className="text-gray-700">See and manage reviews you've written for doctors.</p>
                    <Link to="/my-reviews" className="text-yellow-600 hover:underline mt-2 inline-block">Manage Reviews</Link>
                </div>
                 <div className="bg-red-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-red-800 mb-2">Notifications</h3>
                    <p className="text-gray-700">Check your latest alerts and updates.</p>
                    <Link to="/notifications" className="text-red-600 hover:underline mt-2 inline-block">View Notifications</Link>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-indigo-800 mb-2">Find Doctors & Hospitals</h3>
                    <p className="text-gray-700">Discover healthcare providers and facilities near you.</p>
                    <div className="mt-2 space-x-2">
                         <Link to="/doctors" className="text-indigo-600 hover:underline inline-block">Find Doctors</Link>
                         <Link to="/hospitals" className="text-indigo-600 hover:underline inline-block">Find Hospitals</Link>
                    </div>
                </div>
            </div>

            {/* Optionally display patient profile details here if desired */}
            {user.profile && (
                <div className="mt-8 border-t pt-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">My Profile</h3>
                    <p><strong>First Name:</strong> {user.profile.firstName}</p>
                    <p><strong>Last Name:</strong> {user.profile.lastName}</p>
                    <p><strong>Date of Birth:</strong> {new Date(user.profile.dateOfBirth).toLocaleDateString()}</p>
                    <p><strong>Phone Number:</strong> {user.profile.phoneNumber}</p>
                    {user.profile.gender && <p><strong>Gender:</strong> {user.profile.gender}</p>}
                    {/* Add an edit profile link here */}
                    {/* <Link to="/profile/edit" className="text-blue-600 hover:underline mt-3 inline-block">Edit Profile</Link> */}
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;