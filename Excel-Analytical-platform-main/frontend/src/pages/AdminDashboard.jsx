import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FiUsers, FiTrash2, FiShield } from 'react-icons/fi';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // REASON: This function fetches all user data from the new admin endpoint when the component loads.
  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      // REASON: If the current user is not an admin, the API will return a 403 Forbidden error.
      toast.error(err.response?.data?.msg || 'Failed to fetch users. You may not have admin rights.');
    } finally {
      setIsLoading(false);
    }
  };

  // REASON: useEffect runs the fetchUsers function once when the component is first rendered.
  useEffect(() => {
    fetchUsers();
  }, []);

  // REASON: This function handles the user deletion logic.
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        // REASON: Updates the UI instantly by removing the deleted user from the state.
        setUsers(users.filter(user => user._id !== userId));
        toast.success('User deleted successfully.');
      } catch (err) {
        toast.error('Failed to delete user.');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading Admin Panel...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FiShield className="mr-3 text-red-600" />
        Admin Panel - User Management
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map(user => (
              <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  {/* REASON: We add a check to prevent an admin from deleting their own account. */}
                  {user.role !== 'admin' && (
                    <button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-700">
                      <FiTrash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;