"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, Eye, Share } from "lucide-react"

export function ChartPreview({ chart }) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{chart.type}</Badge>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">

        <div className="h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
          <BarChart3 className="h-8 w-8 text-blue-600" />
        </div>

        <div>
          <CardTitle className="text-sm">{chart.title}</CardTitle>
          <p className="text-xs text-gray-500 mt-1">From {chart.file}</p>
          <p className="text-xs text-gray-400">Created {chart.created}</p>
        </div>
      </CardContent>
    </Card>
  )
}
