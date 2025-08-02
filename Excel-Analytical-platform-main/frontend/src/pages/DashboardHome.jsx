// frontend/src/pages/DashboardHome.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ExcelUpload from '../components/ExcelUpload';
import ExcelChart from '../components/ExcelChart';

const DashboardHome = () => {
  // Access excelData and handleDataParsed from context
  const { excelData, handleDataParsed, setExcelData, setColumnHeaders } = useOutletContext();

  const handleFileUploadAndParsing = (data) => {
    if (data && data.length > 0) {
      // Assuming the first row contains headers
      const headers = Object.keys(data[0]);
      setColumnHeaders(headers); // Set headers in context
      setExcelData(data); // Set data in context
    } else {
      setColumnHeaders([]);
      setExcelData([]);
    }
  };

  return (
    <div>
      {/* Excel Upload Section */}
      <div className="bg-white rounded-md shadow-md p-6 mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Upload Excel File</h2>
        {/* Pass the new handler to ExcelUpload */}
        <ExcelUpload onDataParsed={handleFileUploadAndParsing} />
      </div>

      {/* Default Chart rendering section */}
      {excelData && excelData.length > 0 && (
        <div className="bg-white rounded-md shadow-md p-6 border border-gray-200">
           <h2 className="text-2xl font-semibold mb-4 text-blue-700">Data Visualization</h2>
          <ExcelChart data={excelData} />
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
