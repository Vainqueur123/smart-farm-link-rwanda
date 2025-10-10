"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  MapPin, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Filter,
  Search,
  Eye,
  MessageCircle,
  Phone,
  Mail
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import type { FarmerProfile, BuyerProfile, Product, DistrictCode } from "@/lib/types"

interface RwandaMapProps {
  farmers?: FarmerProfile[]
  buyers?: BuyerProfile[]
  products?: Product[]
  onFarmerClick?: (farmer: FarmerProfile) => void
  onBuyerClick?: (buyer: BuyerProfile) => void
  onProductClick?: (product: Product) => void
  className?: string
}

interface MapLocation {
  id: string
  name: string
  district: DistrictCode
  coordinates: [number, number]
  type: 'farmer' | 'buyer' | 'product'
  data: FarmerProfile | BuyerProfile | Product
  count?: number
}

export function RwandaMap({ 
  farmers = [], 
  buyers = [], 
  products = [], 
  onFarmerClick,
  onBuyerClick,
  onProductClick,
  className 
}: RwandaMapProps) {
  const { t } = useTranslation()
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictCode | "all">("all")
  const [selectedType, setSelectedType] = useState<"all" | "farmer" | "buyer" | "product">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([])

  // District coordinates (approximate)
  const districtCoordinates: Record<DistrictCode, [number, number]> = {
    "Nyarugenge": [-1.9441, 30.0619],
    "Gasabo": [-1.9441, 30.0619],
    "Kicukiro": [-1.9441, 30.0619],
    "Nyanza": [-2.3508, 29.7434],
    "Gisagara": [-2.3508, 29.7434],
    "Nyaruguru": [-2.3508, 29.7434],
    "Huye": [-2.6031, 29.7434],
    "Nyamagabe": [-2.6031, 29.7434],
    "Ruhango": [-2.6031, 29.7434],
    "Muhanga": [-2.6031, 29.7434],
    "Kamonyi": [-2.6031, 29.7434],
    "Rubavu": [-1.6769, 29.2389],
    "Nyabihu": [-1.6769, 29.2389],
    "Musanze": [-1.6769, 29.2389],
    "Burera": [-1.6769, 29.2389],
    "Gicumbi": [-1.6769, 29.2389],
    "Rulindo": [-1.6769, 29.2389],
    "Gakenke": [-1.6769, 29.2389],
    "Rusizi": [-2.4604, 28.9070],
    "Nyamasheke": [-2.4604, 28.9070],
    "Rutsiro": [-2.4604, 28.9070],
    "Karongi": [-2.4604, 28.9070],
    "Ngororero": [-2.4604, 28.9070],
    "Rwamagana": [-1.9486, 30.4347],
    "Nyagatare": [-1.9486, 30.4347],
    "Gatsibo": [-1.9486, 30.4347],
    "Kayonza": [-1.9486, 30.4347],
    "Kirehe": [-1.9486, 30.4347],
    "Ngoma": [-1.9486, 30.4347],
    "Bugesera": [-1.9486, 30.4347]
  }

  useEffect(() => {
    const locations: MapLocation[] = []

    // Add farmers
    farmers.forEach(farmer => {
      const coords = districtCoordinates[farmer.district]
      if (coords) {
        locations.push({
          id: `farmer-${farmer.id}`,
          name: farmer.name || "Unknown Farmer",
          district: farmer.district,
          coordinates: coords,
          type: 'farmer',
          data: farmer,
          count: 1
        })
      }
    })

    // Add buyers
    buyers.forEach(buyer => {
      const coords = districtCoordinates[buyer.district]
      if (coords) {
        locations.push({
          id: `buyer-${buyer.id}`,
          name: buyer.name || "Unknown Buyer",
          district: buyer.district,
          coordinates: coords,
          type: 'buyer',
          data: buyer,
          count: 1
        })
      }
    })

    // Add products (grouped by district)
    const productGroups = products.reduce((acc, product) => {
      const key = product.district
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(product)
      return acc
    }, {} as Record<string, Product[]>)

    Object.entries(productGroups).forEach(([district, districtProducts]) => {
      const coords = districtCoordinates[district as DistrictCode]
      if (coords) {
        locations.push({
          id: `products-${district}`,
          name: `${districtProducts.length} Products`,
          district: district as DistrictCode,
          coordinates: coords,
          type: 'product',
          data: districtProducts[0], // Use first product as representative
          count: districtProducts.length
        })
      }
    })

    setMapLocations(locations)
  }, [farmers, buyers, products])

  const filteredLocations = mapLocations.filter(location => {
    const matchesDistrict = selectedDistrict === "all" || location.district === selectedDistrict
    const matchesType = selectedType === "all" || location.type === selectedType
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.district.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDistrict && matchesType && matchesSearch
  })

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location)
    
    switch (location.type) {
      case 'farmer':
        onFarmerClick?.(location.data as FarmerProfile)
        break
      case 'buyer':
        onBuyerClick?.(location.data as BuyerProfile)
        break
      case 'product':
        onProductClick?.(location.data as Product)
        break
    }
  }

  const getLocationIcon = (type: MapLocation['type']) => {
    switch (type) {
      case 'farmer':
        return <Users className="h-4 w-4 text-green-600" />
      case 'buyer':
        return <ShoppingCart className="h-4 w-4 text-blue-600" />
      case 'product':
        return <TrendingUp className="h-4 w-4 text-orange-600" />
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />
    }
  }

  const getLocationColor = (type: MapLocation['type']) => {
    switch (type) {
      case 'farmer':
        return 'bg-green-100 border-green-300 text-green-800'
      case 'buyer':
        return 'bg-blue-100 border-blue-300 text-blue-800'
      case 'product':
        return 'bg-orange-100 border-orange-300 text-orange-800'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedDistrict} onValueChange={(value) => setSelectedDistrict(value as DistrictCode | "all")}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Districts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {Object.keys(districtCoordinates).map((district) => (
              <SelectItem key={district} value={district}>
                {district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={(value) => setSelectedType(value as any)}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="farmer">Farmers</SelectItem>
            <SelectItem value="buyer">Buyers</SelectItem>
            <SelectItem value="product">Products</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Rwanda Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Simplified map representation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Interactive Map View</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {filteredLocations.length} locations found
                    </p>
                  </div>
                </div>
                
                {/* Location markers */}
                {filteredLocations.map((location, index) => (
                  <div
                    key={location.id}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${20 + (index % 3) * 30}%`,
                      top: `${30 + Math.floor(index / 3) * 25}%`
                    }}
                    onClick={() => handleLocationClick(location)}
                  >
                    <div className={`p-2 rounded-full border-2 ${getLocationColor(location.type)} hover:scale-110 transition-transform`}>
                      {getLocationIcon(location.type)}
                    </div>
                    {location.count && location.count > 1 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {location.count}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLocation ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getLocationIcon(selectedLocation.type)}
                    <div>
                      <p className="font-medium">{selectedLocation.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedLocation.district}</p>
                    </div>
                  </div>
                  
                  {selectedLocation.type === 'farmer' && (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Farm Size:</strong> {(selectedLocation.data as FarmerProfile).farmSize} hectares
                      </p>
                      <p className="text-sm">
                        <strong>Primary Crops:</strong> {(selectedLocation.data as FarmerProfile).primaryCrops.join(', ')}
                      </p>
                      <p className="text-sm">
                        <strong>Experience:</strong> {(selectedLocation.data as FarmerProfile).experienceLevel}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {selectedLocation.type === 'buyer' && (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Business Type:</strong> {(selectedLocation.data as BuyerProfile).businessType}
                      </p>
                      <p className="text-sm">
                        <strong>Preferred Crops:</strong> {(selectedLocation.data as BuyerProfile).preferredCrops.join(', ')}
                      </p>
                      <p className="text-sm">
                        <strong>Budget Range:</strong> RWF {(selectedLocation.data as BuyerProfile).budgetRange.min.toLocaleString()} - {(selectedLocation.data as BuyerProfile).budgetRange.max.toLocaleString()}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {selectedLocation.type === 'product' && (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Product:</strong> {(selectedLocation.data as Product).name}
                      </p>
                      <p className="text-sm">
                        <strong>Price:</strong> RWF {(selectedLocation.data as Product).pricePerKg.toLocaleString()}/kg
                      </p>
                      <p className="text-sm">
                        <strong>Available:</strong> {(selectedLocation.data as Product).availableQuantity} kg
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>Click on a location to view details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Farmers</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {farmers.length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Buyers</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {buyers.length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Products</span>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    {products.length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Districts</span>
                  <Badge variant="outline">
                    {new Set([...farmers, ...buyers, ...products].map(item => item.district)).size}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
