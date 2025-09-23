"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { UploadDialog } from "@/components/upload-dialog";
import { FileAnalysisInlineView } from "@/components/file-analysis";
import axios from "axios";
import { Search, FileSpreadsheet, Eye, Trash2, AlertTriangle } from "lucide-react";
import Aurora from "@/components/ui/aurora";
import { toast } from "sonner";
const baseurl = import.meta.env.VITE_API_BASE_URL;

export default function FilesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, file: null });
  const [deleting, setDeleting] = useState(false);

  const filteredFiles = uploadedFiles.filter((file) =>
    file?.filename?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewFile = (file) => {
    setSelectedFile(file);
    setAnalysisModalOpen(true);
  };

  const handleDeleteFile = (file) => {
    setDeleteDialog({ open: true, file });
  };

  const confirmDeleteFile = async () => {
    if (!deleteDialog.file) return;

    setDeleting(true);
    try {
      // Call backend API to delete the file
      await axios.delete(`${baseurl}/api/files/${deleteDialog.file.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Remove file from local state
      setUploadedFiles(prev => prev.filter(file => file.id !== deleteDialog.file.id));
      
      // Close dialog
      setDeleteDialog({ open: false, file: null });
      
      // Show success message
      toast.success(`File "${deleteDialog.file.filename}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const fetchFiles = () => {
    axios
      .get(`${baseurl}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUploadedFiles(res.data?.records || []);
      })
      .catch((err) => console.error("Failed to fetch dashboard data:", err));
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 opacity-40 h-full">
        <Aurora
          colorStops={["#0038ff", "#00d4ff", "#002233"]}
          amplitude={0.8}
          blend={1}
        />
      </div>
      <div className="absolute inset-0 z-0 scale-y-[-1] opacity-40 h-full">
        <Aurora
          colorStops={["#0038ff", "#00d4ff", "#002233"]}
          amplitude={0.8}
          blend={1}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 space-y-6 mt-16">
            <Card className="border border-pink-500/20 bg-white/10">
              <CardHeader className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-[#fdfdff]">
                      File Library
                    </CardTitle>
                    <CardDescription className="text-[#aaaaaa]">
                      Complete history of all your uploaded files
                    </CardDescription>
                  </div>
                  <div className="relative ">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white " />
                    <Input
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 bg-white/10 border border-pink-100 text-pink-200 placeholder:text-white/40 focus:border-pink-400 "
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-white/5 uppercase text-sm tracking-wide">
                        <TableHead className="pl-6 text-white">File</TableHead>
                        <TableHead className="text-white">Filesize</TableHead>
                        <TableHead className="text-white">Rows</TableHead>
                        <TableHead className="text-white">Columns</TableHead>
                        <TableHead className="text-white">
                          Uploaded At
                        </TableHead>
                        <TableHead className="pr-6 text-right text-white">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFiles.map((file) => {
                        const uploadedAtFormatted = file?.uploadedAt
                          ? new Date(file.uploadedAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "-";

                        return (
                          <TableRow
                            key={file?.id}
                            className="hover:bg-white/10 transition-all duration-200"
                          >
                            <TableCell className="pl-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#00ffcc]/20 rounded-lg">
                                  <FileSpreadsheet className="h-5 w-5 text-[#00ffcc]" />
                                </div>
                                <p className="font-semibold text-white">
                                  {file?.filename}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-white/80">
                              {file?.filesize || "-"}
                            </TableCell>
                            <TableCell className="text-white/80">
                              {file?.rows ?? "-"}
                            </TableCell>
                            <TableCell className="text-white/80">
                              {file?.columns ?? "-"}
                            </TableCell>
                            <TableCell className="text-white/80">
                              {uploadedAtFormatted}
                            </TableCell>
                            <TableCell className="pr-6 text-right">
                              <div className="flex items-center gap-2 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewFile(file)}
                                  className="text-[#ff00d4] hover:bg-[#ff00d4]/10"
                                  title="View file details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteFile(file)}
                                  className="text-red-400 hover:bg-red-500/10"
                                  title="Delete file"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            {selectedFile && (
              <FileAnalysisInlineView
                file={selectedFile}
                onClose={() => setSelectedFile(null)}
              />
            )}
          </main>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => !open && setDeleteDialog({ open: false, file: null })}
      >
        <DialogContent className="bg-black border-red-600 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delete File
            </DialogTitle>
            <DialogDescription className="text-red-300">
              Are you sure you want to delete "{deleteDialog.file?.filename}"? This action cannot be undone and will also delete any charts created from this file.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, file: null })}
              className="border-cyan-600 text-cyan-400 hover:bg-cyan-900/20"
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteFile}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete File
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogs */}
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadSuccess={fetchFiles} // Refresh files after upload
      />
    </div>
  );
}