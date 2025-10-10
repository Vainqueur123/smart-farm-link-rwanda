"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Droplets, Sprout, TrendingUp, CheckCircle, Clock, MapPin, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getDistrictProfile, getRecommendedCropsForDistrict } from "@/lib/districts"
import { HorizontalDashboardLayout } from "@/components/horizontal-dashboard-layout"
import { WeatherWidget } from "@/components/weather-widget"
import { SimpleCalendar } from "@/components/simple-calendar"
import type { Activity } from "@/components/simple-calendar"
import { CropCard } from "@/components/crop-card"
import { RecommendationCard } from "@/components/recommendation-card"
import { useTranslation } from "@/lib/i18n"

export default function DashboardPage() {
  const { user, farmerProfile, loading } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("overview")
  const [mounted, setMounted] = useState(false)

  // Avoid SSR/CSR markup mismatches from dynamic values (dates, Math.random, locale formatting)
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
      return
    }
    
    if (!loading && user) {
      // Redirect based on user role
      if (user.role === "buyer") {
        router.push("/buyer-dashboard")
        return
      } else if (user.role === "admin") {
        router.push("/admin-dashboard")
        return
      } else if (user.role === "farmer") {
        if (!farmerProfile?.profileComplete) {
          router.push("/onboarding")
          return
        } else {
          router.push("/farmer-dashboard")
          return
        }
      }
    }
  }, [user, farmerProfile, loading, router])

  // Ensure client has mounted before any rendering to prevent hydration errors
  if (!mounted) return null

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
  const profile = farmerProfile!

  const districtProfile = getDistrictProfile(profile.district)
  // const recommendedCrops = getRecommendedCropsForDistrict(farmerProfile.district)

  // Mock data for demo - in production this would come from Firebase
  const upcomingActivities: Activity[] = [
    {
      id: "1",
      title: t("Water Maize Field"),
      crop: "maize",
      type: "watering",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: "high",
      status: "pending",
      description: t("Water the maize field in the morning")
    },
    {
      id: "2",
      title: t("Apply Fertilizer to Beans"),
      crop: "beans",
      type: "fertilizing",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      priority: "medium",
      status: "pending",
      description: t("Apply organic fertilizer to bean plants")
    },
    {
      id: "3",
      title: t("Harvest Sweet Potatoes"),
      crop: "sweet_potato",
      type: "harvesting",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: "high",
      status: "pending",
      description: t("Harvest mature sweet potatoes")
    },
  ]

  const farmStats = {
    totalCrops: farmerProfile.primaryCrops.length,
    activeActivities: upcomingActivities.length,
    completedThisWeek: 8,
    yieldPrediction: 85, // percentage
  }

  return (
    <HorizontalDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {t("welcome")}, {farmerProfile.name || farmerProfile.phone}!
              </h1>
              <div className="flex items-center space-x-4 text-green-100">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {profile.district}, {districtProfile?.province}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sprout className="h-4 w-4" />
                  <span>
                    {profile.farmSize} {t("hectares")}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{farmStats.yieldPrediction}%</div>
              <div className="text-green-100">{t("Predicted Yield")}</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t("Active Crops")}</p>
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
                  <p className="text-sm text-gray-600">{t("Pending Tasks")}</p>
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
                  <p className="text-sm text-gray-600">{t("Completed This Week")}</p>
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
                  <p className="text-sm text-gray-600">{t("Yield Prediction")}</p>
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
              <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
              <TabsTrigger value="activities">{t("Activities")}</TabsTrigger>
              <TabsTrigger value="crops">{t("My Crops")}</TabsTrigger>
              <TabsTrigger value="insights">{t("Insights")}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weather Widget */}
                <div className="lg:col-span-1">
                  <WeatherWidget district={profile.district} />
                </div>

                {/* Upcoming Activities */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>{t("Upcoming Activities")}</CardTitle>
                        <CardDescription>{t("Tasks scheduled for the next 7 days")}</CardDescription>
                      </div>
                      <Button size="sm" onClick={() => setActiveTab("activities")}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("Add Task")}
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
                                  {activity.dueDate.toLocaleDateString()} {activity.crop ? `• ${t(activity.crop)}` : ""}
                                </p>
                              </div>
                            </div>
                            <Badge variant={activity.priority === "high" ? "destructive" : "secondary"}>
                              {t(activity.priority)}
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
                  <CardTitle>{t("District-Specific Recommendations")}</CardTitle>
                  <CardDescription>
                    {t("Personalized advice for farming in")} {profile.district}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RecommendationCard
                      title={t("Optimal Planting Season")}
                      description={t("Best time to plant maize is approaching in 2 weeks")}
                      icon={Calendar}
                      type="seasonal"
                    />
                    <RecommendationCard
                      title={t("Soil Preparation")}
                      description={t("Clay soil benefits from organic matter. Consider adding compost before planting")}
                      icon={Sprout}
                      type="soil"
                    />
                    <RecommendationCard
                      title={t("Water Management")}
                      description={t("Dry period ahead. Plan irrigation for next month")}
                      icon={Droplets}
                      type="water"
                    />
                    <RecommendationCard
                      title={t("Market Opportunity")}
                      description={t("Bean prices are higher in neighboring districts. Consider expanding production")}
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
                  <h2 className="text-2xl font-bold">{t("Farm Activities")}</h2>
                  <p className="text-gray-600">{t("Manage your farming schedule and track progress")}</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("Add Activity")}
                </Button>
              </div>
              <SimpleCalendar activities={upcomingActivities} />
            </TabsContent>

            {/* Crops Tab */}
            <TabsContent value="crops" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{t("My Crops")}</h2>
                  <p className="text-gray-600">{t("Monitor your crop health and progress")}</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("Add Crop")}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.primaryCrops.map((crop) => (
                  <CropCard
                    key={crop}
                    crop={crop}
                    district={profile.district}
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
                <h2 className="text-2xl font-bold">{t("Farm Insights")}</h2>
                <p className="text-gray-600">{t("Data-driven insights to improve your farming")}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Yield Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Yield Trends")}</CardTitle>
                    <CardDescription>{t("Your farm performance over time")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {farmerProfile.primaryCrops.slice(0, 3).map((crop) => (
                        <div key={crop} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{t(crop)}</span>
                            <span className="text-green-600">+12% {t("vs last season")}</span>
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
                    <CardTitle>{t("District Performance")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>{t("Productivity Rank")}</span>
                        <Badge variant="secondary">{t("Top 25%")}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{t("Sustainability Score")}</span>
                        <span className="text-green-600 font-medium">8.2/10</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{t("Technology Adoption")}</span>
                        <Badge className="bg-green-600">{t("Advanced")}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations based on district data */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("NISR Data Insights")}</CardTitle>
                  <CardDescription>
                    {t("Recommendations based on National Institute of Statistics Rwanda data")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">{t("Income Opportunity")}</h4>
                      <p className="text-sm text-blue-700">
                        {t("Farmers in")} {profile.district} 
                        {t("who diversify with coffee see higher income on average")}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">{t("Productivity Tip")}</h4>
                      <p className="text-sm text-green-700">
                        {t("Your district soil responds well to organic fertilizers showing better yields")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </HorizontalDashboardLayout>
  )
}
