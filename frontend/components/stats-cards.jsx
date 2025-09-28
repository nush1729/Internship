"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, BarChart3, Brain, TrendingUp } from "lucide-react";

const parseSize = (str) => {
  if (!str) return 0;
  const [value, unit] = str.split(" ");
  const val = parseFloat(value);
  const multiplier = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  };
  return val * (multiplier[unit.toUpperCase()] || 0);
};

const formatBytes = (bytes) => {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${bytes.toFixed(2)} B`;
};

export function StatsCards({ files }) {
  const totalSizeInBytes = files.reduce(
    (sum, file) => sum + parseSize(file.filesize),
    0
  );

  const stats = [
    {
      title: "Total Files",
      value: files.length,
      icon: FileSpreadsheet,
    },
    {
      title: "Charts Created",
      value: "156",
      icon: BarChart3,
    },
    {
      title: "AI Insights",
      value: "42",
      icon: Brain,
    },
    {
      title: "Data Processed",
      value: formatBytes(totalSizeInBytes),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}