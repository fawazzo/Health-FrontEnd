import React, { useState, useEffect } from 'react';
   import { useParams, useNavigate, Link } from 'react-router-dom';
   import { prescriptionService, pharmacyService } from '../api/services';
   import { useAuth } from '../context/AuthContext';
   import { format } from 'date-fns';

   const PrescriptionDetail = () => {
       const { id } = useParams();
       const navigate = useNavigate();
       const { user, isAuthenticated } = useAuth();

       const [prescription, setPrescription] = useState(null);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);

       // For edit mode (if user is doctor)
       const [isEditing, setIsEditing] = useState(false);
       const [medications, setMedications] = useState([]);
       const [instructions, setInstructions] = useState('');
       const [status, setStatus] = useState('');
       const [pharmacyId, setPharmacyId] = useState('');
       const [validUntil, setValidUntil] = useState('');
       const [allPharmacies, setAllPharmacies] = useState([]); // For selecting pharmacy
       const [updateMessage, setUpdateMessage] = useState('');
       const [updateLoading, setUpdateLoading] = useState(false);


       useEffect(() => {
           const fetchData = async () => {
               if (!isAuthenticated) {
                   navigate('/login');
                   return;
               }
               setLoading(true);
               setError(null);
               try {
                   const presRes = await prescriptionService.getPrescriptionById(id);
                   setPrescription(presRes.data);
                   setMedications(presRes.data.medications);
                   setInstructions(presRes.data.instructions || '');
                   setStatus(presRes.data.status);
                   setPharmacyId(presRes.data.pharmacyId?._id || '');
                   setValidUntil(presRes.data.validUntil ? format(new Date(presRes.data.validUntil), 'yyyy-MM-dd') : '');

                   // Fetch pharmacies if doctor or admin
                   if (user?.role === 'doctor' || user?.role === 'admin') {
                       const pharmaciesRes = await pharmacyService.getAllPharmacies();
                       setAllPharmacies(pharmaciesRes.data);
                   }

               } catch (err) {
                   console.error('Failed to fetch prescription:', err);
                   setError('Prescription not found or unauthorized to view.');
               } finally {
                   setLoading(false);
               }
           };
           fetchData();
       }, [id, isAuthenticated, user, navigate]);

       const handleMedicationChange = (index, field, value) => {
           const newMedications = [...medications];
           newMedications[index][field] = value;
           setMedications(newMedications);
       };

       const addMedication = () => {
           setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
       };

       const removeMedication = (index) => {
           const newMedications = medications.filter((_, i) => i !== index);
           setMedications(newMedications);
       };

       const handleUpdatePrescription = async (e) => {
           e.preventDefault();
           setUpdateMessage('');
           setUpdateLoading(true);

           const updateData = {
               medications,
               instructions,
               status,
               pharmacyId: pharmacyId || null, // Ensure sending null if empty string
               validUntil: validUntil || undefined,
           };

           try {
               await prescriptionService.updatePrescription(id, updateData);
               setUpdateMessage('Prescription updated successfully!');
               setIsEditing(false); // Exit edit mode
               // Refresh data
               const updatedPrescription = await prescriptionService.getPrescriptionById(id);
               setPrescription(updatedPrescription.data);
           } catch (err) {
               console.error('Update failed:', err.response?.data?.message || err.message);
               setUpdateMessage(`Update failed: ${err.response?.data?.message || 'Server error.'}`);
           } finally {
               setUpdateLoading(false);
           }
       };

       if (!isAuthenticated) return <div className="text-center py-8 text-gray-600">Please log in to view prescriptions.</div>;
       if (loading) return <div className="text-center py-8">Loading prescription details...</div>;
       if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
       if (!prescription) return <div className="text-center py-8 text-gray-600">Prescription not found.</div>;

       // Authorization check
       const isOwner = prescription.patientId?._id === user?._id || prescription.doctorId?._id === user?._id;
       const isAdmin = user?.role === 'admin';
       const canEdit = user?.role === 'doctor' && prescription.doctorId?._id === user?._id;

       if (!isOwner && !isAdmin) {
           return <div className="text-center py-8 text-red-600">You are not authorized to view this prescription.</div>;
       }

       return (
           <div className="container mx-auto p-4">
               <h1 className="text-3xl font-bold text-gray-800 mb-6">Prescription Details</h1>

               <div className="bg-white rounded-lg shadow-lg p-6">
                   <div className="flex justify-between items-start mb-4">
                       <div>
                           <h2 className="text-xl font-semibold text-gray-900">
                               Prescription by Dr. {prescription.doctorId?.profile?.firstName} {prescription.doctorId?.profile?.lastName}
                           </h2>
                           <p className="text-gray-700">For Patient: {prescription.patientId?.profile?.firstName} {prescription.patientId?.profile?.lastName}</p>
                           <p className="text-sm text-gray-600">Issued on: {format(new Date(prescription.issueDate), 'MM/dd/yyyy')}</p>
                           {prescription.validUntil && <p className="text-sm text-gray-600">Valid Until: {format(new Date(prescription.validUntil), 'MM/dd/yyyy')}</p>}
                           <p className="text-sm text-gray-600">Current Status: <span className="font-medium capitalize">{prescription.status.replace('_', ' ')}</span></p>
                           {prescription.pharmacyId && (
                               <p className="text-sm text-gray-600">Sent to Pharmacy: {prescription.pharmacyId.name} ({prescription.pharmacyId.city})</p>
                           )}
                       </div>
                       {canEdit && !isEditing && (
                           <button
                               onClick={() => setIsEditing(true)}
                               className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-3 rounded"
                           >
                               Edit Prescription
                           </button>
                       )}
                   </div>

                   {isEditing && canEdit ? (
                       <form onSubmit={handleUpdatePrescription} className="space-y-4 mt-6 border-t pt-6">
                           <h3 className="text-lg font-semibold text-gray-700 mb-3">Edit Medications</h3>
                           <div className="space-y-4 border p-4 rounded-md">
                               {medications.map((med, index) => (
                                   <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                       <input
                                           type="text"
                                           placeholder="Name"
                                           className="col-span-1 md:col-span-2 border border-gray-300 rounded-md py-2 px-3 sm:text-sm"
                                           value={med.name}
                                           onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                                           required
                                       />
                                       <input
                                           type="text"
                                           placeholder="Dosage"
                                           className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm"
                                           value={med.dosage}
                                           onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                           required
                                       />
                                       <input
                                           type="text"
                                           placeholder="Frequency"
                                           className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm"
                                           value={med.frequency}
                                           onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                           required
                                       />
                                       <input
                                           type="text"
                                           placeholder="Duration"
                                           className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm"
                                           value={med.duration}
                                           onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                           required
                                       />
                                       {medications.length > 1 && (
                                           <button
                                               type="button"
                                               onClick={() => removeMedication(index)}
                                               className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm"
                                           >
                                               Remove
                                           </button>
                                       )}
                                   </div>
                               ))}
                               <button
                                   type="button"
                                   onClick={addMedication}
                                   className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-sm"
                               >
                                   Add Medication
                               </button>
                           </div>

                           <div>
                               <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">General Instructions</label>
                               <textarea
                                   id="instructions"
                                   rows="3"
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                   value={instructions}
                                   onChange={(e) => setInstructions(e.target.value)}
                               ></textarea>
                           </div>
                           <div>
                               <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                               <select
                                   id="status"
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                   value={status}
                                   onChange={(e) => setStatus(e.target.value)}
                               >
                                   <option value="issued">Issued</option>
                                   <option value="sent_to_pharmacy">Sent to Pharmacy</option>
                                   <option value="filled">Filled</option>
                                   <option value="archived">Archived</option>
                               </select>
                           </div>
                           <div>
                               <label htmlFor="pharmacyId" className="block text-sm font-medium text-gray-700">Send to Pharmacy (Optional)</label>
                               <select
                                   id="pharmacyId"
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                   value={pharmacyId}
                                   onChange={(e) => setPharmacyId(e.target.value)}
                               >
                                   <option value="">-- Select Pharmacy --</option>
                                   {allPharmacies.map(pharm => (
                                       <option key={pharm._id} value={pharm._id}>{pharm.name} ({pharm.city})</option>
                                   ))}
                               </select>
                           </div>
                           <div>
                               <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700">Valid Until (Optional)</label>
                               <input
                                   type="date"
                                   id="validUntil"
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                   value={validUntil}
                                   onChange={(e) => setValidUntil(e.target.value)}
                               />
                           </div>

                           {updateMessage && (
                               <p className={`mt-2 text-sm ${updateMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                                   {updateMessage}
                               </p>
                           )}

                           <div className="flex space-x-4">
                               <button
                                   type="submit"
                                   className="flex-1 justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                   disabled={updateLoading}
                               >
                                   {updateLoading ? 'Updating...' : 'Save Changes'}
                               </button>
                               <button
                                   type="button"
                                   onClick={() => setIsEditing(false)}
                                   className="flex-1 justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                               >
                                   Cancel
                               </button>
                           </div>
                       </form>
                   ) : (
                       <div className="mt-4 border-t pt-4">
                           <h3 className="text-xl font-semibold text-gray-700 mb-2">Medications:</h3>
                           <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                               {prescription.medications.map((med, idx) => (
                                   <li key={idx}>
                                       <strong>{med.name}</strong> - {med.dosage}, {med.frequency}, {med.duration}
                                       {med.notes && <span className="text-sm italic ml-2">({med.notes})</span>}
                                   </li>
                               ))}
                           </ul>
                           {prescription.instructions && (
                               <p className="text-gray-800 leading-relaxed">
                                   <strong>Instructions:</strong> {prescription.instructions}
                               </p>
                           )}
                       </div>
                   )}
               </div>
           </div>
       );
   };

   export default PrescriptionDetail;