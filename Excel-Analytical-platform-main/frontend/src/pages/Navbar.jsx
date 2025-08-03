import React from 'react';
import { Link } from 'react-router-dom';
import { FiGrid } from 'react-icons/fi';

const Navbar = () => {
  return (
    // REASON: The header is positioned absolutely at the top of the page so it can overlay the hero section of the landing page.
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-7xl">
        <Link to="/" className="flex items-center text-2xl font-bold text-gray-800">
          <FiGrid className="mr-2 text-blue-600" />
          ExcelAnalyzer
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/login" className="font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            Login
          </Link>
          <Link to="/register" className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow hover:bg-blue-700 transition-all">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;