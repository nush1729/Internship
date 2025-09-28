"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileSpreadsheet, BarChart3, AlertTriangle } from "lucide-react";

export function AdminStatsCards({ stats }) {
  const statsData = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Files Uploaded",
      value: stats.totalFiles,
      icon: FileSpreadsheet,
      color: "text-sky-500",
      bgColor: "bg-sky-100",
    },
    {
      title: "Charts Generated",
      value: stats.totalCharts,
      icon: BarChart3,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: AlertTriangle,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => (
        <Card key={stat.title} className="bg-white/80 backdrop-blur-lg border border-slate-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}