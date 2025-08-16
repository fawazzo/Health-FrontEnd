import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hospitalService } from '../api/services';

const HospitalDetail = () => {
    const { id } = useParams();
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHospital = async () => {
            try {
                const res = await hospitalService.getHospitalById(id);
                setHospital(res.data);
            } catch (err) {
                console.error('Failed to fetch hospital:', err);
                setError('Hospital not found or failed to load details.');
            } finally {
                setLoading(false);
            }
        };
        fetchHospital();
    }, [id]);

    if (loading) return <div className="text-center py-8">Loading hospital details...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
    if (!hospital) return <div className="text-center py-8 text-gray-600">Hospital not found.</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
                <h1 className="text-4xl font-extrabold text-blue-800 mb-4">{hospital.name}</h1>
                <p className="text-lg text-gray-700 mb-2">
                    {hospital.address}, {hospital.city}, {hospital.state} {hospital.zipCode}
                </p>
                {hospital.phoneNumber && (
                    <p className="text-md text-gray-600 mb-2">Phone: {hospital.phoneNumber}</p>
                )}
                {hospital.website && (
                    <p className="text-md text-blue-600 hover:underline mb-4">
                        Website: <a href={hospital.website} target="_blank" rel="noopener noreferrer">{hospital.website}</a>
                    </p>
                )}
                <p className="text-gray-800 leading-relaxed mb-6">{hospital.description}</p>

                {hospital.services && hospital.services.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-3">Services Offered</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {hospital.services.map((service, index) => (
                                <li key={index}>{service}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {hospital.departments && hospital.departments.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-3">Departments</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {hospital.departments.map((dept, index) => (
                                <li key={index}>{dept}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <Link
                    to="/hospitals"
                    className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-200 mt-4"
                >
                    Back to Hospitals
                </Link>
            </div>
        </div>
    );
};

export default HospitalDetail;