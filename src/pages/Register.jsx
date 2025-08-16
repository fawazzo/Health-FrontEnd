import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/api'; // To fetch lists of hospitals/pharmacies/specialties for selection

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient');

    // Patient profile fields
    const [patientFirstName, setPatientFirstName] = useState('');
    const [patientLastName, setPatientLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // Doctor profile fields
    const [doctorFirstName, setDoctorFirstName] = useState('');
    const [doctorLastName, setDoctorLastName] = useState('');
    const [medicalLicenseNumber, setMedicalLicenseNumber] = useState('');
    const [selectedSpecialties, setSelectedSpecialties] = useState([]); // Changed to array
    const [selectedHospitalAffiliations, setSelectedHospitalAffiliations] = useState([]); // Changed to array

    // Admin profile fields (for hospital/pharmacy admin)
    const [adminFirstName, setAdminFirstName] = useState('');
    const [adminLastName, setAdminLastName] = useState('');
    const [managedHospitalId, setManagedHospitalId] = useState('');
    const [managedPharmacyId, setManagedPharmacyId] = useState('');

    const [message, setMessage] = useState('');
    const [hospitals, setHospitals] = useState([]); // State to store fetched hospitals
    const [pharmacies, setPharmacies] = useState([]); // State to store fetched pharmacies
    const [allSpecialties, setAllSpecialties] = useState([]); // State to store fetched specialties for doctors

    const { register } = useAuth();

    // Effect to fetch lists of hospitals, pharmacies, and specialties on component mount
    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const hospitalRes = await api.get('/hospitals');
                setHospitals(hospitalRes.data);

                const pharmacyRes = await api.get('/pharmacies');
                setPharmacies(pharmacyRes.data);

                const specialtyRes = await api.get('/specialties');
                setAllSpecialties(specialtyRes.data);
            } catch (error) {
                console.error('Failed to fetch dependencies:', error);
                setMessage('Failed to load required data for registration. Please try again.');
            }
        };
        fetchDependencies();
    }, []);

    // Effect to clear profile fields when role changes
    useEffect(() => {
        // Clear all profile-specific state when role changes
        setPatientFirstName('');
        setPatientLastName('');
        setDateOfBirth('');
        setPhoneNumber('');

        setDoctorFirstName('');
        setDoctorLastName('');
        setMedicalLicenseNumber('');
        setSelectedSpecialties([]); // Clear array
        setSelectedHospitalAffiliations([]); // Clear array

        setAdminFirstName('');
        setAdminLastName('');
        setManagedHospitalId('');
        setManagedPharmacyId('');
    }, [role]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        let profileData = {};
        if (role === 'patient') {
            profileData = {
                firstName: patientFirstName,
                lastName: patientLastName,
                dateOfBirth,
                phoneNumber,
            };
        } else if (role === 'doctor') {
            profileData = {
                firstName: doctorFirstName,
                lastName: doctorLastName,
                medicalLicenseNumber,
                specialties: selectedSpecialties, // Send as array of strings (names)
                hospitalAffiliations: selectedHospitalAffiliations, // Send as array of IDs
            };
        } else if (role === 'hospital_admin') {
            profileData = {
                firstName: adminFirstName,
                lastName: adminLastName,
                managedHospitalId,
            };
        } else if (role === 'pharmacy_admin') {
            profileData = {
                firstName: adminFirstName,
                lastName: adminLastName,
                managedPharmacyId,
            };
        }

        const userData = { email, password, role, profile: profileData };

        const result = await register(userData);
        if (result.success) {
            setMessage('Registration successful!'); // AuthContext already redirects on success
        } else {
            setMessage(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label htmlFor="role" className="sr-only">Role</label>
                            <select
                                id="role"
                                name="role"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                                <option value="hospital_admin">Hospital Admin</option>
                                <option value="pharmacy_admin">Pharmacy Admin</option>
                            </select>
                        </div>

                        {/* Conditional Profile Fields based on Role */}

                        {role === 'patient' && (
                            <div className="space-y-4"> {/* Added a div for better spacing */}
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={patientFirstName}
                                    onChange={(e) => setPatientFirstName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={patientLastName}
                                    onChange={(e) => setPatientLastName(e.target.value)}
                                />
                                <input
                                    type="date"
                                    placeholder="Date of Birth"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                        )}

                        {role === 'doctor' && (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={doctorFirstName}
                                    onChange={(e) => setDoctorFirstName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={doctorLastName}
                                    onChange={(e) => setDoctorLastName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Medical License Number"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={medicalLicenseNumber}
                                    onChange={(e) => setMedicalLicenseNumber(e.target.value)}
                                />
                                {/* Hospital Affiliations Multi-Select */}
                                <label htmlFor="hospitalAffiliations" className="block text-sm font-medium text-gray-700 mt-2">Hospital Affiliations (Select one or more)</label>
                                <select
                                    id="hospitalAffiliations"
                                    multiple // Allow multiple selections
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-32 overflow-y-auto"
                                    value={selectedHospitalAffiliations}
                                    onChange={(e) => {
                                        const options = [...e.target.selectedOptions];
                                        const values = options.map(option => option.value);
                                        setSelectedHospitalAffiliations(values);
                                    }}
                                    required // Backend requires at least one
                                >
                                    <option value="" disabled>Select Hospital Affiliations</option>
                                    {hospitals.map(hospital => (
                                        <option key={hospital._id} value={hospital._id}>{hospital.name} ({hospital.city})</option>
                                    ))}
                                </select>
                                {/* Specialties Multi-Select */}
                                <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 mt-2">Specialties (Select one or more)</label>
                                <select
                                    id="specialties"
                                    multiple // Allow multiple selections
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-32 overflow-y-auto"
                                    value={selectedSpecialties}
                                    onChange={(e) => {
                                        const options = [...e.target.selectedOptions];
                                        const values = options.map(option => option.value);
                                        setSelectedSpecialties(values); // Store specialty names as array
                                    }}
                                    required // Backend requires at least one
                                >
                                    <option value="" disabled>Select Specialties</option>
                                    {allSpecialties.map(specialty => (
                                        <option key={specialty._id} value={specialty.name}>{specialty.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {(role === 'hospital_admin' || role === 'pharmacy_admin') && (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={adminFirstName}
                                    onChange={(e) => setAdminFirstName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={adminLastName}
                                    onChange={(e) => setAdminLastName(e.target.value)}
                                />
                                {role === 'hospital_admin' && (
                                    <>
                                        <label htmlFor="managedHospitalId" className="block text-sm font-medium text-gray-700 mt-2">Managed Hospital</label>
                                        <select
                                            id="managedHospitalId"
                                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={managedHospitalId}
                                            onChange={(e) => setManagedHospitalId(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Managed Hospital</option>
                                            {hospitals.map(hospital => (
                                                <option key={hospital._id} value={hospital._id}>{hospital.name} ({hospital.city})</option>
                                            ))}
                                        </select>
                                    </>
                                )}
                                {role === 'pharmacy_admin' && (
                                    <>
                                        <label htmlFor="managedPharmacyId" className="block text-sm font-medium text-gray-700 mt-2">Managed Pharmacy</label>
                                        <select
                                            id="managedPharmacyId"
                                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={managedPharmacyId}
                                            onChange={(e) => setManagedPharmacyId(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Managed Pharmacy</option>
                                            {pharmacies.map(pharmacy => (
                                                <option key={pharmacy._id} value={pharmacy._id}>{pharmacy.name} ({pharmacy.city})</option>
                                            ))}
                                        </select>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {message && (
                        <p className="mt-2 text-center text-sm text-red-600">
                            {message}
                        </p>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;