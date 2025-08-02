import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-950 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-white tracking-wide">ExcelAnalyzer</Link>
        <div className="space-x-6">
          <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
          <Link to="/register" className="text-gray-300 hover:text-white transition">Register</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
