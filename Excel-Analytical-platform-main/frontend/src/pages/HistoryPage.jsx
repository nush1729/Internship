import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`/api/files/history/${userId}`);
        setHistory(response.data.files || []);
      } catch (err) {
        setError('Failed to fetch history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchHistory();
    } else {
      setError('User not logged in.');
      setLoading(false);
    }
  }, [userId]);

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`/api/files/delete/${userId}/${fileId}`);
      setHistory((prev) => prev.filter(file => file._id !== fileId));
    } catch (err) {
      setError('Failed to delete file.');
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Upload History</h2>

      {loading && <p>Loading history...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {history.length === 0 ? (
            <p className="text-gray-600">No history found.</p>
          ) : (
            <ul className="space-y-3">
              {history.map((file) => (
                <li
                  key={file._id}
                  className="flex justify-between items-center bg-gray-50 border border-gray-200 px-4 py-3 rounded-md"
                >
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryPage;
