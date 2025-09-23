import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { WelcomeSection } from "@/components/welcome-section";
import { FeatureCard } from "@/components/feature-card";
import { FileUp, BarChart3, BrainCog, MessageCircle } from "lucide-react";

const features = [
  {
    icon: <FileUp className="w-6 h-6 text-blue-500" />,
    title: "Upload Excel Files",
    description:
      "Upload .xlsx or .csv files and begin analyzing data instantly.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-green-500" />,
    title: "Data Visualizations",
    description: "Visualize your data as charts, heatmaps, or line graphs.",
  },
  {
    icon: <BrainCog className="w-6 h-6 text-purple-500" />,
    title: "AI Insights",
    description: "Get recommendations and detect patterns from your data.",
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-yellow-500" />,
    title: "Ask the Chatbot",
    description: "Use natural language to query and explore your dataset.",
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const name = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    if (name && email) {
      setUser({ name, email });
    }
  }, []);

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600">Loading your dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="relative flex h-screen w-full bg-gray-100 overflow-y-auto">
      <div className="z-20 flex justify-between">
        <DashboardSidebar />
      </div>
      <div className="relative flex-1 h-full overflow-y-auto">
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-white via-gray-50 to-blue-100"></div>
        <div className="relative z-10 flex flex-col items-center p-8">
            <WelcomeSection name={user.name} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                {features.map((feature, index) => (
                    <div key={index} className="animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                        <FeatureCard feature={feature} />
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}