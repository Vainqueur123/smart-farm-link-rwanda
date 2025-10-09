"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { HorizontalDashboardLayout } from "@/components/horizontal-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Download,
  Upload,
  RefreshCw,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Settings,
  Bell,
  MessageSquare,
  FileText,
  Database,
  Server,
  Globe,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalHigh,
  SignalLow,
  Wifi2,
  Wifi3,
  Wifi4,
  Wifi5,
  Wifi6,
  Wifi7,
  Wifi8,
  Wifi9,
  Wifi10,
  Wifi11,
  Wifi12,
  Wifi13,
  Wifi14,
  Wifi15,
  Wifi16,
  Wifi17,
  Wifi18,
  Wifi19,
  Wifi20,
  Wifi21,
  Wifi22,
  Wifi23,
  Wifi24,
  Wifi25,
  Wifi26,
  Wifi27,
  Wifi28,
  Wifi29,
  Wifi30,
  Wifi31,
  Wifi32,
  Wifi33,
  Wifi34,
  Wifi35,
  Wifi36,
  Wifi37,
  Wifi38,
  Wifi39,
  Wifi40,
  Wifi41,
  Wifi42,
  Wifi43,
  Wifi44,
  Wifi45,
  Wifi46,
  Wifi47,
  Wifi48,
  Wifi49,
  Wifi50,
  Wifi51,
  Wifi52,
  Wifi53,
  Wifi54,
  Wifi55,
  Wifi56,
  Wifi57,
  Wifi58,
  Wifi59,
  Wifi60,
  Wifi61,
  Wifi62,
  Wifi63,
  Wifi64,
  Wifi65,
  Wifi66,
  Wifi67,
  Wifi68,
  Wifi69,
  Wifi70,
  Wifi71,
  Wifi72,
  Wifi73,
  Wifi74,
  Wifi75,
  Wifi76,
  Wifi77,
  Wifi78,
  Wifi79,
  Wifi80,
  Wifi81,
  Wifi82,
  Wifi83,
  Wifi84,
  Wifi85,
  Wifi86,
  Wifi87,
  Wifi88,
  Wifi89,
  Wifi90,
  Wifi91,
  Wifi92,
  Wifi93,
  Wifi94,
  Wifi95,
  Wifi96,
  Wifi97,
  Wifi98,
  Wifi99,
  Wifi100
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import type { FarmerProfile, BuyerProfile, AdvisorProfile, AdminProfile, UserRole } from "@/lib/types"

