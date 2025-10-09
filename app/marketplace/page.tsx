"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { HorizontalDashboardLayout } from "@/components/horizontal-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { TrendingUp } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, MapPin, Star, ShoppingCart, Heart, Share2, ArrowUpDown, Plus, MessageSquare, CheckCircle, Package } from "lucide-react"
import { sampleProducts, productCategories, sortOptions } from "@/lib/products"
import { DistrictCode, Product, CropType } from "@/lib/types"
import { useTranslation } from "@/lib/i18n"
import { PricingInsights } from "@/components/pricing-insights"
import { BuyerNetwork } from "@/components/buyer-network"
import { ProductCatalog } from "@/components/product-catalog"
import { ProductListingForm } from "@/components/product-listing-form"

// ImageWithFallback component
const ImageWithFallback = ({ src, alt, fallbackSrc, ...props }: { src: string; alt: string; fallbackSrc: string; [key: string]: any }) => {
  const [imgSrc, setImgSrc] = useState(src)
  
  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  )
}

// Replacing slider with a simple range input for now
const Slider = ({
  value,
  onValueChange,
  min = 0,
  max = 1000,
  step = 10,
  className = ""
}: {
  value: number[]
  onValueChange: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  className?: string
}) => (
  <div className={`w-full ${className}`}>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      className="w-full"
    />
    <div className="flex justify-between text-sm text-muted-foreground">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
)

// Extend the Product interface with additional UI state
interface ProductCardProps extends Product {
  isFavorite?: boolean
  isContacted?: boolean
  onContactFarmer?: (farmerId: string, productId: string) => void
  onToggleFavorite?: (productId: string) => void
}

// Filter state interface
interface Filters {
  searchQuery: string
  category: string
  district: string
  priceRange: [number, number]
  organicOnly: boolean
  inStockOnly: boolean
  sortBy: string
}

