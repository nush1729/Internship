"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"

export function WelcomeSection({ name }) {
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

  const getGreetingEmoji = () => {
    const hour = currentTime.getHours()
    
    if (hour >= 5 && hour < 12) {
      return "🌅" // Morning sunrise
    } else if (hour >= 12 && hour < 17) {
      return "☀️" // Afternoon sun
    } else if (hour >= 17 && hour < 22) {
      return "🌆" // Evening sunset
    } else {
      return "🌙" // Night moon
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
    <div className="text-gray-800 text-center space-y-4"> {/* <-- FIX */}
      <p className="text-3xl md:text-4xl font-bold z-10">
        {`${getGreeting()}, ${name}! ${getGreetingEmoji()}`}
      </p>

      <div className="flex justify-center items-center gap-4 text-gray-500 text-sm"> {/* <-- FIX */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate()}</span>
        </div>
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        <span>{formatTime()}</span>
      </div>

      <p className="text-gray-500 text-sm"> {/* <-- FIX */}
        Ready to analyze your data? You have 3 new insights waiting for you.
      </p>
    </div>
  )
}