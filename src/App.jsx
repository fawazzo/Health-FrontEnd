import React from 'react';
   import { Routes, Route } from 'react-router-dom';
   import Login from './pages/Login';
   import Register from './pages/Register';
   import Dashboard from './pages/Dashboard';
   import Home from './pages/Home';
   import PrivateRoute from './components/PrivateRoute';
   import Unauthorized from './pages/Unauthorized';
   import Navbar from './components/Navbar';

   // Imports for Part 2
   import Hospitals from './pages/Hospitals';
   import HospitalDetail from './pages/HospitalDetail';
   import Specialties from './pages/Specialties';
   import Doctors from './pages/Doctors';
   import DoctorDetail from './pages/DoctorDetail';
   import MyAppointments from './pages/MyAppointments';

   // New imports for Part 3
   import MedicalRecords from './pages/MedicalRecords';
   import MedicalRecordEdit from './pages/MedicalRecordEdit';
   import Prescriptions from './pages/Prescriptions';
   import PrescriptionDetail from './pages/PrescriptionDetail';
   import DoctorReviews from './pages/DoctorReviews';
   import MyReviews from './pages/MyReviews';
   import Notifications from './pages/Notifications';
   import Pharmacies from './pages/Pharmacies';
   import PharmacyDetail from './pages/PharmacyDetail';


   const App = () => {
       return (
           <>
               <Navbar />
               <Routes>
                   <Route path="/" element={<Home />} />
                   <Route path="/login" element={<Login />} />
                   <Route path="/register" element={<Register />} />
                   <Route path="/unauthorized" element={<Unauthorized />} />

                   {/* Public Data Routes */}
                   <Route path="/hospitals" element={<Hospitals />} />
                   <Route path="/hospitals/:id" element={<HospitalDetail />} />
                   <Route path="/specialties" element={<Specialties />} />
                   <Route path="/doctors" element={<Doctors />} />
                   <Route path="/doctors/:id" element={<DoctorDetail />} /> {/* Doctor detail and booking */}
                   <Route path="/reviews/doctor/:doctorId" element={<DoctorReviews />} /> {/* Public doctor reviews */}
                   <Route path="/pharmacies" element={<Pharmacies />} />
                   <Route path="/pharmacies/:id" element={<PharmacyDetail />} />


                   {/* Private Routes (Accessible by any authenticated user) */}
                   <Route element={<PrivateRoute />}>
                       <Route path="/dashboard" element={<Dashboard />} />
                       <Route path="/my-appointments" element={<MyAppointments />} /> {/* Filtered by role on backend */}
                       <Route path="/notifications" element={<Notifications />} />
                       {/* Medical Records (Upload/View for patient, doctor, admin; Edit/Delete for patient/admin) */}
                       <Route path="/medicalrecords" element={<MedicalRecords />} />
                       <Route path="/medicalrecords/:id/edit" element={<MedicalRecordEdit />} />
                       {/* Prescriptions (View for patient/doctor/admin, Create/Edit for doctor, Delete for admin) */}
                       <Route path="/prescriptions" element={<Prescriptions />} />
                       <Route path="/prescriptions/:id" element={<PrescriptionDetail />} />
                   </Route>

                   {/* Role-specific Private Routes */}
                   <Route element={<PrivateRoute allowedRoles={['patient']} />}>
                        <Route path="/my-reviews" element={<MyReviews />} />
                   </Route>
                   {/* Admin-only routes for managing entities could go here, e.g., create/update/delete hospitals, specialties, pharmacies */}
                   {/* <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                        <Route path="/admin/hospitals/create" element={<CreateHospital />} />
                        <Route path="/admin/specialties/create" element={<CreateSpecialty />} />
                   </Route> */}
                   {/* Doctor-specific routes not covered by general private routes: e.g., managing their own availability */}
                   {/* <Route element={<PrivateRoute allowedRoles={['doctor']} />}>
                        <Route path="/doctor/my-availability-management" element={<DoctorAvailabilityManagement />} />
                   </Route> */}
               </Routes>
           </>
       );
   };

   export default App;