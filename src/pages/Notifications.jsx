import React, { useState, useEffect } from 'react';
   import { notificationService } from '../api/services';
   import { useAuth } from '../context/AuthContext';
   import { formatDistanceToNow, parseISO } from 'date-fns'; // You'll need to install date-fns

   const Notifications = () => {
       const [notifications, setNotifications] = useState([]);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);
       const { isAuthenticated } = useAuth();

       const fetchNotifications = async () => {
           setLoading(true);
           setError(null);
           try {
               const res = await notificationService.getMyNotifications();
               setNotifications(res.data);
           } catch (err) {
               console.error('Failed to fetch notifications:', err);
               setError('Failed to load notifications. Please log in.');
           } finally {
               setLoading(false);
           }
       };

       useEffect(() => {
           if (isAuthenticated) {
               fetchNotifications();
           }
       }, [isAuthenticated]);

       const handleMarkAsRead = async (id) => {
           try {
               await notificationService.markNotificationAsRead(id);
               setNotifications(prev => prev.map(notif =>
                   notif._id === id ? { ...notif, isRead: true } : notif
               ));
           } catch (err) {
               console.error('Failed to mark as read:', err);
               alert('Failed to mark notification as read.');
           }
       };

       const handleMarkAllAsRead = async () => {
           if (!window.confirm('Are you sure you want to mark all notifications as read?')) return;
           try {
               await notificationService.markAllNotificationsAsRead();
               setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
               alert('All notifications marked as read!');
           } catch (err) {
               console.error('Failed to mark all as read:', err);
               alert('Failed to mark all notifications as read.');
           }
       };

       const handleDeleteNotification = async (id) => {
           if (!window.confirm('Are you sure you want to delete this notification?')) return;
           try {
               await notificationService.deleteNotification(id);
               setNotifications(prev => prev.filter(notif => notif._id !== id));
               alert('Notification deleted!');
           } catch (err) {
               console.error('Failed to delete notification:', err);
               alert('Failed to delete notification.');
           }
       };

       if (!isAuthenticated) return <div className="text-center py-8 text-gray-600">Please log in to view your notifications.</div>;
       if (loading) return <div className="text-center py-8">Loading notifications...</div>;
       if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

       return (
           <div className="container mx-auto p-4">
               <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Notifications</h1>

               {notifications.length > 0 && (
                   <div className="flex justify-end mb-4">
                       <button
                           onClick={handleMarkAllAsRead}
                           className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-2 px-4 rounded"
                       >
                           Mark All as Read
                       </button>
                   </div>
               )}

               {notifications.length === 0 ? (
                   <p className="text-gray-600 text-center text-lg">You have no new notifications.</p>
               ) : (
                   <div className="space-y-4">
                       {notifications.map((notif) => (
                           <div
                               key={notif._id}
                               className={`bg-white rounded-lg shadow-md p-5 border-l-4 ${notif.isRead ? 'border-gray-300' : 'border-blue-500'}`}
                           >
                               <div className="flex justify-between items-start">
                                   <div>
                                       <h3 className={`text-lg font-semibold ${notif.isRead ? 'text-gray-600' : 'text-blue-800'}`}>
                                           {notif.type.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}
                                       </h3>
                                       <p className={`text-gray-800 ${notif.isRead ? 'font-normal' : 'font-medium'}`}>{notif.message}</p>
                                       {notif.link && (
                                           <a href={notif.link} className="text-blue-500 hover:underline text-sm">View Details</a>
                                       )}
                                       <p className="text-xs text-gray-500 mt-1">
                                           {formatDistanceToNow(parseISO(notif.sentAt), { addSuffix: true })}
                                       </p>
                                   </div>
                                   <div className="flex space-x-2">
                                       {!notif.isRead && (
                                           <button
                                               onClick={() => handleMarkAsRead(notif._id)}
                                               className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded"
                                           >
                                               Mark as Read
                                           </button>
                                       )}
                                       <button
                                           onClick={() => handleDeleteNotification(notif._id)}
                                           className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded"
                                       >
                                           Delete
                                       </button>
                                   </div>
                               </div>
                           </div>
                       ))}
                   </div>
               )}
           </div>
       );
   };

   export default Notifications;