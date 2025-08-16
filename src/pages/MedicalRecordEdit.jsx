import React, { useState, useEffect } from 'react';
   import { useParams, useNavigate } from 'react-router-dom';
   import { medicalRecordService, authService } from '../api/services'; // authService to get doctor list
   import { useAuth } from '../context/AuthContext';

   const MedicalRecordEdit = () => {
       const { id } = useParams();
       const navigate = useNavigate();
       const { user, isAuthenticated } = useAuth();

       const [record, setRecord] = useState(null);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);

       // Form state
       const [title, setTitle] = useState('');
       const [description, setDescription] = useState('');
       const [type, setType] = useState('');
       const [accessGrantedTo, setAccessGrantedTo] = useState([]); // Array of doctor IDs
       const [allDoctors, setAllDoctors] = useState([]); // List of all doctors for selection
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
                   const recordRes = await medicalRecordService.getMedicalRecordById(id);
                   setRecord(recordRes.data);
                   setTitle(recordRes.data.title);
                   setDescription(recordRes.data.description || '');
                   setType(recordRes.data.type);
                   setAccessGrantedTo(recordRes.data.accessGrantedTo.map(doc => doc._id)); // Map to IDs

                   // Fetch all doctors for access control dropdown if current user is patient/admin
                   if (user.role === 'patient' || user.role === 'admin') {
                       const doctorsRes = await authService.getAllDoctors(); // Need a dedicated get all doctors in authService or just doctorService
                       // Assuming doctorService.getAllDoctors() does not need special auth and returns users with role 'doctor'
                       // Backend's /api/doctors endpoint is public and returns users with role 'doctor'.
                       const allDocUsers = doctorsRes.data;
                       setAllDoctors(allDocUsers);
                   }

               } catch (err) {
                   console.error('Failed to fetch medical record for edit:', err);
                   setError('Medical record not found or unauthorized to edit.');
               } finally {
                   setLoading(false);
               }
           };
           fetchData();
       }, [id, isAuthenticated, user, navigate]);

       const handleAccessChange = (e) => {
           const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
           setAccessGrantedTo(selectedOptions);
       };

       const handleUpdateSubmit = async (e) => {
           e.preventDefault();
           setUpdateMessage('');
           setUpdateLoading(true);

           const updateData = {
               title,
               description,
               type,
               accessGrantedTo,
           };

           try {
               await medicalRecordService.updateMedicalRecord(id, updateData);
               setUpdateMessage('Medical record updated successfully!');
               // navigate('/medicalrecords'); // Or stay on page with success message
           } catch (err) {
               console.error('Update failed:', err.response?.data?.message || err.message);
               const errors = err.response?.data?.errors?.map(e => Object.values(e).join('')) || [];
               setUpdateMessage(`Update failed: ${errors.join(', ') || err.response?.data?.message || 'Server error.'}`);
           } finally {
               setUpdateLoading(false);
           }
       };

       if (!isAuthenticated) return <div className="text-center py-8 text-gray-600">Please log in to edit medical records.</div>;
       if (loading) return <div className="text-center py-8">Loading record for editing...</div>;
       if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
       if (!record) return <div className="text-center py-8 text-gray-600">Record not found.</div>;

       // Authorization check (Client-side, backend enforces fully)
       const isOwner = record.patientId?._id === user?._id;
       const isAdmin = user?.role === 'admin';
       if (!isOwner && !isAdmin) {
            return <div className="text-center py-8 text-red-600">You are not authorized to edit this medical record.</div>;
       }


       return (
           <div className="container mx-auto p-4">
               <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Medical Record: {record.title}</h1>

               <div className="bg-white rounded-lg shadow-md p-6">
                   <form onSubmit={handleUpdateSubmit} className="space-y-4">
                       <div>
                           <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                           <input
                               type="text"
                               id="title"
                               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                               value={title}
                               onChange={(e) => setTitle(e.target.value)}
                               required
                           />
                       </div>
                       <div>
                           <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                           <textarea
                               id="description"
                               rows="3"
                               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                               value={description}
                               onChange={(e) => setDescription(e.target.value)}
                           ></textarea>
                       </div>
                       <div>
                           <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                           <select
                               id="type"
                               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                               value={type}
                               onChange={(e) => setType(e.target.value)}
                               required
                           >
                               <option value="lab_result">Lab Result</option>
                               <option value="imaging_scan">Imaging Scan</option>
                               <option value="consultation_note">Consultation Note</option>
                               <option value="prescription_copy">Prescription Copy</option>
                               <option value="other">Other</option>
                           </select>
                       </div>

                       {(user.role === 'patient' || user.role === 'admin') && allDoctors.length > 0 && (
                           <div>
                               <label htmlFor="accessGrantedTo" className="block text-sm font-medium text-gray-700">Grant Access To Doctors (Multi-select)</label>
                               <select
                                   id="accessGrantedTo"
                                   multiple
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-32"
                                   value={accessGrantedTo}
                                   onChange={handleAccessChange}
                               >
                                   {allDoctors.map(doc => (
                                       <option key={doc._id} value={doc._id}>
                                           Dr. {doc.profile.firstName} {doc.profile.lastName} ({doc.profile.specialties?.join(', ')})
                                       </option>
                                   ))}
                               </select>
                               <p className="mt-1 text-sm text-gray-500">Hold Ctrl (Windows) or Cmd (Mac) to select multiple doctors.</p>
                           </div>
                       )}

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
                               onClick={() => navigate('/medicalrecords')}
                               className="flex-1 justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                           >
                               Cancel
                           </button>
                       </div>
                   </form>
               </div>
           </div>
       );
   };

   export default MedicalRecordEdit;