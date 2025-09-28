"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import { useGreeting } from "@/hooks/use-greeting"

export function WelcomeSection({ name }) {
  const { getGreeting, formatDate, formatTime, getTimeBasedMessage } = useGreeting()

  return (
    <Card className="w-full bg-white/80 backdrop-blur-lg border border-slate-200 shadow-lg">
      <CardContent className="p-8 text-center space-y-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            {`${getGreeting()}, ${name}!`}
          </h1>
          <p className="text-slate-600 mt-2">
            {getTimeBasedMessage()}
          </p>
        </div>
        <div className="flex justify-center items-center gap-4 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate()}</span>
          </div>
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatTime()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}