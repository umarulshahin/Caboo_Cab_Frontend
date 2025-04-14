// src/pages/ErrorPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ message = "Oops! Something went wrong." }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
      <p className="text-lg text-white mb-6">{message}</p>
      <button
        onClick={() => navigate(-1)}
        className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default ErrorPage;
