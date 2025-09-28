"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { UploadDialog } from "@/components/upload-dialog"
import { FileAnalysisInlineView } from "@/components/file-analysis"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [recentUploadedFile, setRecentUploadedFile] = useState(null)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setDialogOpen(true)
  }

  const openUploadDialog = () => {
    setDialogOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden text-slate-800 relative">
      <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-white via-slate-50 to-blue-100"></div>
      <DashboardSidebar />

      <div className="flex flex-col flex-1 relative z-10">
        <main className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl text-center space-y-4 mb-12">
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
              Upload & Visualize
            </h1>
            <p className="text-lg text-slate-500">
              Transform your Excel data into beautiful, interactive visualizations in just a few clicks.
            </p>
          </div>

          <Card
            className="w-full max-w-2xl bg-white/60 backdrop-blur-lg border-2 border-dashed border-slate-300 transition-all duration-300 ease-in-out hover:border-blue-400 hover:shadow-2xl"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <CardContent className="p-12">
              <div
                className={`flex flex-col items-center justify-center space-y-6 text-center transition-transform duration-300 ${
                  dragActive ? "scale-105" : "scale-100"
                }`}
              >
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full bg-blue-100 animate-pulse-glow"></div>
                  <div className="relative w-full h-full bg-blue-100/50 rounded-full flex items-center justify-center border-4 border-white">
                    <Upload className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-slate-800">
                    Drop your Excel file here
                  </p>
                  <p className="text-slate-500">
                    Supports .xlsx and .xls files up to 50MB
                  </p>
                </div>
                <Button
                  onClick={openUploadDialog}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Or Choose a File
                </Button>
              </div>
            </CardContent>
          </Card>

          {recentUploadedFile && showAnalysis && (
            <div className="w-full max-w-2xl mt-8 animate-in slide-in-from-bottom-4 duration-500">
              <FileAnalysisInlineView file={recentUploadedFile} onClose={() => setShowAnalysis(false)} />
            </div>
          )}
        </main>
      </div>

      <UploadDialog
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        onUploadSuccess={(file, result) => {
          const fileData = {
            id: result.fileId || Date.now(),
            filename: result.filename,
            filesize: result.fileSize,
            status: "completed",
            uploadedAt: new Date().toLocaleString(),
            charts: 0,
            originalFile: file,
            serverResponse: result,
          };
          setRecentUploadedFile(fileData);
          setShowAnalysis(true);
        }}
      />
    </div>
  )
}