const ProductCard = ({
  id,
  name,
  description,
  pricePerKg,
  unit,
  district,
  farmerName,
  farmerId,
  rating,
  reviewCount,
  imageUrl,
  isOrganic,
  isVerified,
  harvestDate,
  isFavorite = false,
  isContacted = false,
  onContactFarmer,
  onToggleFavorite
}: ProductCardProps) => {
  const { t } = useTranslation()
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 overflow-hidden rounded-t-lg bg-gray-50">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          width={400}
          height={300}
          className="h-full w-full object-cover object-center"
          fallbackSrc="/placeholder-product.png"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
          onClick={() => onToggleFavorite?.(id)}
        >
          <Heart 
            className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
          />
        </Button>
        {isOrganic && (
          <Badge className="absolute top-2 left-2 bg-green-600 hover:bg-green-700">
            {t('organic')}
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">{name}</CardTitle>
          <div className="text-xl font-bold text-green-700 whitespace-nowrap">
            RWF {pricePerKg.toLocaleString()}
            <span className="text-sm font-normal text-gray-500 ml-1">/{unit}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="font-medium">{rating.toFixed(1)}</span>
          <span className="text-gray-500 text-sm ml-1">({reviewCount})</span>
          <div className="mx-2 h-1 w-1 rounded-full bg-gray-300" />
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{district}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span>{t('harvested')}: {format(new Date(harvestDate), 'MMM d, yyyy')}</span>
          {isVerified && (
            <Badge variant="outline" className="ml-2 border-green-200 text-green-700">
              {t('verified')}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full space-y-3">
          {/* Farmer Information */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">
                    {farmerName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{farmerName}</p>
                  <p className="text-xs text-gray-500">{district}</p>
                </div>
              </div>
              {isVerified && (
                <Badge variant="outline" className="border-green-200 text-green-700 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {t('verified')}
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{t('farmer_phone')}: {farmerId}</span>
              <span>{t('harvested')}: {format(new Date(harvestDate), 'MMM d')}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onContactFarmer?.(farmerId, id)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              {isContacted ? t('contacted') : t('contact_farmer')}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onToggleFavorite?.(id)}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function MarketplacePage() {
  const { user, farmerProfile, userRole } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()
  
  // State for products and filters
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [contactedFarmers, setContactedFarmers] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("browse")
  const [selectedCrop, setSelectedCrop] = useState<string>("")
  const [showProductForm, setShowProductForm] = useState(false)
  
  // Initialize filters state
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    category: 'all',
    district: 'all',
    priceRange: [0, 5000],
    organicOnly: false,
    inStockOnly: true,
    sortBy: 'popular'
  })
  
  // Load favorites and contacted farmers from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites')
    const savedContactedFarmers = localStorage.getItem('contactedFarmers')
    
    if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)))
    if (savedContactedFarmers) setContactedFarmers(new Set(JSON.parse(savedContactedFarmers)))
  }, [])

  // Save favorites and contacted farmers to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('contactedFarmers', JSON.stringify(Array.from(contactedFarmers)))
  }, [contactedFarmers])

  // Handle favorite toggle
  const handleToggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId)
    } else {
      newFavorites.add(productId)
    }
    setFavorites(newFavorites)
  }

  // Handle contact farmer
  const handleContactFarmer = (farmerId: string, productId: string) => {
    const newContactedFarmers = new Set(contactedFarmers)
    newContactedFarmers.add(farmerId)
    setContactedFarmers(newContactedFarmers)
    
    // In real app, this would open a chat or contact form
    console.log(`Contacting farmer ${farmerId} about product ${productId}`)
    // You could also trigger a notification or open a modal here
  }

  // Handle product creation
  const handleProductCreated = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev])
    setShowProductForm(false)
    // In real app, this would also update the database
  }

  // Filter and sort products with error handling
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      console.error('Products data is not an array:', products)
      return []
    }
    return products
      .filter((product: Product) => {
        // Search query filter
        const matchesSearch = product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
        
        // Category filter
        const matchesCategory = filters.category === 'all' || 
                              product.type === filters.category
        
        // District filter
        const matchesDistrict = !filters.district || 
                              product.district.toLowerCase() === filters.district.toLowerCase()
        
        // Price range filter
        const [minPrice, maxPrice] = filters.priceRange
        const matchesPrice = product.pricePerKg >= minPrice && 
                           product.pricePerKg <= maxPrice
        
        // Organic filter
        const matchesOrganic = !filters.organicOnly || product.isOrganic
        
        // In stock filter
        const matchesInStock = !filters.inStockOnly || product.availableQuantity > 0
        
        return matchesSearch && matchesCategory && matchesDistrict && 
               matchesPrice && matchesOrganic && matchesInStock
      })
      .sort((a, b) => {
        // Sorting logic
        switch (filters.sortBy) {
          case 'price-asc':
            return a.pricePerKg - b.pricePerKg
          case 'price-desc':
            return b.pricePerKg - a.pricePerKg
          case 'rating':
            return b.rating - a.rating
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          case 'popular':
          default:
            return (b.reviewCount * b.rating) - (a.reviewCount * a.rating)
        }
      })
  }, [filters])

  // Generate market prices from products
  const marketPrices = useMemo(() => {
    return products.slice(0, 5).map((product: Product) => ({
      crop: product.name,
      district: product.district,
      currentPrice: product.pricePerKg,
      weeklyChange: parseFloat((Math.random() * 10 - 5).toFixed(1)),
      monthlyChange: parseFloat((Math.random() * 15 - 5).toFixed(1)),
      demand: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
      supply: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
      trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down' | 'stable'
    }))
  }, [products])

  if (loading) {
    return (
      <HorizontalDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading marketplace...</p>
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
            <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground">
              Browse and purchase fresh produce directly from local farmers
            </p>
          </div>
          {userRole === "farmer" && (
            <Button 
              onClick={() => setShowProductForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              List Your Product
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${userRole === "farmer" ? "grid-cols-5" : "grid-cols-4"}`}>
            <TabsTrigger value="browse">{t("Browse Listings")}</TabsTrigger>
            <TabsTrigger value="prices">{t("Market Prices")}</TabsTrigger>
            <TabsTrigger value="buyers">{t("Buyer Network")}</TabsTrigger>
            <TabsTrigger value="catalog">{t("Product Catalog")}</TabsTrigger>
            {userRole === "farmer" && (
              <TabsTrigger value="my-listings">{t("My Listings")}</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Filters Sidebar */}
              <div className="w-full md:w-72 lg:w-80 space-y-6 md:sticky md:top-24 self-start">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        className="w-full pl-9"
                        value={filters.searchQuery}
                        onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Category
                      </label>
                      <Select
                        value={filters.category}
                        onValueChange={(value: string) => setFilters({ ...filters, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        District
                      </label>
                      <Select
                        value={filters.district || 'all'}
                        onValueChange={(value) => setFilters({ ...filters, district: value === 'all' ? '' : value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Districts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Districts</SelectItem>
                          {Array.from(new Set(sampleProducts.map((p) => p.district))).map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Price Range (RWF)
                      </label>
                      <div className="px-2">
                        <Slider
                          value={filters.priceRange}
                          min={0}
                          max={5000}
                          step={100}
                          onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>RWF {filters.priceRange?.[0]?.toLocaleString?.() ?? '0'}</span>
                          <span>RWF {filters.priceRange?.[1]?.toLocaleString?.() ?? '5000'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="organic-only"
                          checked={filters.organicOnly}
                          onCheckedChange={(checked) => setFilters({ ...filters, organicOnly: Boolean(checked) })}
                        />
                        <label
                          htmlFor="organic-only"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Organic Only
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="in-stock"
                          checked={filters.inStockOnly}
                          onCheckedChange={(checked) => setFilters({ ...filters, inStockOnly: Boolean(checked) })}
                        />
                        <label
                          htmlFor="in-stock"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          In Stock Only
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h4 className="font-medium mb-2">Need help?</h4>
                    <p className="text-sm text-gray-600 mb-3">Our team is here to help with any questions</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Contact Support
                    </Button>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredProducts.length} of {products.length} products
                    </p>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        Sort by:
                      </span>
                      <Select
                        value={filters.sortBy}
                        onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                      >
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <div className="flex items-center">
                            <ArrowUpDown className="h-4 w-4 mr-2 opacity-50" />
                            <SelectValue placeholder="Sort by" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          {...product}
                          isFavorite={favorites.has(product.id)}
                          isContacted={contactedFarmers.has(product.farmerId)}
                          onToggleFavorite={handleToggleFavorite}
                          onContactFarmer={handleContactFarmer}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                      <Search className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">{t('no_products_found')}</h3>
                      <p className="text-muted-foreground text-center max-w-md mt-2">
                        Try adjusting your search or filters
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() =>
                          setFilters({
                            searchQuery: '',
                            category: 'all',
                            district: '',
                            priceRange: [0, 5000],
                            organicOnly: false,
                            inStockOnly: true,
                            sortBy: 'popular',
                          })
                        }
                      >
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prices" className="space-y-6">
            {/* Pricing Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PricingInsights crop="maize" district="Kigali" currentPrice={350} />
              <PricingInsights crop="irish_potato" district="Musanze" currentPrice={280} />
            </div>

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

          <TabsContent value="buyers" className="space-y-6">
            <BuyerNetwork farmerDistrict={farmerProfile?.district || "Kigali"} />
          </TabsContent>

          <TabsContent value="catalog" className="space-y-6">
            <ProductCatalog selectedCrop={selectedCrop} />
          </TabsContent>

          <TabsContent value="my-listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">My Product Listings</h2>
                <p className="text-muted-foreground">Manage your products and track performance</p>
              </div>
              <Button 
                onClick={() => setShowProductForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            </div>

            {userRole === "farmer" ? (
              <div className="space-y-4">
                {products.filter(p => p.farmerId === farmerProfile?.id).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products
                      .filter(p => p.farmerId === farmerProfile?.id)
                      .map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                          <div className="h-64 bg-gray-100 flex items-center justify-center">
                            <ImageWithFallback
                              src={product.imageUrl}
                              alt={product.name}
                              fallbackSrc="/placeholder-product.png"
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">{product.name}</h3>
                              <Badge variant={product.isVerified ? "default" : "secondary"}>
                                {product.isVerified ? "Verified" : "Pending"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">Price:</span>
                                <span className="text-sm">RWF {product.pricePerKg}/kg</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">Available:</span>
                                <span className="text-sm">{product.availableQuantity} {product.unit}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">District:</span>
                                <span className="text-sm">{product.district}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                Edit
                              </Button>
                              <Button size="sm" variant="destructive">
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No products listed yet</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Start by listing your products to reach more buyers and grow your business
                      </p>
                      <Button 
                        onClick={() => setShowProductForm(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        List Your First Product
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Only farmers can manage product listings</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Product Listing Form Modal */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <ProductListingForm
                onSuccess={handleProductCreated}
                onCancel={() => setShowProductForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </HorizontalDashboardLayout>
  );
};