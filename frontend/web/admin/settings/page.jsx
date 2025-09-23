"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Crown, Check, X, Clock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { getUserProfile, getAdminRequests, approveAdminRequest, rejectAdminRequest } from "@/services/api"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminSettings() {
  const [userProfile, setUserProfile] = useState(null)
  const [adminRequests, setAdminRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [requestsLoading, setRequestsLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const profile = await getUserProfile()
      setUserProfile(profile)
      
      if (profile.role === 'admin' || profile.role === 'superadmin') {
        setRequestsLoading(true);
        const requests = await getAdminRequests()
        setAdminRequests(requests)
        setRequestsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load page data. Please try refreshing.")
    } finally {
      setLoading(false)
    }
  }

  const handleApproveRequest = async (requestId) => {
    setRequestsLoading(true)
    try {
      await approveAdminRequest(requestId)
      toast.success("Admin request approved successfully!")
      fetchData()
    } catch (error) {
      toast.error("Failed to approve request")
    } finally {
      setRequestsLoading(false)
    }
  }

  const handleRejectRequest = async (requestId) => {
    setRequestsLoading(true)
    try {
      await rejectAdminRequest(requestId)
      toast.success("Admin request rejected")
      fetchData();
    } catch (error) {
      console.error("Error rejecting request:", error)
      toast.error("Failed to reject request")
    } finally {
      setRequestsLoading(false)
    }
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

  if (!userProfile) {
    return (
        <div className="flex min-h-screen bg-slate-50">
          <AdminSidebar />
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
                <h2 className="text-xl font-semibold text-red-600">Failed to Load Profile</h2>
                <p className="text-slate-500 mt-2">Could not retrieve your profile data. Please try refreshing the page.</p>
            </div>
          </div>
        </div>
      )
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <AdminSidebar />
      <main className="flex-1 p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              {userProfile.role === 'superadmin' ? 'Superadmin Settings' : 'Admin Settings'}
            </h1>
            <p className="text-slate-500">Manage your account and user requests</p>
          </header>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                        <Crown className="w-5 h-5 text-indigo-600" />
                        Your Profile
                    </CardTitle>
                    <CardDescription>Your administrator account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Label>Username</Label>
                        <Input value={userProfile.username || ""} readOnly />
                    </div>
                    <div className="space-y-1">
                        <Label>Email Address</Label>
                        <Input value={userProfile.email || ""} readOnly />
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                        <div>
                            <Label>Current Role</Label>
                            <Badge variant="outline" className="mt-1 border-indigo-300 bg-indigo-50 text-indigo-700 capitalize">
                                <Crown className="w-3 h-3 mr-1" />
                                {userProfile.role}
                            </Badge>
                        </div>
                        <div>
                            <Label>Member Since</Label>
                            <p className="text-sm text-slate-600 mt-1">
                                {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                    </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                    <CardTitle className="text-slate-800 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-indigo-600" />
                        Admin Access Requests
                        {adminRequests.length > 0 && (
                        <Badge className="ml-2">{adminRequests.length}</Badge>
                        )}
                    </CardTitle>
                    <CardDescription>Review and manage user requests for admin access</CardDescription>
                    </CardHeader>
                    <CardContent>
                    {requestsLoading ? (
                        <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div></div>
                    ) : adminRequests.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                        <Users className="mx-auto h-12 w-12 mb-4" />
                        <p>No pending admin requests.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                        {adminRequests.map((request) => (
                            <div key={request.id} className="p-4 border rounded-lg bg-slate-50">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-slate-900">
                                        {request.user.firstName || request.user.username} {request.user.lastName || ""}
                                        </h4>
                                        <p className="text-sm text-slate-500">{request.user.email}</p>
                                    </div>
                                    <Badge variant="outline" className="border-yellow-300 bg-yellow-50 text-yellow-800">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Pending
                                    </Badge>
                                </div>
                                <div className="space-y-2 mb-4 text-sm">
                                    <div>
                                    <Label>Reason:</Label>
                                    <p className="text-slate-700 mt-1">{request.reason}</p>
                                    </div>
                                    {request.experience && (
                                    <div>
                                        <Label>Experience:</Label>
                                        <p className="text-slate-700 mt-1">{request.experience}</p>
                                    </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleApproveRequest(request.id)} size="sm" className="bg-green-600 hover:bg-green-700">
                                    <Check className="w-4 h-4 mr-1" /> Approve
                                    </Button>
                                    <Button onClick={() => handleRejectRequest(request.id)} size="sm" variant="outline">
                                    <X className="w-4 h-4 mr-1" /> Reject
                                    </Button>
                                </div>
                            </div>
                        ))}
                        </div>
                    )}
                    </CardContent>
                </Card>
            </div>
          </div>
        </main>
    </div>
  )
}