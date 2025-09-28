"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, MapPin, Phone, Star, Plus } from "lucide-react"
import { districts } from "@/lib/districts"
import { useTranslation } from "@/lib/i18n"

interface MarketListing {
  id: string
  farmerId: string
  farmerName: string
  farmerPhone: string
  farmerDistrict: string
  farmerSector: string
  crop: string
  quantity: number
  unit: string
  pricePerUnit: number
  totalValue: number
  quality: "Premium" | "Standard" | "Basic"
  harvestDate: string
  availableUntil: string
  description: string
  images: string[]
  rating: number
  verified: boolean
  organic: boolean
}

interface MarketPrice {
  crop: string
  district: string
  currentPrice: number
  weeklyChange: number
  monthlyChange: number
  demand: "High" | "Medium" | "Low"
  supply: "High" | "Medium" | "Low"
  trend: "up" | "down" | "stable"
}

export default function MarketplacePage() {
  const { user } = useAuth()
  const { t, currentLanguage } = useTranslation()
  const [activeTab, setActiveTab] = useState("browse")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("all")
  const [selectedCrop, setSelectedCrop] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [listings, setListings] = useState<MarketListing[]>([])
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    const mockListings: MarketListing[] = [
      {
        id: "1",
        farmerId: "farmer1",
        farmerName: "Jean Baptiste Uwimana",
        farmerPhone: "+250788123456",
        farmerDistrict: "Nyagatare",
        farmerSector: "Karangazi",
        crop: "Maize",
        quantity: 500,
        unit: "kg",
        pricePerUnit: 350,
        totalValue: 175000,
        quality: "Premium",
        harvestDate: "2024-01-15",
        availableUntil: "2024-02-15",
        description: "High-quality yellow maize, properly dried and stored",
        images: ["/yellow-maize-harvest.jpg"],
        rating: 4.8,
        verified: true,
        organic: false,
      },
      {
        id: "2",
        farmerId: "farmer2",
        farmerName: "Marie Claire Mukamana",
        farmerPhone: "+250788234567",
        farmerDistrict: "Musanze",
        farmerSector: "Cyuve",
        crop: "Irish Potatoes",
        quantity: 1000,
        unit: "kg",
        pricePerUnit: 280,
        totalValue: 280000,
        quality: "Premium",
        harvestDate: "2024-01-10",
        availableUntil: "2024-03-10",
        description: "Fresh Irish potatoes from volcanic soil, excellent for export",
        images: ["/fresh-irish-potatoes.jpg"],
        rating: 4.9,
        verified: true,
        organic: true,
      },
      {
        id: "3",
        farmerId: "farmer3",
        farmerName: "Emmanuel Nzeyimana",
        farmerPhone: "+250788345678",
        farmerDistrict: "Huye",
        farmerSector: "Tumba",
        crop: "Coffee",
        quantity: 200,
        unit: "kg",
        pricePerUnit: 1200,
        totalValue: 240000,
        quality: "Premium",
        harvestDate: "2024-01-05",
        availableUntil: "2024-04-05",
        description: "Arabica coffee beans, fully washed, AA grade",
        images: ["/arabica-coffee-beans.png"],
        rating: 5.0,
        verified: true,
        organic: true,
      },
    ]

    const mockPrices: MarketPrice[] = [
      {
        crop: "Maize",
        district: "Nyagatare",
        currentPrice: 350,
        weeklyChange: 5.2,
        monthlyChange: 12.8,
        demand: "High",
        supply: "Medium",
        trend: "up",
      },
      {
        crop: "Irish Potatoes",
        district: "Musanze",
        currentPrice: 280,
        weeklyChange: -2.1,
        monthlyChange: 8.5,
        demand: "Medium",
        supply: "High",
        trend: "down",
      },
      {
        crop: "Coffee",
        district: "Huye",
        currentPrice: 1200,
        weeklyChange: 8.7,
        monthlyChange: 15.3,
        demand: "High",
        supply: "Low",
        trend: "up",
      },
    ]

    setListings(mockListings)
    setMarketPrices(mockPrices)
    setLoading(false)
  }, [])

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDistrict = selectedDistrict === "all" || listing.farmerDistrict === selectedDistrict
    const matchesCrop = selectedCrop === "all" || listing.crop === selectedCrop

    return matchesSearch && matchesDistrict && matchesCrop
  })

  const crops = ["Maize", "Irish Potatoes", "Coffee", "Beans", "Rice", "Cassava", "Sweet Potatoes", "Bananas"]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t("Loading marketplace...")}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">{t("Smart Marketplace")}</h1>
            <p className="text-muted-foreground text-pretty">{t("Connect with buyers and sellers across Rwanda")}</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            {t("List Your Produce")}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">{t("Browse Listings")}</TabsTrigger>
            <TabsTrigger value="prices">{t("Market Prices")}</TabsTrigger>
            <TabsTrigger value="my-listings">{t("My Listings")}</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("Search crops or farmers...")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder={t("All Districts")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Districts")}</SelectItem>
                      {districts.map((district) => (
                        <SelectItem key={district.name} value={district.name}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder={t("All Crops")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Crops")}</SelectItem>
                      {crops.map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img
                      src={listing.images[0] || "/placeholder.svg"}
                      alt={listing.crop}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      {listing.verified && <Badge className="bg-blue-600 hover:bg-blue-700">{t("Verified")}</Badge>}
                      {listing.organic && <Badge className="bg-green-600 hover:bg-green-700">{t("Organic")}</Badge>}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-white/90">
                        {listing.quality}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{listing.crop}</h3>
                          <p className="text-sm text-muted-foreground">
                            {listing.quantity} {listing.unit} available
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {listing.pricePerUnit.toLocaleString()} RWF
                          </p>
                          <p className="text-xs text-muted-foreground">per {listing.unit}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {listing.farmerDistrict}, {listing.farmerSector}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{listing.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{listing.farmerName}</span>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>

                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700">{t("Contact Farmer")}</Button>
                        <Button variant="outline" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="prices" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {marketPrices.map((price) => (
                <Card key={`${price.crop}-${price.district}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{price.crop}</CardTitle>
                      <Badge
                        variant={
                          price.trend === "up" ? "default" : price.trend === "down" ? "destructive" : "secondary"
                        }
                      >
                        <TrendingUp className={`h-3 w-3 mr-1 ${price.trend === "down" ? "rotate-180" : ""}`} />
                        {price.trend === "up" ? "Rising" : price.trend === "down" ? "Falling" : "Stable"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{price.district} District</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{price.currentPrice.toLocaleString()} RWF</p>
                      <p className="text-sm text-muted-foreground">per kg</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t("Weekly Change")}</p>
                        <p className={`font-medium ${price.weeklyChange > 0 ? "text-green-600" : "text-red-600"}`}>
                          {price.weeklyChange > 0 ? "+" : ""}
                          {price.weeklyChange}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t("Monthly Change")}</p>
                        <p className={`font-medium ${price.monthlyChange > 0 ? "text-green-600" : "text-red-600"}`}>
                          {price.monthlyChange > 0 ? "+" : ""}
                          {price.monthlyChange}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t("Demand")}</p>
                        <Badge
                          variant={
                            price.demand === "High" ? "default" : price.demand === "Medium" ? "secondary" : "outline"
                          }
                        >
                          {price.demand}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t("Supply")}</p>
                        <Badge
                          variant={
                            price.supply === "High" ? "default" : price.supply === "Medium" ? "secondary" : "outline"
                          }
                        >
                          {price.supply}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-listings" className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Plus className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t("No listings yet")}</h3>
                    <p className="text-muted-foreground">{t("Start selling your produce to buyers across Rwanda")}</p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("Create Your First Listing")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
