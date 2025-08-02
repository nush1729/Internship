// frontend/src/pages/ChartsPage.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);


const ChartsPage = () => {
  const { excelData, columnHeaders } = useOutletContext();
  const [selectedLabelColumn, setSelectedLabelColumn] = useState('');
  const [selectedDataColumn, setSelectedDataColumn] = useState('');

  useEffect(() => {
      if (columnHeaders && columnHeaders.length > 1) {
          // Attempt to pre-select a text column for labels and a numerical for data
          const textColumn = columnHeaders.find(header => {
              if (excelData && excelData.length > 1) {
                   // Check the type of data in the second row (after header)
                   const sampleValue = excelData[1][header];
                   return typeof sampleValue === 'string';
              }
              return false;
          });
           const numberColumn = columnHeaders.find(header => {
              if (excelData && excelData.length > 1) {
                   const sampleValue = excelData[1][header];
                   return typeof sampleValue === 'number' || parseFloat(sampleValue); // Check if parsable to number
              }
              return false;
          });

          setSelectedLabelColumn(textColumn || columnHeaders[0]);
          setSelectedDataColumn(numberColumn || (columnHeaders.length > 1 ? columnHeaders[1] : ''));

      } else if (columnHeaders && columnHeaders.length > 0) {
           setSelectedLabelColumn(columnHeaders[0]);
           setSelectedDataColumn('');
      }


  }, [columnHeaders, excelData]); // Re-run when data or headers change


  // Prepare data for Chart.js
  const chartData = {
    labels: excelData.slice(1).map(row => row[selectedLabelColumn]), // Use selected column for labels
    datasets: [
      {
        label: selectedDataColumn || 'Data', // Use selected column name as dataset label
        data: excelData.slice(1).map(row => parseFloat(row[selectedDataColumn])).filter(value => !isNaN(value)), // Use selected column for data
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

   // Options for the charts
   const chartOptions = {
       responsive: true,
       maintainAspectRatio: false,
       plugins: {
           legend: {
               position: 'top',
           },
           title: {
               display: true,
               text: `${selectedDataColumn || 'Data'} by ${selectedLabelColumn || 'Label'}`,
           },
       },
       scales: {
            x: {
                 title: {
                     display: true,
                     text: selectedLabelColumn || 'Label',
                 }
             },
             y: {
                 title: {
                     display: true,
                     text: selectedDataColumn || 'Data',
                 }
             }
       }
   };


  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">2D Charts</h2>

      {excelData && excelData.length > 0 && columnHeaders && columnHeaders.length > 0 ? (
          <>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="labelColumn" className="block text-gray-700 text-sm font-bold mb-2">
                  Select Label Column:
                </label>
                <select
                  id="labelColumn"
                  value={selectedLabelColumn}
                  onChange={(e) => setSelectedLabelColumn(e.target.value)}
                  className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                >
                  <option value="">-- Select Column --</option>
                  {columnHeaders.map((header) => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="dataColumn" className="block text-gray-700 text-sm font-bold mb-2">
                  Select Data Column:
                </label>
                <select
                  id="dataColumn"
                  value={selectedDataColumn}
                  onChange={(e) => setSelectedDataColumn(e.target.value)}
                  className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                >
                   <option value="">-- Select Column --</option>
                  {columnHeaders.map((header) => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedLabelColumn && selectedDataColumn && chartData.labels.length > 0 && chartData.datasets[0].data.length > 0 ? (
                 <div className="mt-8">
                     <h3 className="text-xl font-semibold mb-4 text-blue-700">Bar Chart</h3>
                     <div style={{ height: '400px' }}> {/* Give chart a height */}
                         <Bar data={chartData} options={chartOptions} />
                     </div>

                     <h3 className="text-xl font-semibold mb-4 mt-8 text-blue-700">Line Chart</h3>
                      <div style={{ height: '400px' }}> {/* Give chart a height */}
                         <Line data={chartData} options={chartOptions} />
                     </div>
                 </div>
            ) : (
                 <p>Select both a Label column and a Data column to see charts.</p>
            )}

          </>
      ) : (
        <p>Please upload an Excel file on the Dashboard Home page to generate charts.</p>
      )}
    </div>
  );
};

export default ChartsPage;
