import React, { useState, useEffect } from 'react';
   import { medicalRecordService } from '../api/services';
   import { useAuth } from '../context/AuthContext';
   import { Link } from 'react-router-dom';
   import { format } from 'date-fns';

   const MedicalRecords = () => {
       const [records, setRecords] = useState([]);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);
       const { user, isAuthenticated } = useAuth();

       // State for file upload form
       const [title, setTitle] = useState('');
       const [description, setDescription] = useState('');
       const [type, setType] = useState('other');
       const [selectedFile, setSelectedFile] = useState(null);
       const [patientIdForUpload, setPatientIdForUpload] = useState(''); // Only for doctor/admin
       const [uploadMessage, setUploadMessage] = useState('');
       const [uploadLoading, setUploadLoading] = useState(false);

       const fetchRecords = async () => {
           setLoading(true);
           setError(null);
           try {
               const res = await medicalRecordService.getMedicalRecords();
               setRecords(res.data);
           } catch (err) {
               console.error('Failed to fetch medical records:', err);
               setError('Failed to load medical records. Please ensure you are authorized.');
           } finally {
               setLoading(false);
           }
       };

       useEffect(() => {
           if (isAuthenticated) {
               fetchRecords();
           }
       }, [isAuthenticated, user]);

       const handleFileChange = (e) => {
           setSelectedFile(e.target.files[0]);
       };

       const handleUploadSubmit = async (e) => {
           e.preventDefault();
           setUploadMessage('');
           if (!selectedFile) {
               setUploadMessage('Please select a file to upload.');
               return;
           }

           setUploadLoading(true);
           const formData = new FormData();
           formData.append('medicalRecordFile', selectedFile);
           formData.append('title', title);
           formData.append('description', description);
           formData.append('type', type);

           if (user.role === 'doctor' || user.role === 'admin') {
               if (!patientIdForUpload) {
                   setUploadMessage('Patient ID is required for doctors/admins.');
                   setUploadLoading(false);
                   return;
               }
               formData.append('patientId', patientIdForUpload);
           }

           try {
               await medicalRecordService.uploadMedicalRecord(formData);
               setUploadMessage('File uploaded successfully!');
               setTitle('');
               setDescription('');
               setType('other');
               setSelectedFile(null);
               setPatientIdForUpload('');
               document.getElementById('medicalRecordFile').value = ''; // Clear file input
               fetchRecords(); // Refresh list
           } catch (err) {
               console.error('Upload failed:', err.response?.data?.message || err.message);
               const errors = err.response?.data?.errors?.map(e => Object.values(e).join('')) || [];
               setUploadMessage(`Upload failed: ${errors.join(', ') || err.response?.data?.message || 'Server error.'}`);
           } finally {
               setUploadLoading(false);
           }
       };

       const handleDeleteRecord = async (recordId) => {
           if (!window.confirm('Are you sure you want to delete this medical record?')) return;
           try {
               await medicalRecordService.deleteMedicalRecord(recordId);
               setRecords(prev => prev.filter(record => record._id !== recordId));
               alert('Medical record deleted successfully!');
           } catch (err) {
               console.error('Failed to delete record:', err.response?.data?.message || err.message);
               alert(`Failed to delete record: ${err.response?.data?.message || 'Server error.'}`);
           }
       };

       if (!isAuthenticated) return <div className="text-center py-8 text-gray-600">Please log in to view medical records.</div>;
       if (loading) return <div className="text-center py-8">Loading medical records...</div>;
       if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

       return (
           <div className="container mx-auto p-4">
               <h1 className="text-3xl font-bold text-gray-800 mb-6">Medical Records</h1>

               {/* Upload New Record Form */}
               <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                   <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload New Medical Record</h2>
                   <form onSubmit={handleUploadSubmit} className="space-y-4">
                       {(user.role === 'doctor' || user.role === 'admin') && (
                           <div>
                               <label htmlFor="patientIdForUpload" className="block text-sm font-medium text-gray-700">Patient ID</label>
                               <input
                                   type="text"
                                   id="patientIdForUpload"
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                   value={patientIdForUpload}
                                   onChange={(e) => setPatientIdForUpload(e.target.value)}
                                   placeholder="Enter Patient User ID"
                                   required
                               />
                           </div>
                       )}
                       <div>
                           <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                           <input
                               type="text"
                               id="title"
                               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                               value={title}
                               onChange={(e) => setTitle(e.target.value)}
                               placeholder="e.g., Blood Test Results, X-ray Scan"
                               required
                           />
                       </div>
                       <div>
                           <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                           <textarea
                               id="description"
                               rows="2"
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
                       <div>
                           <label htmlFor="medicalRecordFile" className="block text-sm font-medium text-gray-700">File Upload</label>
                           <input
                               type="file"
                               id="medicalRecordFile"
                               className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                               onChange={handleFileChange}
                               required
                           />
                       </div>
                       {uploadMessage && (
                           <p className={`mt-2 text-sm ${uploadMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                               {uploadMessage}
                           </p>
                       )}
                       <div>
                           <button
                               type="submit"
                               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                               disabled={uploadLoading}
                           >
                               {uploadLoading ? 'Uploading...' : 'Upload Record'}
                           </button>
                       </div>
                   </form>
               </div>

               {/* List Existing Records */}
               <div className="space-y-4">
                   {records.length === 0 ? (
                       <p className="text-gray-600">No medical records found.</p>
                   ) : (
                       records.map((record) => (
                           <div key={record._id} className="bg-white rounded-lg shadow-md p-5 border-l-4 border-teal-500 flex justify-between items-center">
                               <div>
                                   <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                                   <p className="text-sm text-gray-600">Type: {record.type.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}</p>
                                   <p className="text-sm text-gray-600">Uploaded: {format(new Date(record.uploadDate), 'MM/dd/yyyy')}</p>
                                   {record.doctorId && <p className="text-sm text-gray-600">Uploaded by Dr. {record.doctorId.profile.firstName} {record.doctorId.profile.lastName}</p>}
                                   {record.description && <p className="text-sm text-gray-700 italic">{record.description}</p>}
                               </div>
                               <div className="flex space-x-2">
                                   <a
                                       href={record.fileUrl}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-3 rounded"
                                   >
                                       View File
                                   </a>
                                   {(user.role === 'patient' || user.role === 'admin') && ( // Only owner/admin can update metadata
                                        <Link
                                            to={`/medicalrecords/${record._id}/edit`}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-3 rounded"
                                        >
                                            Edit
                                        </Link>
                                   )}
                                   {(user.role === 'patient' || user.role === 'admin') && ( // Only owner/admin can delete
                                       <button
                                           onClick={() => handleDeleteRecord(record._id)}
                                           className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded"
                                       >
                                           Delete
                                       </button>
                                   )}
                               </div>
                           </div>
                       ))
                   )}
               </div>
           </div>
       );
   };

   export default MedicalRecords;