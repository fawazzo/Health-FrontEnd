import api from './api';

// --- User/Auth Services (Already handled by AuthContext, but adding for completeness) ---
export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
};

// --- Hospital Services ---
export const hospitalService = {
    getAllHospitals: () => api.get('/hospitals'),
    getHospitalById: (id) => api.get(`/hospitals/${id}`),
    createHospital: (hospitalData) => api.post('/hospitals', hospitalData), // Admin only
    updateHospital: (id, hospitalData) => api.put(`/hospitals/${id}`, hospitalData), // Admin only
    deleteHospital: (id) => api.delete(`/hospitals/${id}`), // Admin only
};

// --- Specialty Services ---
export const specialtyService = {
    getAllSpecialties: () => api.get('/specialties'),
    getSpecialtyById: (id) => api.get(`/specialties/${id}`),
    createSpecialty: (specialtyData) => api.post('/specialties', specialtyData), // Admin only
    updateSpecialty: (id, specialtyData) => api.put(`/specialties/${id}`, specialtyData), // Admin only
    deleteSpecialty: (id) => api.delete(`/specialties/${id}`), // Admin only
};

// --- Doctor Services ---
export const doctorService = {
    getAllDoctors: (params) => api.get('/doctors', { params }), // params can include specialty, hospitalId, name, city
    getDoctorById: (id) => api.get(`/doctors/${id}`),
    getDoctorAvailability: (doctorId, hospitalId, date) => api.get(`/doctors/${doctorId}/availability/${hospitalId}/${date}`),
    setDoctorAvailability: (availabilityData) => api.post('/doctors/availability', availabilityData), // Doctor/Hospital_Admin
    getMyAvailability: (params) => api.get('/doctors/my-availability', { params }), // Doctor/Hospital_Admin
    toggleAvailabilityPublishStatus: (id, isPublished) => api.put(`/doctors/availability/${id}/publish`, { isPublished }), // Doctor/Hospital_Admin
};

// --- Appointment Services ---
export const appointmentService = {
    getAllAppointments: () => api.get('/appointments'), // For patient/doctor/admin based on role
    getAppointmentById: (id) => api.get(`/appointments/${id}`),
    bookAppointment: (appointmentData) => api.post('/appointments', appointmentData), // Patient only
    updateAppointmentStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }), // Patient/Doctor/Admin
    addAppointmentNotes: (id, notes) => api.put(`/appointments/${id}/notes`, { notes }), // Doctor only
};

// --- Medical Record Services (Placeholder for Part 3) ---
export const medicalRecordService = {
    getMedicalRecords: () => api.get('/medicalrecords'),
    getMedicalRecordById: (id) => api.get(`/medicalrecords/${id}`),
    uploadMedicalRecord: (formData) => api.post('/medicalrecords', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateMedicalRecord: (id, data) => api.put(`/medicalrecords/${id}`, data),
    deleteMedicalRecord: (id) => api.delete(`/medicalrecords/${id}`),
};

// --- Prescription Services (Placeholder for Part 3) ---
export const prescriptionService = {
    getPrescriptions: () => api.get('/prescriptions'),
    getPrescriptionById: (id) => api.get(`/prescriptions/${id}`),
    createPrescription: (data) => api.post('/prescriptions', data),
    updatePrescription: (id, data) => api.put(`/prescriptions/${id}`, data),
    deletePrescription: (id) => api.delete(`/prescriptions/${id}`), // Admin only
};

// --- Review Services (Placeholder for Part 3) ---
export const reviewService = {
    getDoctorReviews: (doctorId) => api.get(`/reviews/doctor/${doctorId}`),
    getPatientReviews: (patientId) => api.get(`/reviews/patient/${patientId}`),
    createReview: (data) => api.post('/reviews', data),
    updateReview: (id, data) => api.put(`/reviews/${id}`, data),
    deleteReview: (id) => api.delete(`/reviews/${id}`),
};

// --- Notification Services (Placeholder for Part 3) ---
export const notificationService = {
    getMyNotifications: () => api.get('/notifications'),
    markNotificationAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllNotificationsAsRead: () => api.put('/notifications/mark-all-read'),
    deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// --- Pharmacy Services (Placeholder for Part 3) ---
export const pharmacyService = {
    getAllPharmacies: (params) => api.get('/pharmacies', { params }),
    getPharmacyById: (id) => api.get(`/pharmacies/${id}`),
    createPharmacy: (data) => api.post('/pharmacies', data),
    updatePharmacy: (id, data) => api.put(`/pharmacies/${id}`, data),
    deletePharmacy: (id) => api.delete(`/pharmacies/${id}`), // Admin only
};