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
  MessageSquare, 
  Users, 
  TrendingUp, 
  Calendar,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  BookOpen,
  CheckCircle,
  AlertCircle,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Bell,
  Settings,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import type { FarmerProfile, BuyerProfile } from "@/lib/types"

interface AdviceRequest {
  id: string
  farmerId: string
  farmerName: string
  farmerPhone: string
  farmerDistrict: string
  cropType: string
  question: string
  urgency: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "completed"
  createdAt: Date
  completedAt?: Date
  response?: string
  rating?: number
}

interface DistrictRecommendation {
  id: string
  district: string
  topic: string
  title: string
  content: string
  cropTypes: string[]
  season: string
  priority: "low" | "medium" | "high"
  createdAt: string
  updatedAt: string
}

export default function AdvisorDashboard() {
  const { user, advisorProfile, userRole, loading } = useAuth()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "in_progress" | "completed">("all")
  const [selectedUrgency, setSelectedUrgency] = useState<"all" | "low" | "medium" | "high">("all")
  
  // Mock data
  const [adviceRequests, setAdviceRequests] = useState<AdviceRequest[]>([])
  const [farmers, setFarmers] = useState<FarmerProfile[]>([])
  const [buyers, setBuyers] = useState<BuyerProfile[]>([])
  const [districtRecommendations, setDistrictRecommendations] = useState<DistrictRecommendation[]>([])
  const [showRecommendationForm, setShowRecommendationForm] = useState(false)

  useEffect(() => {
    if (userRole !== "advisor") {
      return
    }
    loadData()
  }, [userRole])

  const loadData = async () => {
    // Mock data loading
    const mockAdviceRequests: AdviceRequest[] = [
      {
        id: "1",
        farmerId: "farmer1",
        farmerName: "Jean Baptiste Nkurunziza",
        farmerPhone: "0781234567",
        farmerDistrict: "Kicukiro",
        cropType: "maize",
        question: "My maize plants are showing yellow leaves. What could be the cause and how can I fix it?",
        urgency: "high",
        status: "pending",
        createdAt: new Date("2024-01-20T10:00:00Z")
      },
      {
        id: "2",
        farmerId: "farmer2",
        farmerName: "Marie Claire Uwimana",
        farmerPhone: "0782345678",
        farmerDistrict: "Musanze",
        cropType: "irish_potato",
        question: "What is the best time to plant potatoes in Musanze district?",
        urgency: "medium",
        status: "in_progress",
        createdAt: new Date("2024-01-19T14:30:00Z")
      },
      {
        id: "3",
        farmerId: "farmer3",
        farmerName: "Paul Mugenzi",
        farmerPhone: "0783456789",
        farmerDistrict: "Huye",
        cropType: "beans",
        question: "How can I improve my bean yield using organic methods?",
        urgency: "low",
        status: "completed",
        createdAt: new Date("2024-01-18T09:15:00Z"),
        completedAt: new Date("2024-01-18T16:45:00Z"),
        response: "For organic bean cultivation, focus on soil health, proper spacing, and natural pest control methods...",
        rating: 5
      }
    ]

    const mockFarmers: FarmerProfile[] = [
      {
        id: "farmer1",
        name: "Jean Baptiste Nkurunziza",
        email: "jean@example.com",
        phone: "0781234567",
        district: "Kicukiro",
        sector: "Kagarama",
        cell: "Kagarama",
        village: "Kagarama",
        language: "rw",
        farmSize: 2.5,
        primaryCrops: ["maize", "beans"],
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
      }
    ]

    setAdviceRequests(mockAdviceRequests)
    setFarmers(mockFarmers)
    setBuyers([])
  }

  const handleAdviceRequest = (requestId: string, action: "accept" | "complete" | "reject") => {
    // In real app, this would update the database
    console.log(`Performing ${action} on advice request ${requestId}`)
  }

  const filteredRequests = adviceRequests.filter(request => {
    const matchesSearch = request.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.cropType.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus
    const matchesUrgency = selectedUrgency === "all" || request.urgency === selectedUrgency
    return matchesSearch && matchesStatus && matchesUrgency
  })

  if (loading) {
    return (
      <HorizontalDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading advisor dashboard...</p>
          </div>
        </div>
      </HorizontalDashboardLayout>
    )
  }

  if (userRole !== "advisor") {
    return (
      <HorizontalDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the advisor dashboard.</p>
          </div>
        </div>
      </HorizontalDashboardLayout>
    )
  }

  return (
    <HorizontalDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Advisor Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {advisorProfile?.name || "Advisor"}! Help farmers with agricultural advice.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Advice
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Advice</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adviceRequests.length}</div>
              <p className="text-xs text-muted-foreground">Given this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adviceRequests.filter(r => r.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">RWF 125,000</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
            <TabsTrigger value="requests">{t("requests")}</TabsTrigger>
            <TabsTrigger value="recommendations">{t("district_recommendations")}</TabsTrigger>
            <TabsTrigger value="farmers">{t("farmers")}</TabsTrigger>
            <TabsTrigger value="analytics">{t("analytics")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adviceRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{request.farmerName}</p>
                          <p className="text-sm text-muted-foreground">{request.cropType} • {request.farmerDistrict}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={
                              request.urgency === "high" ? "destructive" : 
                              request.urgency === "medium" ? "default" : "outline"
                            }
                          >
                            {request.urgency}
                          </Badge>
                          <Badge variant="outline" className="ml-2">
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Specialization Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {advisorProfile?.specialization?.map((crop, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium capitalize">{crop.replace('_', ' ')}</span>
                        <Badge variant="outline">Expert</Badge>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Experience</span>
                        <span className="font-medium">{advisorProfile?.experienceYears} years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Hourly Rate</span>
                        <span className="font-medium">RWF {advisorProfile?.hourlyRate?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as any)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedUrgency} onValueChange={(value) => setSelectedUrgency(value as any)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-green-700">
                            {request.farmerName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{request.farmerName}</h3>
                          <p className="text-sm text-muted-foreground">{request.farmerDistrict}</p>
                          <p className="text-sm text-muted-foreground">{request.farmerPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={
                            request.urgency === "high" ? "destructive" : 
                            request.urgency === "medium" ? "default" : "outline"
                          }
                        >
                          {request.urgency}
                        </Badge>
                        <Badge variant="outline">
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Crop: {request.cropType}</p>
                      <p className="font-medium mb-2">Question:</p>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">{request.question}</p>
                    </div>

                    {request.response && (
                      <div className="mb-4">
                        <p className="font-medium mb-2">Your Response:</p>
                        <p className="text-sm bg-green-50 p-3 rounded-lg">{request.response}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {request.createdAt.toLocaleDateString()}
                        {request.completedAt && (
                          <>
                            <span className="mx-2">•</span>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completed {request.completedAt.toLocaleDateString()}
                          </>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {request.status === "pending" && (
                          <Button 
                            size="sm" 
                            onClick={() => handleAdviceRequest(request.id, "accept")}
                          >
                            Accept
                          </Button>
                        )}
                        {request.status === "in_progress" && (
                          <Button 
                            size="sm" 
                            onClick={() => handleAdviceRequest(request.id, "complete")}
                          >
                            Complete
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{t("district_recommendations")}</h2>
                <p className="text-sm text-muted-foreground">{t("manage_district_specific_advice")}</p>
              </div>
              <Button onClick={() => setShowRecommendationForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t("add_recommendation")}
              </Button>
            </div>

            {/* District Recommendations List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {districtRecommendations.map((recommendation) => (
                <Card key={recommendation.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{recommendation.title}</h3>
                        <p className="text-sm text-muted-foreground">{recommendation.district}</p>
                      </div>
                      <Badge 
                        variant={
                          recommendation.priority === "high" ? "destructive" : 
                          recommendation.priority === "medium" ? "default" : "outline"
                        }
                      >
                        {recommendation.priority}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">{t("topic")}: {recommendation.topic}</p>
                      <p className="text-sm text-muted-foreground mb-2">{t("season")}: {recommendation.season}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {recommendation.cropTypes.map((crop) => (
                          <Badge key={crop} variant="secondary" className="text-xs">
                            {t(crop)}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg line-clamp-3">
                        {recommendation.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t("created")}: {new Date(recommendation.createdAt).toLocaleDateString()}</span>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {districtRecommendations.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t("no_recommendations")}</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {t("start_creating_district_specific_recommendations")}
                  </p>
                  <Button onClick={() => setShowRecommendationForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("create_first_recommendation")}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="farmers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmers.map((farmer) => (
                <Card key={farmer.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-green-700">
                          {farmer.name?.charAt(0) || "F"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{farmer.name}</h3>
                        <p className="text-sm text-muted-foreground">{farmer.district}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        {farmer.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        {farmer.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {farmer.sector}, {farmer.district}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm ml-1">{farmer.rating}</span>
                      </div>
                      <Badge variant={farmer.isVerified ? "outline" : "destructive"}>
                        {farmer.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <Button className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Farmer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advice Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Advice Given</span>
                      <span className="font-medium">{adviceRequests.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="font-medium">{adviceRequests.filter(r => r.status === "completed").length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">In Progress</span>
                      <span className="font-medium">{adviceRequests.filter(r => r.status === "in_progress").length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending</span>
                      <span className="font-medium">{adviceRequests.filter(r => r.status === "pending").length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Response Time</span>
                      <span className="font-medium">2.5 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                      <span className="font-medium">4.8/5.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Repeat Clients</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Earnings</span>
                      <span className="font-medium">RWF 125,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HorizontalDashboardLayout>
  )
}
