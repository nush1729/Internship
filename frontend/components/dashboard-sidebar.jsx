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
    Users,
    UserCheck,
    Database,
    HelpCircle,
    LogOut,
    Upload,
    ChevronLeft,
    ChevronRight,
  } from "lucide-react";
  import { Badge } from "@/components/ui/badge";
  import { useNavigate, useLocation } from "react-router-dom";

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Files", href: "/dashboard/files", icon: FileSpreadsheet },
    { name: "Upload", href: "/dashboard/upload", icon: Upload },
    { name: "Charts", href: "/dashboard/charts", icon: BarChart3},
    { name: "AI Insights", href: "/dashboard/insights", icon: Brain},
  ];

  const role = localStorage.getItem("role") // 'admin' or 'user'


  export function DashboardSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const [isCollapsed, setIsCollapsed] = useState(true);
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
    
    if (role === "admin") {
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
            "flex flex-col backdrop-blur-2xl bg-[#0b0c10]/60 shadow-[0_0_10px_#06b6d4] transition-all duration-300 ease-in-out",
            isCollapsed ? "w-16" : "w-64"
          )}
        >
          <div className="flex items-center h-16 px-6 border-b border-[#1f1f1f]/60">
            {!isCollapsed ? (
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleNavigation("/dashboard")}
              >
                <span className="text-xl font-bold text-[#b8e2f4]">ExcelAI</span>
              </div>
            ) : (
              <div
                className="flex items-center justify-center w-full cursor-pointer"
                onClick={() => handleNavigation("/dashboard")}
              >
                <div className="w-8 h-8 bg-cyan-500/30 border border-cyan-500 p-2 flex items-center justify-center shadow-[0_0_8px_#06b6d4]">
                  <BarChart3 className="h-5 w-5 text-cyan-500" />
                </div>
              </div>
            )}
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <div key={item.name} className="relative group">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full gap-3 text-white hover:bg-cyan-500/10 hover:text-cyan-300 transition-all duration-200",
                      isCollapsed ? "justify-center px-2" : "justify-start",
                      isActive && "bg-cyan-500/10 text-cyan-300 "
                    )}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        
                        {item.admin && (
                          <Badge
                            variant="outline"
                            className="ml-auto text-xs text-blue-400 border border-blue-400"
                          >
                            Admin
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>

                  {isCollapsed && (
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-[#1a1a2e] text-cyan-300 text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow">
                      {item.name}
                      
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-[#1f1f1f]/60 space-y-1">
            {secondaryNavigation.map((item) => (
              <div key={item.name} className="relative group">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full gap-3 text-white hover:text-blue-400 hover:bg-cyan-500/10 transition-all duration-200",
                    isCollapsed ? "justify-center px-2" : "justify-start"
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && item.name}
                </Button>

                {isCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-[#1a1a2e] text-blue-400 text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow">
                    {item.name}
                  </div>
                )}
              </div>
            ))}

            <div className="relative group">
              <Button
                variant="ghost"
                className={cn(
                  "w-full gap-3 text-red-500 hover:text-red-400 hover:bg-red-900/30 transition-all duration-200",
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
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-[#1a1a2e] text-red-400 text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow">
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
            "absolute top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full border border-cyan-400 bg-[#0b0c10]/70 hover:bg-cyan-500/10 shadow-[0_0_10px_#06b6d4] transition-all duration-200",
            "flex items-center justify-center p-0 z-10",
            isCollapsed ? "-right-4" : "-right-4"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-cyan-300" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-cyan-300" />
          )}
        </Button>  
      </div>
    );
  }
