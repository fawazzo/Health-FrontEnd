import React, { useState, useEffect } from 'react';
import { hospitalService } from '../api/services';
import { Link } from 'react-router-dom';

const Hospitals = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await hospitalService.getAllHospitals();
                setHospitals(res.data);
            } catch (err) {
                console.error('Failed to fetch hospitals:', err);
                setError('Failed to load hospitals. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchHospitals();
    }, []);

    if (loading) return <div className="text-center py-8">Loading hospitals...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Hospitals</h1>
            {hospitals.length === 0 ? (
                <p className="text-gray-600">No hospitals found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hospitals.map((hospital) => (
                        <div key={hospital._id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-blue-700 mb-2">{hospital.name}</h2>
                            <p className="text-gray-600 mb-1">{hospital.address}, {hospital.city}, {hospital.state} {hospital.zipCode}</p>
                            {hospital.phoneNumber && <p className="text-gray-600 mb-1">Phone: {hospital.phoneNumber}</p>}
                            {hospital.website && <p className="text-blue-500 hover:underline mb-2"><a href={hospital.website} target="_blank" rel="noopener noreferrer">{hospital.website}</a></p>}
                            <p className="text-gray-700 text-sm mb-4">{hospital.description}</p>
                            <Link
                                to={`/hospitals/${hospital._id}`}
                                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Hospitals;