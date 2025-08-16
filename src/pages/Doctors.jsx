import React, { useState, useEffect } from 'react';
import { doctorService, specialtyService, hospitalService } from '../api/services';
import { Link } from 'react-router-dom';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search filters
    const [searchName, setSearchName] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedHospital, setSelectedHospital] = useState('');

    const fetchDoctors = async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await doctorService.getAllDoctors(filters);
            setDoctors(res.data);
        } catch (err) {
            console.error('Failed to fetch doctors:', err);
            setError('Failed to load doctors. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch initial doctors and filter options
        fetchDoctors();

        const fetchFilters = async () => {
            try {
                const [specialtiesRes, hospitalsRes] = await Promise.all([
                    specialtyService.getAllSpecialties(),
                    hospitalService.getAllHospitals()
                ]);
                setSpecialties(specialtiesRes.data);
                setHospitals(hospitalsRes.data);
            } catch (err) {
                console.error('Failed to load filter options:', err);
            }
        };
        fetchFilters();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const filters = {};
        if (searchName) filters.name = searchName;
        if (selectedSpecialty) filters.specialty = selectedSpecialty;
        if (selectedHospital) filters.hospitalId = selectedHospital;
        fetchDoctors(filters);
    };

    if (loading && doctors.length === 0) return <div className="text-center py-8">Loading doctors...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Find a Doctor</h1>

            <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="searchName" className="block text-sm font-medium text-gray-700">Doctor Name</label>
                    <input
                        type="text"
                        id="searchName"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="e.g., John Doe"
                    />
                </div>
                <div>
                    <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Specialty</label>
                    <select
                        id="specialty"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                    >
                        <option value="">All Specialties</option>
                        {specialties.map(s => (
                            <option key={s._id} value={s.name}>{s.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="hospital" className="block text-sm font-medium text-gray-700">Hospital Affiliation</label>
                    <select
                        id="hospital"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={selectedHospital}
                        onChange={(e) => setSelectedHospital(e.target.value)}
                    >
                        <option value="">All Hospitals</option>
                        {hospitals.map(h => (
                            <option key={h._id} value={h._id}>{h.name} ({h.city})</option>
                        ))}
                    </select>
                </div>
                <div className="md:col-span-3 flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Search Doctors
                    </button>
                </div>
            </form>

            {loading ? (
                <div className="text-center py-8">Searching...</div>
            ) : doctors.length === 0 ? (
                <p className="text-gray-600 text-center text-lg">No doctors found matching your criteria.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                        <div key={doctor._id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-blue-700 mb-2">Dr. {doctor.profile.firstName} {doctor.profile.lastName}</h2>
                            <p className="text-gray-600 mb-1">
                                Specialties: {doctor.profile.specialties?.join(', ') || 'N/A'}
                            </p>
                            {doctor.profile.hospitalAffiliations?.length > 0 && (
                                <p className="text-gray-600 mb-2">
                                    Affiliations: {doctor.profile.hospitalAffiliations.map(h => h.name).join(', ')}
                                </p>
                            )}
                            <Link
                                to={`/doctors/${doctor._id}`}
                                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                            >
                                View Profile & Book
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Doctors;