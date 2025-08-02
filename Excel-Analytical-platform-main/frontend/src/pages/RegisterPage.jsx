import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // default role is user

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      localStorage.setItem('username', email);
      localStorage.setItem('role', role); // store role
      // You can also send `role` to your backend here if needed
      navigate('/login');
    } else {
      alert('Passwords do not match');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-300">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Register</h2>
          <form onSubmit={handleRegister}>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* 👇 Role Dropdown */}
            <div className="mb-6">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Register as</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-semibold text-lg"
            >
              Register
            </button>

            {/* Link to Login */}
            <div className="text-center mt-4">
              <Link to="/login" className="text-blue-600 hover:underline text-sm">Already have an account? Login here.</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
