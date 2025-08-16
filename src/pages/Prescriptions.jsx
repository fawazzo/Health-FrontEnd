import React, { useState, useEffect } from 'react';
   import { prescriptionService, appointmentService, pharmacyService } from '../api/services';
   import { useAuth } from '../context/AuthContext';
   import { Link } from 'react-router-dom';
   import { format } from 'date-fns';

   const Prescriptions = () => {
       const [prescriptions, setPrescriptions] = useState([]);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);
       const { user, isAuthenticated } = useAuth();

       // State for Doctor's New Prescription Form
       const [availableAppointments, setAvailableAppointments] = useState([]);
       const [selectedAppointment, setSelectedAppointment] = useState('');
       const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
       const [instructions, setInstructions] = useState('');
       const [validUntil, setValidUntil] = useState('');
       const [createMessage, setCreateMessage] = useState('');
       const [createLoading, setCreateLoading] = useState(false);

       const fetchPrescriptions = async () => {
           setLoading(true);
           setError(null);
           try {
               const res = await prescriptionService.getPrescriptions();
               setPrescriptions(res.data);
           } catch (err) {
               console.error('Failed to fetch prescriptions:', err);
               setError('Failed to load prescriptions. Please ensure you are authorized.');
           } finally {
               setLoading(false);
           }
       };

       useEffect(() => {
           if (isAuthenticated) {
               fetchPrescriptions();

               // If user is a doctor, fetch their completed appointments for new prescription creation
               if (user?.role === 'doctor') {
                   const fetchDoctorAppointments = async () => {
                       try {
                           const res = await appointmentService.getAllAppointments(); // This gets filtered by role on backend
                           const completedAppointments = res.data.filter(app => app.status === 'completed');
                           setAvailableAppointments(completedAppointments);
                       } catch (err) {
                           console.error('Failed to fetch doctor appointments:', err);
                       }
                   };
                   fetchDoctorAppointments();
               }
           }
       }, [isAuthenticated, user]);

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

       const handleCreatePrescription = async (e) => {
           e.preventDefault();
           setCreateMessage('');
           setCreateLoading(true);

           try {
               const prescriptionData = {
                   appointmentId: selectedAppointment,
                   medications,
                   instructions,
                   validUntil: validUntil || undefined,
               };
               await prescriptionService.createPrescription(prescriptionData);
               setCreateMessage('Prescription created successfully!');
               // Clear form
               setSelectedAppointment('');
               setMedications([{ name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
               setInstructions('');
               setValidUntil('');
               fetchPrescriptions(); // Refresh list
           } catch (err) {
               console.error('Failed to create prescription:', err.response?.data?.message || err.message);
               setCreateMessage(`Failed to create prescription: ${err.response?.data?.message || 'Server error.'}`);
           } finally {
               setCreateLoading(false);
           }
       };

       const handleDeletePrescription = async (prescriptionId) => {
           if (!window.confirm('Are you sure you want to delete this prescription? This action is irreversible.')) return;
           try {
               await prescriptionService.deletePrescription(prescriptionId);
               setPrescriptions(prev => prev.filter(p => p._id !== prescriptionId));
               alert('Prescription deleted successfully!');
           } catch (err) {
               console.error('Failed to delete prescription:', err.response?.data?.message || err.message);
               alert(`Failed to delete prescription: ${err.response?.data?.message || 'Server error.'}`);
           }
       };

       if (!isAuthenticated) return <div className="text-center py-8 text-gray-600">Please log in to view prescriptions.</div>;
       if (loading) return <div className="text-center py-8">Loading prescriptions...</div>;
       if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

       return (
           <div className="container mx-auto p-4">
               <h1 className="text-3xl font-bold text-gray-800 mb-6">My Prescriptions</h1>

               {user.role === 'doctor' && (
                   <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                       <h2 className="text-2xl font-bold text-gray-800 mb-4">Issue New Prescription</h2>
                       <form onSubmit={handleCreatePrescription} className="space-y-4">
                           <div>
                               <label htmlFor="appointment" className="block text-sm font-medium text-gray-700">Select Completed Appointment</label>
                               <select
                                   id="appointment"
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                   value={selectedAppointment}
                                   onChange={(e) => setSelectedAppointment(e.target.value)}
                                   required
                               >
                                   <option value="">-- Select an appointment --</option>
                                   {availableAppointments.length > 0 ? (
                                       availableAppointments.map(app => (
                                           <option key={app._id} value={app._id}>
                                               {format(new Date(app.date), 'MM/dd/yyyy')} {app.startTime} - Patient: {app.patientId?.profile?.firstName} {app.patientId?.profile?.lastName}
                                           </option>
                                       ))
                                   ) : (
                                       <option disabled>No completed appointments available</option>
                                   )}
                               </select>
                           </div>

                           <div className="space-y-4 border p-4 rounded-md">
                               <h3 className="text-lg font-semibold text-gray-700">Medications</h3>
                               {medications.map((med, index) => (
                                   <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                       <input
                                           type="text"
                                           placeholder="Name (e.g., Amoxicillin)"
                                           className="col-span-1 md:col-span-2 border border-gray-300 rounded-md py-2 px-3 sm:text-sm"
                                           value={med.name}
                                           onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                                           required
                                       />
                                       <input
                                           type="text"
                                           placeholder="Dosage (e.g., 250mg)"
                                           className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm"
                                           value={med.dosage}
                                           onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                           required
                                       />
                                       <input
                                           type="text"
                                           placeholder="Frequency (e.g., BID)"
                                           className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm"
                                           value={med.frequency}
                                           onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                           required
                                       />
                                       <input
                                           type="text"
                                           placeholder="Duration (e.g., 7 days)"
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
                                   placeholder="e.g., Take with food, finish full course of antibiotics"
                               ></textarea>
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

                           {createMessage && (
                               <p className={`mt-2 text-sm ${createMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                                   {createMessage}
                               </p>
                           )}

                           <div>
                               <button
                                   type="submit"
                                   className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                   disabled={createLoading}
                               >
                                   {createLoading ? 'Issuing...' : 'Issue Prescription'}
                               </button>
                           </div>
                       </form>
                   </div>
               )}

               {/* List Existing Prescriptions */}
               <div className="space-y-4">
                   {prescriptions.length === 0 ? (
                       <p className="text-gray-600">No prescriptions found.</p>
                   ) : (
                       prescriptions.map((p) => (
                           <div key={p._id} className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500">
                               <div className="flex justify-between items-start mb-2">
                                   <div>
                                       <h3 className="text-lg font-semibold text-gray-900">
                                            Prescription by Dr. {p.doctorId?.profile?.firstName} {p.doctorId?.profile?.lastName}
                                       </h3>
                                       <p className="text-sm text-gray-600">For Patient: {p.patientId?.profile?.firstName} {p.patientId?.profile?.lastName}</p>
                                       <p className="text-sm text-gray-600">Issued on: {format(new Date(p.issueDate), 'MM/dd/yyyy')}</p>
                                       {p.validUntil && <p className="text-sm text-gray-600">Valid Until: {format(new Date(p.validUntil), 'MM/dd/yyyy')}</p>}
                                       <p className="text-sm text-gray-600">Status: <span className="font-medium capitalize">{p.status.replace('_', ' ')}</span></p>
                                   </div>
                                   <div className="flex space-x-2">
                                       <Link
                                           to={`/prescriptions/${p._id}`}
                                           className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded"
                                       >
                                           View Details
                                       </Link>
                                       {user.role === 'doctor' && (
                                            <Link
                                                to={`/prescriptions/${p._id}/edit`}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-3 rounded"
                                            >
                                                Edit
                                            </Link>
                                       )}
                                       {user.role === 'admin' && (
                                           <button
                                               onClick={() => handleDeletePrescription(p._id)}
                                               className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded"
                                           >
                                               Delete
                                           </button>
                                       )}
                                   </div>
                               </div>
                               <div className="mt-2">
                                   <h4 className="font-medium text-gray-800">Medications:</h4>
                                   <ul className="list-disc list-inside text-gray-700 text-sm">
                                       {p.medications.map((med, idx) => (
                                           <li key={idx}>
                                               {med.name} - {med.dosage}, {med.frequency}, {med.duration} ({med.notes})
                                           </li>
                                       ))}
                                   </ul>
                                   {p.instructions && <p className="text-gray-700 text-sm mt-2"><strong>Instructions:</strong> {p.instructions}</p>}
                               </div>
                           </div>
                       ))
                   )}
               </div>
           </div>
       );
   };

   export default Prescriptions;