import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 👈 Added role
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Store login data
    localStorage.setItem('username', email);
    localStorage.setItem('role', role); // 👈 Save selected role
    localStorage.setItem("userId", response.data.user._id); 
localStorage.setItem("username", response.data.user.username);
localStorage.setItem("role", response.data.user.role);



    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-300">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* 👇 Admin/User Role Dropdown */}
            <div className="mb-6">
              <label htmlFor="role" className="block text-gray-700 text-sm font-medium mb-2">Login As</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-semibold text-lg transition duration-300 ease-in-out shadow-md"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/forgot-password" className="text-blue-800 hover:underline text-sm">Forgot Password?</Link>
          </div>
          <div className="mt-4 text-center">
            <span className="text-gray-600 text-sm">Don't have an account? </span>
            <Link to="/register" className="text-blue-800 hover:underline text-sm font-semibold">Register Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
