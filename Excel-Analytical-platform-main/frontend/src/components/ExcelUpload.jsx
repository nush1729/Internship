import React, { useState } from "react";
import * as XLSX from "xlsx";
// Import the upload icon (install react-icons if you haven't already)
import { FiUploadCloud } from 'react-icons/fi';


const ExcelUpload = ({ onDataParsed }) => {
  const [fileName, setFileName] = useState("");
   const [isDragging, setIsDragging] = useState(false); // State to track dragging

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);
      onDataParsed(json); // send parsed data back to parent
    };
    reader.readAsBinaryString(file);
  };

   // Handle drag and drop events for visual feedback
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add a visual cue when hovering over
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload({ target: { files: [file] } }); // Process the dropped file
    }
  };


  return (
     // Removed the extra heading h2 "Upload Excel File" as it's in the parent
    <div
      className={`w-full p-6 text-center border-2 border-dashed rounded-lg transition ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`} // Dynamic border and background
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        hidden
        id="excel-upload-input" // Add an ID for the label
      />
      {/* Use a label to associate the text/icon with the hidden input */}
      <label htmlFor="excel-upload-input" className="cursor-pointer flex flex-col items-center justify-center">
         {/* Add an Excel-like icon */}
         <FiUploadCloud className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 font-semibold mb-1">Drag and drop an Excel file here</p>
        <p className="text-gray-500 text-sm mb-2">or click to select a file</p>
        {/* Display the selected file name */}
        {fileName && <p className="text-blue-700 font-medium">{fileName}</p>}
      </label>
    </div>
  );
};

export default ExcelUpload;
