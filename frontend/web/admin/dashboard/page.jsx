"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Aurora from "@/components/ui/aurora"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminWelcomeSection } from "@/components/admin-welcome-section"
import { AdminFeatureCard } from "@/components/admin-feature-card"
import { FileUp, BarChart3, Users, Shield } from "lucide-react"

const adminFeatures = [
  {
    icon: <Users className="w-6 h-6 text-indigo-500" />,
    title: "User Management",
    description: "Manage users, roles, and account permissions across the platform.",
  },
  {
    icon: <FileUp className="w-6 h-6 text-sky-500" />,
    title: "File Administration",
    description: "Upload and manage Excel files with administrative privileges.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
    title: "Analytics Dashboard",
    description: "Create charts and visualizations with full admin access.",
  },
  {
    icon: <Shield className="w-6 h-6 text-slate-500" />,
    title: "System Security",
    description: "Monitor system activity and manage security settings.",
  },
]

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    const role = localStorage.getItem("role")
    const name = localStorage.getItem("username")
    const email = localStorage.getItem("email")

    if (role !== "admin" && role !== "superadmin") {
      navigate("/dashboard")
      return
    }

    if (name && email) {
      setAdmin({ name, email, role })
    }
  }, [navigate])

  if (!admin) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-500">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-screen w-full bg-slate-50 overflow-hidden">
      <AdminSidebar />
      <div className="relative flex-1 h-full overflow-y-auto">
        <div className="absolute inset-0 z-0 opacity-20">
          <Aurora colorStops={["#a855f7", "#6366f1", "#38bdf8"]} amplitude={0.8} blend={0.6} />
        </div>
        <div className="relative z-10 p-8">
            <AdminWelcomeSection name={admin.name} />
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Admin Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {adminFeatures.map((feature, index) => (
                         <div key={index} className="animate-float" style={{ animationDelay: `${index * 0.15}s` }}>
                            <AdminFeatureCard feature={feature} />
                         </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}