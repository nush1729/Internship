"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BarChart3,
  Download,
  Eye,
  Search,
  Filter,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { UploadDialog } from "@/components/upload-dialog";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { toast } from "sonner";

export default function ChartsHistoryPage() {
  const navigate = useNavigate();
  const [charts, setCharts] = useState([]);
  const [filteredCharts, setFilteredCharts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, chart: null });

  useEffect(() => {
    const loadCharts = () => {
      try {
        const storedCharts = JSON.parse(localStorage.getItem("userCharts") || "[]");
        setCharts(storedCharts);
      } catch (error) {
        console.error("Error loading charts:", error);
        setCharts([]);
      }
    };
    loadCharts();
    const handleStorageChange = () => loadCharts();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    let filtered = charts.filter((chart) => {
      const matchesSearch = chart.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || chart.type.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesType;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.created) - new Date(a.created);
        case "oldest": return new Date(a.created) - new Date(b.created);
        case "title": return a.title.localeCompare(b.title);
        default: return 0;
      }
    });
    setFilteredCharts(filtered);
  }, [charts, searchTerm, filterType, sortBy]);

  const handleViewChart = (chartId) => {
    navigate(`/chart/${chartId}`);
  };

  const handleDeleteChart = (chart) => {
    setDeleteDialog({ open: true, chart });
  };

  const confirmDeleteChart = () => {
    if (!deleteDialog.chart) return;
    try {
      const updatedCharts = charts.filter(chart => chart.id !== deleteDialog.chart.id);
      localStorage.setItem("userCharts", JSON.stringify(updatedCharts));
      localStorage.removeItem(`chartConfig_${deleteDialog.chart.id}`);
      setCharts(updatedCharts);
      setDeleteDialog({ open: false, chart: null });
      toast.success(`Chart "${deleteDialog.chart.title}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting chart:", error);
      toast.error("Failed to delete chart");
    }
  };

  const getUniqueChartTypes = () => [...new Set(charts.map((chart) => chart.type))];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Charts History</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium">
              {filteredCharts.length} of {charts.length} charts found
            </div>
            <UploadDialog onUploadSuccess={() => window.dispatchEvent(new Event("storage"))} />
          </div>
        </header>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search charts by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2 text-slate-500" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {getUniqueChartTypes().map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredCharts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed">
            <BarChart3 className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-700">
              {charts.length === 0 ? "No charts created yet" : "No charts match your search"}
            </h3>
            <p className="text-slate-500 mt-2">
              {charts.length === 0 ? "Upload a file to get started!" : "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCharts.map((chart) => (
              <div key={chart.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">{chart.type}</Badge>
                  <p className="text-xs text-slate-500">{new Date(chart.created).toLocaleDateString()}</p>
                </div>
                <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-10 w-10 text-blue-500" />
                </div>
                <h2 className="text-base font-semibold text-slate-800 mb-2 truncate" title={chart.title}>{chart.title}</h2>
                <p className="text-xs text-slate-500 mb-4 truncate">From: {chart.file}</p>
                <div className="flex items-center gap-2 mt-auto">
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handleViewChart(chart.id)}>
                    <Eye className="h-4 w-4 mr-2" /> View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteChart(chart)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, chart: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" /> Delete Chart
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.chart?.title}"? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, chart: null })}>Cancel</Button>
            <Button onClick={confirmDeleteChart} className="bg-red-600 hover:bg-red-700">
              Delete Chart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}