"use client"

import { Card, CardContent } from "@/components/ui/card"

export function AdminFeatureCard({ feature }) {
  return (
    <Card className="w-64 bg-white/70 backdrop-blur-md border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 hover:border-indigo-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 border border-indigo-200">
            {feature.icon}
          </div>
          <h3 className="font-semibold text-slate-800 text-lg mt-1">{feature.title}</h3>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
      </CardContent>
    </Card>
  )
}