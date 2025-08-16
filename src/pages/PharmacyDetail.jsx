import React, { useState, useEffect } from 'react';
   import { useParams, Link } from 'react-router-dom';
   import { pharmacyService } from '../api/services';

   const PharmacyDetail = () => {
       const { id } = useParams();
       const [pharmacy, setPharmacy] = useState(null);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);

       useEffect(() => {
           const fetchPharmacy = async () => {
               try {
                   const res = await pharmacyService.getPharmacyById(id);
                   setPharmacy(res.data);
               } catch (err) {
                   console.error('Failed to fetch pharmacy:', err);
                   setError('Pharmacy not found or failed to load details.');
               } finally {
                   setLoading(false);
               }
           };
           fetchPharmacy();
       }, [id]);

       if (loading) return <div className="text-center py-8">Loading pharmacy details...</div>;
       if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
       if (!pharmacy) return <div className="text-center py-8 text-gray-600">Pharmacy not found.</div>;

       return (
           <div className="container mx-auto p-4">
               <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
                   <h1 className="text-4xl font-extrabold text-blue-800 mb-4">{pharmacy.name}</h1>
                   <p className="text-lg text-gray-700 mb-2">
                       {pharmacy.address}, {pharmacy.city}, {pharmacy.state} {pharmacy.zipCode}
                   </p>
                   {pharmacy.phoneNumber && (
                       <p className="text-md text-gray-600 mb-2">Phone: {pharmacy.phoneNumber}</p>
                   )}
                   {pharmacy.website && (
                       <p className="text-md text-blue-600 hover:underline mb-4">
                           Website: <a href={pharmacy.website} target="_blank" rel="noopener noreferrer">{pharmacy.website}</a>
                       </p>
                   )}
                   {pharmacy.services && pharmacy.services.length > 0 && (
                       <div className="mb-6">
                           <h2 className="text-2xl font-semibold text-gray-700 mb-3">Services Offered</h2>
                           <ul className="list-disc list-inside text-gray-700 space-y-1">
                               {pharmacy.services.map((service, index) => (
                                   <li key={index}>{service}</li>
                               ))}
                           </ul>
                       </div>
                   )}
                   {pharmacy.location && (
                       <div className="mb-6">
                           <h2 className="text-2xl font-semibold text-gray-700 mb-3">Location Coordinates</h2>
                           <p className="text-gray-700">Latitude: {pharmacy.location.coordinates[1]}</p>
                           <p className="text-gray-700">Longitude: {pharmacy.location.coordinates[0]}</p>
                           {/* Potentially add a map here using a map library if desired */}
                       </div>
                   )}

                   <Link
                       to="/pharmacies"
                       className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-200 mt-4"
                   >
                       Back to Pharmacies
                   </Link>
               </div>
           </div>
       );
   };

   export default PharmacyDetail;