"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Send,
  Sparkles,
  BarChart3,
  LineChart,
  PieChart,
  Bot,
  User as UserIcon,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import axios from "axios";

// Helper function to calculate correlation between two data columns
const calculateCorrelation = (data, col1, col2) => {
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
    let n = 0;

    for (const row of data) {
        const x_val = row[col1];
        const y_val = row[col2];
        
        if (x_val == null || y_val == null) continue;

        const x = parseFloat(String(x_val).replace(/[,$%\s]/g, ''));
        const y = parseFloat(String(y_val).replace(/[,$%\s]/g, ''));

        if (!isNaN(x) && !isNaN(y)) {
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
            sumY2 += y * y;
            n++;
        }
    }

    if (n < 2) return 0;
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    if (denominator === 0) return 0;
    return numerator / denominator;
};

// Gemini API service
const geminiService = {
  generateContent: async (userPrompt, apiKey = null) => {
    try {
      const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
      if (!key) throw new Error("API key is required");
      const SYSTEM_PROMPT = "You are a helpful AI data assistant for Excel data analysis. Provide concise, accurate responses.";
      const result = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        { contents: [{ parts: [{ text: `System: ${SYSTEM_PROMPT}\n\nUser: ${userPrompt}` }] }] },
        { headers: { "Content-Type": "application/json" }, params: { key } }
      );
      return result.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini API Error:", error.response ? error.response.data : error);
      throw new Error(`API Error: ${error.response?.data?.error?.message || "Failed to get response"}`);
    }
  },

  analyzeExcelData: async (data, fileInfo, apiKey = null) => {
    try {
      const columnSummary = Object.keys(data[0] || {}).join(", ");
      const dataSample = JSON.stringify(data.slice(0, 20));

      const prompt = `
        You are an expert data analyst. I have an Excel file with the following details:
        - Filename: ${fileInfo.name}
        - Rows: ${fileInfo.rowCount}
        - Columns: ${columnSummary}
        
        Here's a sample of the data:
        ${dataSample}
        
        Please analyze this data and provide:
        1. Three key insights from the data.
        2. Recommendations for the best chart types to visualize this data and why.
        3. Any interesting patterns or trends you notice.
        
        Format your response as a JSON object with the following structure:
        {
          "insights": [
            { "title": "Insight Title 1", "description": "Detailed description of the insight.", "chartType": "recommended chart type", "confidence": 0.85 },
            { "title": "Insight Title 2", "description": "Detailed description of the insight.", "chartType": "recommended chart type", "confidence": 0.92 }
          ],
          "recommendedCharts": [
            { "type": "chart_type", "reason": "Explanation why this chart is suitable." },
            { "type": "chart_type", "reason": "Explanation for another suitable chart." }
          ],
          "patterns": ["Identified pattern 1", "Identified pattern 2"]
        }
      `;

      const response = await geminiService.generateContent(prompt, apiKey);
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/({[\s\S]*})/);
      
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      } else {
        return JSON.parse(response);
      }
    } catch (error) {
      console.error("Error analyzing Excel data with AI:", error);
      throw error;
    }
  },

  generateChatResponse: async (messages, dataContext = null, apiKey = null) => {
    try {
      const conversationHistory = messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n\n");

      let userPrompt = `You are an AI data assistant helping with Excel data analysis.`;
      if (dataContext) {
        userPrompt += `\n\nThe user has uploaded an Excel file with the following context:\n- Filename: ${dataContext.name}\n- Rows: ${dataContext.rowCount}\n- Columns: ${dataContext.headers.join(", ")}`;
      }
      userPrompt += `\n\nConversation history:\n${conversationHistory}\n\nPlease provide a helpful, concise response to the user's latest message.`;

      const response = await geminiService.generateContent(userPrompt, apiKey);
      return response;
    } catch (error) {
      console.error("Error generating chat response:", error);
      throw error;
    }
  },
};

