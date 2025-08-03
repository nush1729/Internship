import React from 'react';
import { useNavigate } from 'react-router-dom';
import ExcelUpload from '../components/ExcelUpload';
import { FiUpload, FiBarChart } from 'react-icons/fi';
// REASON: The import is now corrected to 'useAuth'.
import { useAuth } from '../components/AuthContext';

const DashboardHome = () => {
  const navigate = useNavigate();
  // REASON: The context hook is now correctly called 'useAuth'.
  const { excelData } = useAuth();

  const handleUploadSuccess = () => {
    navigate('/dashboard/charts');
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <FiUpload className="mr-3 text-blue-600" />
          Upload New Excel File
        </h2>
        <p className="text-gray-600 mb-4">Upload a file here to begin your analysis. After uploading, you will be taken to the charting page.</p>
        <ExcelUpload onUploadSuccess={handleUploadSuccess} />
      </div>
      {excelData && excelData.length > 0 && (
          <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200 flex items-center justify-between">
              <p className="text-green-800 font-semibold">Data is ready for charting!</p>
              <button onClick={() => navigate('/dashboard/charts')} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-700 transition-all flex items-center">
                  <FiBarChart className="mr-2" />
                  Go to Charts
              </button>
          </div>
      )}
    </div>
  );
};
export default DashboardHome;