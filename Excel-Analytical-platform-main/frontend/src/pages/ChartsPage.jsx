import React from 'react';
import ExcelChart from '../components/ExcelChart';
import { FiBarChart2 } from 'react-icons/fi';
// REASON: The import is now corrected to 'useAuth'.
import { useAuth } from '../components/AuthContext';
import { Link } from 'react-router-dom';

const ChartsPage = () => {
  // REASON: The context hook is now correctly called 'useAuth' and correctly provides excelData.
  const { excelData, fileName } = useAuth();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <FiBarChart2 className="mr-3 text-green-600" />
        2D Data Visualization
      </h2>
      {excelData && excelData.length > 0 ? (
        <>
            <p className="text-gray-600 mb-4">Visualizing data from: <span className="font-semibold text-gray-800">{fileName}</span></p>
            <ExcelChart />
        </>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p className="mb-4">No data to display.</p>
          <Link to="/dashboard" className="text-blue-600 hover:underline font-semibold">
            Please upload an Excel file on the Dashboard home page first.
          </Link>
        </div>
      )}
    </div>
  );
};
export default ChartsPage;