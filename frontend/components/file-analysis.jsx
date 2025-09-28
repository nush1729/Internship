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

  useEffect(() => {
    if (file && file.originalFile) {
      setFileData(file.originalFile);
    } else if (file && (file.id || file.fileId)) {
      fetchFileData(file.id || file.fileId);
    } else {
      setError("File data is not available for chart creation.");
    }
  }, [file]);

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
      <Card className="border border-blue-200 bg-white/80 backdrop-blur-lg mt-6 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base text-slate-800">
            Analysis for: <span className="font-semibold text-blue-600">{file.filename || file.name}</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 w-8 h-8"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-sm text-slate-600 grid grid-cols-3 gap-4">
            <p>
              <strong className="text-slate-700">Size:</strong>{" "}
              {file.filesize || file.size || "Unknown"}
            </p>
            <p>
              <strong className="text-slate-700">Uploaded at:</strong>{" "}
              {file.uploadedAt
              ? new Date(file.uploadedAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
              : "-"}
            </p>

            <p>
              <strong className="text-slate-700">Charts Detected:</strong> {file.charts ?? 0}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-600">Loading file data...</span>
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
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