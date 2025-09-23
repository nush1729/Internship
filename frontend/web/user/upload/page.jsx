"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { UploadDialog } from "@/components/upload-dialog"
import { FileAnalysisInlineView } from "@/components/file-analysis"
import Iridescence from "@/components/ui/iridescence"

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
    // Open dialog when files are dropped
    setDialogOpen(true)
  }

  const openUploadDialog = () => {
    setDialogOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-[#0a0f1c] overflow-hidden text-white relative ">
      <div className="absolute inset-0 z-0 opacity-20 h-full">
        <Iridescence />
      </div>
      {/* Sidebar */}

      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 relative z-0">
        <main className="flex-1 p-6 space-y-6">
          <div className="text-center mt-8 space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-pink-400 bg-clip-text text-transparent">
              Upload Files
            </h1>
            <p className="text-slate-400">Transform your Excel data into beautiful visualizations</p>
          </div>

          {/* Dropzone */}
          <Card className="bg-transparent border border-blue-900/50 shadow-xl backdrop-blur-3xl">
            <CardHeader>
              <CardTitle className="text-blue-100 flex gap-2 items-center text-xl">
                <FileSpreadsheet className="w-5 h-5" />
                Upload Excel Files
              </CardTitle>
              <CardDescription className="text-slate-400">
                Drag and drop your .xlsx or .xls files here, or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-blue-400 bg-blue-900/20 scale-105"
                    : "border-slate-600 bg-slate-800 hover:border-blue-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-blue-300" />
                  </div>
                  <p className="text-xl font-semibold text-white">Drop your files here</p>
                  <p className="text-sm text-slate-400">Supports .xlsx and .xls files up to 50MB each</p>
                  <Button
                    variant="outline"
                    onClick={openUploadDialog}
                    className="border-blue-400 text-blue-300 hover:bg-blue-900 hover:text-blue-100"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {recentUploadedFile && showAnalysis && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <FileAnalysisInlineView file={recentUploadedFile} onClose={() => setShowAnalysis(false)} />
            </div>
          )}
        </main>
      </div>

      {/* Upload Dialog Component */}
      <UploadDialog
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        onUploadSuccess={(file, result) => {
          console.log("Upload success with result:", result)
          const fileData = {
            id: Date.now(),
            name: file.filename || file.name || "Unnamed",
            size: file.filesize
            ? `${(file.filesize / 1024).toFixed(2)} KB`
            : file.size
            ? `${(file.size / 1024).toFixed(2)} KB`
            : "Unknown",
            status: "completed",
            uploadedAt: new Date().toLocaleString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            charts: 0,
            originalFile: file,
            serverResponse: result,
          };

          setRecentUploadedFile(fileData)
          setShowAnalysis(true)
        }}
      />
    </div>
  )
}
