import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
      <h1 className="text-5xl font-extrabold mb-6 animate-fade-in-down">
        Welcome to HealthLink Connect
      </h1>
      <p className="text-xl text-center mb-8 max-w-2xl opacity-90 animate-fade-in">
        Your comprehensive platform for managing healthcare appointments, medical records, and more.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-800 transition duration-300 transform hover:scale-105"
        >
          Register
        </Link>
      </div>
      {/* Simple animation added via custom keyframes in index.css or direct tailwind config if complex */}
      <style jsx>{`
         @keyframes fadeInDown {
             from { opacity: 0; transform: translateY(-20px); }
             to { opacity: 1; transform: translateY(0); }
         }
         @keyframes fadeIn {
             from { opacity: 0; }
             to { opacity: 1; }
         }
         .animate-fade-in-down {
             animation: fadeInDown 1s ease-out;
         }
         .animate-fade-in {
             animation: fadeIn 1.5s ease-out;
         }
      `}</style>
    </div>
  );
};

export default Home;