const dataAnalysisService = {
  analyzeData: (data) => {
    const analysis = {
      columnTypes: {}, hasTimeData: false, hasCategoricalData: false, hasNumericalData: false,
      rowCount: data.length, columnCount: data[0] ? Object.keys(data[0]).length : 0,
      columns: data[0] ? Object.keys(data[0]) : [],
      numericalColumns: [], categoricalColumns: [], dateColumns: [], patterns: [], recommendedCharts: [],
    };
    if (!data.length || !analysis.columnCount) return { recommendation: "No data found", analysis };

    for (const column of analysis.columns) {
      const values = data.map((row) => row[column]);
      const nonNullValues = values.filter((v) => v !== null && v !== undefined && v !== "");
      if (nonNullValues.length === 0) continue;

      const dateCount = nonNullValues.filter((v) => (v instanceof Date && !isNaN(v)) || (typeof v === 'string' && !isNaN(Date.parse(v)) && new Date(v).getFullYear() > 1900)).length;
      const numericCount = nonNullValues.filter((v) => {
        if (typeof v === 'number' && isFinite(v)) return true;
        if (typeof v === 'string') {
          const cleanValue = v.replace(/[,$%\s]/g, "");
          return !isNaN(cleanValue) && !isNaN(parseFloat(cleanValue)) && cleanValue !== "";
        }
        return false;
      }).length;

      if (dateCount / nonNullValues.length > 0.7) {
        analysis.columnTypes[column] = "date"; analysis.dateColumns.push(column); analysis.hasTimeData = true;
      } else if (numericCount / nonNullValues.length > 0.7) {
        analysis.columnTypes[column] = "numerical"; analysis.numericalColumns.push(column); analysis.hasNumericalData = true;
      } else {
        analysis.columnTypes[column] = "categorical"; analysis.categoricalColumns.push(column); analysis.hasCategoricalData = true;
      }
    }
    
    if (analysis.hasTimeData && analysis.hasNumericalData) analysis.patterns.push("time_series");
    if (analysis.hasCategoricalData && analysis.hasNumericalData) analysis.patterns.push("categorical_comparison");
    if (analysis.numericalColumns.length >= 2) analysis.patterns.push("correlation");
    
    if (analysis.patterns.includes("time_series")) analysis.recommendedCharts.push({ type: "line", confidence: 0.9, reason: "Ideal for showing trends over time." });
    if (analysis.patterns.includes("categorical_comparison")) {
        analysis.recommendedCharts.push({ type: "bar", confidence: 0.85, reason: "Best for comparing values across categories." });
        if (analysis.categoricalColumns.length > 0) {
            const uniqueCategories = new Set(data.map(row => row[analysis.categoricalColumns[0]])).size;
            if (uniqueCategories <= 7) {
                analysis.recommendedCharts.push({ type: "pie", confidence: 0.7, reason: "Good for showing proportions of a whole with few categories." });
            }
        }
    }
    if (analysis.patterns.includes("correlation")) analysis.recommendedCharts.push({ type: "scatter", confidence: 0.8, reason: "Shows the relationship between two numerical variables." });
    
    analysis.recommendedCharts.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    const insights = dataAnalysisService.generateInsights(data, analysis);
    return {
      recommendation: analysis.recommendedCharts.length > 0 ? analysis.recommendedCharts[0].type : "bar",
      reason: analysis.recommendedCharts.length > 0 ? analysis.recommendedCharts[0].reason : "A bar chart is a good versatile starting point.",
      analysis,
      insights,
    };
  },
  generateInsights: (data, analysis) => {
    const insights = [];
    if (!data.length) return insights;

    if (analysis.hasTimeData && analysis.numericalColumns.length > 0) {
        const dateColumn = analysis.dateColumns[0];
        const numColumn = analysis.numericalColumns[0];
        const sortedData = [...data].filter(row => row[dateColumn] != null).sort((a, b) => new Date(a[dateColumn]) - new Date(b[dateColumn]));
        
        if (sortedData.length > 1) {
            const firstValue = parseFloat(String(sortedData[0][numColumn]).replace(/[,$%\s]/g, ''));
            const lastValue = parseFloat(String(sortedData[sortedData.length - 1][numColumn]).replace(/[,$%\s]/g, ''));
            if (!isNaN(firstValue) && !isNaN(lastValue) && firstValue !== 0) {
                const change = (((lastValue - firstValue) / Math.abs(firstValue)) * 100).toFixed(1);
                const trend = change >= 0 ? 'increase' : 'decrease';
                insights.push({ title: "Time-Series Trend", description: `Over the observed period, "${numColumn}" showed a ${Math.abs(change)}% ${trend}.`, chartType: "line", confidence: 0.85 });
            }
        }
    }

    if (analysis.hasCategoricalData && analysis.numericalColumns.length > 0) {
        const catColumn = analysis.categoricalColumns[0];
        const numColumn = analysis.numericalColumns[0];
        const categoryTotals = {};
        data.forEach(row => {
            const category = row[catColumn];
            const value = parseFloat(String(row[numColumn]).replace(/[,$%\s]/g, ''));
            if (category && !isNaN(value)) {
                categoryTotals[category] = (categoryTotals[category] || 0) + value;
            }
        });
        const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
        if (sortedCategories.length > 0) {
            const topCategory = sortedCategories[0][0];
            const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
            if(total > 0) {
              const percentage = ((sortedCategories[0][1] / total) * 100).toFixed(1);
              insights.push({ title: "Top Performing Category", description: `The "${topCategory}" category is the largest contributor to "${numColumn}", making up ${percentage}% of the total.`, chartType: "bar", confidence: 0.8 });
            }
        }
    }

    if (analysis.numericalColumns.length >= 2) {
        const col1 = analysis.numericalColumns[0];
        const col2 = analysis.numericalColumns[1];
        const correlation = calculateCorrelation(data, col1, col2);
        let correlationDescription = "no clear correlation";
        if (Math.abs(correlation) > 0.7) correlationDescription = `a strong ${correlation > 0 ? 'positive' : 'negative'} correlation`;
        else if (Math.abs(correlation) > 0.4) correlationDescription = `a moderate ${correlation > 0 ? 'positive' : 'negative'} correlation`;
        else if (Math.abs(correlation) > 0.1) correlationDescription = `a weak ${correlation > 0 ? 'positive' : 'negative'} correlation`;
        insights.push({ title: "Correlation Analysis", description: `There appears to be ${correlationDescription} (coefficient: ${correlation.toFixed(2)}) between "${col1}" and "${col2}".`, chartType: "scatter", confidence: 0.75 });
    }

    if (insights.length === 0) {
        insights.push({ title: "Data Summary", description: `The uploaded file contains ${analysis.rowCount} rows and ${analysis.columnCount} columns. Ask the assistant about specific columns to find more insights.`, chartType: "bar", confidence: 0.6 });
    }
    return insights;
  },
  generateSample: (data, maxRows = 5) => data.slice(0, maxRows),
  formatResponseMessage: (fileName, analysis) => {
    let message = `I've analyzed "${fileName}". Based on your data, I recommend a **${analysis.recommendation} chart**. ${analysis.reason}`;
    if(analysis.analysis.recommendedCharts.length > 1) {
        message += `\n\nOther good options include:`;
        analysis.analysis.recommendedCharts.slice(1,3).forEach(chart => {
            message += `\n- **${chart.type} chart**: ${chart.reason}`;
        });
    }
    return message;
  },
};

