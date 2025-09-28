"use client"

import { Crown, Shield, Calendar, Clock } from "lucide-react"
import { useGreeting } from "@/hooks/use-greeting"

export function AdminWelcomeSection({ name, role }) {
  const { getGreeting, formatDate, formatTime } = useGreeting()

  return (
    <div className="w-full bg-white/80 backdrop-blur-lg border border-slate-200 shadow-lg rounded-xl p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 shadow-lg">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {`${getGreeting()}, ${name}!`}
          </h1>
          <div className="mt-2 flex items-center justify-center gap-2 text-indigo-600">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium capitalize">{role === 'superadmin' ? 'Super Administrator' : 'System Administrator'}</span>
          </div>
        </div>
        <p className="text-slate-600">
          You have full administrative access to the platform.
        </p>
        <div className="flex items-center gap-4 text-slate-500 text-sm pt-2">
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
      </div>
    </div>
  )
}