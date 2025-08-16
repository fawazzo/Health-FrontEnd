import React from 'react';
import { Link } from 'react-router-dom';

const DoctorDashboard = ({ user }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Doctor Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-blue-800 mb-2">My Appointments</h3>
                    <p className="text-gray-700">View and manage your patient appointments.</p>
                    <Link to="/my-appointments" className="text-blue-600 hover:underline mt-2 inline-block">Go to Appointments</Link>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-green-800 mb-2">Manage Availability</h3>
                    <p className="text-gray-700">Set and update your consultation hours.</p>
                    <Link to="/doctor/availability" className="text-green-600 hover:underline mt-2 inline-block">Update Schedule</Link>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-purple-800 mb-2">Prescriptions</h3>
                    <p className="text-gray-700">Issue new prescriptions and review existing ones.</p>
                    <Link to="/prescriptions" className="text-purple-600 hover:underline mt-2 inline-block">Manage Prescriptions</Link>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-yellow-800 mb-2">Medical Records</h3>
                    <p className="text-gray-700">Upload and view patient medical records.</p>
                    <Link to="/medicalrecords" className="text-yellow-600 hover:underline mt-2 inline-block">Manage Records</Link>
                </div>
                <div className="bg-red-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-red-800 mb-2">My Reviews</h3>
                    <p className="text-gray-700">See what patients are saying about your services.</p>
                    <Link to={`/reviews/doctor/${user._id}`} className="text-red-600 hover:underline mt-2 inline-block">View My Reviews</Link>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-indigo-800 mb-2">Notifications</h3>
                    <p className="text-gray-700">Check your latest alerts and updates.</p>
                    <Link to="/notifications" className="text-indigo-600 hover:underline mt-2 inline-block">View Notifications</Link>
                </div>
            </div>

            {user.profile && (
                <div className="mt-8 border-t pt-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">My Profile</h3>
                    <p><strong>First Name:</strong> {user.profile.firstName}</p>
                    <p><strong>Last Name:</strong> {user.profile.lastName}</p>
                    <p><strong>Medical License:</strong> {user.profile.medicalLicenseNumber}</p>

                    {/* NEW FIX: Display specialties as a proper list */}
                    {user.profile.specialties && user.profile.specialties.length > 0 && (
                        <div className="mb-2">
                            <strong>Specialties:</strong>
                            <ul className="list-disc list-inside ml-4">
                                {user.profile.specialties.map((specialty, index) => ( // Added index for key
                                    <li key={specialty || index}>- {specialty}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {user.profile.hospitalAffiliations && user.profile.hospitalAffiliations.length > 0 && (
                        <div className="mb-2">
                            <strong>Hospital Affiliations:</strong>
                            <ul className="list-disc list-inside ml-4">
                                {user.profile.hospitalAffiliations.map(hospital => (
                                    <li key={hospital._id}>- {hospital.name} ({hospital.city})</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {user.profile.averageRating && <p><strong>Average Rating:</strong> {user.profile.averageRating.toFixed(1)} ({user.profile.numReviews} reviews)</p>}
                    {/* <Link to="/profile/edit" className="text-blue-600 hover:underline mt-3 inline-block">Edit Profile</Link> */}
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;