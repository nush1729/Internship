import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const UserDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* REASON: The Outlet will now correctly render child components that can access the context
              because the provider is at the top level in main.jsx. */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default UserDashboard;