import React, { useState, useRef } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  ScatterChart, Scatter,
  ComposedChart,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import Select from "react-select";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];

const chartTypes = [
  { type: "bar", label: "Bar Chart" },
  { type: "line", label: "Line Chart" },
  { type: "area", label: "Area Chart" },
  { type: "scatter", label: "Scatter Chart" },
  { type: "composed", label: "Composed Chart" },
  { type: "pie", label: "Pie Chart" },
  { type: "radar", label: "Radar Chart" }
];

const ExcelChart = ({ data }) => {
  const [xAxis, setXAxis] = useState(null);
  const [yAxis, setYAxis] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [aiSummary, setAiSummary] = useState("");
  const [showChart, setShowChart] = useState(false);
  const chartRef = useRef();

  const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

  const handleDownload = async (format) => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current);
    const image = canvas.toDataURL("image/png");

    if (format === "png") {
      const link = document.createElement("a");
      link.href = image;
      link.download = "chart.png";
      link.click();
    } else if (format === "pdf") {
      const pdf = new jsPDF();
      pdf.addImage(image, "PNG", 10, 10, 180, 100);
      pdf.save("chart.pdf");
    }
  };

  const handleAISummary = async () => {
    try {
      const response = await axios.post("/api/summarize-chart-data", { data, xAxis, yAxis });
      setAiSummary(response.data.summary);
    } catch (err) {
      console.error(err);
      setAiSummary("Failed to generate summary.");
    }
  };

  const renderChart = () => {
    if (!xAxis || !yAxis) return <p className="text-center text-gray-500">Please select X and Y axes</p>;

    switch (chartType) {
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yAxis} fill="#8884d8" />
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yAxis} stroke="#82ca9d" />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={yAxis} stroke="#ffc658" fill="#ffc658" />
          </AreaChart>
        );
      case "scatter":
        return (
          <ScatterChart>
            <CartesianGrid />
            <XAxis dataKey={xAxis} name={xAxis} />
            <YAxis dataKey={yAxis} name={yAxis} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Data" data={data} fill="#ff8042" />
          </ScatterChart>
        );
      case "composed":
        return (
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={yAxis} fill="#8884d8" stroke="#8884d8" />
            <Bar dataKey={yAxis} barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey={yAxis} stroke="#ff7300" />
          </ComposedChart>
        );
      case "pie":
        return (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey={yAxis}
              nameKey={xAxis}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      case "radar":
        return (
          <RadarChart outerRadius={90} data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey={xAxis} />
            <PolarRadiusAxis />
            <Radar name={yAxis} dataKey={yAxis} stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-4">
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-gray-600 font-semibold">X-Axis</label>
          <Select options={columns.map(col => ({ label: col, value: col }))} onChange={(e) => setXAxis(e.value)} />
        </div>
        <div>
          <label className="text-sm text-gray-600 font-semibold">Y-Axis</label>
          <Select options={columns.map(col => ({ label: col, value: col }))} onChange={(e) => setYAxis(e.value)} />
        </div>
        <div>
          <label className="text-sm text-gray-600 font-semibold block mb-1">Chart Type</label>
          <div className="flex flex-wrap gap-2">
            {chartTypes.map((c) => (
              <button
                key={c.type}
                onClick={() => setChartType(c.type)}
                className={`px-3 py-1 text-sm rounded-full border ${
                  chartType === c.type ? "bg-blue-600 text-white" : "bg-white text-gray-800"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowChart(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Generate Chart
        </button>
      </div>

      {showChart && (
        <>
          <div ref={chartRef} className="w-full h-[400px] bg-white rounded-xl p-4 shadow-md">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-4 mt-6 items-center justify-start">
            <button
              onClick={() => handleDownload("png")}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Download PNG
            </button>
            <button
              onClick={() => handleDownload("pdf")}
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
            >
              Download PDF
            </button>
            <button
              onClick={handleAISummary}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Generate AI Summary
            </button>
          </div>

          {aiSummary && (
            <div className="mt-4 p-4 border rounded bg-gray-100 text-sm text-gray-800">
              <strong>AI Summary:</strong> {aiSummary}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExcelChart;
