import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiBox, FiClock, FiUser, FiLogOut, FiGrid, FiBarChart } from 'react-icons/fi';
import { useAuth } from './AuthContext';

const SidebarLink = ({ to, icon, children }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center py-3 px-4 my-1 transition-colors duration-200 rounded-lg ${
        isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'
      }`
    }
  >
    {icon}
    <span className="mx-4 font-medium">{children}</span>
  </NavLink>
);

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-md">
      <div className="flex items-center justify-center h-20 border-b">
        <FiGrid className="h-6 w-6 text-blue-600" />
        <span className="ml-2 text-xl font-bold text-gray-800">ExcelAnalyzer</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <nav>
          <SidebarLink to="/dashboard" icon={<FiHome className="h-5 w-5" />}>Dashboard</SidebarLink>
          <SidebarLink to="/dashboard/charts" icon={<FiBarChart className="h-5 w-5" />}>2D Charts</SidebarLink>
          <SidebarLink to="/dashboard/3d-chart" icon={<FiBox className="h-5 w-5" />}>3D Chart</SidebarLink>
          <SidebarLink to="/dashboard/history" icon={<FiClock className="h-5 w-5" />}>History</SidebarLink>
          <SidebarLink to="/dashboard/profile" icon={<FiUser className="h-5 w-5" />}>Profile</SidebarLink>
        </nav>
      </div>
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center w-full py-3 px-4 text-gray-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors duration-200"
        >
          <FiLogOut className="h-5 w-5" />
          <span className="mx-4 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;