import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../api/axios';
// REASON: The import is now corrected to 'useAuth'.
import { useAuth } from './AuthContext';

const ExcelUpload = ({ onUploadSuccess }) => {
  // REASON: Destructuring the setters from the correctly named 'useAuth' hook.
  const { setExcelData, setColumnHeaders, setFileName, fileName } = useAuth();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const toastId = toast.loading("Uploading and processing file...");
    try {
      const res = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setExcelData(res.data.data);
      setColumnHeaders(Object.keys(res.data.data[0] || {}));
      setFileName(file.name);
      toast.update(toastId, { render: "File processed successfully!", type: "success", isLoading: false, autoClose: 3000 });
      // REASON: This calls the function passed from the parent component upon success.
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      toast.update(toastId, { render: "Error uploading file. Please try again.", type: "error", isLoading: false, autoClose: 3000 });
    }
  }, [setExcelData, setColumnHeaders, setFileName, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-6 text-center border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center">
        <FiUploadCloud className="w-12 h-12 text-gray-400 mb-3" />
        {isDragActive ? (
          <p className="text-blue-600 font-semibold">Drop the file here ...</p>
        ) : (
          <>
            <p className="text-gray-600 font-semibold mb-1">Drag & drop your Excel file here, or click to select</p>
            <p className="text-gray-500 text-sm">Supports .xlsx and .xls</p>
            {fileName && <p className="text-green-600 font-medium mt-2">Loaded: {fileName}</p>}
          </>
        )}
      </div>
    </div>
  );
};
export default ExcelUpload;