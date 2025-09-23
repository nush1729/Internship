"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Shield,
  Search,
  Users,
  Settings,
  Activity,
  Crown,
  Database,
  Lock,
  AlertTriangle,
  BookOpen,
  Video,
  Mail,
  Phone,
  ExternalLink,
  Zap,
  Brain,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import Aurora from "@/components/ui/aurora"

const adminFaqData = [
  {
    category: "User Management",
    
    questions: [
      {
        question: "How do I promote a user to admin?",
        answer: "Go to Admin > Users, find the user you want to promote, and click the crown icon next to their name. Confirm the promotion in the dialog. The user will immediately gain admin privileges."
      },
      {
        question: "How do I suspend a user account?",
        answer: "In the Users section, click the suspend icon (UserX) next to the user's name. Suspended users will lose access to the platform but their data remains intact."
      },
      {
        question: "Can I view a user's uploaded files and charts?",
        answer: "Yes, click the expand arrow next to any user in the Users table to view their files and charts. You can also delete individual files or charts if needed."
      },
      {
        question: "How do I handle admin access requests?",
        answer: "Admin requests appear in your Settings page. Review the user's reason and experience, then approve or reject the request. Approved users immediately gain admin privileges."
      }
    ]
  },
  {
    category: "System Administration",

    questions: [
      {
        question: "How do I monitor system activity?",
        answer: "Use the System Activity page to view real-time logs of user actions, file uploads, chart creations, and system events. You can filter by date, user, or activity type."
      },
      {
        question: "What admin privileges do I have?",
        answer: "As an admin, you can manage users, view all files and charts, access system analytics, approve admin requests, and monitor platform activity. You also have enhanced AI features."
      },
      {
        question: "How do I backup user data?",
        answer: "Currently, data backup is handled automatically by our system. For manual exports or specific user data, contact technical support with your admin credentials."
      },
      {
        question: "Can I see platform usage statistics?",
        answer: "Yes, the Admin Dashboard provides overview statistics including total users, files uploaded, charts created, and system performance metrics."
      }
    ]
  },
  {
    category: "Security & Compliance",

    questions: [
      {
        question: "How do I ensure data security?",
        answer: "All data is encrypted at rest and in transit. Regularly review user access, monitor suspicious activity in the Activity logs, and ensure only trusted users have admin privileges."
      },
      {
        question: "What should I do if I suspect unauthorized access?",
        answer: "Immediately suspend the affected user account, review activity logs for the timeframe in question, and contact support. Change admin passwords if necessary."
      },
      {
        question: "How do I manage user permissions?",
        answer: "User permissions are role-based (user/admin). Users can only access their own data, while admins have system-wide access. Promote users to admin only when necessary."
      },
      {
        question: "Are there audit logs available?",
        answer: "Yes, the System Activity page provides comprehensive audit logs including user actions, admin activities, and system events with timestamps and user identification."
      }
    ]
  },
  {
    category: "Advanced Features",

    questions: [
      {
        question: "What additional AI features do admins have?",
        answer: "Admins have access to system-wide analytics, cross-user data insights, predictive analytics, and enhanced AI recommendations for platform optimization."
      },
      {
        question: "How do I optimize platform performance?",
        answer: "Monitor user activity patterns, identify peak usage times, review file upload sizes, and use the admin AI insights to get recommendations for system optimization."
      },
      {
        question: "Can I set system-wide policies?",
        answer: "Currently, file size limits and user permissions are preset. For custom policies or enterprise features, contact support to discuss your requirements."
      },
      {
        question: "How do I handle large-scale user management?",
        answer: "Use the search and filter features in the Users section. For bulk operations or enterprise user management, contact support for additional tools and features."
      }
    ]
  },
  {
    category: "Troubleshooting",

    questions: [
      {
        question: "A user reports they can't upload files. How do I help?",
        answer: "Check if the user's account is active (not suspended), verify file format and size limits, and review recent activity logs for error messages. Guide them through the upload process if needed."
      },
      {
        question: "How do I resolve chart rendering issues?",
        answer: "Chart issues are usually browser-related. Advise users to clear cache, update browsers, or try a different browser. Check if the issue affects multiple users or is isolated."
      },
      {
        question: "What if the AI features aren't working?",
        answer: "AI features require active internet connectivity and may have API dependencies. Check system status, review error logs, and contact technical support if issues persist."
      },
      {
        question: "How do I handle user complaints about data loss?",
        answer: "Review the user's activity logs to trace their actions. Check if files were accidentally deleted or if there were upload failures. Contact support for data recovery if needed."
      }
    ]
  }
]

