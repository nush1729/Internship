import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2">Sorry, the page you are looking for does not exist.</p>
      <Link
        to="/"
        className="mt-6 bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow hover:bg-blue-700 transition-all"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;