"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Upload,
  Send,
  Sparkles,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
  Bot,
  X,
  Settings,
} from "lucide-react";
import * as XLSX from "xlsx";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import axios from "axios";
import Aurora from "@/components/ui/aurora";

// Gemini API service
const geminiService = {
  // Use Vite's environment variable syntax
//   apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",

  // Call Gemini API
  // prompt argument will now be used as userPrompt
  generateContent: async (userPrompt, apiKey = null) => {
    try {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
      if (!key) {
        throw new Error("API key is required");
      }

      // Define your system prompt here or import it from a constants file
      // For this example, I'll use a placeholder.
      // Make sure SYSTEM_PROMPT is defined somewhere in your code.
      const SYSTEM_PROMPT =
        "You are a helpful AI data assistant assisting with Excel data analysis and visualization. Provide concise and accurate responses.";

      const result = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", // New URL
        {
          contents: [
            {
              parts: [
                {
                  // Incorporate SYSTEM_PROMPT and userPrompt into the text part
                  text: `System: ${SYSTEM_PROMPT}\n\nUser: ${userPrompt}`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            // Pass the actual API key here
            key: key,
          },
        }
      );

      // Access the content from the new response structure
      return result.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      // axios errors often have a response property with more details
      if (axios.isAxiosError(error) && error.response) {
        console.error("API Error Response Data:", error.response.data);
        throw new Error(
          `API Error: ${
            error.response.data.error?.message || error.response.statusText
          }`
        );
      }
      throw error;
    }
  },

  // Generate insights from Excel data
  analyzeExcelData: async (data, fileInfo, apiKey = null) => {
    try {
      const columnSummary = Object.keys(data[0] || {}).join(", ");
      const allData = JSON.stringify(data);

      const prompt = `
        You are an expert data analyst specializing in Excel data visualization.
        
        I have an Excel file with the following information:
        - Filename: ${fileInfo.name}
        - Rows: ${fileInfo.rowCount}
        - Columns: ${columnSummary}
        
        Here's the full data:
        ${allData}
        
        Please analyze this data and provide:
        1. The best chart types to visualize this data and why
        2. Three key insights from the data
        3. Any patterns or trends you notice
        4. Recommendations for further analysis
        
        Format your response as JSON with the following structure:
        {
          "recommendedCharts": [
            {
              "type": "chart_type",
              "confidence": 0.9,
              "reason": "explanation"
            }
          ],
          "insights": [
            {
              "title": "insight title",
              "description": "detailed description",
              "chartType": "recommended chart type",
              "confidence": 0.8
            }
          ],
          "patterns": ["pattern1", "pattern2"],
          "recommendations": ["recommendation1", "recommendation2"]
        }
      `;

      // The analyzeExcelData function also calls generateContent,
      // so it will now use the updated axios request format.
      const response = await geminiService.generateContent(prompt, apiKey);

      const jsonMatch =
        response.match(/```json\n([\s\S]*?)\n```/) ||
        response.match(/({[\s\S]*})/) ||
        response.match(/```\n([\s\S]*?)\n```/); // Added this order for robustness

      let parsedResponse;
      if (jsonMatch && jsonMatch[1]) {
        parsedResponse = JSON.parse(jsonMatch[1]);
      } else {
        try {
          parsedResponse = JSON.parse(response);
        } catch (e) {
          console.error("Failed to parse JSON response:", e);
          throw new Error("Invalid response format from AI");
        }
      }

      return parsedResponse;
    } catch (error) {
      console.error("Error analyzing Excel data:", error);
      throw error;
    }
  },

  // Generate chat response
  generateChatResponse: async (messages, dataContext = null, apiKey = null) => {
    try {
      // Format the conversation history into a single user prompt for now
      // This part might need further refinement if you want to maintain
      // a multi-turn chat history directly in the API call's 'contents' array.
      // For a simple 'System: ... User: ...' format, we condense it.
      const conversationHistory = messages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n\n");

      let userPrompt = `You are an AI data assistant helping with Excel data analysis and visualization.`;

      if (dataContext) {
        userPrompt += `
          \n\nThe user has uploaded an Excel file with the following information:
          - Filename: ${dataContext.name}
          - Rows: ${dataContext.rowCount}
          - Columns: ${dataContext.columnCount}
          - Column names: ${dataContext.headers.join(", ")}
          
          The data contains:
          ${
            dataContext.numericalColumns
              ? `- Numerical columns: ${dataContext.numericalColumns.join(
                  ", "
                )}`
              : ""
          }
          ${
            dataContext.categoricalColumns
              ? `- Categorical columns: ${dataContext.categoricalColumns.join(
                  ", "
                )}`
              : ""
          }
          ${
            dataContext.dateColumns
              ? `- Date columns: ${dataContext.dateColumns.join(", ")}`
              : ""
          }
        `;
      }

      userPrompt += `\n\nConversation history:\n${conversationHistory}\n\nPlease provide a helpful, concise response to the user's latest message.`;

      // Call the updated generateContent function with the constructed userPrompt
      const response = await geminiService.generateContent(userPrompt, apiKey);
      return response;
    } catch (error) {
      console.error("Error generating chat response:", error);
      throw error;
    }
  },
};

// Data analysis service for Excel files
const dataAnalysisService = {
  // Analyze Excel data and recommend chart types
  analyzeData: (data) => {
    // Extract column types and data patterns
    const analysis = {
      columnTypes: {},
      hasTimeData: false,
      hasCategoricalData: false,
      hasNumericalData: false,
      rowCount: data.length,
      columnCount: data[0] ? Object.keys(data[0]).length : 0,
      columns: data[0] ? Object.keys(data[0]) : [],
      numericalColumns: [],
      categoricalColumns: [],
      dateColumns: [],
      patterns: [],
      recommendedCharts: [],
    };

    // Skip analysis if no data
    if (!data.length || !analysis.columnCount) {
      return {
        recommendation: "No data found",
        analysis,
      };
    }

    // Analyze each column to determine its type
    for (const column of analysis.columns) {
      const values = data.map((row) => row[column]);
      const nonNullValues = values.filter(
        (v) => v !== null && v !== undefined && v !== ""
      );

      if (nonNullValues.length === 0) continue;

      // Check if column contains dates
      const possibleDateCount = nonNullValues.filter((v) => {
        // Check if value is a date object or a date string
        return (
          v instanceof Date ||
          !isNaN(Date.parse(v)) ||
          /^\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4}$/.test(v) ||
          /^\d{4}[/\-.]\d{1,2}[/\-.]\d{1,2}$/.test(v)
        );
      }).length;

      // Check if column contains numbers
      const numericCount = nonNullValues.filter((v) => {
        const num = Number.parseFloat(v);
        return !isNaN(num) && isFinite(num);
      }).length;

      // Determine column type based on majority of values
      if (possibleDateCount / nonNullValues.length > 0.7) {
        analysis.columnTypes[column] = "date";
        analysis.dateColumns.push(column);
        analysis.hasTimeData = true;
      } else if (numericCount / nonNullValues.length > 0.7) {
        analysis.columnTypes[column] = "numerical";
        analysis.numericalColumns.push(column);
        analysis.hasNumericalData = true;
      } else {
        analysis.columnTypes[column] = "categorical";
        analysis.categoricalColumns.push(column);
        analysis.hasCategoricalData = true;
      }
    }

    // Detect patterns in the data
    if (analysis.hasTimeData && analysis.hasNumericalData) {
      analysis.patterns.push("time_series");
    }

    if (analysis.hasCategoricalData && analysis.hasNumericalData) {
      analysis.patterns.push("categorical_comparison");
    }

    if (analysis.numericalColumns.length >= 2) {
      analysis.patterns.push("correlation");
    }

    if (analysis.hasCategoricalData && !analysis.hasNumericalData) {
      analysis.patterns.push("frequency");
    }

    // Recommend chart types based on patterns
    if (analysis.patterns.includes("time_series")) {
      analysis.recommendedCharts.push({
        type: "line",
        confidence: 0.9,
        reason:
          "Your data contains time-based information and numerical values, making it ideal for a line chart to show trends over time.",
      });
      analysis.recommendedCharts.push({
        type: "area",
        confidence: 0.75,
        reason:
          "Area charts are good for showing cumulative totals over time or emphasizing volume.",
      });
    }

    if (analysis.patterns.includes("categorical_comparison")) {
      analysis.recommendedCharts.push({
        type: "bar",
        confidence: 0.85,
        reason:
          "Your data contains categories and corresponding numerical values, making it perfect for bar charts to compare values across categories.",
      });

      // If few categories with numerical values, recommend pie chart
      const categoricalColumn = analysis.categoricalColumns[0];
      const uniqueCategories = new Set(
        data.map((row) => row[categoricalColumn])
      ).size;

      if (uniqueCategories <= 7) {
        analysis.recommendedCharts.push({
          type: "pie",
          confidence: 0.7,
          reason:
            "Your data has a small number of categories, making it suitable for a pie chart to show proportions of the whole.",
        });
      }
    }

    if (
      analysis.patterns.includes("correlation") &&
      analysis.numericalColumns.length >= 2
    ) {
      analysis.recommendedCharts.push({
        type: "scatter",
        confidence: 0.8,
        reason:
          "Your data contains multiple numerical columns, which is ideal for scatter plots to identify correlations between variables.",
      });
    }

    if (analysis.patterns.includes("frequency")) {
      analysis.recommendedCharts.push({
        type: "bar",
        confidence: 0.75,
        reason:
          "Your data contains categorical information that can be counted and displayed as a frequency distribution using a bar chart.",
      });
    }

    // Sort recommendations by confidence
    analysis.recommendedCharts.sort((a, b) => b.confidence - a.confidence);

    // Generate insights based on the data
    const insights = dataAnalysisService.generateInsights(data, analysis);

    return {
      recommendation:
        analysis.recommendedCharts.length > 0
          ? analysis.recommendedCharts[0].type
          : "bar",
      reason:
        analysis.recommendedCharts.length > 0
          ? analysis.recommendedCharts[0].reason
          : "Based on your data structure, a bar chart is a safe default choice.",
      analysis,
      insights,
    };
  },

  // Generate insights from the data
  generateInsights: (data, analysis) => {
    const insights = [];

    // Skip if no data
    if (!data.length) return insights;

    // Generate insights based on data patterns
    if (analysis.hasTimeData && analysis.hasNumericalData) {
      const dateColumn = analysis.dateColumns[0];
      const numColumn = analysis.numericalColumns[0];

      // Sort data by date
      const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a[dateColumn]);
        const dateB = new Date(b[dateColumn]);
        return dateA - dateB;
      });

      // Calculate growth or trend
      if (sortedData.length > 1) {
        const firstValue = Number.parseFloat(sortedData[0][numColumn]) || 0;
        const lastValue =
          Number.parseFloat(sortedData[sortedData.length - 1][numColumn]) || 0;

        if (firstValue !== 0) {
          const growthRate = ((lastValue - firstValue) / firstValue) * 100;

          insights.push({
            title: "Trend Analysis",
            description: `${numColumn} ${
              growthRate >= 0 ? "increased" : "decreased"
            } by ${Math.abs(growthRate).toFixed(1)}% over the time period.`,
            chartType: "line",
            confidence: 0.85,
          });
        }
      }
    }

    if (analysis.hasCategoricalData && analysis.hasNumericalData) {
      const catColumn = analysis.categoricalColumns[0];
      const numColumn = analysis.numericalColumns[0];

      // Find top category
      const categoryTotals = {};
      data.forEach((row) => {
        const category = row[catColumn];
        const value = Number.parseFloat(row[numColumn]) || 0;

        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += value;
      });

      const sortedCategories = Object.entries(categoryTotals).sort(
        (a, b) => b[1] - a[1]
      );

      if (sortedCategories.length > 0) {
        const topCategory = sortedCategories[0][0];
        const topValue = sortedCategories[0][1];
        const total = sortedCategories.reduce(
          (sum, [_, value]) => sum + value,
          0
        );
        const percentage = ((topValue / total) * 100).toFixed(1);

        insights.push({
          title: "Category Distribution",
          description: `"${topCategory}" accounts for ${percentage}% of the total ${numColumn}.`,
          chartType: "pie",
          confidence: 0.8,
        });
      }
    }

    if (analysis.numericalColumns.length >= 2) {
      const numCol1 = analysis.numericalColumns[0];
      const numCol2 = analysis.numericalColumns[1];

      insights.push({
        title: "Variable Relationship",
        description: `Analyze the relationship between ${numCol1} and ${numCol2} to identify potential correlations.`,
        chartType: "scatter",
        confidence: 0.75,
      });
    }

    return insights;
  },

  // Generate a sample of the data for preview
  generateSample: (data, maxRows = 5) => {
    if (!data || !data.length) return [];
    return data.slice(0, maxRows);
  },

  // Format response message based on analysis
  formatResponseMessage: (fileName, analysis) => {
    const { recommendation, reason, analysis: dataAnalysis } = analysis;

    let message = `I've analyzed "${fileName}" (${dataAnalysis.rowCount} rows, ${dataAnalysis.columnCount} columns). `;

    if (dataAnalysis.recommendedCharts.length > 0) {
      message += `Based on your data, I recommend using a **${recommendation} chart** for visualization. ${reason}\n\n`;

      if (dataAnalysis.recommendedCharts.length > 1) {
        message += `Alternative chart types to consider:\n`;
        dataAnalysis.recommendedCharts.slice(1, 3).forEach((chart) => {
          message += `- **${chart.type} chart**: ${chart.reason}\n`;
        });
      }
    } else {
      message += `I couldn't determine an optimal chart type. A bar chart is a safe default choice.`;
    }

    return message;
  },
};

