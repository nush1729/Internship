"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, Eye } from "lucide-react"

const recentCharts = [
  {
    title: "Sales Trend",
    type: "Line Chart",
    file: "Sales_Data_Q4.xlsx",
    created: "2 hours ago",
  },
  {
    title: "Revenue by Region",
    type: "Bar Chart",
    file: "Sales_Data_Q4.xlsx",
    created: "3 hours ago",
  },
  {
    title: "Customer Distribution",
    type: "3D Pie Chart",
    file: "Customer_Analytics.xls",
    created: "1 day ago",
  },
]

export function ChartGallery() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Recent Charts
        </CardTitle>
        <CardDescription>Your latest generated visualizations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentCharts.map((chart, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{chart.title}</h4>
                <p className="text-xs text-gray-500">
                  {chart.type} • {chart.created}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{chart.type}</Badge>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
