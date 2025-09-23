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
  HelpCircle,
  Search,
  FileSpreadsheet,
  BarChart3,
  Upload,
  Brain,
  MessageCircle,
  Settings,
  Download,
  Eye,
  Share2,
  Filter,
  Zap,
  Shield,
  BookOpen,
  Video,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import Iridescence from "@/components/ui/iridescence"

const faqData = [
  {
    category: "Getting Started",
    icon: <BookOpen className="h-4 w-4" />,
    questions: [
      {
        question: "How do I upload my first Excel file?",
        answer: "Navigate to the Upload page from the sidebar, then either drag and drop your .xlsx or .xls file into the dropzone, or click 'Choose Files' to browse your computer. Files up to 50MB are supported."
      },
      {
        question: "What file formats are supported?",
        answer: "We support Excel files in .xlsx and .xls formats. CSV files can also be uploaded. Make sure your file is under 50MB for optimal performance."
      },
      {
        question: "How do I create my first chart?",
        answer: "After uploading a file, go to the Files page and click the 'Create Chart' button next to your uploaded file. Follow the step-by-step wizard to select chart type, axes, and styling options."
      },
      {
        question: "Can I view my uploaded files later?",
        answer: "Yes! All your uploaded files are saved in the Files section. You can access them anytime to create new charts or view existing data."
      }
    ]
  },
  {
    category: "File Management",
    icon: <FileSpreadsheet className="h-4 w-4" />,
    questions: [
      {
        question: "How do I organize my files?",
        answer: "Use the search functionality in the Files page to quickly find specific files. Files are automatically sorted by upload date, with the most recent files appearing first."
      },
      {
        question: "Can I delete uploaded files?",
        answer: "Currently, files cannot be deleted through the interface. If you need to remove a file, please contact support. We're working on adding this feature in a future update."
      },
      {
        question: "What happens to my data?",
        answer: "Your data is securely stored and only accessible to you. We use industry-standard encryption and never share your data with third parties."
      },
      {
        question: "Is there a file size limit?",
        answer: "Yes, individual files are limited to 50MB. For larger files, consider splitting them into smaller chunks or contact support for enterprise solutions."
      }
    ]
  },
  {
    category: "Chart Creation",
    icon: <BarChart3 className="h-4 w-4" />,
    questions: [
      {
        question: "What types of charts can I create?",
        answer: "You can create various chart types including bar charts, line charts, pie charts, area charts, scatter plots, and 3D visualizations like 3D bar charts, 3D scatter plots, and surface plots."
      },
      {
        question: "How do I create a 3D chart?",
        answer: "During chart creation, select a 3D chart type (3D Bar Chart, 3D Scatter Plot, or 3D Surface Plot). You'll need to select X, Y, and Z axes from your data columns."
      },
      {
        question: "Can I customize chart colors and themes?",
        answer: "Yes! During chart creation, you can choose from multiple color themes including Default, Ocean, Forest, Sunset, Purple, and Yellow. You can also toggle legend and grid visibility."
      },
      {
        question: "How do I download my charts?",
        answer: "Once a chart is created, click the 'Download PNG' button in the chart view to save a high-quality image of your visualization."
      },
      {
        question: "Can I share my charts with others?",
        answer: "Yes! Use the 'Share' button to copy a link to your chart. Anyone with the link can view your chart (but not your raw data)."
      }
    ]
  },
  {
    category: "AI Features",
    icon: <Brain className="h-4 w-4" />,
    questions: [
      {
        question: "How does the AI Insights feature work?",
        answer: "AI Insights analyzes your uploaded data to automatically detect patterns, trends, and anomalies. It provides recommendations for the best chart types and highlights interesting findings in your data."
      },
      {
        question: "What can I ask the AI assistant?",
        answer: "You can ask questions about your data in natural language, request chart recommendations, get explanations of patterns, and receive suggestions for data analysis approaches."
      },
      {
        question: "Is my data used to train AI models?",
        answer: "No, your data is never used to train our AI models. All AI processing happens securely and your data remains private and confidential."
      },
      {
        question: "How accurate are AI insights?",
        answer: "Our AI provides suggestions and insights based on statistical analysis. While generally accurate, always verify important findings with domain expertise and additional analysis."
      }
    ]
  },
  {
    category: "Account & Settings",
    icon: <Settings className="h-4 w-4" />,
    questions: [
      {
        question: "How do I update my profile information?",
        answer: "Go to Settings from the sidebar to view and update your profile information, including name and email address."
      },
      {
        question: "How can I request admin access?",
        answer: "In the Settings page, you'll find an 'Request Admin Access' section where you can submit a request with your reason and relevant experience. Admin requests are reviewed by existing administrators."
      },
      {
        question: "What's the difference between user and admin roles?",
        answer: "Users can upload files, create charts, and use AI features. Admins have additional privileges including user management, system analytics, and access to administrative tools."
      },
      {
        question: "How do I change my password?",
        answer: "Password changes are currently handled through the authentication system. If you signed up with Google, your password is managed through your Google account."
      }
    ]
  },
  {
    category: "Troubleshooting",
    icon: <Zap className="h-4 w-4" />,
    questions: [
      {
        question: "My file upload is failing. What should I do?",
        answer: "Check that your file is under 50MB and in .xlsx or .xls format. Ensure you have a stable internet connection. If the problem persists, try refreshing the page or contact support."
      },
      {
        question: "Charts are not displaying correctly. How can I fix this?",
        answer: "Try refreshing the page or clearing your browser cache. Ensure you're using a modern browser (Chrome, Firefox, Safari, or Edge). If issues persist, contact support with details about your browser and operating system."
      },
      {
        question: "I can't see my uploaded files. Where are they?",
        answer: "Check the Files section in the sidebar. If files aren't appearing, try refreshing the page. If you recently uploaded files, they should appear immediately after successful upload."
      },
      {
        question: "The AI assistant isn't responding. What's wrong?",
        answer: "The AI assistant requires an active internet connection. If it's not responding, check your connection and try again. Some features may require additional setup or API keys."
      }
    ]
  }
]


