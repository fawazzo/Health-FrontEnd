import React, { useState, useEffect } from 'react';
import { specialtyService } from '../api/services';
import { Link } from 'react-router-dom';

const Specialties = () => {
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const res = await specialtyService.getAllSpecialties();
                setSpecialties(res.data);
            } catch (err) {
                console.error('Failed to fetch specialties:', err);
                setError('Failed to load specialties. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchSpecialties();
    }, []);

    if (loading) return <div className="text-center py-8">Loading specialties...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Medical Specialties</h1>
            {specialties.length === 0 ? (
                <p className="text-gray-600">No specialties found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {specialties.map((specialty) => (
                        <div key={specialty._id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-blue-700 mb-2">{specialty.name}</h2>
                            <p className="text-gray-700 text-sm">{specialty.description || 'No description available.'}</p>
                            {/* Optionally, link to doctors by this specialty */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Specialties;