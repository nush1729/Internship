import React, { useState, useRef, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Select from 'react-select';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import { FiDownload, FiCpu } from 'react-icons/fi';
// REASON: The import is now corrected to 'useAuth'.
import { useAuth } from './AuthContext';
import api from '../api/axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const chartTypes = [
  { value: "bar", label: "Bar Chart" },
  { value: "line", label: "Line Chart" },
  { value: "area", label: "Area Chart" },
  { value: "pie", label: "Pie Chart" },
];

const ExcelChart = () => {
  // REASON: Destructuring the shared data from the correctly named 'useAuth' hook.
  const { excelData, columnHeaders } = useAuth();

  const [xAxisKey, setXAxisKey] = useState(null);
  const [yAxisKey, setYAxisKey] = useState(null);
  const [chartType, setChartType] = useState(chartTypes[0]);
  const [aiSummary, setAiSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const chartRef = useRef();

  const columnOptions = useMemo(() => columnHeaders.map(col => ({ label: col, value: col })), [columnHeaders]);

  const handleDownload = async (format) => {
    if (!chartRef.current) return toast.warn('Please generate a chart first.');
    const canvas = await html2canvas(chartRef.current, { backgroundColor: '#ffffff' });
    const image = canvas.toDataURL('image/png', 1.0);
    if (format === 'png') {
      const link = document.createElement('a');
      link.href = image;
      link.download = 'chart.png';
      link.click();
    } else if (format === 'pdf') {
      const pdf = new jsPDF('landscape', 'px', [canvas.width, canvas.height]);
      pdf.addImage(image, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('chart.pdf');
    }
  };

  const handleAISummary = async () => {
    if (!xAxisKey || !yAxisKey) return toast.warn('Please select X and Y axes first.');
    setIsSummaryLoading(true);
    setAiSummary('');
    try {
      const res = await api.post('/files/summary', {
        data: excelData,
        chartType: chartType.label,
        xAxis: xAxisKey.label,
        yAxis: yAxisKey.label
      });
      setAiSummary(res.data.summary);
      toast.success('AI summary generated!');
    } catch (err) {
      toast.error('Failed to generate AI summary.');
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const renderChart = () => {
    if (!xAxisKey || !yAxisKey) {
      return <div className="flex items-center justify-center h-full text-gray-500">Please select X and Y axes to generate a chart.</div>;
    }
    const ChartComponent = { bar: BarChart, line: LineChart, area: AreaChart, pie: PieChart }[chartType.value];
    const pieData = excelData.map(entry => ({ name: entry[xAxisKey.value], value: parseFloat(entry[yAxisKey.value]) })).filter(item => !isNaN(item.value));
    if (chartType.value === 'pie') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
              {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={excelData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey.value} />
          <YAxis />
          <Tooltip />
          <Legend />
          {chartType.value === 'bar' && <Bar dataKey={yAxisKey.value} fill="#8884d8" />}
          {chartType.value === 'line' && <Line type="monotone" dataKey={yAxisKey.value} stroke="#82ca9d" />}
          {chartType.value === 'area' && <Area type="monotone" dataKey={yAxisKey.value} fill="#82ca9d" stroke="#82ca9d" />}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select placeholder="Select X-Axis" options={columnOptions} onChange={setXAxisKey} />
        <Select placeholder="Select Y-Axis" options={columnOptions} onChange={setYAxisKey} />
        <Select value={chartType} options={chartTypes} onChange={setChartType} />
      </div>
      <div ref={chartRef} className="w-full h-[450px] bg-white rounded-lg p-4 mb-6">
        {renderChart()}
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <button onClick={() => handleDownload('png')} className="flex items-center bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-600 transition-all">
          <FiDownload className="mr-2" /> Download PNG
        </button>
        <button onClick={() => handleDownload('pdf')} className="flex items-center bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-red-600 transition-all">
          <FiDownload className="mr-2" /> Download PDF
        </button>
        <button onClick={handleAISummary} disabled={isSummaryLoading} className="flex items-center bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-purple-600 transition-all disabled:opacity-50">
          <FiCpu className={`mr-2 ${isSummaryLoading ? 'animate-spin' : ''}`} />
          {isSummaryLoading ? 'Generating...' : 'Generate AI Summary'}
        </button>
      </div>
      {aiSummary && (
        <div className="mt-6 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
          <h3 className="font-bold text-lg text-purple-800 mb-2">AI-Powered Insights</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{aiSummary}</p>
        </div>
      )}
    </div>
  );
};
export default ExcelChart;