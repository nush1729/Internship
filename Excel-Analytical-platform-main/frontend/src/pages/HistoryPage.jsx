import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiClock, FiTrash2, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // REASON: useEffect is the standard, modern way to fetch data when a component loads.
  // The logic is concise but powerful. It fetches the history and handles loading/error states.
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/files/history');
        setHistory(res.data);
      } catch (err) {
        toast.error('Failed to fetch file history.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []); // The empty array [] ensures this runs only once.

  // REASON: The delete function is clear and handles user confirmation, API calls, and UI updates.
  const handleDelete = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file? This action is permanent.')) {
      try {
        await api.delete(`/files/history/${fileId}`);
        setHistory(currentHistory => currentHistory.filter(file => file._id !== fileId));
        toast.success('File deleted successfully.');
      } catch (err) {
        toast.error('Failed to delete file.');
      }
    }
  };

  if (isLoading) return <div className="text-center p-10">Loading history...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FiClock className="mr-3 text-indigo-600" /> Upload History
      </h2>
      <div className="overflow-x-auto">
        {history.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">File Name</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Upload Date</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">File Size</th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {history.map(file => (
                <tr key={file._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center"><FiFileText className="mr-2 text-gray-400" />{file.originalName}</td>
                  <td className="py-3 px-4">{new Date(file.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-4">{(file.size / 1024).toFixed(2)} KB</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleDelete(file._id)} className="text-red-500 hover:text-red-700">
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-gray-500">You have not uploaded any files yet.</div>
        )}
      </div>
    </div>
  );
};
export default HistoryPage;