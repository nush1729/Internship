"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, BarChart3, AlertCircle } from "lucide-react";
import { ChartCreationDialog } from "@/components/chart-creation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function FileAnalysisInlineView({ file, onClose }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // When the component mounts or file changes, try to retrieve the file data
  useEffect(() => {
    console.log("file received:", file);

    if (file && file.originalFile) {
      console.log("Using originalFile:", file.originalFile);
      setFileData(file.originalFile);
    } else if (file && (file.id || file.fileId)) {
      console.log("Fetching file data from server:", file.id || file.fileId);
      fetchFileData(file.id || file.fileId);
    } else {
      setError("File data is not available for chart creation.");
    }
  }, [file]);

  // Function to fetch file data from backend
  const fetchFileData = async (fileId) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/file/${fileId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch file data: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        // Create a virtual file object with the data
        const virtualFile = {
          name: result.filename,
          data: result.data,
          rows: result.rows,
          columns: result.columns,
          isVirtualFile: true
        };
        setFileData(virtualFile);
      } else {
        throw new Error("Invalid file data received from server");
      }
    } catch (err) {
      console.error("Failed to retrieve file data:", err);
      setError("Could not retrieve the file data for chart creation.");
    } finally {
      setLoading(false);
    }
  };


  if (!file) return null;

  return (
    <>
      <Card className="border border-pink-500/20 bg-white/10 text-white">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Analysis for: {file.filename || file.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-red-500"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p>
              <strong>Size:</strong>{" "}
              {file.filesize || file.size || "Unknown"}
            </p>
            <p>
              <strong>Uploaded at:</strong>{" "}
              {file.uploadedAt
              ? new Date(file.uploadedAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
              : "-"}
            </p>

            <p>
              <strong>Charts Detected:</strong> {file.charts ?? 0}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
              <span className="text-blue-400">Loading file data...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-[--neon-dark] text-white border border-[--neon-blue] shadow-[0_0_10px_rgba(0,191,255,0.6)] 
             hover:bg-gradient-to-r hover:from-[--neon-blue] hover:to-[--neon-cyan] 
             hover:shadow-[0_0_20px_rgba(0,255,255,0.8)] transition duration-300"
              disabled={!fileData}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Create Chart
            </Button>
          )}
        </CardContent>
      </Card>

      <ChartCreationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedFile={fileData}
      />
    </>
  );
}
