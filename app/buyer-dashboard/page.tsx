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
  ShoppingCart, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Heart,
  MessageCircle,
  Plus,
  Eye,
  Calendar,
  TrendingUp,
  Package,
  Truck,
  CreditCard,
  Bell,
  Settings,
  User,
  LogOut,
  CheckCircle
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import type { Product, FarmerProfile } from "@/lib/types"

export default function BuyerDashboard() {
  const { user, buyerProfile, userRole, loading } = useAuth()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDistrict, setSelectedDistrict] = useState("all")
  
  // Mock data
  const [products, setProducts] = useState<Product[]>([])
  const [farmers, setFarmers] = useState<FarmerProfile[]>([
    {
      id: "farmer1",
      name: "Claudine Mukamana",
      email: "claudine@example.com",
      phone: "0784123456",
      district: "Musanze",
      sector: "Kinigi",
      cell: "Kinigi",
      village: "Kinigi",
      farmSize: 2.5,
      primaryCrops: ["maize", "beans", "irish_potato"],
      experienceLevel: "intermediate",
      hasSmartphone: true,
      preferredContact: "app",
      registrationDate: new Date("2023-01-15"),
      joinDate: new Date("2023-01-15"),
      profileComplete: true,
      isVerified: true,
      rating: 4.8,
      totalSales: 45,
      role: "farmer"
    },
    {
      id: "farmer2", 
      name: "Jean Baptiste Nkurunziza",
      email: "jean@example.com",
      phone: "0785987654",
      district: "Rubavu",
      sector: "Gisenyi",
      cell: "Gisenyi",
      village: "Gisenyi",
      farmSize: 1.8,
      primaryCrops: ["coffee", "tea", "banana"],
      experienceLevel: "expert",
      hasSmartphone: true,
      preferredContact: "app",
      registrationDate: new Date("2022-08-20"),
      joinDate: new Date("2022-08-20"),
      profileComplete: true,
      isVerified: true,
      rating: 4.9,
      totalSales: 78,
      role: "farmer"
    },
    {
      id: "farmer3",
      name: "Marie Claire Uwimana",
      email: "marie@example.com", 
      phone: "0787654321",
      district: "Huye",
      sector: "Huye",
      cell: "Huye",
      village: "Huye",
      farmSize: 3.2,
      primaryCrops: ["rice", "maize", "sorghum"],
      experienceLevel: "beginner",
      hasSmartphone: true,
      preferredContact: "app",
      registrationDate: new Date("2023-03-10"),
      joinDate: new Date("2023-03-10"),
      profileComplete: true,
      isVerified: false,
      rating: 4.2,
      totalSales: 12,
      role: "farmer"
    }
  ])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [cart, setCart] = useState<Set<string>>(new Set())
  const [contactedFarmers, setContactedFarmers] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (userRole !== "buyer") {
      return
    }
    loadData()
  }, [userRole])

  const loadData = async () => {
    // Mock data loading
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Fresh Maize",
        type: "maize",
        description: "High quality fresh maize from Kicukiro district",
        pricePerKg: 800,
        minOrderQuantity: 10,
        availableQuantity: 500,
        unit: "kg",
        district: "Kicukiro",
        farmerId: "farmer1",
        farmerName: "Jean Baptiste Nkurunziza",
        rating: 4.5,
        reviewCount: 23,
        imageUrl: "/placeholder-product.png",
        isOrganic: true,
        harvestDate: "2024-01-15",
        paymentMethods: ["mtn_momo", "airtel_money"],
        isVerified: true,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z"
      },
      {
        id: "2",
        name: "Organic Potatoes",
        type: "irish_potato",
        description: "Fresh organic potatoes from Musanze",
        pricePerKg: 600,
        minOrderQuantity: 5,
        availableQuantity: 300,
        unit: "kg",
        district: "Musanze",
        farmerId: "farmer2",
        farmerName: "Marie Claire Uwimana",
        rating: 4.8,
        reviewCount: 15,
        imageUrl: "/placeholder-product.png",
        isOrganic: true,
        harvestDate: "2024-01-20",
        paymentMethods: ["mtn_momo", "cash"],
        isVerified: true,
        createdAt: "2024-01-20T08:00:00Z",
        updatedAt: "2024-01-20T08:00:00Z"
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
      },
      {
        id: "farmer2",
        name: "Marie Claire Uwimana",
        email: "marie@example.com",
        phone: "0782345678",
        district: "Musanze",
        sector: "Kinigi",
        cell: "Kinigi",
        village: "Kinigi",
        language: "rw",
        farmSize: 1.8,
        primaryCrops: ["irish_potato", "carrots"],
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

    setProducts(mockProducts)
    setFarmers(mockFarmers)
  }

  const handleContactFarmer = (farmerId: string, productId?: string) => {
    const newContactedFarmers = new Set(contactedFarmers)
    newContactedFarmers.add(farmerId)
    setContactedFarmers(newContactedFarmers)
    // In real app, this would open a chat or contact form
    console.log(`Contacting farmer ${farmerId} about product ${productId}`)
  }

  const handleToggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId)
    } else {
      newFavorites.add(productId)
    }
    setFavorites(newFavorites)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.type === selectedCategory
    const matchesDistrict = selectedDistrict === "all" || product.district === selectedDistrict
    return matchesSearch && matchesCategory && matchesDistrict
  })

  // Filter farmers based on search and filters
  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         farmer.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         farmer.primaryCrops.some(crop => crop.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesDistrict = selectedDistrict === "all" || farmer.district === selectedDistrict
    const matchesCategory = selectedCategory === "all" || farmer.primaryCrops.includes(selectedCategory)
    
    return matchesSearch && matchesDistrict && matchesCategory
  })

  if (loading) {
    return (
      <HorizontalDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading buyer dashboard...</p>
          </div>
        </div>
      </HorizontalDashboardLayout>
    )
  }

  if (userRole !== "buyer") {
    return (
      <HorizontalDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the buyer dashboard.</p>
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
            <h1 className="text-2xl font-bold tracking-tight">Buyer Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {buyerProfile?.name || "Buyer"}! Find fresh produce from local farmers.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{favorites.size}</div>
              <p className="text-xs text-muted-foreground">Saved products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">RWF 450,000</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Farmers Contacted</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Active conversations</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="farmers">Farmers</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Fresh Maize - 50kg</p>
                        <p className="text-sm text-muted-foreground">From Jean Baptiste</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">RWF 40,000</p>
                        <Badge variant="outline">Delivered</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Organic Potatoes - 30kg</p>
                        <p className="text-sm text-muted-foreground">From Marie Claire</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">RWF 18,000</p>
                        <Badge variant="outline">In Transit</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Favorite Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.district}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">RWF {product.pricePerKg}/kg</p>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm ml-1">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="maize">Maize</SelectItem>
                  <SelectItem value="irish_potato">Potatoes</SelectItem>
                  <SelectItem value="beans">Beans</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  <SelectItem value="Kicukiro">Kicukiro</SelectItem>
                  <SelectItem value="Musanze">Musanze</SelectItem>
                  <SelectItem value="Huye">Huye</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="h-64 bg-gray-100 flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{product.name}</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleFavorite(product.id)}
                      >
                        <Heart className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-green-600">
                        RWF {product.pricePerKg}/kg
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm ml-1">{product.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {product.district}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-1" />
                        {product.farmerName}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleContactFarmer(product.farmerId, product.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="farmers" className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search farmers by name, district, or crops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  <SelectItem value="Musanze">Musanze</SelectItem>
                  <SelectItem value="Rubavu">Rubavu</SelectItem>
                  <SelectItem value="Huye">Huye</SelectItem>
                  <SelectItem value="Kigali">Kigali</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Crops" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  <SelectItem value="maize">Maize</SelectItem>
                  <SelectItem value="beans">Beans</SelectItem>
                  <SelectItem value="coffee">Coffee</SelectItem>
                  <SelectItem value="tea">Tea</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Farmers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFarmers.length > 0 ? (
                filteredFarmers.map((farmer) => (
                  <Card key={farmer.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
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
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(farmer.id)}
                          >
                            <Heart className={`h-4 w-4 ${favorites.has(farmer.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                          </Button>
                          {farmer.isVerified && (
                            <Badge variant="outline" className="border-green-200 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          {farmer.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {farmer.sector}, {farmer.district}
                        </div>
                        <div className="flex items-center text-sm">
                          <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                          {farmer.farmSize} hectares
                        </div>
                      </div>

                      {/* Crops */}
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Crops Grown:</p>
                        <div className="flex flex-wrap gap-1">
                          {farmer.primaryCrops.slice(0, 3).map((crop) => (
                            <Badge key={crop} variant="secondary" className="text-xs">
                              {crop}
                            </Badge>
                          ))}
                          {farmer.primaryCrops.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{farmer.primaryCrops.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm ml-1">{farmer.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">({farmer.totalSales} sales)</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {farmer.experienceLevel}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant={contactedFarmers.has(farmer.id) ? "outline" : "default"}
                          className="flex-1"
                          onClick={() => handleContactFarmer(farmer.id)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          {contactedFarmers.has(farmer.id) ? "Contacted" : "Contact"}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No farmers found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Fresh Maize - 50kg</p>
                        <p className="text-sm text-muted-foreground">Order #12345 • Jan 15, 2024</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">RWF 40,000</p>
                      <Badge variant="outline">Delivered</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Truck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Organic Potatoes - 30kg</p>
                        <p className="text-sm text-muted-foreground">Order #12346 • Jan 20, 2024</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">RWF 18,000</p>
                      <Badge variant="outline">In Transit</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HorizontalDashboardLayout>
  )
}