export default function AIInsightsPage() {
  const navigate = useNavigate();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [dataSample, setDataSample] = useState([]);
  const [dataAnalysis, setDataAnalysis] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! Upload an Excel file, and I'll help you analyze it and recommend the best chart types for your data.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [showDataPreview, setShowDataPreview] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sample insights for initial state
  const sampleInsights = [
    {
      title: "Sales Trend Analysis",
      description:
        "Monthly sales show a 15% increase in Q2 compared to Q1, with peak performance in June.",
      chartType: "line",
      confidence: 0.92,
    },
    {
      title: "Product Category Distribution",
      description:
        "Electronics account for 45% of total revenue, followed by Home Goods (28%) and Apparel (17%).",
      chartType: "pie",
      confidence: 0.89,
    },
    {
      title: "Regional Performance Comparison",
      description:
        "Western region outperforms others with 32% higher sales and 18% better conversion rates.",
      chartType: "bar",
      confidence: 0.85,
    },
  ];

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Parse Excel file and extract data
  const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          // Get first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // Convert to JSON with headers
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Extract headers and data
          if (jsonData.length < 2) {
            resolve({ data: [], headers: [] });
            return;
          }

          const headers = jsonData[0];
          const rows = jsonData.slice(1);

          // Convert to array of objects
          const formattedData = rows.map((row) => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });

          resolve({
            data: formattedData,
            headers,
            sheetNames: workbook.SheetNames,
            activeSheet: firstSheetName,
          });
        } catch (error) {
          reject(error);
        }
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

    // Add message about the uploaded file
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: `I've uploaded ${selectedFile.name} for analysis.`,
      },
    ]);

    try {
      // Parse Excel file
      const { data, headers, sheetNames, activeSheet } = await parseExcelFile(
        selectedFile
      );

      // Store parsed data
      setParsedData(data);

      // Generate sample for preview
      const sample = dataAnalysisService.generateSample(data);
      setDataSample(sample);

      // Store file metadata
      const fileInfo = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        lastModified: new Date(selectedFile.lastModified).toLocaleString(),
        rowCount: data.length,
        columnCount: headers.length,
        headers,
        sheetNames,
        activeSheet,
      };
      setFileData(fileInfo);

      let analysis;
      let responseMessage;

      if (useAI && (apiKey || import.meta.env.VITE_GEMINI_API_KEY)) {
        try {
          // Use Gemini API for analysis
          const aiAnalysis = await geminiService.analyzeExcelData(
            data,
            fileInfo,
            apiKey
          );

          // Update insights from AI analysis
          if (aiAnalysis.insights && aiAnalysis.insights.length > 0) {
            setInsights(aiAnalysis.insights);
          }

          // Create analysis object from AI response
          analysis = {
            recommendation: aiAnalysis.recommendedCharts?.[0]?.type || "bar",
            reason:
              aiAnalysis.recommendedCharts?.[0]?.reason ||
              "Based on your data structure, a bar chart is a safe default choice.",
            analysis: {
              ...dataAnalysisService.analyzeData(data).analysis,
              recommendedCharts: aiAnalysis.recommendedCharts || [],
            },
            insights: aiAnalysis.insights || [],
          };

          // Format AI response message
          responseMessage = `I've analyzed "${selectedFile.name}" (${data.length} rows, ${headers.length} columns).\n\n`;

          if (
            aiAnalysis.recommendedCharts &&
            aiAnalysis.recommendedCharts.length > 0
          ) {
            const topChart = aiAnalysis.recommendedCharts[0];
            responseMessage += `Based on your data, I recommend using a **${topChart.type} chart** for visualization. ${topChart.reason}\n\n`;

            if (aiAnalysis.recommendedCharts.length > 1) {
              responseMessage += `Alternative chart types to consider:\n`;
              aiAnalysis.recommendedCharts.slice(1, 3).forEach((chart) => {
                responseMessage += `- **${chart.type} chart**: ${chart.reason}\n`;
              });
            }
          }

          if (aiAnalysis.patterns && aiAnalysis.patterns.length > 0) {
            responseMessage += `\nI've detected these patterns in your data: ${aiAnalysis.patterns.join(
              ", "
            )}\n`;
          }

          if (
            aiAnalysis.recommendations &&
            aiAnalysis.recommendations.length > 0
          ) {
            responseMessage += `\nRecommendations for further analysis:\n`;
            aiAnalysis.recommendations.forEach((rec) => {
              responseMessage += `- ${rec}\n`;
            });
          }
        } catch (error) {
          console.error("Error using Gemini API:", error);
          // Fall back to local analysis
          analysis = dataAnalysisService.analyzeData(data);
          responseMessage = dataAnalysisService.formatResponseMessage(
            selectedFile.name,
            analysis
          );
        }
      } else {
        // Use local analysis
        analysis = dataAnalysisService.analyzeData(data);
        responseMessage = dataAnalysisService.formatResponseMessage(
          selectedFile.name,
          analysis
        );
      }

      setDataAnalysis(analysis);

      // Generate insights if not already set by AI
      if (!analysis.insights || analysis.insights.length === 0) {
        const localInsights = dataAnalysisService.generateInsights(
          data,
          analysis.analysis
        );
        if (localInsights.length > 0) {
          setInsights(localInsights);
        }
      } else {
        setInsights(analysis.insights);
      }

      // Add response message
      setAnalyzing(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: responseMessage,
        },
      ]);
    } catch (error) {
      console.error("Error processing Excel file:", error);
      setAnalyzing(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I encountered an error while processing ${selectedFile.name}. Please make sure it's a valid Excel file.`,
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Start analyzing
    setAnalyzing(true);

    try {
      let aiResponse = "";

      if (useAI && (apiKey || import.meta.env.VITE_GEMINI_API_KEY)) {
        try {
          // Create data context for AI
          const dataContext = fileData
            ? {
                ...fileData,
                numericalColumns: dataAnalysis?.analysis?.numericalColumns,
                categoricalColumns: dataAnalysis?.analysis?.categoricalColumns,
                dateColumns: dataAnalysis?.analysis?.dateColumns,
              }
            : null;

          // Use Gemini API for chat response
          aiResponse = await geminiService.generateChatResponse(
            [...messages, userMessage],
            dataContext,
            apiKey
          );
        } catch (error) {
          console.error("Error using Gemini API for chat:", error);
          // Fall back to local response generation
          aiResponse = generateLocalResponse(inputMessage);
        }
      } else {
        // Use local response generation
        aiResponse = generateLocalResponse(inputMessage);
      }

      setAnalyzing(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } catch (error) {
      console.error("Error generating response:", error);
      setAnalyzing(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error while processing your request. Please try again.",
        },
      ]);
    }
  };

  // Generate a local response without using AI
  const generateLocalResponse = (userMessage) => {
    const userMessageLower = userMessage.toLowerCase();

    if (parsedData.length === 0) {
      return "Please upload an Excel file first so I can provide specific insights about your data.";
    } else if (
      userMessageLower.includes("why") &&
      userMessageLower.includes("chart")
    ) {
      if (
        dataAnalysis &&
        dataAnalysis.recommendedCharts &&
        dataAnalysis.recommendedCharts.length > 0
      ) {
        const topChart = dataAnalysis.recommendedCharts[0];
        return `I recommended a ${topChart.type} chart because ${topChart.reason}`;
      } else {
        return "Bar charts are excellent for comparing values across categories. Line charts show trends over time. Pie charts display proportions of a whole. The best chart depends on what story you want your data to tell.";
      }
    } else if (
      userMessageLower.includes("trend") ||
      userMessageLower.includes("pattern")
    ) {
      if (
        dataAnalysis &&
        dataAnalysis.analysis.patterns &&
        dataAnalysis.analysis.patterns.length > 0
      ) {
        let response = `I've detected the following patterns in your data: ${dataAnalysis.analysis.patterns.join(
          ", "
        )}. `;

        if (dataAnalysis.analysis.patterns.includes("time_series")) {
          response +=
            "There appears to be a time-based trend in your numerical data. ";
        }

        if (dataAnalysis.analysis.patterns.includes("categorical_comparison")) {
          response +=
            "Your data shows variations across different categories. ";
        }

        if (dataAnalysis.analysis.patterns.includes("correlation")) {
          response +=
            "There might be correlations between your numerical variables. ";
        }

        return response;
      } else {
        return "I couldn't detect any clear patterns in your data. This might be due to limited data points or high variability.";
      }
    } else if (
      userMessageLower.includes("recommend") ||
      userMessageLower.includes("suggest")
    ) {
      if (
        dataAnalysis &&
        dataAnalysis.recommendedCharts &&
        dataAnalysis.recommendedCharts.length > 0
      ) {
        let response = "Based on your data structure, I recommend: \n\n";
        dataAnalysis.recommendedCharts.forEach((chart, index) => {
          response += `${index + 1}. **${chart.type.toUpperCase()} CHART**: ${
            chart.reason
          }\n`;
        });
        return response;
      } else {
        return "Based on your data structure, I recommend creating a dashboard with: 1) A line chart showing monthly trends, 2) A bar chart comparing categories, and 3) A scatter plot to visualize the correlation between variables.";
      }
    } else if (
      userMessageLower.includes("summary") ||
      userMessageLower.includes("overview")
    ) {
      if (fileData) {
        let response = `Your file "${fileData.name}" contains ${fileData.rowCount} rows and ${fileData.columnCount} columns. `;

        if (dataAnalysis) {
          if (dataAnalysis.analysis.numericalColumns.length > 0) {
            response += `\nNumerical columns: ${dataAnalysis.analysis.numericalColumns.join(
              ", "
            )}. `;
          }

          if (dataAnalysis.analysis.categoricalColumns.length > 0) {
            response += `\nCategorical columns: ${dataAnalysis.analysis.categoricalColumns.join(
              ", "
            )}. `;
          }

          if (dataAnalysis.analysis.dateColumns.length > 0) {
            response += `\nDate columns: ${dataAnalysis.analysis.dateColumns.join(
              ", "
            )}. `;
          }
        }

        return response;
      } else {
        return "I don't have any data to summarize. Please upload an Excel file first.";
      }
    } else {
      return "I can help you analyze your Excel data and recommend the best visualization approaches. Would you like me to focus on a specific aspect of your data or explain why certain chart types might work better than others?";
    }
  };

  const generateNewInsights = async () => {
    setLoading(true);

    try {
      if (parsedData.length > 0) {
        if (useAI && (apiKey || import.meta.env.VITE_GEMINI_API_KEY)) {
          try {
            // Use Gemini API for new insights
            const fileInfo = {
              name: fileData.name,
              rowCount: parsedData.length,
              columnCount: fileData.headers.length,
            };

            const aiAnalysis = await geminiService.analyzeExcelData(
              parsedData,
              fileInfo,
              apiKey
            );

            if (aiAnalysis.insights && aiAnalysis.insights.length > 0) {
              setInsights(aiAnalysis.insights);
            } else {
              // Fall back to local insights
              const analysis = dataAnalysisService.analyzeData(parsedData);
              const localInsights = dataAnalysisService.generateInsights(
                parsedData,
                analysis.analysis
              );
              setInsights(
                localInsights.length > 0 ? localInsights : sampleInsights
              );
            }
          } catch (error) {
            console.error("Error generating AI insights:", error);
            // Fall back to local insights
            const analysis = dataAnalysisService.analyzeData(parsedData);
            const localInsights = dataAnalysisService.generateInsights(
              parsedData,
              analysis.analysis
            );
            setInsights(
              localInsights.length > 0 ? localInsights : sampleInsights
            );
          }
        } else {
          // Use local analysis
          const analysis = dataAnalysisService.analyzeData(parsedData);
          const localInsights = dataAnalysisService.generateInsights(
            parsedData,
            analysis.analysis
          );
          setInsights(
            localInsights.length > 0 ? localInsights : sampleInsights
          );
        }
      } else {
        // Use sample insights if no data is available
        setInsights(sampleInsights);
      }
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights(sampleInsights);
    } finally {
      setLoading(false);
    }
  };

  const getChartIcon = (chartType) => {
    switch (chartType) {
      case "bar":
        return <BarChart3 className="h-5 w-5" />;
      case "line":
        return <LineChart className="h-5 w-5" />;
      case "pie":
        return <PieChart className="h-5 w-5" />;
      case "scatter":
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  return (
    <div
      style={{ backgroundColor: "black", minHeight: "100vh" }}
      className="flex relative "
    >
      <DashboardSidebar />
      <div className="absolute inset-0 z-0 opacity-40 h-full">
        <Aurora
          colorStops={["#0038ff", "#00d4ff", "#002233"]}
          amplitude={0.8}
          blend={1}
        />
      </div>
      <div className="absolute inset-0 z-0 opacity-40 scale-y-[-1]">
        <Aurora
          colorStops={["#0038ff", "#00d4ff", "#002233"]}
          amplitude={0.8}
          blend={1}
        />
      </div>
      <div className="container mx-auto py-10 px-4 z-0">
        <Tabs defaultValue="assistant" className="w-full ">
          <TabsList
            className="grid w-full grid-cols-2 gap-4"
            style={{ backgroundColor: "transparent", borderColor: "#00BFFF" }}
          >
            <TabsTrigger
              value="assistant"
              className="data-[state=active]:bg-transparent text-[#00FFFF] border border-transparent data-[state=active]:border-[#00FFFF]"
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </TabsTrigger>

            <TabsTrigger
              value="insights"
              className="data-[state=active]:bg-transparent text-[#00FFFF] border border-transparent data-[state=active]:border-[#00FFFF]"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            <Card
              style={{
                backgroundColor: "transparent",
                borderColor: "#00BFFF",
                boxShadow: "0 0 10px rgba(0, 191, 255, 0.3)",
              }}
            >
              <CardHeader>
                <CardTitle
                  style={{
                    color: "#00FFFF",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Sparkles className="h-5 w-5" />
                  Data Insights & Trends
                </CardTitle>
                <CardDescription style={{ color: "rgba(0, 191, 255, 0.7)" }}>
                  {fileData
                    ? `Analysis of "${fileData.name}" (${fileData.rowCount} rows, ${fileData.columnCount} columns)`
                    : "AI-powered analysis of your Excel data and recommended visualizations"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {fileData && dataSample.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 style={{ color: "#00FFFF" }}>Data Preview</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDataPreview(!showDataPreview)}
                        style={{ borderColor: "#00BFFF", color: "#00FFFF" }}
                      >
                        {showDataPreview ? "Hide Preview" : "Show Preview"}
                      </Button>
                    </div>

                    {showDataPreview && (
                      <div
                        className="overflow-x-auto"
                        style={{
                          backgroundColor: "rgba(26, 26, 26, 0.8)",
                          border: "1px solid rgba(0, 191, 255, 0.3)",
                          borderRadius: "0.5rem",
                          padding: "0.5rem",
                        }}
                      >
                        <table className="w-full">
                          <thead>
                            <tr>
                              {fileData.headers.map((header, index) => (
                                <th
                                  key={index}
                                  className="px-2 py-1 text-left text-xs"
                                  style={{
                                    color: "#00FFFF",
                                    borderBottom:
                                      "1px solid rgba(0, 191, 255, 0.3)",
                                  }}
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {dataSample.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {fileData.headers.map((header, colIndex) => (
                                  <td
                                    key={colIndex}
                                    className="px-2 py-1 text-xs"
                                    style={{
                                      color: "#ffffff",
                                      borderBottom:
                                        "1px solid rgba(26, 26, 26, 0.5)",
                                    }}
                                  >
                                    {row[header] !== undefined
                                      ? String(row[header])
                                      : ""}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid gap-4">
                  {loading ? (
                    <div className="flex justify-center items-center py-10">
                      <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2"
                        style={{ borderColor: "#00FFFF" }}
                      ></div>
                    </div>
                  ) : (
                    insights.map((insight, index) => (
                      <Card
                        key={index}
                        style={{
                          backgroundColor: "rgba(26, 26, 26, 0.8)",
                          borderColor: "#00BFFF",
                          transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        className="hover:shadow-lg hover:-translate-y-1"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle
                            className="text-lg flex items-center gap-2"
                            style={{ color: "#00FFFF" }}
                          >
                            {getChartIcon(insight.chartType)}
                            {insight.title}
                          </CardTitle>
                          <CardDescription
                            style={{ color: "rgba(0, 191, 255, 0.7)" }}
                          >
                            Recommended chart:{" "}
                            <span style={{ color: "#00FFFF" }}>
                              {insight.chartType} chart
                            </span>
                            <span
                              className="ml-2 px-2 py-0.5 rounded text-xs"
                              style={{
                                backgroundColor: "rgba(0, 255, 255, 0.2)",
                                color: "#00FFFF",
                                border: "1px solid rgba(0, 255, 255, 0.3)",
                              }}
                            >
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p style={{ color: "#ffffff" }}>
                            {insight.description}
                          </p>
                        </CardContent>
                        
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={generateNewInsights}
                  disabled={loading}
                  style={{
                    backgroundColor: "#00BFFF",
                    color: "#000000",
                    boxShadow: "0 0 10px rgba(0, 191, 255, 0.5)",
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate New Insights
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="assistant">
            <Card
              style={{
                backgroundColor: "transparent",
                borderColor: "#00BFFF",
                boxShadow: "0 0 10px rgba(0, 191, 255, 0.3)",
              }}
            >
              <CardHeader>
                <CardTitle
                  style={{
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  className={"text-xl"}
                >
                  <Bot className="h-5 w-5 " />
                  AI Data Assistant
                </CardTitle>
                <CardDescription style={{ color: "rgba(0, 191, 255, 0.7)" }} className={"text-md"}>
                  Upload Excel files and chat with AI to get personalized data
                  visualization recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="flex flex-col h-[400px] overflow-hidden"
                  style={{
                    border: "1px solid rgba(0, 191, 255, 0.3)",
                    borderRadius: "0.5rem",
                    backgroundColor: "transparent",
                  }}
                >
                  <div className="flex-1 overflow-y-auto p-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 flex ${
                          message.role === "assistant"
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === "assistant"
                              ? "rounded-tl-none"
                              : "rounded-tr-none"
                          }`}
                          style={{
                            backgroundColor:
                              message.role === "assistant"
                                ? "rgba(0, 191, 255, 0.2)"
                                : "rgba(0, 255, 255, 0.2)",
                            borderColor:
                              message.role === "assistant"
                                ? "#00BFFF"
                                : "#00FFFF",
                            borderWidth: "1px",
                            color:
                              message.role === "assistant"
                                ? "#00BFFF"
                                : "#00FFFF",
                          }}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {analyzing && (
                      <div className="mb-4 flex justify-start">
                        <div
                          className="max-w-[80%] rounded-lg rounded-tl-none px-4 py-2"
                          style={{
                            backgroundColor: "rgba(0, 191, 255, 0.2)",
                            borderColor: "#00BFFF",
                            borderWidth: "1px",
                            color: "#00BFFF",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="animate-pulse">Analyzing</div>
                            <div className="flex space-x-1">
                              <div
                                className="h-2 w-2 rounded-full bg-current animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              ></div>
                              <div
                                className="h-2 w-2 rounded-full bg-current animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              ></div>
                              <div
                                className="h-2 w-2 rounded-full bg-current animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div
                    className="p-3 border-t"
                    style={{ borderColor: "rgba(0, 191, 255, 0.3)" }}
                  >
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        style={{ borderColor: "#00BFFF", color: "#00FFFF", backgroundColor:"black" }}
                      >
                        <Upload className="h-4 w-4" />
                        <span className="sr-only">Upload file</span>
                      </Button>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="hidden "
                        onChange={handleFileUpload}
                      />
                      <Input
                        placeholder="Ask about your data..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        style={{
                          backgroundColor: "rgba(26, 26, 26, 0.8)",
                          borderColor: "#00BFFF",
                        }}
                        className={"text-cyan-200"}
                      />
                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() && !analyzing}
                        style={{
                          backgroundColor: "#00BFFF",
                          color: "#000000",
                        }}
                      >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div style={{ color: "rgba(0, 191, 255, 0.7)" }}>
                  {file && (
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4"
                        onClick={() => {
                          setFile(null);
                          setParsedData([]);
                          setDataSample([]);
                          setFileData(null);
                        }}
                        style={{ color: "#00FFFF" }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
