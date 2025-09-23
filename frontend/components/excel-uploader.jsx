// components/excel-uploader.jsx
import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const ExcelUploader = () => {
  const [headers, setHeaders] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);
      setDataRows(rows);
      if (rows.length) setHeaders(Object.keys(rows[0]));
    };
    reader.readAsBinaryString(file);
  };

  const xData = dataRows.map((row) => row[xKey]);
  const yData = dataRows.map((row) => parseFloat(row[yKey])).filter((val) => !isNaN(val));

  const chartData = {
    labels: xData,
    datasets: [
      {
        label: `${yKey} vs ${xKey}`,
        data: yData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `${yKey} vs ${xKey}`
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xKey
        }
      },
      y: {
        title: {
          display: true,
          text: yKey
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="p-6 bg-yellow-300 min-h-screen">
      <h2 className="text-xl font-bold mb-4">📊 Excel Analytics Dashboard</h2>

      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {headers.length > 0 && (
        <div className="mb-4">
          <label className="mr-2">X-Axis:</label>
          <select onChange={(e) => setXKey(e.target.value)} className="mr-4 p-2">
            {headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>

          <label className="mr-2">Y-Axis:</label>
          <select onChange={(e) => setYKey(e.target.value)} className="p-2">
            {headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
      )}

      {xKey && yKey && <Line data={chartData} options={chartOptions} />}
    </div>
  );
};

export default ExcelUploader;
