import React from 'react';
   import { Link } from 'react-router-dom';
   import { useAuth } from '../context/AuthContext';

   const Navbar = () => {
       const { isAuthenticated, user, logout } = useAuth();

       return (
           <nav className="bg-blue-600 p-4 text-white shadow-lg">
               <div className="container mx-auto flex justify-between items-center">
                   <Link to="/" className="text-2xl font-bold">HealthLink Connect</Link>
                   <div className="flex items-center space-x-4">
                       <Link to="/hospitals" className="hover:underline">Hospitals</Link>
                       <Link to="/specialties" className="hover:underline">Specialties</Link>
                       <Link to="/doctors" className="hover:underline">Find a Doctor</Link>
                       <Link to="/pharmacies" className="hover:underline">Pharmacies</Link>

                       {isAuthenticated ? (
                           <>
                               {user?.role === 'patient' && (
                                   <>
                                       <Link to="/my-appointments" className="hover:underline">Appointments</Link>
                                       <Link to="/medicalrecords" className="hover:underline">Records</Link>
                                       <Link to="/prescriptions" className="hover:underline">Prescriptions</Link>
                                       <Link to="/my-reviews" className="hover:underline">My Reviews</Link>
                                       <Link to="/notifications" className="hover:underline">Notifications</Link>
                                   </>
                               )}
                               {user?.role === 'doctor' && (
                                   <>
                                       <Link to="/my-appointments" className="hover:underline">Appointments</Link>
                                       <Link to="/medicalrecords" className="hover:underline">Records</Link>
                                       <Link to="/prescriptions" className="hover:underline">Prescriptions</Link>
                                       <Link to="/notifications" className="hover:underline">Notifications</Link>
                                   </>
                               )}
                               {user?.role === 'admin' && (
                                   <>
                                       <Link to="/my-appointments" className="hover:underline">All Appointments</Link>
                                       <Link to="/medicalrecords" className="hover:underline">All Records</Link>
                                       <Link to="/prescriptions" className="hover:underline">All Prescriptions</Link>
                                       <Link to="/notifications" className="hover:underline">Notifications</Link>
                                       {/* Admin links for creating/updating hospitals, specialties, pharmacies can be added here */}
                                   </>
                               )}

                               <span className="text-sm">Welcome, <span className="font-semibold capitalize">{user?.profile?.firstName || user?.email}</span> ({user?.role.replace('_', ' ')})</span>
                               <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                               <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
                           </>
                       ) : (
                           <>
                               <Link to="/login" className="hover:underline">Login</Link>
                               <Link to="/register" className="hover:underline">Register</Link>
                           </>
                       )}
                   </div>
               </div>
           </nav>
       );
   };

   export default Navbar;