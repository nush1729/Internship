"use client";

import { useState,useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileSpreadsheet,
  BarChart3,
  Brain,
  Settings,
  UserCheck,
  HelpCircle,
  LogOut,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Files", href: "/dashboard/files", icon: FileSpreadsheet },
  { name: "Upload", href: "/dashboard/upload", icon: Upload },
  { name: "Charts", href: "/dashboard/charts", icon: BarChart3},
  { name: "AI Insights", href: "/dashboard/insights", icon: Brain},
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleNavigation = (href) => {
    navigate(href);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const secondaryNavigation = [
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help", href: "/help", icon: HelpCircle },
  ];
  
  if (role === "admin" || role === "superadmin") {
    secondaryNavigation.push({
    name: "Switch to Admin",
    href: "/admin",
    icon: UserCheck,
  });
 }

  return (
    <div className="relative flex z-10">
      <div
        className={cn(
          "flex flex-col bg-white/80 backdrop-blur-lg border-r border-slate-200 shadow-sm transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center h-16 px-4 border-b border-slate-200">
          <div
              className="flex items-center gap-2 cursor-pointer w-full"
              onClick={() => handleNavigation("/dashboard")}
            >
              <div className="w-8 h-8 bg-blue-500/10 border border-blue-200 p-2 flex items-center justify-center rounded-lg shadow-sm">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              {!isCollapsed && (
                <span className="text-xl font-bold text-slate-800">ExcelAI</span>
              )}
            </div>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.name} className="relative group">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full gap-3 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200",
                    isCollapsed ? "justify-center px-2" : "justify-start",
                    isActive && "bg-blue-100 text-blue-700 font-semibold hover:bg-blue-100 hover:text-blue-700"
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
            );
          })}
        </nav>

        <div className="px-2 py-4 border-t border-slate-200 space-y-1">
          {secondaryNavigation.map((item) => (
            <div key={item.name} className="relative group">
              <Button
                variant="ghost"
                className={cn(
                  "w-full gap-3 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-all duration-200",
                  isCollapsed ? "justify-center px-2" : "justify-start"
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
                "w-full gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200",
                isCollapsed ? "justify-center px-2" : "justify-start"
              )}
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && "Sign Out"}
            </Button>

            {isCollapsed && (
              <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-slate-900 text-red-400 text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-slate-700">
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
  );
}