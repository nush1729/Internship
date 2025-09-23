"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { handleSignOut } from "@/services/api"

const adminNavigation = [
  { name: "Admin Dashboard", href: "/admin", icon: Shield },
  { name: "User Management", href: "/admin/users", icon: Users},
]

export function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleNavigation = (href) => {
    navigate(href)
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Dynamically create secondary navigation based on role
  const adminSecondaryNavigation = [
    { name: role === 'superadmin' ? "Superadmin Settings" : "Admin Settings", href: "/admin/settings", icon: Settings },
    { name: "Switch to User", href: "/dashboard", icon: UserCheck },
    { name: "Help", href: "/admin/help", icon: HelpCircle },
  ]

  return (
    <div className="relative flex z-10">
      <div
        className={cn(
          "flex flex-col bg-slate-800 text-white transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex items-center h-16 px-4 border-b border-slate-700">
          <div
              className="flex items-center gap-2 cursor-pointer w-full"
              onClick={() => handleNavigation("/admin")}
            >
              <div className="w-8 h-8 bg-indigo-500/20 border border-indigo-500 p-2 flex items-center justify-center rounded-lg shadow-sm">
                <Shield className="h-5 w-5 text-indigo-400" />
              </div>
              {!isCollapsed && (
                <span className="text-xl font-bold text-slate-200">Admin</span>
              )}
            </div>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {adminNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <div key={item.name} className="relative group">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full gap-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200",
                    isCollapsed ? "justify-center px-2" : "justify-start",
                    isActive && "bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 hover:text-indigo-200",
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="flex-1 text-left">{item.name}</span>
                  )}
                </Button>

                {isCollapsed && (
                  <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-slate-900 text-white text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-slate-700">
                    {item.name}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="px-2 py-4 border-t border-slate-700 space-y-1">
          {adminSecondaryNavigation.map((item) => (
            <div key={item.name} className="relative group">
              <Button
                variant="ghost"
                className={cn(
                  "w-full gap-3 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200",
                  isCollapsed ? "justify-center px-2" : "justify-start",
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && item.name}
              </Button>

              {isCollapsed && (
                <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-slate-900 text-white text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-slate-700">
                  {item.name}
                </div>
              )}
            </div>
          ))}

          <div className="relative group">
            <Button
              variant="ghost"
              className={cn(
                "w-full gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200",
                isCollapsed ? "justify-center px-2" : "justify-start",
              )}
              onClick={() => handleSignOut(navigate)}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && "Sign Out"}
            </Button>

            {isCollapsed && (
              <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-slate-900 text-red-300 text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-slate-700">
                Sign Out
              </div>
            )}
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className={cn(
          "absolute top-16 transform h-8 w-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 shadow-md transition-all duration-200",
          "flex items-center justify-center p-0 z-10",
           isCollapsed ? "left-14" : "left-60"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-slate-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-slate-600" />
        )}
      </Button>
    </div>
  )
}