import React, { useState, useEffect } from 'react';
   import { useParams } from 'react-router-dom';
   import { reviewService, doctorService } from '../api/services';
   import { format } from 'date-fns';

   const DoctorReviews = () => {
       const { doctorId } = useParams();
       const [doctor, setDoctor] = useState(null);
       const [reviews, setReviews] = useState([]);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);

       useEffect(() => {
           const fetchDoctorAndReviews = async () => {
               setLoading(true);
               setError(null);
               try {
                   const doctorRes = await doctorService.getDoctorById(doctorId);
                   setDoctor(doctorRes.data);
                   const reviewsRes = await reviewService.getDoctorReviews(doctorId);
                   setReviews(reviewsRes.data);
               } catch (err) {
                   console.error('Failed to fetch doctor or reviews:', err);
                   setError('Could not load doctor reviews. Doctor not found or server error.');
               } finally {
                   setLoading(false);
               }
           };
           fetchDoctorAndReviews();
       }, [doctorId]);

       if (loading) return <div className="text-center py-8">Loading reviews...</div>;
       if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
       if (!doctor) return <div className="text-center py-8 text-gray-600">Doctor not found.</div>;

       return (
           <div className="container mx-auto p-4">
               <h1 className="text-3xl font-bold text-gray-800 mb-6">Reviews for Dr. {doctor.profile.firstName} {doctor.profile.lastName}</h1>
               {reviews.length === 0 ? (
                   <p className="text-gray-600 text-lg text-center">No reviews available for this doctor yet.</p>
               ) : (
                   <div className="space-y-6">
                       {reviews.map((review) => (
                           <div key={review._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                               <div className="flex justify-between items-center mb-2">
                                   <div>
                                       <p className="text-lg font-semibold text-gray-900">
                                           {review.isAnonymous ? 'Anonymous Patient' : `${review.patientId?.profile?.firstName} ${review.patientId?.profile?.lastName}`}
                                       </p>
                                       <p className="text-sm text-gray-600">
                                           Reviewed on: {format(new Date(review.createdAt), 'MM/dd/yyyy')}
                                       </p>
                                       <p className="text-sm text-gray-600">
                                           Appointment Date: {review.appointmentId?.date ? format(new Date(review.appointmentId.date), 'MM/dd/yyyy') : 'N/A'}
                                       </p>
                                   </div>
                                   <div className="text-2xl font-bold text-yellow-600">
                                       {review.rating} / 5 <span className="text-gray-500 text-base">⭐</span>
                                   </div>
                               </div>
                               <p className="text-gray-800 italic mt-2">{review.comment}</p>
                           </div>
                       ))}
                   </div>
               )}
           </div>
       );
   };

   export default DoctorReviews;