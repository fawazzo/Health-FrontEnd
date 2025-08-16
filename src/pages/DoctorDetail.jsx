import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService, appointmentService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom'; // Keep this line here, it's correct.

const DoctorDetail = () => {
    const { id: doctorId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth(); // Removed 'user' to resolve ESLint warning

    const [doctor, setDoctor] = useState(null);
    const [loadingDoctor, setLoadingDoctor] = useState(true);
    const [errorDoctor, setErrorDoctor] = useState(null);

    // Appointment booking state
    const [selectedHospitalId, setSelectedHospitalId] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [appointmentType, setAppointmentType] = useState('in-person');
    const [reasonForVisit, setReasonForVisit] = useState('');
    const [consultationFee, setConsultationFee] = useState(0);
    const [bookingMessage, setBookingMessage] = useState('');
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [loadingBooking, setLoadingBooking] = useState(false);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await doctorService.getDoctorById(doctorId);
                setDoctor(res.data);
                if (res.data.profile.hospitalAffiliations && res.data.profile.hospitalAffiliations.length > 0) {
                    if (!selectedHospitalId || !res.data.profile.hospitalAffiliations.some(h => h._id === selectedHospitalId)) {
                        setSelectedHospitalId(res.data.profile.hospitalAffiliations[0]._id);
                    }
                } else {
                    setSelectedHospitalId(''); // Clear if no affiliations
                }
            } catch (err) {
                console.error('Failed to fetch doctor:', err);
                setErrorDoctor('Doctor not found or failed to load details.');
            } finally {
                setLoadingDoctor(false);
            }
        };
        fetchDoctor();
    }, [doctorId, selectedHospitalId]);


    useEffect(() => {
        const fetchAvailability = async () => {
            if (doctorId && selectedHospitalId && selectedDate) {
                setLoadingAvailability(true);
                setAvailableSlots([]);
                setSelectedSlot('');
                setBookingMessage('');
                try {
                    const formattedDate = selectedDate.toISOString().split('T')[0];
                    const res = await doctorService.getDoctorAvailability(doctorId, selectedHospitalId, formattedDate);
                    const available = res.data?.timeSlots.filter(slot => !slot.isBooked) || [];
                    setAvailableSlots(available);
                    if (available.length === 0) {
                        setBookingMessage('No available slots for this date at this hospital.');
                    }
                } catch (err) {
                    console.error('Failed to fetch availability:', err);
                    if (err.response && err.response.status === 404) {
                        setBookingMessage('No availability found for selected criteria.');
                    } else {
                        setBookingMessage('Failed to load availability. Please try again.');
                    }
                } finally {
                    setLoadingAvailability(false);
                }
            } else {
                setAvailableSlots([]);
                setSelectedSlot('');
            }
        };
        fetchAvailability();
    }, [doctorId, selectedHospitalId, selectedDate]);


    const handleBookAppointment = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!selectedSlot) {
            setBookingMessage('Please select a time slot.');
            return;
        }

        setLoadingBooking(true);
        setBookingMessage('');

        const [startTime, endTime] = selectedSlot.split('-');
        const appointmentData = {
            doctorId,
            hospitalId: selectedHospitalId,
            date: selectedDate.toISOString().split('T')[0],
            startTime,
            endTime,
            type: appointmentType,
            reasonForVisit,
            consultationFee: parseFloat(consultationFee) || 0,
        };

        try {
            const res = await appointmentService.bookAppointment(appointmentData);
            setBookingMessage('Appointment booked successfully!');
            setSelectedSlot('');
            setReasonForVisit('');
            setConsultationFee(0);

            const formattedDate = selectedDate.toISOString().split('T')[0];
            const updatedAvailabilityRes = await doctorService.getDoctorAvailability(doctorId, selectedHospitalId, formattedDate);
            setAvailableSlots(updatedAvailabilityRes.data?.timeSlots.filter(slot => !slot.isBooked) || []);

            console.log('Booked appointment:', res.data);
            navigate('/my-appointments');

        } catch (err) {
            console.error('Booking failed:', err.response?.data?.message || err.message);
            setBookingMessage(`Booking failed: ${err.response?.data?.message || 'Server error.'}`);
        } finally {
            setLoadingBooking(false);
        }
    };


    if (loadingDoctor) return <div className="text-center py-8">Loading doctor details...</div>;
    if (errorDoctor) return <div className="text-center py-8 text-red-600">{errorDoctor}</div>;
    if (!doctor) return <div className="text-center py-8 text-gray-600">Doctor not found.</div>;

    return (
        <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-8">
            {/* Doctor Profile Section */}
            <div className="lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mt-6">
                <h1 className="text-3xl font-extrabold text-blue-800 mb-4">Dr. {doctor.profile.firstName} {doctor.profile.lastName}</h1>
                <p className="text-lg text-gray-700 mb-2">Specialties: <span className="font-semibold">{doctor.profile.specialties?.join(', ') || 'N/A'}</span></p>
                {doctor.profile.medicalLicenseNumber && (
                    <p className="text-md text-gray-600 mb-2">License: {doctor.profile.medicalLicenseNumber}</p>
                )}
                {/* Hospital Affiliations List */}
                {doctor.profile.hospitalAffiliations?.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Affiliated Hospitals:</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {doctor.profile.hospitalAffiliations.map((hospital) => (
                                <li key={hospital._id}>
                                    {hospital.name} ({hospital.city}, {hospital.address})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {doctor.profile.averageRating && (
                    <p className="text-md text-gray-700 mb-2">
                        Average Rating: <span className="font-semibold">{doctor.profile.averageRating.toFixed(1)}</span> ({doctor.profile.numReviews} reviews)
                    </p>
                )}
                <p className="text-gray-800 leading-relaxed">{doctor.profile.bio || 'No biography available.'}</p>

                <Link
                 to={`/reviews/doctor/${doctorId}`}
                 className="inline-block mt-4 text-blue-600 hover:underline"
                >
                 View All Reviews for Dr. {doctor.profile.lastName}
                </Link>
            </div>

            {/* Appointment Booking Section */}
            <div className="lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Book an Appointment</h2>

                {!isAuthenticated && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Login Required</p>
                        <p>Please <Link to="/login" className="underline">log in</Link> to book an appointment.</p>
                    </div>
                )}

                <form onSubmit={handleBookAppointment} className="space-y-4">
                    <div>
                        <label htmlFor="hospital" className="block text-sm font-medium text-gray-700">Select Hospital</label>
                        <select
                            id="hospital"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={selectedHospitalId}
                            onChange={(e) => setSelectedHospitalId(e.target.value)}
                            required
                            disabled={!isAuthenticated}
                        >
                            <option value="">Select a Hospital</option>
                            {/* Ensured optional chaining for safety before map */}
                            {doctor.profile.hospitalAffiliations?.map((h) => (
                                <option key={h._id} value={h._id}>{h.name} ({h.city})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Select Date</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="yyyy/MM/dd"
                            minDate={new Date()}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholderText="Click to select a date"
                            required
                            disabled={!isAuthenticated}
                        />
                    </div>

                    {loadingAvailability ? (
                        <div className="text-center text-gray-600">Loading availability...</div>
                    ) : availableSlots.length > 0 ? (
                        <div>
                            <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">Select Time Slot</label>
                            <select
                                id="timeSlot"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={selectedSlot}
                                onChange={(e) => setSelectedSlot(e.target.value)}
                                required
                                disabled={!isAuthenticated}
                            >
                                <option value="">Select a slot</option>
                                {availableSlots.map(slot => (
                                    <option key={`${slot.startTime}-${slot.endTime}`} value={`${slot.startTime}-${slot.endTime}`}>
                                        {slot.startTime} - {slot.endTime}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        selectedDate && <p className="text-red-500 text-sm">{bookingMessage || 'No slots available for this date.'}</p>
                    )}

                    <div>
                        <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700">Appointment Type</label>
                        <select
                            id="appointmentType"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={appointmentType}
                            onChange={(e) => setAppointmentType(e.target.value)}
                            required
                            disabled={!isAuthenticated}
                        >
                            <option value="in-person">In-person</option>
                            <option value="telemedicine">Telemedicine</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="reasonForVisit" className="block text-sm font-medium text-gray-700">Reason for Visit</label>
                        <textarea
                            id="reasonForVisit"
                            rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={reasonForVisit}
                            onChange={(e) => setReasonForVisit(e.target.value)}
                            placeholder="e.g., General check-up, cold symptoms, follow-up"
                            required
                            disabled={!isAuthenticated}
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700">Consultation Fee (Optional)</label>
                        <input
                            type="number"
                            id="consultationFee"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={consultationFee}
                            onChange={(e) => setConsultationFee(e.target.value)}
                            min="0"
                            step="0.01"
                            disabled={!isAuthenticated}
                        />
                    </div>

                    {bookingMessage && (
                        <p className={`mt-2 text-center text-sm ${bookingMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                            {bookingMessage}
                        </p>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            disabled={!isAuthenticated || loadingBooking || !selectedSlot}
                        >
                            {loadingBooking ? 'Booking...' : 'Confirm Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorDetail;