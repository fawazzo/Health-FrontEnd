import React, { useState, useEffect } from 'react';
import { appointmentService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns'; // You'll need to install this library

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth(); // To display user role

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await appointmentService.getAllAppointments();
                // Sort by date and time
                const sortedAppointments = res.data.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    if (dateA - dateB !== 0) return dateA - dateB;

                    // If dates are same, sort by start time
                    const timeA = a.startTime.split(':').map(Number);
                    const timeB = b.startTime.split(':').map(Number);
                    if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
                    return timeA[1] - timeB[1];
                });
                setAppointments(sortedAppointments);
            } catch (err) {
                console.error('Failed to fetch appointments:', err);
                setError('Failed to load appointments. Please ensure you are authorized.');
            } finally {
                setLoading(false);
            }
        };
        if (user) { // Only fetch if user is logged in
            fetchAppointments();
        }
    }, [user]);

    // Function to update appointment status (for doctor/patient/admin)
    const handleUpdateStatus = async (appointmentId, newStatus) => {
        if (!window.confirm(`Are you sure you want to change status to '${newStatus}'?`)) return;
        try {
            await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
            // Optimistically update UI or refetch
            setAppointments(prev => prev.map(app =>
                app._id === appointmentId ? { ...app, status: newStatus } : app
            ));
            alert('Appointment status updated!');
        } catch (err) {
            console.error('Failed to update status:', err.response?.data?.message || err.message);
            alert(`Failed to update status: ${err.response?.data?.message || 'Server error.'}`);
        }
    };

    // Function to add notes (Doctor only)
    const handleAddNotes = async (appointmentId) => {
        const notes = prompt('Enter notes for this appointment:');
        if (!notes) return;
        try {
            await appointmentService.addAppointmentNotes(appointmentId, notes);
            setAppointments(prev => prev.map(app =>
                app._id === appointmentId ? { ...app, notes: notes } : app
            ));
            alert('Notes added successfully!');
        } catch (err) {
            console.error('Failed to add notes:', err.response?.data?.message || err.message);
            alert(`Failed to add notes: ${err.response?.data?.message || 'Server error.'}`);
        }
    };


    if (!user) {
        return <div className="text-center py-8 text-gray-600">Please log in to view your appointments.</div>;
    }
    if (loading) return <div className="text-center py-8">Loading appointments...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>

            {appointments.length === 0 ? (
                <p className="text-gray-600 text-center text-lg">You have no appointments scheduled.</p>
            ) : (
                <div className="space-y-6">
                    {appointments.map((appointment) => (
                        <div key={appointment._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">{format(new Date(appointment.date), 'EEEE, MMMM dd, yyyy')}</p>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {appointment.startTime} - {appointment.endTime} ({appointment.type})
                                    </h2>
                                    <p className="text-gray-700">
                                        <span className="font-medium">{user.role === 'patient' ? 'Doctor:' : 'Patient:'}</span>{' '}
                                        {user.role === 'patient' ?
                                            `Dr. ${appointment.doctorId?.profile?.firstName} ${appointment.doctorId?.profile?.lastName} (${appointment.doctorId?.profile?.specialties?.join(', ')})` :
                                            `${appointment.patientId?.profile?.firstName} ${appointment.patientId?.profile?.lastName}`
                                        }
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-medium">Hospital:</span> {appointment.hospitalId?.name}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-medium">Reason:</span> {appointment.reasonForVisit}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-medium">Status:</span>{' '}
                                        <span className={`font-semibold ${
                                            appointment.status === 'completed' ? 'text-green-600' :
                                            appointment.status === 'cancelled' ? 'text-red-600' :
                                            'text-blue-600'
                                        }`}>
                                            {appointment.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </p>
                                    {appointment.notes && (
                                        <p className="text-gray-700 italic mt-2">
                                            <strong>Notes:</strong> {appointment.notes}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col space-y-2">
                                    {(user.role === 'patient' && appointment.status === 'booked') && (
                                        <button
                                            onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
                                            className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    {(user.role === 'doctor' && ['booked', 'confirmed'].includes(appointment.status)) && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(appointment._id, 'confirmed')}
                                                className="bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-3 rounded"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                                                className="bg-purple-500 hover:bg-purple-600 text-white text-sm py-1 px-3 rounded"
                                            >
                                                Complete
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(appointment._id, 'no-show')}
                                                className="bg-orange-500 hover:bg-orange-600 text-white text-sm py-1 px-3 rounded"
                                            >
                                                No-Show
                                            </button>
                                            <button
                                                onClick={() => handleAddNotes(appointment._id)}
                                                className="bg-gray-500 hover:bg-gray-600 text-white text-sm py-1 px-3 rounded"
                                            >
                                                Add Notes
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
                                                className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    {user.role === 'admin' && (
                                         <button
                                             onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
                                             className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded"
                                         >
                                             Cancel (Admin)
                                         </button>
                                    )}
                                    {/* Add more actions based on role and status */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAppointments;