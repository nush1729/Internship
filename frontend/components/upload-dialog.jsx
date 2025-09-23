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
    console.log("Selected file:", {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    })

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
    console.log("Upload success in dialog:", result)
    setUploadComplete(true)
    setUploadError(null)
    onUploadSuccess?.(file, result)

    // Auto-close dialog after 3 seconds
    setTimeout(() => {
      handleClose()
    }, 3000)
  }

  const handleUploadError = (error) => {
    console.error("Upload error in dialog:", error)
    setUploadError(error.message)
    setUploadComplete(false)
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset state after dialog closes
    setTimeout(() => {
      setSelectedFile(null)
      setUploadComplete(false)
      setUploadError(null)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-black/90 border border-blue-900/50 text-white backdrop-blur-xl shadow-[0_0_20px_rgba(0,191,255,0.3)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Upload Excel File
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {uploadComplete
              ? "File uploaded successfully!"
              : selectedFile
                ? "Review your file and upload to server"
                : "Select or drop a .xls or .xlsx file to continue"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {uploadError && (
            <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm">{uploadError}</span>
            </div>
          )}

          {uploadComplete ? (
            // Upload Success State
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-16 w-16 text-cyan-400 mb-4 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
              <h3 className="text-lg font-medium text-white mb-2">Upload Complete!</h3>
              <p className="text-sm text-slate-400">
                Your file "{selectedFile?.name}" has been uploaded and processed successfully.
              </p>
            </div>
          ) : !selectedFile ? (
            // File Selection State
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? "border-cyan-400 bg-cyan-900/20 shadow-[0_0_20px_rgba(0,255,255,0.3)] scale-105"
                  : "border-slate-600 bg-slate-800/50 hover:border-blue-500 hover:bg-blue-900/10"
              } backdrop-blur-sm`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mx-auto w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
                <Upload className="h-8 w-8 text-cyan-400" />
              </div>
              <p className="text-lg font-medium text-white mb-2">Drop your Excel file here</p>
              <p className="text-sm text-slate-400 mb-4">or click to browse files (Max 50MB)</p>

              <div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".xls,.xlsx"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button
                  variant="outline"
                  className="cursor-pointer border-cyan-400 text-cyan-300 hover:bg-cyan-900/20 hover:text-cyan-200 hover:border-cyan-300 bg-transparent"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </div>
          ) : (
            // File Selected State
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 border rounded-xl bg-blue-900/20 border-blue-500/50 backdrop-blur-sm shadow-[0_0_10px_rgba(0,191,255,0.2)]">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-cyan-800 rounded-lg flex items-center justify-center border border-blue-500/30">
                  <FileSpreadsheet className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{selectedFile.name}</p>
                  <p className="text-sm text-cyan-300">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                    {selectedFile.type.includes("sheet") ? "Excel 2007+" : "Excel 97-2003"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null)
                    setUploadError(null)
                  }}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {!uploadComplete && (
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
                  {selectedFile && !uploadError && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSelectedFile(null)
                        setUploadError(null)
                      }}
                      className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      Choose Different File
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {!uploadComplete && (
            <div className="flex justify-between items-center pt-4 border-t border-cyan-500 ">
              <UploadButton
                file={selectedFile}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                disabled={!selectedFile}
              >
                <Upload className="mr-2 h-4 w-4 " />
                Upload & Process File
              </UploadButton>

              <Button
                variant="outline"
                onClick={handleClose}
                className="h-10 px-4 border-slate-600 text-cyan-500 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
