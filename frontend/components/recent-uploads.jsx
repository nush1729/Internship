"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, Eye, BarChart3 } from "lucide-react"
import { Files } from "./files"

export function RecentUploads({ files }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Recent Uploads
        </CardTitle>
        <CardDescription>Your latest uploaded Excel files</CardDescription>
      </CardHeader>
      <Files files={files}/>
    </Card>
  );
}