export default function AIInsightsPage() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! Upload an Excel file, and I'll help you analyze it and recommend the best chart types for your data.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
                if (jsonData.length < 2) { resolve({ data: [], headers: [] }); return; }
                const headers = jsonData[0];
                const rows = jsonData.slice(1);
                const formattedData = rows.map((row) => {
                    const obj = {};
                    headers.forEach((header, index) => { obj[header] = row[index]; });
                    return obj;
                });
                resolve({ data: formattedData, headers });
            } catch (error) { reject(error); }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setAnalyzing(true);
    setMessages((prev) => [...prev, { role: "user", content: `I've uploaded ${selectedFile.name} for analysis.` }]);
    try {
        const { data, headers } = await parseExcelFile(selectedFile);
        setParsedData(data);
        const fileInfo = { name: selectedFile.name, rowCount: data.length, columnCount: headers.length, headers };
        setFileData(fileInfo);
        const analysis = dataAnalysisService.analyzeData(data);
        const responseMessage = dataAnalysisService.formatResponseMessage(selectedFile.name, analysis);
        setInsights(analysis.insights);
        setAnalyzing(false);
        setMessages((prev) => [...prev, { role: "assistant", content: responseMessage }]);
    } catch (error) {
        console.error("Error processing file:", error);
        setAnalyzing(false);
        setMessages((prev) => [...prev, { role: "assistant", content: `I encountered an error while processing ${selectedFile.name}. Please ensure it's a valid Excel file.` }]);
    }
  };
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setAnalyzing(true);
    try {
        const aiResponse = await geminiService.generateChatResponse([...messages, userMessage], fileData);
        setAnalyzing(false);
        setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
    } catch (error) {
        setAnalyzing(false);
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    }
  };

  const getChartIcon = (chartType) => {
    switch (chartType) {
      case "bar": return <BarChart3 className="h-5 w-5" />;
      case "line": return <LineChart className="h-5 w-5" />;
      case "pie": return <PieChart className="h-5 w-5" />;
      case "scatter": return <Sparkles className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-800">
      <DashboardSidebar />
      <main className="flex-1 p-8 flex flex-col">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">AI-Powered Analytics</h1>
          <p className="text-lg text-slate-500 mt-2">
            Use our AI Assistant to get instant insights and recommendations for your data.
          </p>
        </header>

        <Tabs defaultValue="assistant" className="w-full flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-slate-200 text-slate-500 rounded-lg">
            <TabsTrigger value="assistant" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-md">
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-md">
              <Sparkles className="h-4 w-4 mr-2" />
              Generated Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assistant" className="flex-1 mt-6">
            <Card className="h-full flex flex-col shadow-lg border-slate-200">
              <CardContent className="p-0 flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-4 ${message.role === "user" ? "justify-end" : ""}`}>
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                          <Bot className="h-5 w-5 text-slate-500" />
                        </div>
                      )}
                      <div className={`max-w-xl rounded-lg px-4 py-3 shadow-sm ${message.role === "assistant" ? "bg-white text-slate-800 border" : "bg-blue-600 text-white"}`}>
                        <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}></p>
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                          <UserIcon className="h-5 w-5 text-slate-500" />
                        </div>
                      )}
                    </div>
                  ))}
                  {analyzing && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                        <Bot className="h-5 w-5 text-slate-500" />
                      </div>
                      <div className="max-w-xl rounded-lg px-4 py-3 bg-white border shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t bg-white rounded-b-xl">
                  {file && (
                    <div className="mb-2 text-xs text-slate-500 flex items-center gap-2 p-2 bg-slate-100 rounded-md">
                        <FileSpreadsheet className="h-4 w-4 text-blue-600"/>
                        Analyzing: <span className="font-medium text-slate-700">{file.name}</span>
                    </div>
                  )}
                  <div className="relative">
                    <Input
                      placeholder="Ask about your data..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      className="pr-24 h-12 text-base"
                    />
                    <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center">
                      <input type="file" accept=".xlsx,.xls,.csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-600" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-5 w-5" />
                      </Button>
                      <Button size="icon" onClick={handleSendMessage} disabled={!inputMessage.trim() || analyzing}>
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="flex-1 mt-6">
            <Card className="h-full shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle>AI Generated Insights</CardTitle>
                <CardDescription>
                  {fileData ? `Key takeaways from "${fileData.name}".` : "Upload a file to get started."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analyzing ? (
                   <div className="col-span-full text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-slate-500 mt-2">Generating insights...</p>
                    </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {insights.length > 0 ? insights.map((insight, index) => (
                      <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                            {getChartIcon(insight.chartType)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">{insight.title}</h4>
                            <p className="text-xs text-slate-500">Recommended chart: {insight.chartType}</p>
                           </div>
                        </div>
                        <p className="text-sm text-slate-600">{insight.description}</p>
                      </div>
                    )) : (
                        <div className="col-span-full text-center py-12">
                            <Sparkles className="mx-auto h-12 w-12 text-slate-400 mb-4"/>
                            <h3 className="text-lg font-medium text-slate-700">No Insights Yet</h3>
                            <p className="text-slate-500 mt-2">Upload a file in the AI Assistant tab to get started.</p>
                        </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}