const adminTutorials = [
  {
    title: "Admin Dashboard Overview",
    description: "Complete walkthrough of admin features and navigation",
    duration: "6:30",
    thumbnail: "👑",
    url: "#"
  },
  {
    title: "User Management Best Practices",
    description: "How to effectively manage users, roles, and permissions",
    duration: "8:45",
    thumbnail: "👥",
    url: "#"
  },
  {
    title: "System Monitoring & Analytics",
    description: "Using activity logs and system insights for platform health",
    duration: "7:20",
    thumbnail: "📊",
    url: "#"
  },
  {
    title: "Security & Compliance Guide",
    description: "Maintaining security standards and handling incidents",
    duration: "9:15",
    thumbnail: "🔒",
    url: "#"
  }
]

const adminQuickActions = [
  {
    title: "Manage Users",
    description: "View and manage user accounts",
    icon: <Users className="h-5 w-5" />,
    action: () => window.location.href = "/admin/users"
  },
  {
    title: "System Activity",
    description: "Monitor platform activity",
    icon: <Activity className="h-5 w-5" />,
    action: () => window.location.href = "/admin/activity"
  },
  {
    title: "Admin Settings",
    description: "Configure admin preferences",
    icon: <Settings className="h-5 w-5" />,
    action: () => window.location.href = "/admin/settings"
  },
  {
    title: "Switch to User View",
    description: "Access user dashboard",
    icon: <Shield className="h-5 w-5" />,
    action: () => window.location.href = "/dashboard"
  }
]

