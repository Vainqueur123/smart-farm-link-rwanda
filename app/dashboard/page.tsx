"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Droplets, Sprout, TrendingUp, CheckCircle, Clock, MapPin, Plus } from "@/lib/lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getDistrictProfile, getRecommendedCropsForDistrict } from "@/lib/districts"
import { DashboardLayout } from "@/components/dashboard-layout"
import { WeatherWidget } from "@/components/weather-widget"
import { ActivityCalendar } from "@/components/activity-calendar"
import { CropCard } from "@/components/crop-card"
import { RecommendationCard } from "@/components/recommendation-card"
import { useTranslation } from "react-i18next"

export default function DashboardPage() {
  const { user, farmerProfile, loading } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
    if (!loading && user && !farmerProfile?.profileComplete) {
      router.push("/onboarding")
    }
  }, [user, farmerProfile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (!user || !farmerProfile) return null

  const districtProfile = getDistrictProfile(farmerProfile.district)
  const recommendedCrops = getRecommendedCropsForDistrict(farmerProfile.district)

  // Mock data for demo - in production this would come from Firebase
  const upcomingActivities = [
    {
      id: "1",
      title: "Water Maize Field",
      crop: "maize",
      type: "watering",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: "high",
    },
    {
      id: "2",
      title: "Apply Fertilizer to Beans",
      crop: "beans",
      type: "fertilizing",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      priority: "medium",
    },
    {
      id: "3",
      title: "Harvest Sweet Potatoes",
      crop: "sweet_potato",
      type: "harvesting",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: "high",
    },
  ]

  const farmStats = {
    totalCrops: farmerProfile.primaryCrops.length,
    activeActivities: upcomingActivities.length,
    completedThisWeek: 8,
    yieldPrediction: 85, // percentage
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {t("welcome")}, {farmerProfile.phone}!
              </h1>
              <div className="flex items-center space-x-4 text-green-100">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {farmerProfile.district}, {districtProfile?.province}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sprout className="h-4 w-4" />
                  <span>{farmerProfile.farmSize} hectares</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{farmStats.yieldPrediction}%</div>
              <div className="text-green-100">Predicted Yield</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Crops</p>
                  <p className="text-2xl font-bold text-green-600">{farmStats.totalCrops}</p>
                </div>
                <Sprout className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Tasks</p>
                  <p className="text-2xl font-bold text-orange-600">{farmStats.activeActivities}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed This Week</p>
                  <p className="text-2xl font-bold text-blue-600">{farmStats.completedThisWeek}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Yield Prediction</p>
                  <p className="text-2xl font-bold text-green-600">{farmStats.yieldPrediction}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="crops">My Crops</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weather Widget */}
                <div className="lg:col-span-1">
                  <WeatherWidget district={farmerProfile.district} />
                </div>

                {/* Upcoming Activities */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Upcoming Activities</CardTitle>
                        <CardDescription>Tasks scheduled for the next 7 days</CardDescription>
                      </div>
                      <Button size="sm" onClick={() => setActiveTab("activities")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {upcomingActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  activity.priority === "high"
                                    ? "bg-red-500"
                                    : activity.priority === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                              />
                              <div>
                                <p className="font-medium">{activity.title}</p>
                                <p className="text-sm text-gray-600">
                                  {activity.dueDate.toLocaleDateString()} • {t(activity.crop)}
                                </p>
                              </div>
                            </div>
                            <Badge variant={activity.priority === "high" ? "destructive" : "secondary"}>
                              {activity.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* District Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>District-Specific Recommendations</CardTitle>
                  <CardDescription>Personalized advice for farming in {farmerProfile.district}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RecommendationCard
                      title="Optimal Planting Season"
                      description="Based on {district} climate data, the best time to plant maize is approaching in 2 weeks."
                      icon={Calendar}
                      type="seasonal"
                    />
                    <RecommendationCard
                      title="Soil Preparation"
                      description="Your district's clay soil benefits from organic matter. Consider adding compost before planting."
                      icon={Sprout}
                      type="soil"
                    />
                    <RecommendationCard
                      title="Water Management"
                      description="Rainfall prediction shows dry period ahead. Plan irrigation for next month."
                      icon={Droplets}
                      type="water"
                    />
                    <RecommendationCard
                      title="Market Opportunity"
                      description="Bean prices are 15% higher in neighboring districts. Consider expanding production."
                      icon={TrendingUp}
                      type="market"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Farm Activities</h2>
                  <p className="text-gray-600">Manage your farming schedule and track progress</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </div>
              <ActivityCalendar activities={upcomingActivities} />
            </TabsContent>

            {/* Crops Tab */}
            <TabsContent value="crops" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">My Crops</h2>
                  <p className="text-gray-600">Monitor your crop health and progress</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Crop
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmerProfile.primaryCrops.map((crop) => (
                  <CropCard
                    key={crop}
                    crop={crop}
                    district={farmerProfile.district}
                    progress={Math.floor(Math.random() * 100)}
                    health="good"
                    nextActivity="watering"
                  />
                ))}
              </div>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Farm Insights</h2>
                <p className="text-gray-600">Data-driven insights to improve your farming</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Yield Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle>Yield Trends</CardTitle>
                    <CardDescription>Your farm performance over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {farmerProfile.primaryCrops.slice(0, 3).map((crop) => (
                        <div key={crop} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{t(crop)}</span>
                            <span className="text-green-600">+12% vs last season</span>
                          </div>
                          <Progress value={Math.floor(Math.random() * 40) + 60} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* District Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>District Performance</CardTitle>
                    <CardDescription>How you compare to other farmers in {farmerProfile.district}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Productivity Rank</span>
                        <Badge variant="secondary">Top 25%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Sustainability Score</span>
                        <span className="text-green-600 font-medium">8.2/10</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Technology Adoption</span>
                        <Badge className="bg-green-600">Advanced</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations based on district data */}
              <Card>
                <CardHeader>
                  <CardTitle>NISR Data Insights</CardTitle>
                  <CardDescription>
                    Recommendations based on National Institute of Statistics Rwanda data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Income Opportunity</h4>
                      <p className="text-sm text-blue-700">
                        Farmers in {farmerProfile.district} who diversify with coffee see 23% higher income on average.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Productivity Tip</h4>
                      <p className="text-sm text-green-700">
                        Your district's soil type responds well to organic fertilizers, showing 18% better yields.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