const quickActions = [
  {
    title: "Upload New File",
    description: "Start by uploading an Excel file",
    icon: <Upload className="h-5 w-5" />,
    action: () => window.location.href = "/dashboard/upload"
  },
  {
    title: "View My Files",
    description: "Access your uploaded files",
    icon: <FileSpreadsheet className="h-5 w-5" />,
    action: () => window.location.href = "/dashboard/files"
  },
  {
    title: "Create Chart",
    description: "Build a new visualization",
    icon: <BarChart3 className="h-5 w-5" />,
    action: () => window.location.href = "/dashboard/files"
  },
  {
    title: "AI Insights",
    description: "Get AI-powered analysis",
    icon: <Brain className="h-5 w-5" />,
    action: () => window.location.href = "/dashboard/insights"
  }
]

export default function UserHelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredFAQ = faqData.filter(category => {
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
    <div className="flex min-h-screen bg-[#0a0f1c] overflow-hidden text-white relative">
      <div className="absolute inset-0 z-0 opacity-20 h-full">
        <Iridescence />
      </div>

      <DashboardSidebar />

      <div className="flex flex-col flex-1 relative z-0">
        <main className="flex-1 p-6 space-y-6">
          <div className="text-center mt-8 space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Help & Support
            </h1>
            <p className="text-slate-400">Find answers and get the help you need</p>
          </div>

          {/* Quick Actions */}
          <Card className="bg-transparent border border-blue-900/50 shadow-xl backdrop-blur-3xl">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-slate-400">
                Common tasks to get you started quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 border-cyan-500/30 bg-cyan-900/10 hover:bg-cyan-900/20 text-left flex flex-col items-start gap-2"
                    onClick={action.action}
                  >
                    <div className="flex items-center gap-2 text-cyan-400">
                      {action.icon}
                      <span className="font-medium">{action.title}</span>
                    </div>
                    <span className="text-xs text-slate-400">{action.description}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="faq" className="w-full ">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-cyan-500/30">
              <TabsTrigger 
                value="faq" 
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-cyan-300"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </TabsTrigger>
             
             
              <TabsTrigger 
                value="contact" 
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-cyan-300"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="mt-6">
              <Card className="bg-transparent border border-blue-900/50 shadow-xl backdrop-blur-3xl">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Frequently Asked Questions</CardTitle>
                  <CardDescription className="text-slate-400">
                    Find quick answers to common questions
                  </CardDescription>
                  
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-300" />
                      <Input
                        placeholder="Search FAQ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-cyan-600 bg-slate-800/50 text-white"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-cyan-600 bg-slate-800/50 text-white rounded-md"
                    >
                      <option value="all">All Categories</option>
                      {faqData.map(category => (
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
                          <div className="p-2 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                            {category.icon}
                          </div>
                          <h3 className="text-lg font-semibold text-cyan-300">{category.category}</h3>
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
                              className="border border-cyan-500/20 rounded-lg px-4 bg-slate-800/30"
                            >
                              <AccordionTrigger className="text-left text-cyan-200 hover:text-cyan-100">
                                {qa.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-slate-300 leading-relaxed">
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

            
           

            <TabsContent value="contact" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-transparent border border-blue-900/50 shadow-xl backdrop-blur-3xl">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Contact Support</CardTitle>
                    <CardDescription className="text-slate-400">
                      Get help from our support team
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border border-cyan-500/30 rounded-lg bg-slate-800/30">
                      <Mail className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="font-medium text-cyan-200">Email Support</p>
                        <p className="text-sm text-slate-400">support@excelanalytics.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border border-cyan-500/30 rounded-lg bg-slate-800/30">
                      <MessageCircle className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="font-medium text-cyan-200">Live Chat</p>
                        <p className="text-sm text-slate-400">Available 9 AM - 6 PM EST</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border border-cyan-500/30 rounded-lg bg-slate-800/30">
                      <Phone className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="font-medium text-cyan-200">Phone Support</p>
                        <p className="text-sm text-slate-400">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-transparent border border-blue-900/50 shadow-xl backdrop-blur-3xl">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">System Status</CardTitle>
                    <CardDescription className="text-slate-400">
                      Current platform status and updates
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
                      <h4 className="font-medium text-cyan-200">Recent Updates</h4>
                      <div className="text-sm text-slate-400 space-y-1">
                        <p>• Enhanced 3D chart rendering performance</p>
                        <p>• Improved AI insights accuracy</p>
                        <p>• Added new color themes</p>
                        <p>• Bug fixes and stability improvements</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-cyan-500 text-cyan-400 hover:bg-cyan-900/20"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Status Page
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}