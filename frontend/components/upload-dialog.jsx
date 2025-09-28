"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle } from "lucide-react"
import { UploadButton } from "@/components/uploadbutton"

export function UploadDialog({ open, onOpenChange, onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      validateAndSetFile(files[0])
    }
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      validateAndSetFile(files[0])
    }
  }

  const validateAndSetFile = (file) => {
    const validTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
    const isValidType = validTypes.includes(file.type) || file.name.endsWith(".xls") || file.name.endsWith(".xlsx")

    if (!isValidType) {
      setUploadError("Please upload a valid Excel file (.xls or .xlsx)")
      return
    }

    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      setUploadError("File size must be less than 50MB")
      return
    }

    setSelectedFile(file)
    setUploadError(null)
  }

  const handleUploadSuccess = (file, result) => {
    setUploadComplete(true)
    setUploadError(null)
    onUploadSuccess?.(file, result)
    setTimeout(() => handleClose(), 3000)
  }

  const handleUploadError = (error) => {
    setUploadError(error.message)
    setUploadComplete(false)
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setSelectedFile(null)
      setUploadComplete(false)
      setUploadError(null)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white/80 border text-slate-800 backdrop-blur-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Upload Excel File
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {uploadComplete
              ? "File uploaded successfully!"
              : selectedFile
                ? "Review your file and upload"
                : "Select or drop a .xls or .xlsx file"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {uploadError && (
            <div className="flex items-center gap-2 p-3 bg-red-100/50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{uploadError}</span>
            </div>
          )}

          {uploadComplete ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Upload Complete!</h3>
              <p className="text-sm text-slate-500">
                "{selectedFile?.name}" has been processed.
              </p>
            </div>
          ) : !selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? "border-blue-500 bg-blue-50/50 scale-105"
                  : "border-slate-300 bg-slate-50/50 hover:border-blue-400"
              }`}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            >
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 border border-blue-200">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-slate-800 mb-2">Drop your file here</p>
              <p className="text-sm text-slate-500 mb-4">or click to browse (Max 50MB)</p>
              <div>
                <input id="file-upload-dialog" type="file" accept=".xls,.xlsx" className="hidden" onChange={handleFileSelect} />
                <Button variant="outline" onClick={() => document.getElementById("file-upload-dialog")?.click()}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 border rounded-xl bg-blue-50/50 border-blue-200">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border">
                  <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{selectedFile.name}</p>
                  <p className="text-sm text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setSelectedFile(null); setUploadError(null); }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <UploadButton file={selectedFile} onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError} disabled={!selectedFile}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload & Process
                </UploadButton>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}