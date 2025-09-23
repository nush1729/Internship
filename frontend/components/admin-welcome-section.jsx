"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Crown, Shield, Calendar, Clock } from "lucide-react"

export function AdminWelcomeSection({ name }) {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute to keep greeting current
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    
    if (hour >= 5 && hour < 12) {
      return "Good morning"
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon"
    } else if (hour >= 17 && hour < 22) {
      return "Good evening"
    } else {
      return "Good night"
    }
  }

  const formatDate = () => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = () => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <Card className="bg-white/80 backdrop-blur-lg border border-slate-200 shadow-lg">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 shadow-lg">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {`${getGreeting()}, ${name}!`}
          </h1>
          <div className="flex items-center justify-center gap-2 text-indigo-600">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">System Administrator</span>
          </div>
        </div>

        <div className="space-y-3 text-slate-600">
          <p className="text-lg">You have full administrative access to the platform</p>
          <p className="text-sm opacity-80">Manage users, oversee file uploads, and monitor system analytics</p>
        </div>

        <div className="mt-6 flex justify-center items-center gap-4 text-slate-500 text-sm">
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