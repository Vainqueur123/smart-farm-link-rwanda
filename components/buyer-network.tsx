"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Search, 
  MapPin, 
  Star, 
  MessageCircle, 
  Phone, 
  Building, 
  ShoppingCart,
  TrendingUp,
  Filter
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface Buyer {
  id: string
  name: string
  type: "restaurant" | "retailer" | "institution" | "exporter" | "processor"
  district: string
  sector: string
  phone: string
  email: string
  rating: number
  totalOrders: number
  lastOrder: string
  preferredCrops: string[]
  tags: string[]
  isVerified: boolean
  isOnline: boolean
}

interface BuyerNetworkProps {
  farmerDistrict?: string
}

export function BuyerNetwork({ farmerDistrict }: BuyerNetworkProps) {
  const { t } = useTranslation()
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [filteredBuyers, setFilteredBuyers] = useState<Buyer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDistrict, setSelectedDistrict] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBuyers()
  }, [])

  useEffect(() => {
    filterBuyers()
  }, [buyers, searchQuery, selectedType, selectedDistrict, activeTab])

  const loadBuyers = async () => {
    setLoading(true)
    // Mock buyer data
    const mockBuyers: Buyer[] = [
      {
        id: "1",
        name: "Kigali Restaurant Group",
        type: "restaurant",
        district: "Kigali",
        sector: "Nyarugenge",
        phone: "+250788123456",
        email: "orders@kigalirestaurant.rw",
        rating: 4.8,
        totalOrders: 156,
        lastOrder: "2024-01-15",
        preferredCrops: ["maize", "irish_potato", "beans"],
        tags: ["premium", "regular_buyer"],
        isVerified: true,
        isOnline: true
      },
      {
        id: "2",
        name: "Rwanda Export Company",
        type: "exporter",
        district: "Kigali",
        sector: "Gasabo",
        phone: "+250788234567",
        email: "procurement@rwandaexport.rw",
        rating: 4.9,
        totalOrders: 89,
        lastOrder: "2024-01-14",
        preferredCrops: ["coffee", "tea", "beans"],
        tags: ["export", "high_volume"],
        isVerified: true,
        isOnline: false
      },
      {
        id: "3",
        name: "Musanze Fresh Market",
        type: "retailer",
        district: "Musanze",
        sector: "Muhoza",
        phone: "+250788345678",
        email: "info@musanzefresh.rw",
        rating: 4.6,
        totalOrders: 234,
        lastOrder: "2024-01-16",
        preferredCrops: ["irish_potato", "sweet_potato", "cassava"],
        tags: ["local", "bulk_buyer"],
        isVerified: true,
        isOnline: true
      },
      {
        id: "4",
        name: "University of Rwanda",
        type: "institution",
        district: "Huye",
        sector: "Huye",
        phone: "+250788456789",
        email: "procurement@ur.ac.rw",
        rating: 4.7,
        totalOrders: 67,
        lastOrder: "2024-01-12",
        preferredCrops: ["maize", "beans", "rice"],
        tags: ["institution", "monthly_orders"],
        isVerified: true,
        isOnline: false
      }
    ]
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    setBuyers(mockBuyers)
    setLoading(false)
  }

  const filterBuyers = () => {
    let filtered = buyers

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(buyer => 
        buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.preferredCrops.some(crop => crop.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(buyer => buyer.type === selectedType)
    }

    // District filter
    if (selectedDistrict !== "all") {
      filtered = filtered.filter(buyer => buyer.district === selectedDistrict)
    }

    // Tab filter
    if (activeTab === "verified") {
      filtered = filtered.filter(buyer => buyer.isVerified)
    } else if (activeTab === "online") {
      filtered = filtered.filter(buyer => buyer.isOnline)
    } else if (activeTab === "nearby") {
      filtered = filtered.filter(buyer => buyer.district === farmerDistrict)
    }

    setFilteredBuyers(filtered)
  }

  const getBuyerTypeIcon = (type: string) => {
    switch (type) {
      case "restaurant":
        return "🍽️"
      case "retailer":
        return "🏪"
      case "institution":
        return "🏛️"
      case "exporter":
        return "🚢"
      case "processor":
        return "🏭"
      default:
        return "🏢"
    }
  }

  const getBuyerTypeLabel = (type: string) => {
    switch (type) {
      case "restaurant":
        return t("Restaurant")
      case "retailer":
        return t("Retailer")
      case "institution":
        return t("Institution")
      case "exporter":
        return t("Exporter")
      case "processor":
        return t("Processor")
      default:
        return t("Buyer")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t("Buyer Network")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t("Buyer Network")}
          <Badge variant="secondary">{filteredBuyers.length} {t("buyers")}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("Search buyers, districts, or crops...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder={t("All Types")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All Types")}</SelectItem>
              <SelectItem value="restaurant">{t("Restaurants")}</SelectItem>
              <SelectItem value="retailer">{t("Retailers")}</SelectItem>
              <SelectItem value="institution">{t("Institutions")}</SelectItem>
              <SelectItem value="exporter">{t("Exporters")}</SelectItem>
              <SelectItem value="processor">{t("Processors")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder={t("All Districts")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All Districts")}</SelectItem>
              <SelectItem value="Kigali">Kigali</SelectItem>
              <SelectItem value="Musanze">Musanze</SelectItem>
              <SelectItem value="Huye">Huye</SelectItem>
              <SelectItem value="Nyagatare">Nyagatare</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">{t("All")}</TabsTrigger>
            <TabsTrigger value="verified">{t("Verified")}</TabsTrigger>
            <TabsTrigger value="online">{t("Online")}</TabsTrigger>
            <TabsTrigger value="nearby">{t("Nearby")}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3">
            {filteredBuyers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("No buyers found")}</p>
              </div>
            ) : (
              filteredBuyers.map((buyer) => (
                <Card key={buyer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getBuyerTypeIcon(buyer.type)}</span>
                          <div>
                            <h3 className="font-semibold">{buyer.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{buyer.district}, {buyer.sector}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{buyer.rating}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {getBuyerTypeLabel(buyer.type)}
                          </Badge>
                          {buyer.isVerified && (
                            <Badge className="bg-blue-600 text-xs">
                              {t("Verified")}
                            </Badge>
                          )}
                          {buyer.isOnline && (
                            <Badge className="bg-green-600 text-xs">
                              {t("Online")}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            <span>{buyer.totalOrders} {t("orders")}</span>
                            <span className="text-muted-foreground">•</span>
                            <span>{t("Last order")}: {new Date(buyer.lastOrder).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span>{t("Interested in")}: {buyer.preferredCrops.map(crop => t(crop)).join(", ")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {t("Contact")}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          {t("Call")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

