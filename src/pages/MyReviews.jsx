import React, { useState, useEffect } from 'react';
   import { reviewService, appointmentService } from '../api/services';
   import { useAuth } from '../context/AuthContext';
   import { format } from 'date-fns';

   const MyReviews = () => {
       const [reviews, setReviews] = useState([]);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);
       const { user, isAuthenticated } = useAuth();

       // State for Create/Edit Review Form
       const [isCreating, setIsCreating] = useState(false);
       const [isEditingId, setIsEditingId] = useState(null); // ID of review being edited

       const [eligibleAppointments, setEligibleAppointments] = useState([]);
       const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
       const [rating, setRating] = useState('');
       const [comment, setComment] = useState('');
       const [isAnonymous, setIsAnonymous] = useState(false);
       const [formMessage, setFormMessage] = useState('');
       const [formLoading, setFormLoading] = useState(false);

       const fetchReviewsAndAppointments = async () => {
           setLoading(true);
           setError(null);
           try {
               const reviewsRes = await reviewService.getPatientReviews(user._id);
               setReviews(reviewsRes.data);

               // For creating new reviews: find completed appointments not yet reviewed
               const appointmentsRes = await appointmentService.getAllAppointments(); // Backend filters by patientId
               const reviewedAppointmentIds = new Set(reviewsRes.data.map(r => r.appointmentId?._id));
               const eligible = appointmentsRes.data.filter(
                   app => app.status === 'completed' && !reviewedAppointmentIds.has(app._id)
               );
               setEligibleAppointments(eligible);

           } catch (err) {
               console.error('Failed to fetch data:', err);
               setError('Failed to load reviews or appointments. Please try again.');
           } finally {
               setLoading(false);
           }
       };

       useEffect(() => {
           if (isAuthenticated && user?.role === 'patient') {
               fetchReviewsAndAppointments();
           }
       }, [isAuthenticated, user]);

       const handleCreateReview = async (e) => {
           e.preventDefault();
           setFormMessage('');
           setFormLoading(true);

           const appointment = eligibleAppointments.find(app => app._id === selectedAppointmentId);
           if (!appointment) {
               setFormMessage('Please select a valid appointment.');
               setFormLoading(false);
               return;
           }

           const reviewData = {
               doctorId: appointment.doctorId._id,
               appointmentId: selectedAppointmentId,
               rating: parseInt(rating),
               comment,
               isAnonymous,
           };

           try {
               await reviewService.createReview(reviewData);
               setFormMessage('Review submitted successfully!');
               // Clear form and reset
               setSelectedAppointmentId('');
               setRating('');
               setComment('');
               setIsAnonymous(false);
               setIsCreating(false);
               fetchReviewsAndAppointments(); // Refresh list
           } catch (err) {
               console.error('Failed to create review:', err.response?.data?.message || err.message);
               setFormMessage(`Failed to create review: ${err.response?.data?.message || 'Server error.'}`);
           } finally {
               setFormLoading(false);
           }
       };

       const handleEditClick = (review) => {
           setIsEditingId(review._id);
           setRating(review.rating);
           setComment(review.comment || '');
           setIsAnonymous(review.isAnonymous);
           // Can't change appointment/doctor for existing review
       };

       const handleUpdateReview = async (e) => {
           e.preventDefault();
           setFormMessage('');
           setFormLoading(true);

           const reviewData = {
               rating: parseInt(rating),
               comment,
               isAnonymous,
           };

           try {
               await reviewService.updateReview(isEditingId, reviewData);
               setFormMessage('Review updated successfully!');
               setIsEditingId(null); // Exit edit mode
               fetchReviewsAndAppointments(); // Refresh list
           } catch (err) {
               console.error('Failed to update review:', err.response?.data?.message || err.message);
               setFormMessage(`Failed to update review: ${err.response?.data?.message || 'Server error.'}`);
           } finally {
               setFormLoading(false);
           }
       };

       const handleDeleteReview = async (reviewId) => {
           if (!window.confirm('Are you sure you want to delete this review?')) return;
           try {
               await reviewService.deleteReview(reviewId);
               setReviews(prev => prev.filter(r => r._id !== reviewId));
               alert('Review deleted successfully!');
               fetchReviewsAndAppointments(); // Refresh lists as doctor's average rating might change
           } catch (err) {
               console.error('Failed to delete review:', err.response?.data?.message || err.message);
               alert(`Failed to delete review: ${err.response?.data?.message || 'Server error.'}`);
           }
       };

       if (!isAuthenticated || user?.role !== 'patient') {
           return <div className="text-center py-8 text-gray-600">This page is for logged-in patients only.</div>;
       }
       if (loading) return <div className="text-center py-8">Loading your reviews...</div>;
       if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

       return (
           <div className="container mx-auto p-4">
               <h1 className="text-3xl font-bold text-gray-800 mb-6">My Reviews</h1>

               {/* Create New Review Section */}
               {!isCreating && eligibleAppointments.length > 0 && (
                   <div className="mb-6 flex justify-end">
                       <button
                           onClick={() => setIsCreating(true)}
                           className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                       >
                           Write a New Review
                       </button>
                   </div>
               )}

               {(isCreating || isEditingId) && (
                   <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                       <h2 className="text-2xl font-bold text-gray-800 mb-4">{isCreating ? 'Write a Review' : 'Edit Review'}</h2>
                       <form onSubmit={isCreating ? handleCreateReview : handleUpdateReview} className="space-y-4">
                           {isCreating && (
                               <div>
                                   <label htmlFor="appointmentSelect" className="block text-sm font-medium text-gray-700">Select Completed Appointment</label>
                                   <select
                                       id="appointmentSelect"
                                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                       value={selectedAppointmentId}
                                       onChange={(e) => setSelectedAppointmentId(e.target.value)}
                                       required
                                   >
                                       <option value="">-- Select an appointment --</option>
                                       {eligibleAppointments.map(app => (
                                           <option key={app._id} value={app._id}>
                                               {format(new Date(app.date), 'MM/dd/yyyy')} with Dr. {app.doctorId?.profile?.firstName} {app.doctorId?.profile?.lastName}
                                           </option>
                                       ))}
                                   </select>
                               </div>
                           )}
                           <div>
                               <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                               <input
                                   type="number"
                                   id="rating"
                                   min="1"
                                   max="5"
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                   value={rating}
                                   onChange={(e) => setRating(e.target.value)}
                                   required
                               />
                           </div>
                           <div>
                               <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment (Optional)</label>
                               <textarea
                                   id="comment"
                                   rows="3"
                                   maxLength="500"
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                   value={comment}
                                   onChange={(e) => setComment(e.target.value)}
                               ></textarea>
                               <p className="text-sm text-gray-500 text-right">{comment.length}/500</p>
                           </div>
                           <div className="flex items-center">
                               <input
                                   id="isAnonymous"
                                   type="checkbox"
                                   className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                   checked={isAnonymous}
                                   onChange={(e) => setIsAnonymous(e.target.checked)}
                               />
                               <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-900">Post Anonymously</label>
                           </div>

                           {formMessage && (
                               <p className={`mt-2 text-sm ${formMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                                   {formMessage}
                               </p>
                           )}

                           <div className="flex space-x-4">
                               <button
                                   type="submit"
                                   className="flex-1 justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                   disabled={formLoading}
                               >
                                   {formLoading ? (isCreating ? 'Submitting...' : 'Updating...') : (isCreating ? 'Submit Review' : 'Save Changes')}
                               </button>
                               <button
                                   type="button"
                                   onClick={() => { setIsCreating(false); setIsEditingId(null); setFormMessage(''); }}
                                   className="flex-1 justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                               >
                                   Cancel
                               </button>
                           </div>
                       </form>
                   </div>
               )}

               {reviews.length === 0 && !isCreating ? (
                   <p className="text-gray-600 text-center text-lg">You have not submitted any reviews yet.</p>
               ) : (
                   <div className="space-y-6">
                       {reviews.map((review) => (
                           <div key={review._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                               <div className="flex justify-between items-start mb-2">
                                   <div>
                                       <h3 className="text-lg font-semibold text-gray-900">
                                           Review for Dr. {review.doctorId?.profile?.firstName} {review.doctorId?.profile?.lastName}
                                       </h3>
                                       <p className="text-sm text-gray-600">
                                           On: {format(new Date(review.createdAt), 'MM/dd/yyyy')}
                                           {' '} (Appointment on: {review.appointmentId?.date ? format(new Date(review.appointmentId.date), 'MM/dd/yyyy') : 'N/A'})
                                       </p>
                                   </div>
                                   <div className="text-2xl font-bold text-yellow-600">
                                       {review.rating} / 5 <span className="text-gray-500 text-base">⭐</span>
                                   </div>
                               </div>
                               <p className="text-gray-800 italic mt-2">{review.comment}</p>
                               <p className="text-sm text-gray-600 mt-2">Status: {review.isAnonymous ? 'Anonymous' : 'Public'}</p>

                               <div className="mt-4 flex space-x-2 justify-end">
                                   {isEditingId !== review._id && (
                                       <button
                                           onClick={() => handleEditClick(review)}
                                           className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-3 rounded"
                                       >
                                           Edit
                                       </button>
                                   )}
                                   <button
                                       onClick={() => handleDeleteReview(review._id)}
                                       className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded"
                                   >
                                       Delete
                                   </button>
                               </div>
                           </div>
                       ))}
                   </div>
               )}
           </div>
       );
   };

   export default MyReviews;