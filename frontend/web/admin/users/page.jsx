"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Search,
  UserX,
  Crown,
  FileSpreadsheet,
  BarChart3,
  Filter,
  ChevronDown,
  ChevronRight,
  Trash2,
  Download,
  Eye,
  Calendar,
  FileText,
  ShieldAlert,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import axios from "axios"
import toast from "react-hot-toast"
const baseurl = import.meta.env.VITE_API_BASE_URL;

export default function AdminUsersPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [expandedUser, setExpandedUser] = useState(null)
  const [userFiles, setUserFiles] = useState([])
  const [userCharts, setUserCharts] = useState([])
  const [actionDialog, setActionDialog] = useState({ open: false, type: "", user: null })
  const [loading, setLoading] = useState(true)
  const [loadingUserData, setLoadingUserData] = useState(false)
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role")
    setUserRole(role);
    if (role !== "admin" && role !== "superadmin") {
      navigate("/dashboard")
      return
    }
    fetchUsers()
  }, [navigate])

  useEffect(() => {
    const filtered = users.filter((user) => {
      const username = user.username || ""
      const email = user.email || ""

      const matchesSearch =
        username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = filterRole === "all" || user.role === filterRole
      const matchesStatus = filterStatus === "all" || user.status === filterStatus

      return matchesSearch && matchesRole && matchesStatus
    })
    setFilteredUsers(filtered)
  }, [users, searchTerm, filterRole, filterStatus])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${baseurl}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setUsers(response.data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetails = async (userId) => {
    setLoadingUserData(true)
    try {
      const [filesResponse, chartsResponse] = await Promise.all([
        axios.get(`${baseurl}/api/admin/users/${userId}/files`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get(`${baseurl}/api/admin/users/${userId}/charts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ])

      setUserFiles(filesResponse.data || [])
      setUserCharts(chartsResponse.data || [])
    } catch (error) {
      console.error("Error fetching user details:", error)
      toast.error("Failed to fetch user details")
    } finally {
      setLoadingUserData(false)
    }
  }
  
  const handleUserAction = async (action, userId) => {
    try {
      const token = localStorage.getItem("token");
      if (action === "promote") {
        await axios.put(
          `${baseurl}/api/admin/users/${userId}/promote`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("User promoted to admin successfully");
      } else {
        await axios.put(
          `${baseurl}/api/admin/users/${userId}`,
          { action },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(`User ${action}ed successfully`);
      }
      fetchUsers();
    } catch (error) {
      console.error(`Error performing ${action} on user:`, error);
      toast.error(`Failed to ${action} user`);
    } finally {
        setActionDialog({ open: false, type: "", user: null });
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseurl}/api/admin/admins/${adminId}/remove`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Admin removed successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error removing admin:", error);
      toast.error("Failed to remove admin");
    } finally {
        setActionDialog({ open: false, type: "", user: null });
    }
  };
  
  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`${baseurl}/api/admin/files/${fileId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      toast.success("File deleted successfully")
      fetchUserDetails(expandedUser.id)
      fetchUsers()
    } catch (error) {
      console.error("Error deleting file:", error)
      toast.error("Failed to delete file")
    }
  }

  const toggleUserExpansion = (user) => {
    if (expandedUser?.id === user.id) {
      setExpandedUser(null)
    } else {
      setExpandedUser(user)
      fetchUserDetails(user.id)
    }
  }

  const getRoleBadge = (role) => {
    const roleConfig = {
      superadmin: { className: "bg-purple-100 text-purple-700 border-purple-200", icon: Crown },
      admin: { className: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: Crown },
      user: { className: "bg-slate-100 text-slate-700 border-slate-200", icon: Users },
    }

    const config = roleConfig[role] || roleConfig.user
    const IconComponent = config.icon

    return (
      <Badge variant="outline" className={`${config.className} flex items-center gap-1 capitalize`}>
        <IconComponent className="h-3 w-3" />
        {role}
      </Badge>
    )
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { className: "bg-green-100 text-green-800" },
      suspended: { className: "bg-orange-100 text-orange-800" },
    }

    const config = statusConfig[status] || statusConfig.active
    return <Badge variant="secondary" className={`${config.className} capitalize`}>{status}</Badge>
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
            </div>
            <div className="text-sm text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full font-medium">
              {filteredUsers.length} of {users.length} users
            </div>
        </header>

        <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="superadmin">Superadmin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
              <CardTitle className="text-slate-800">All Users</CardTitle>
              <CardDescription>
                Manage user accounts, roles, and view their content
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-100">
                      <TableHead className="w-12"></TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Files</TableHead>
                      <TableHead>Charts</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                                No users match your criteria.
                            </TableCell>
                        </TableRow>
                    ) : (
                    filteredUsers.map((user) => (
                      <>
                        <TableRow key={user.id} className="hover:bg-slate-50/50">
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleUserExpansion(user)}
                              className="p-1 h-8 w-8 text-slate-500 hover:bg-slate-200"
                            >
                              {expandedUser?.id === user.id ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-slate-900">{user.username}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status || "active")}</TableCell>
                          <TableCell className="text-slate-600">{user.fileCount || 0}</TableCell>
                          <TableCell className="text-slate-600">{user.chartCount || 0}</TableCell>
                          <TableCell className="text-slate-600">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              {userRole === 'superadmin' && user.role === 'admin' && (
                                <Button size="icon" variant="outline" className="h-8 w-8 border-yellow-300 text-yellow-600 hover:bg-yellow-50" onClick={() => setActionDialog({ open: true, type: "removeAdmin", user })}>
                                  <ShieldAlert className="h-4 w-4" />
                                </Button>
                              )}
                              {user.role === 'user' && (userRole === 'admin' || userRole === 'superadmin') && (
                                <Button size="icon" variant="outline" className="h-8 w-8 border-indigo-300 text-indigo-600 hover:bg-indigo-50" onClick={() => setActionDialog({ open: true, type: "promote", user })}>
                                  <Crown className="h-4 w-4" />
                                </Button>
                              )}
                              
                              {user.role !== 'superadmin' && (
                                <Button size="icon" variant="outline" className="h-8 w-8 border-orange-300 text-orange-600 hover:bg-orange-50" onClick={() => setActionDialog({ open: true, type: "suspend", user })}>
                                  <UserX className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedUser?.id === user.id && (
                          <TableRow className="bg-slate-100/50">
                            <TableCell colSpan={8} className="p-4">
                                {loadingUserData ? (
                                    <div className="text-center py-4">Loading details...</div>
                                ) : (
                                    <Tabs defaultValue="files" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 bg-slate-200">
                                            <TabsTrigger value="files">Files ({userFiles.length})</TabsTrigger>
                                            <TabsTrigger value="charts">Charts ({userCharts.length})</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="files" className="mt-4">
                                            {/* Files content here */}
                                        </TabsContent>
                                        <TabsContent value="charts" className="mt-4">
                                            {/* Charts content here */}
                                        </TabsContent>
                                    </Tabs>
                                )}
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
        </Card>

        <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ open: false, type: "", user: null })}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="capitalize">{actionDialog.type === 'removeAdmin' ? 'Remove Admin' : `${actionDialog.type} User`}</DialogTitle>
                    <DialogDescription>
                        {actionDialog.type === 'promote' && `Are you sure you want to promote ${actionDialog.user?.username} to admin?`}
                        {actionDialog.type === 'suspend' && `Are you sure you want to suspend ${actionDialog.user?.username}'s account?`}
                        {actionDialog.type === 'removeAdmin' && `Are you sure you want to demote ${actionDialog.user?.username} to a regular user?`}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setActionDialog({ open: false, type: "", user: null })}>Cancel</Button>
                    <Button 
                        onClick={() => actionDialog.type === 'removeAdmin' ? handleRemoveAdmin(actionDialog.user.id) : handleUserAction(actionDialog.type, actionDialog.user.id)}
                        className={actionDialog.type === 'suspend' || actionDialog.type === 'removeAdmin' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}