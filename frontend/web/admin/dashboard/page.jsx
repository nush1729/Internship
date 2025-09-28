"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminWelcomeSection } from "@/components/admin-welcome-section"
import { AdminFeatureCard } from "@/components/admin-feature-card"
import { AdminStatsCards } from "@/components/admin-stats-cards"
import { Users, FileUp, BarChart3, Shield } from "lucide-react"
import axios from "axios"

const baseurl = import.meta.env.VITE_API_BASE_URL;

const adminFeatures = [
  {
    icon: <Users className="w-6 h-6 text-indigo-500" />,
    title: "User Management",
    description: "Manage users, roles, and account permissions across the platform.",
  },
  {
    icon: <FileUp className="w-6 h-6 text-sky-500" />,
    title: "File Administration",
    description: "Oversee all uploaded files and manage user content.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
    title: "Platform Analytics",
    description: "View system-wide analytics and usage statistics.",
  },
  {
    icon: <Shield className="w-6 h-6 text-slate-500" />,
    title: "System Security",
    description: "Monitor activity and manage security settings.",
  },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFiles: 0,
    totalCharts: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("username");

    if (role !== "admin" && role !== "superadmin") {
      navigate("/dashboard");
      return;
    }

    if (name) {
      setAdmin({ name, role });
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const usersResponse = await axios.get(`${baseurl}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const users = usersResponse.data || [];
        const totalUsers = users.length;
        const totalFiles = users.reduce((acc, user) => acc + (user.fileCount || 0), 0);
        const totalCharts = users.reduce((acc, user) => acc + (user.chartCount || 0), 0);

        const requestsResponse = await axios.get(`${baseurl}/api/admin/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pendingRequests = (requestsResponse.data || []).length;

        setStats({ totalUsers, totalFiles, totalCharts, pendingRequests });
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [navigate]);

  if (loading || !admin) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-500">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 h-screen overflow-y-auto p-8">
        <div className="space-y-8">
          <AdminWelcomeSection name={admin.name} role={admin.role} />
          
          <AdminStatsCards stats={stats} />
          
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Admin Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adminFeatures.map((feature, index) => (
                <AdminFeatureCard key={index} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}