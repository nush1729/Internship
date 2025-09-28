import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { WelcomeSection } from "@/components/welcome-section";
import { StatsCards } from "@/components/stats-cards";
import { FeatureCard } from "@/components/feature-card";
import { FileUp, BarChart3, BrainCog, MessageCircle } from "lucide-react";
import axios from "axios";

const baseurl = import.meta.env.VITE_API_BASE_URL;

const features = [
  {
    icon: <FileUp className="w-8 h-8 text-blue-500" />,
    title: "Upload Excel Files",
    description: "Upload .xlsx or .xls files and begin analyzing data instantly.",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-green-500" />,
    title: "Data Visualizations",
    description: "Visualize your data as charts, heatmaps, or line graphs.",
  },
  {
    icon: <BrainCog className="w-8 h-8 text-purple-500" />,
    title: "AI Insights",
    description: "Get recommendations and detect patterns from your data.",
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-yellow-500" />,
    title: "Ask the Chatbot",
    description: "Use natural language to query and explore your dataset.",
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    if (name && email) {
      setUser({ name, email });
    }

    const fetchFiles = () => {
      axios
        .get(`${baseurl}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setFiles(res.data?.records || []);
        })
        .catch((err) => console.error("Failed to fetch dashboard data:", err))
        .finally(() => setLoading(false));
    };

    fetchFiles();
  }, []);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full bg-slate-50 overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 h-screen overflow-y-auto p-8">
        <div className="space-y-8">
          <WelcomeSection name={user.name} />
          
          <StatsCards files={files} />
          
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Get Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="animate-float" style={{ animationDelay: `${index * 0.15}s` }}>
                  <FeatureCard feature={feature} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}