export default function AdminDashboard() {
  const { user, userRole, loading } = useAuth()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all")
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive" | "pending">("all")
  
  // Mock data - in real app, this would come from database
  const [farmers, setFarmers] = useState<FarmerProfile[]>([])
  const [buyers, setBuyers] = useState<BuyerProfile[]>([])
  const [advisors, setAdvisors] = useState<AdvisorProfile[]>([])
  const [admins, setAdmins] = useState<AdminProfile[]>([])

  // Statistics
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalBuyers: 0,
    totalAdvisors: 0,
    totalAdmins: 0,
    activeUsers: 0,
    pendingUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0
  })

  useEffect(() => {
    if (userRole !== "admin") {
      // Redirect non-admin users
      return
    }
    loadData()
  }, [userRole])

  const loadData = async () => {
    // Mock data loading - in real app, this would fetch from Firestore
    const mockFarmers: FarmerProfile[] = [
      {
        id: "1",
        name: "Jean Baptiste Nkurunziza",
        email: "jean@example.com",
        phone: "0781234567",
        district: "Kicukiro",
        sector: "Kagarama",
        cell: "Kagarama",
        village: "Kagarama",
        language: "rw",
        farmSize: 2.5,
        primaryCrops: ["maize", "beans", "potatoes"],
        experienceLevel: "intermediate",
        hasSmartphone: true,
        preferredContactMethod: "app",
        registrationDate: new Date("2024-01-15"),
        joinDate: new Date("2024-01-15"),
        profileComplete: true,
        role: "farmer",
        isVerified: true,
        rating: 4.5,
        totalSales: 1500000
      },
      {
        id: "2",
        name: "Marie Claire Uwimana",
        email: "marie@example.com",
        phone: "0782345678",
        district: "Musanze",
        sector: "Kinigi",
        cell: "Kinigi",
        village: "Kinigi",
        language: "rw",
        farmSize: 1.8,
        primaryCrops: ["irish_potato", "carrots", "cabbage"],
        experienceLevel: "expert",
        hasSmartphone: true,
        preferredContactMethod: "app",
        registrationDate: new Date("2024-02-10"),
        joinDate: new Date("2024-02-10"),
        profileComplete: true,
        role: "farmer",
        isVerified: true,
        rating: 4.8,
        totalSales: 2300000
      }
    ]

    const mockBuyers: BuyerProfile[] = [
      {
        id: "3",
        name: "Paul Mugenzi",
        email: "paul@example.com",
        phone: "0783456789",
        district: "Kigali",
        sector: "Nyarugenge",
        cell: "Nyarugenge",
        village: "Nyarugenge",
        language: "rw",
        businessType: "restaurant",
        preferredCrops: ["tomato", "onion", "cabbage"],
        budgetRange: { min: 50000, max: 200000 },
        preferredContactMethod: "app",
        registrationDate: new Date("2024-01-20"),
        joinDate: new Date("2024-01-20"),
        profileComplete: true,
        role: "buyer",
        isVerified: true,
        rating: 4.2,
        totalPurchases: 800000
      }
    ]

    const mockAdvisors: AdvisorProfile[] = [
      {
        id: "4",
        name: "Dr. Agnes Mukamana",
        email: "agnes@example.com",
        phone: "0784567890",
        district: "Huye",
        sector: "Huye",
        cell: "Huye",
        village: "Huye",
        language: "rw",
        specialization: ["maize", "beans", "rice"],
        experienceYears: 15,
        qualifications: ["PhD in Agriculture", "MSc in Crop Science"],
        certifications: ["Certified Agricultural Advisor", "Organic Farming Specialist"],
        preferredContactMethod: "app",
        registrationDate: new Date("2024-01-05"),
        joinDate: new Date("2024-01-05"),
        profileComplete: true,
        role: "advisor",
        isVerified: true,
        rating: 4.9,
        totalAdviceGiven: 150,
        hourlyRate: 5000,
        availability: "available"
      }
    ]

    setFarmers(mockFarmers)
    setBuyers(mockBuyers)
    setAdvisors(mockAdvisors)
    setAdmins([])

    // Calculate statistics
    setStats({
      totalUsers: mockFarmers.length + mockBuyers.length + mockAdvisors.length,
      totalFarmers: mockFarmers.length,
      totalBuyers: mockBuyers.length,
      totalAdvisors: mockAdvisors.length,
      totalAdmins: 0,
      activeUsers: mockFarmers.length + mockBuyers.length + mockAdvisors.length,
      pendingUsers: 0,
      totalProducts: 45,
      totalOrders: 120,
      totalRevenue: 4500000,
      newUsersToday: 2,
      newUsersThisWeek: 8,
      newUsersThisMonth: 25
    })
  }

  const handleUserAction = async (userId: string, action: "verify" | "suspend" | "activate" | "delete") => {
    try {
      // Update local state immediately for better UX
      if (action === "verify") {
        setFarmers(prev => prev.map(f => f.id === userId ? { ...f, isVerified: true } : f))
        setBuyers(prev => prev.map(b => b.id === userId ? { ...b, isVerified: true } : b))
        setAdvisors(prev => prev.map(a => a.id === userId ? { ...a, isVerified: true } : a))
      } else if (action === "suspend") {
        setFarmers(prev => prev.map(f => f.id === userId ? { ...f, isActive: false } : f))
        setBuyers(prev => prev.map(b => b.id === userId ? { ...b, isActive: false } : b))
        setAdvisors(prev => prev.map(a => a.id === userId ? { ...a, isActive: false } : a))
      } else if (action === "activate") {
        setFarmers(prev => prev.map(f => f.id === userId ? { ...f, isActive: true } : f))
        setBuyers(prev => prev.map(b => b.id === userId ? { ...b, isActive: true } : b))
        setAdvisors(prev => prev.map(a => a.id === userId ? { ...a, isActive: true } : a))
      } else if (action === "delete") {
        setFarmers(prev => prev.filter(f => f.id !== userId))
        setBuyers(prev => prev.filter(b => b.id !== userId))
        setAdvisors(prev => prev.filter(a => a.id !== userId))
      }
      
      // In real app, this would update the database
      console.log(`Successfully performed ${action} on user ${userId}`)
    } catch (error) {
      console.error(`Error performing ${action} on user ${userId}:`, error)
    }
  }

  const exportData = (type: "farmers" | "buyers" | "advisors" | "all") => {
    // In real app, this would generate and download CSV/Excel file
    console.log(`Exporting ${type} data`)
  }

  if (loading) {
    return (
      <HorizontalDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </HorizontalDashboardLayout>
    )
  }

  if (userRole !== "admin") {
    return (
      <HorizontalDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
          </div>
        </div>
      </HorizontalDashboardLayout>
    )
  }

  const allUsers = [...farmers, ...buyers, ...advisors, ...admins]
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery)
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "active" && user.isVerified) ||
                         (selectedStatus === "inactive" && !user.isVerified) ||
                         (selectedStatus === "pending" && !user.profileComplete)
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <HorizontalDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, products, and system settings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportData("all")}>
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
            <Button onClick={() => loadData()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.newUsersToday} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Farmers</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFarmers}</div>
              <p className="text-xs text-muted-foreground">
                Active farmers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Buyers</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBuyers}</div>
              <p className="text-xs text-muted-foreground">
                Registered buyers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Advisors</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAdvisors}</div>
              <p className="text-xs text-muted-foreground">
                Agricultural advisors
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">This Week</span>
                      <span className="font-medium">+{stats.newUsersThisWeek}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">This Month</span>
                      <span className="font-medium">+{stats.newUsersThisMonth}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Revenue</span>
                      <span className="font-medium">RWF {stats.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Users</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {stats.activeUsers} Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Products</span>
                      <span className="font-medium">{stats.totalProducts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Orders</span>
                      <span className="font-medium">{stats.totalOrders}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole | "all")}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="farmer">Farmers</SelectItem>
                  <SelectItem value="buyer">Buyers</SelectItem>
                  <SelectItem value="advisor">Advisors</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as any)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-green-700">
                            {user.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name || "Unknown User"}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.role === "farmer" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                        <Badge variant={user.isVerified ? "outline" : "destructive"}>
                          {user.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, "verify")}>
                            <UserCheck className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, "suspend")}>
                            <UserX className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, "delete")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Product management features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">System settings will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HorizontalDashboardLayout>
  )
}
