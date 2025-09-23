"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export function AdminRouteGuard({ children }) {
  const navigate = useNavigate()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminAccess = () => {
      const token = localStorage.getItem("token")
      const role = localStorage.getItem("role")

      if (!token) {
        navigate("/")
        return
      }

      // FIX: Allow 'superadmin' in addition to 'admin'
      if (role !== "admin" && role !== "superadmin") {
        navigate("/dashboard")
        return
      }

      setIsAuthorized(true)
      setLoading(false)
    }

    checkAdminAccess()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-300">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return children
}