export default function AdminHelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredFAQ = adminFaqData.filter(category => {
    if (selectedCategory !== "all" && category.category !== selectedCategory) return false
    
    if (searchTerm) {
      return category.questions.some(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return true
  })

  return (
    <div className="flex min-h-screen bg-black text-white relative overflow-hidden">
      {/* Aurora Background with red theme */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Aurora colorStops={["#ff0038", "#ff4d00", "#330022"]} amplitude={1.2} blend={0.4} />
      </div>

      <AdminSidebar />

      <div className="flex-1 z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mt-12">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-500" />
              <h1 className="text-4xl font-bold text-white">Admin Help & Support</h1>
            </div>
            <Badge className="bg-red-900 text-red-300 border-red-600">
              <Crown className="h-3 w-3 mr-1" />
              Administrator
            </Badge>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Actions */}
          <Card className="mb-8 border border-red-500/20 bg-black/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Admin Quick Actions
              </CardTitle>
              <CardDescription className="text-red-300">
                Common administrative tasks and navigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {adminQuickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 border-red-500/30 bg-red-900/10 hover:bg-red-900/20 text-left flex flex-col items-start gap-2"
                    onClick={action.action}
                  >
                    <div className="flex items-center gap-2 text-red-400">
                      {action.icon}
                      <span className="font-medium">{action.title}</span>
                    </div>
                    <span className="text-xs text-red-300">{action.description}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-red-950/20 border border-red-800">
              <TabsTrigger 
                value="faq" 
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-red-300"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin FAQ
              </TabsTrigger>
             
              <TabsTrigger 
                value="contact" 
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-red-300"
              >
                <Mail className="h-4 w-4 mr-2" />
                Support
              </TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="mt-6">
              <Card className="border border-red-500/20 bg-black/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-red-400">Administrator FAQ</CardTitle>
                  <CardDescription className="text-red-300">
                    Answers to common administrative questions and procedures
                  </CardDescription>
                  
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-300" />
                      <Input
                        placeholder="Search admin FAQ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-red-600 bg-black text-red-200"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-red-600 bg-black text-red-200 rounded-md"
                    >
                      <option value="all">All Categories</option>
                      {adminFaqData.map(category => (
                        <option key={category.category} value={category.category}>
                          {category.category}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredFAQ.map((category, categoryIndex) => (
                      <div key={categoryIndex}>
                        <div className="flex items-center gap-2 mb-4">
                          
                          <h3 className="text-lg font-semibold text-red-300">{category.category}</h3>
                        </div>
                        
                        <Accordion type="single" collapsible className="space-y-2">
                          {category.questions
                            .filter(q => 
                              !searchTerm || 
                              q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              q.answer.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((qa, qaIndex) => (
                            <AccordionItem 
                              key={qaIndex} 
                              value={`${categoryIndex}-${qaIndex}`}
                              className="border border-red-500/20 rounded-lg px-4 bg-red-950/10"
                            >
                              <AccordionTrigger className="text-left text-red-200 hover:text-red-100">
                                {qa.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-red-300 leading-relaxed">
                                {qa.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tutorials" className="mt-6">
              <Card className="border border-red-500/20 bg-black/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-red-400">Admin Training Videos</CardTitle>
                  <CardDescription className="text-red-300">
                    Comprehensive video tutorials for platform administration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {adminTutorials.map((video, index) => (
                      <div key={index} className="border border-red-500/30 rounded-lg p-4 bg-red-950/10 hover:bg-red-950/20 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{video.thumbnail}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-red-200 mb-1">{video.title}</h4>
                            <p className="text-sm text-red-400 mb-2">{video.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="border-red-500 text-red-300">
                                {video.duration}
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-900/20"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Watch
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guides" className="mt-6">
              <Card className="border border-red-500/20 bg-black/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-red-400">Administrative Guides</CardTitle>
                  <CardDescription className="text-red-300">
                    In-depth guides for advanced administrative functions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-red-500/30 rounded-lg p-4 bg-red-950/10">
                      <h4 className="font-semibold text-red-200 mb-2">👑 Complete Admin Handbook</h4>
                      <p className="text-red-400 text-sm mb-3">
                        Comprehensive guide covering all administrative functions, best practices, and advanced features for platform management.
                      </p>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-400">
                        Read Guide
                      </Button>
                    </div>
                    
                    <div className="border border-red-500/30 rounded-lg p-4 bg-red-950/10">
                      <h4 className="font-semibold text-red-200 mb-2">🔒 Security & Compliance Manual</h4>
                      <p className="text-red-400 text-sm mb-3">
                        Essential security practices, compliance requirements, incident response procedures, and data protection guidelines.
                      </p>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-400">
                        Read Guide
                      </Button>
                    </div>
                    
                    <div className="border border-red-500/30 rounded-lg p-4 bg-red-950/10">
                      <h4 className="font-semibold text-red-200 mb-2">📊 Analytics & Reporting</h4>
                      <p className="text-red-400 text-sm mb-3">
                        Advanced analytics interpretation, custom reporting, performance monitoring, and data-driven decision making.
                      </p>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-400">
                        Read Guide
                      </Button>
                    </div>
                    
                    <div className="border border-red-500/30 rounded-lg p-4 bg-red-950/10">
                      <h4 className="font-semibold text-red-200 mb-2">⚡ Performance Optimization</h4>
                      <p className="text-red-400 text-sm mb-3">
                        System optimization techniques, resource management, scaling strategies, and performance troubleshooting.
                      </p>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-400">
                        Read Guide
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-red-500/20 bg-black/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-red-400">Admin Support</CardTitle>
                    <CardDescription className="text-red-300">
                      Priority support for administrators
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border border-red-500/30 rounded-lg bg-red-950/10">
                      <Mail className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="font-medium text-red-200">Admin Support Email</p>
                        <p className="text-sm text-red-400">admin-support@excelanalytics.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border border-red-500/30 rounded-lg bg-red-950/10">
                      <Phone className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="font-medium text-red-200">Priority Hotline</p>
                        <p className="text-sm text-red-400">+1 (555) 123-ADMIN</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border border-red-500/30 rounded-lg bg-red-950/10">
                      <Shield className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="font-medium text-red-200">Emergency Contact</p>
                        <p className="text-sm text-red-400">24/7 for critical issues</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-red-500/20 bg-black/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-red-400">System Status</CardTitle>
                    <CardDescription className="text-red-300">
                      Platform health and admin notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-green-500/30 rounded-lg bg-green-900/20">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-300">All Systems Operational</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-red-200">Admin Notifications</h4>
                      <div className="text-sm text-red-400 space-y-1">
                        <p>• 3 pending admin access requests</p>
                        <p>• System maintenance scheduled for next week</p>
                        <p>• New security features available</p>
                        <p>• Performance optimization completed</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-red-500 text-red-400 hover:bg-red-900/20"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Admin Portal
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}