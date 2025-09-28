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
import { UploadDialog } from "@/components/upload-dialog";
import { FileAnalysisInlineView } from "@/components/file-analysis";
import axios from "axios";
import { Search, FileSpreadsheet, Eye, Trash2, AlertTriangle } from "lucide-react";
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
      await axios.delete(`${baseurl}/api/files/${deleteDialog.file.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUploadedFiles(prev => prev.filter(file => file.id !== deleteDialog.file.id));
      setDeleteDialog({ open: false, file: null });
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
    <div className="relative flex min-h-screen w-full bg-slate-50 text-slate-800">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col p-8">
        <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900">File Library</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
        </header>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Your Uploaded Files</CardTitle>
            <CardDescription>
              A complete history of all your uploaded Excel files. Click on a file to create a chart.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">File</TableHead>
                    <TableHead>Filesize</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>Columns</TableHead>
                    <TableHead>Uploaded At</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.map((file) => (
                    <TableRow key={file?.id} className="hover:bg-slate-50/50">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                          </div>
                          <p className="font-semibold text-slate-800">{file?.filename}</p>
                        </div>
                      </TableCell>
                      <TableCell>{file?.filesize || "-"}</TableCell>
                      <TableCell>{file?.rows ?? "-"}</TableCell>
                      <TableCell>{file?.columns ?? "-"}</TableCell>
                      <TableCell>
                        {file?.uploadedAt ? new Date(file.uploadedAt).toLocaleString() : "-"}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => handleViewFile(file)} title="View file details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteFile(file)} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" title="Delete file">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {selectedFile && analysisModalOpen && (
          <FileAnalysisInlineView file={selectedFile} onClose={() => setAnalysisModalOpen(false)} />
        )}
      </div>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, file: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete File
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.file?.filename}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, file: null })} disabled={deleting}>
              Cancel
            </Button>
            <Button onClick={confirmDeleteFile} className="bg-red-600 hover:bg-red-700" disabled={deleting}>
              {deleting ? "Deleting..." : "Delete File"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <UploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} onUploadSuccess={fetchFiles} />
    </div>
  );
}