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
  CuboidIcon as Cube,
  Search,
  Filter,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { UploadDialog } from "@/components/upload-dialog";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import Aurora from "@/components/ui/aurora";
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
        const storedCharts = JSON.parse(
          localStorage.getItem("userCharts") || "[]"
        );
        setCharts(storedCharts);
        setFilteredCharts(storedCharts);
      } catch (error) {
        console.error("Error loading charts:", error);
        setCharts([]);
        setFilteredCharts([]);
      }
    };

    loadCharts();
    const handleStorageChange = () => loadCharts();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const filtered = charts.filter((chart) => {
      const matchesSearch = chart.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "all" ||
        chart.type.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesType;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created) - new Date(a.created);
        case "oldest":
          return new Date(a.created) - new Date(b.created);
        case "most-viewed":
          return (b.views || 0) - (a.views || 0);
        case "most-downloaded":
          return (b.downloads || 0) - (a.downloads || 0);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredCharts(filtered);
  }, [charts, searchTerm, filterType, sortBy]);

  const handleViewChart = (chartId) => {
    const updatedCharts = charts.map((chart) =>
      chart.id === chartId
        ? { ...chart, views: (chart.views || 0) + 1 }
        : chart
    );
    localStorage.setItem("userCharts", JSON.stringify(updatedCharts));
    setCharts(updatedCharts);
    navigate(`/chart/${chartId}`);
  };

  const handleDownloadChart = (chartId) => {
    const updatedCharts = charts.map((chart) =>
      chart.id === chartId
        ? { ...chart, downloads: (chart.downloads || 0) + 1 }
        : chart
    );
    localStorage.setItem("userCharts", JSON.stringify(updatedCharts));
    setCharts(updatedCharts);
    console.log("Downloading chart:", chartId);
  };

  const handleDeleteChart = (chart) => {
    setDeleteDialog({ open: true, chart });
  };

  const confirmDeleteChart = () => {
    if (!deleteDialog.chart) return;

    try {
      // Remove chart from localStorage
      const updatedCharts = charts.filter(chart => chart.id !== deleteDialog.chart.id);
      localStorage.setItem("userCharts", JSON.stringify(updatedCharts));
      
      // Remove chart config from localStorage
      localStorage.removeItem(`chartConfig_${deleteDialog.chart.id}`);
      
      // Update state
      setCharts(updatedCharts);
      
      // Close dialog
      setDeleteDialog({ open: false, chart: null });
      
      // Show success message
      toast.success(`Chart "${deleteDialog.chart.title}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting chart:", error);
      toast.error("Failed to delete chart");
    }
  };

  const getUniqueChartTypes = () => {
    const types = [...new Set(charts.map((chart) => chart.type))];
    return types;
  };

  const handleChartCreated = () => {
    const event = new Event("storage");
    window.dispatchEvent(event);
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a23] text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-60 h-full ">
        <Aurora
          colorStops={["#0038ff", "#00d4ff", "#002233"]}
          amplitude={1.2}
          blend={0.4} 
        />
      </div>
      <DashboardSidebar />

      <div className="flex-1 z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mt-12">
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold text-white">
                Charts History
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-cyan-300 bg-cyan-950 border border-cyan-400 px-3 py-1 rounded-full">
                {filteredCharts.length} of {charts.length} charts
              </div>
              <UploadDialog onChartCreated={handleChartCreated} />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-300" />
                <Input
                  placeholder="Search charts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-cyan-600 bg-black text-cyan-200"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40 border-cyan-600 bg-black text-white">
                    <Filter className="h-4 w-4 mr-2 text-cyan-400" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-cyan-600 text-white">
                    <SelectItem value="all">All Types</SelectItem>
                    {getUniqueChartTypes().map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 border-cyan-600 bg-black text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-cyan-600 text-white">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="most-viewed">Most Viewed</SelectItem>
                    <SelectItem value="most-downloaded">Most Downloaded</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          {filteredCharts.length === 0 ? (
            <div className="text-center py-1 flex flex-wrap flex-col">
              <h3 className="text-lg font-medium text-cyan-300 mb-2">
                {charts.length === 0
                  ? "No charts created yet "
                  : "No charts match your search"}
              </h3>
              <p className="text-cyan-400 mb-6">
                {charts.length === 0
                  ? "Upload an Excel file and create your first chart!"
                  : "Try adjusting your search terms or filters"}
              </p>
              {charts.length === 0 ? (
                <UploadDialog onChartCreated={handleChartCreated} />
              ) : null}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filteredCharts.map((chart) => (
                <div
                  key={chart.id}
                  className="bg-black border border-cyan-600 rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-shadow h-full"
                >
                  <div className="flex items-center justify-between mb-3 text-cyan-300 text-sm">
                    <div className="flex items-center gap-2">
                      <Cube className="h-4 w-4" />
                      <span className="capitalize">{chart.type}</span>
                    </div>
                    <span className="text-xs">
                      {new Date(chart.created).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold text-cyan-100 mb-3 break-words">
                    {chart.title}
                  </h2>

                  <div className="flex items-center gap-2 flex-wrap text-xs text-cyan-400 mb-4">
                    <Badge variant="outline" className="border-cyan-500 text-cyan-300">
                      Views: {chart.views || 0}
                    </Badge>
                    <Badge variant="outline" className="border-cyan-500 text-cyan-300">
                      Downloads: {chart.downloads || 0}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mt-auto pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-cyan-400 border-cyan-500 bg-black hover:bg-cyan-900/20"
                      onClick={() => handleDownloadChart(chart.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      onClick={() => handleViewChart(chart.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-400 border-red-500 bg-black hover:bg-red-900/20"
                      onClick={() => handleDeleteChart(chart)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, chart: null })}>
        <DialogContent className="bg-black border-red-600 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delete Chart
            </DialogTitle>
            <DialogDescription className="text-red-300">
              Are you sure you want to delete "{deleteDialog.chart?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, chart: null })}
              className="border-cyan-600 text-cyan-400 hover:bg-cyan-900/20"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteChart}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Chart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}