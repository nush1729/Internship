// frontend/src/components/Sidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navItemClass = (path) =>
    `text-gray-700 hover:text-blue-700 cursor-pointer transition duration-150 ease-in-out ${
      location.pathname === path ? "font-bold text-blue-700" : ""
    }`;

  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-md p-4 flex flex-col justify-between text-gray-800 border-r border-gray-200">
      <div>
        <h2
          className="text-xl font-bold text-blue-800 mb-6 truncate"
          title={username}
        >
          Hi, {username} 👋
        </h2>

        <ul className="space-y-4">
          <li onClick={() => navigate("/dashboard")} className={navItemClass("/dashboard")}>
            Dashboard
          </li>
          <li onClick={() => navigate("/dashboard/3dchart")} className={navItemClass("/dashboard/3dchart")}>
            3D Chart
          </li>
          <li onClick={() => navigate("/dashboard/profile")} className={navItemClass("/dashboard/profile")}>
            Profile
          </li>
          <li onClick={() => navigate("/dashboard/history")} className={navItemClass("/dashboard/history")}>
            History
          </li>

          {role === "admin" && (
            <li
              onClick={() => navigate("/dashboard/admin")}
              className="text-red-600 hover:text-red-800 cursor-pointer transition duration-150 ease-in-out font-semibold"
            >
              Admin Panel
            </li>
          )}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 mt-6 rounded-md hover:bg-red-700 transition duration-300 ease-in-out font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
