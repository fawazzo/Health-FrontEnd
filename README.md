# 🌐 HealthLink Connect - Frontend

HealthLink Connect is a **comprehensive healthcare management platform** designed for **patients, doctors, hospitals, and pharmacies**.  
This repository contains the **frontend** of the application, built with **React + Vite** for speed and scalability.

---

## ✨ Features

### 🔑 Authentication & Roles
- Secure **Login & Registration**  
- **Role-based Access**: Patient, Doctor, Admin, Hospital Admin, Pharmacy Admin  

### 📊 Dashboards
- Personalized **role-specific dashboards** with relevant data & shortcuts  

### 🔍 Browse & Search
- **Doctors**: by name, specialty, or hospital  
- **Hospitals**: services, departments, details  
- **Pharmacies**: by name, city, or geolocation  
- **Specialties**: explore medical fields  

### 📅 Appointment Management
- **Patients**: Book, view, and cancel appointments  
- **Doctors**: Confirm, complete, cancel, add consultation notes  
- **Admins**: Oversee all appointments  

### 📂 Medical Records
- **Patients**: Upload, view, edit, and share access  
- **Doctors**: Access patient records with permission  
- **Admins**: Full management rights  

### 💊 Prescription System
- **Patients**: View prescriptions (active & past)  
- **Doctors**: Issue & update prescriptions, send to pharmacies  
- **Pharmacy Admin**: Manage prescription fulfillment *(future)*  
- **Admins**: Oversight across all prescriptions  

### ⭐ Reviews
- **Patients**: Leave reviews for doctors  
- **Doctors**: View patient feedback  

### 🔔 Notifications
- Real-time alerts & updates  

### 📱 Responsive Design
- **Tailwind CSS** for a modern, mobile-first UI  

---

## 🛠️ Tech Stack

- ⚛️ **React** – UI library  
- ⚡ **Vite** – Fast dev/build tool  
- 🎨 **Tailwind CSS** – Utility-first styling  
- 🌐 **Axios** – API requests  
- 🔀 **React Router DOM** – Routing  
- 🗓️ **date-fns** & **react-datepicker** – Date management  

---

## 🚀 Getting Started

### 📌 Prerequisites
- **Node.js** (LTS recommended)  
- **npm** or **Yarn**  

### 📥 Installation
```bash
# Clone the repo
git clone https://github.com/your-username/Health-FrontEnd.git
cd Health-FrontEnd

# Install dependencies
npm install
# or
yarn install
```

### ⚙️ Environment Setup
Create a `.env` file in the project root:  
```env
VITE_BACKEND_API_URL=http://localhost:5000/api
```
Replace with your backend API URL.

### ▶️ Run Locally
```bash
npm run dev
# or
yarn dev
```
Access at: [http://localhost:5173](http://localhost:5173)

### 📦 Production Build
```bash
npm run build
# or
yarn build
```
Outputs to `/dist`.

---

## 📂 Project Structure
```
Health-FrontEnd/
├── src/
│   ├── api/          # API services
│   ├── assets/       # Images & static files
│   ├── components/   # Reusable UI components
│   │   ├── dashboards/
│   │   ├── Navbar.jsx
│   │   └── PrivateRoute.jsx
│   ├── context/      # Global state (e.g., Auth)
│   ├── pages/        # Route-level pages
│   ├── App.jsx       # Main app
│   └── main.jsx      # Entry point
├── package.json
├── vite.config.js
└── README.md
```

---

## 🤝 Contributing
We welcome contributions!  
- Open an **issue** for suggestions  
- Submit a **pull request** for improvements  

---

## 📜 License
Licensed under the **MIT License**.  
Feel free to use, modify, and share.

---

💡 *HealthLink Connect — making healthcare simpler, smarter, and more connected.*
