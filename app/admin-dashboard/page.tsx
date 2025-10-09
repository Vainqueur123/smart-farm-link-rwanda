"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  DollarSign,
  Package,
  BarChart3,
  Settings as SettingsIcon
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AdminOnly } from "@/components/role-guard"
import { User, UserRole, Analytics } from "@/lib/types"
import { UserManagement } from "@/components/admin/user-management"

// Mock data for admin dashboard
const mockUsers: User[] = [
  {
    id: "1",
    email: "farmer1@example.com",
    role: "farmer",
    name: "John Doe",
    phone: "0780000001",
    isActive: true,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date()
  },
  {
    id: "2",
    email: "buyer1@example.com",
    role: "buyer",
    name: "Jane Smith",
    phone: "0780000002",
    isActive: true,
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date()
  }
]

const mockAnalytics: Analytics = {
  totalUsers: 1250,
  totalFarmers: 850,
  totalBuyers: 400,
  totalProducts: 3200,
  totalOrders: 1850,
  totalRevenue: 12500000,
  averageOrderValue: 6757,
  topSellingProducts: [
    { productId: '1', productName: 'Fresh Tomatoes', salesCount: 250, revenue: 2500000 },
    { productId: '2', productName: 'Irish Potatoes', salesCount: 180, revenue: 1800000 },
    { productId: '3', productName: 'Maize', salesCount: 150, revenue: 1200000 }
  ],
  userGrowth: [
    { date: '2024-01', farmers: 50, buyers: 20 },
    { date: '2024-02', farmers: 75, buyers: 35 },
    { date: '2024-03', farmers: 100, buyers: 50 }
  ],
  revenueByMonth: [
    { month: "2024-01", revenue: 2000000, orders: 300 },
    { month: "2024-02", revenue: 3500000, orders: 520 },
    { month: "2024-03", revenue: 5000000, orders: 740 }
  ]
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [analytics, setAnalytics] = useState<Analytics>(mockAnalytics)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, you would fetch data from your API here
        setIsLoading(false)
      } catch (err) {
        console.error('Failed to load data:', err)
        setError('Failed to load data. Please try again.')
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleUserUpdate = async (userId: string, updates: Partial<User>) => {
    try {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, ...updates } : user
        )
      )
    } catch (err) {
      console.error('Failed to update user:', err)
      throw new Error('Failed to update user')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <AdminOnly>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name || 'Admin'}
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Users
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" /> Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage all users, including farmers and buyers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <strong className="font-bold">Error: </strong>
                      <span className="block sm:inline">{error}</span>
                    </div>
                  ) : (
                    <UserManagement 
                      users={users} 
                      onUserUpdate={handleUserUpdate} 
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                    <CardDescription>Monthly revenue and order trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.revenueByMonth.map((month) => (
                        <div key={month.month} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">
                                {month.month}
                              </span>
                              <span className="text-sm font-medium text-green-600">
                                RWF {month.revenue.toLocaleString()}
                              </span>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-green-600 h-2.5 rounded-full" 
                                style={{ width: `${Math.min(100, (month.revenue / (analytics.revenueByMonth[0].revenue * 1.2)) * 100)}%` }}
                              ></div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">{month.orders} orders</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Statistics</CardTitle>
                    <CardDescription>Platform user growth and activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-700">Total Users</p>
                          <p className="text-2xl font-bold">{analytics.totalUsers}</p>
                          <div className="flex items-center mt-1">
                            <Users className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="text-xs text-blue-600">
                              {analytics.totalFarmers} Farmers • {analytics.totalBuyers} Buyers
                            </span>
                          </div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-700">Total Revenue</p>
                          <p className="text-2xl font-bold">RWF {analytics.totalRevenue.toLocaleString()}</p>
                          <div className="flex items-center mt-1">
                            <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-xs text-green-600">
                              {analytics.totalOrders} Total Orders
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Settings</CardTitle>
                  <CardDescription>Manage platform settings and configurations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">System Status</h3>
                      <div className="flex items-center space-x-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                        <span className="text-sm">All systems operational</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AdminOnly>
  )
}
