import React, { useState, useEffect } from 'react';
   import { pharmacyService } from '../api/services';
   import { Link } from 'react-router-dom';

   const Pharmacies = () => {
       const [pharmacies, setPharmacies] = useState([]);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);

       // Search filters
       const [searchName, setSearchName] = useState('');
       const [searchCity, setSearchCity] = useState('');
       const [latitude, setLatitude] = useState('');
       const [longitude, setLongitude] = useState('');
       const [maxDistance, setMaxDistance] = useState(''); // in km

       const fetchPharmacies = async (filters = {}) => {
           setLoading(true);
           setError(null);
           try {
               const res = await pharmacyService.getAllPharmacies(filters);
               setPharmacies(res.data);
           } catch (err) {
               console.error('Failed to fetch pharmacies:', err);
               setError('Failed to load pharmacies. Please try again later.');
           } finally {
               setLoading(false);
           }
       };

       useEffect(() => {
           fetchPharmacies();
       }, []);

       const handleSearch = (e) => {
           e.preventDefault();
           const filters = {};
           if (searchName) filters.name = searchName;
           if (searchCity) filters.city = searchCity;
           if (latitude && longitude && maxDistance) {
               filters.latitude = parseFloat(latitude);
               filters.longitude = parseFloat(longitude);
               filters.maxDistance = parseFloat(maxDistance);
           }
           fetchPharmacies(filters);
       };

       const handleGetMyLocation = () => {
           if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(
                   (position) => {
                       setLatitude(position.coords.latitude.toFixed(6));
                       setLongitude(position.coords.longitude.toFixed(6));
                       setMaxDistance(10); // Default search radius
                   },
                   (err) => {
                       console.error('Error getting location:', err);
                       alert('Unable to retrieve your location. Please allow location access or enter manually.');
                   }
               );
           } else {
               alert('Geolocation is not supported by your browser.');
           }
       };


       if (loading && pharmacies.length === 0) return <div className="text-center py-8">Loading pharmacies...</div>;
       if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

       return (
           <div className="container mx-auto p-4">
               <h1 className="text-3xl font-bold text-gray-800 mb-6">Find a Pharmacy</h1>

               <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   <div>
                       <label htmlFor="searchName" className="block text-sm font-medium text-gray-700">Pharmacy Name</label>
                       <input
                           type="text"
                           id="searchName"
                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                           value={searchName}
                           onChange={(e) => setSearchName(e.target.value)}
                           placeholder="e.g., CVS Pharmacy"
                       />
                   </div>
                   <div>
                       <label htmlFor="searchCity" className="block text-sm font-medium text-gray-700">City</label>
                       <input
                           type="text"
                           id="searchCity"
                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                           value={searchCity}
                           onChange={(e) => setSearchCity(e.target.value)}
                           placeholder="e.g., New York"
                       />
                   </div>
                   <div className="md:col-span-3 lg:col-span-1">
                       <label className="block text-sm font-medium text-gray-700">Location (for nearby search)</label>
                       <div className="flex space-x-2 mt-1">
                           <input
                               type="number"
                               step="0.000001"
                               className="block w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                               placeholder="Latitude"
                               value={latitude}
                               onChange={(e) => setLatitude(e.target.value)}
                           />
                           <input
                               type="number"
                               step="0.000001"
                               className="block w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                               placeholder="Longitude"
                               value={longitude}
                               onChange={(e) => setLongitude(e.target.value)}
                           />
                       </div>
                       <input
                           type="number"
                           step="1"
                           className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                           placeholder="Max Distance (km)"
                           value={maxDistance}
                           onChange={(e) => setMaxDistance(e.target.value)}
                       />
                       <button
                           type="button"
                           onClick={handleGetMyLocation}
                           className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 px-4 rounded-md shadow-sm"
                       >
                           Get My Location
                       </button>
                   </div>
                   <div className="md:col-span-3 flex justify-end">
                       <button
                           type="submit"
                           className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                       >
                           Search Pharmacies
                       </button>
                   </div>
               </form>

               {loading ? (
                   <div className="text-center py-8">Searching...</div>
               ) : pharmacies.length === 0 ? (
                   <p className="text-gray-600 text-center text-lg">No pharmacies found matching your criteria.</p>
               ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {pharmacies.map((pharmacy) => (
                           <div key={pharmacy._id} className="bg-white rounded-lg shadow-md p-6">
                               <h2 className="text-xl font-semibold text-blue-700 mb-2">{pharmacy.name}</h2>
                               <p className="text-gray-600 mb-1">{pharmacy.address}, {pharmacy.city}, {pharmacy.state} {pharmacy.zipCode}</p>
                               {pharmacy.phoneNumber && <p className="text-gray-600 mb-1">Phone: {pharmacy.phoneNumber}</p>}
                               {pharmacy.website && <p className="text-blue-500 hover:underline mb-2"><a href={pharmacy.website} target="_blank" rel="noopener noreferrer">{pharmacy.website}</a></p>}
                               {pharmacy.services?.length > 0 && <p className="text-gray-700 text-sm">Services: {pharmacy.services.join(', ')}</p>}
                               <Link
                                   to={`/pharmacies/${pharmacy._id}`}
                                   className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 mt-4"
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

   export default Pharmacies;