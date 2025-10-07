"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, MapPin, Star, ShoppingCart, Heart, Share2, ArrowUpDown, Plus } from "lucide-react"
import { sampleProducts, productCategories, sortOptions } from "@/lib/products"
import { DistrictCode, Product, CropType } from "@/lib/types"
import { useTranslation } from "@/lib/i18n"
import { PricingInsights } from "@/components/pricing-insights"
import { BuyerNetwork } from "@/components/buyer-network"
import { ProductCatalog } from "@/components/product-catalog"

// Extend the Product interface with additional UI state
interface ProductCardProps extends Product {
  isFavorite?: boolean
  inCart?: boolean
  onAddToCart?: (productId: string) => void
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
  rating,
  reviewCount,
  imageUrl,
  isOrganic,
  isVerified,
  harvestDate,
  isFavorite = false,
  inCart = false,
  onAddToCart,
  onToggleFavorite
}: ProductCardProps) => {
  const { t } = useTranslation()
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden rounded-t-lg bg-gray-50">
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
        <Button 
          variant={inCart ? "outline" : "default"} 
          className="w-full"
          onClick={() => onAddToCart?.(id)}
        >
          {inCart ? t('in_cart') : t('add_to_cart')}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function MarketplacePage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()
  
  // State for products and filters
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [cart, setCart] = useState<Set<string>>(new Set())
  
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
  
  // Load favorites and cart from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites')
    const savedCart = localStorage.getItem('cart')
    
    if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)))
    if (savedCart) setCart(new Set(JSON.parse(savedCart)))
  }, [])

  // Save favorites and cart to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(Array.from(cart)))
  }, [cart])

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

  // Handle add to cart
  const handleAddToCart = (productId: string) => {
    const newCart = new Set(cart)
    if (newCart.has(productId)) {
      newCart.delete(productId)
    } else {
      newCart.add(productId)
    }
    setCart(newCart)
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
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading marketplace...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground">
              Browse and purchase fresh produce directly from local farmers
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            List Your Product
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="browse">{t("Browse Listings")}</TabsTrigger>
            <TabsTrigger value="prices">{t("Market Prices")}</TabsTrigger>
            <TabsTrigger value="buyers">{t("Buyer Network")}</TabsTrigger>
            <TabsTrigger value="catalog">{t("Product Catalog")}</TabsTrigger>
            <TabsTrigger value="my-listings">{t("My Listings")}</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Filters Sidebar */}
              <div className="w-full md:w-64 space-y-6">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        {...product}
                        isFavorite={favorites.has(product.id)}
                        inCart={cart.has(product.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onAddToCart={handleAddToCart}
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
          </TabsContent>

          <TabsContent value="buyers" className="space-y-6">
            <BuyerNetwork farmerDistrict={user?.district} />
          </TabsContent>

          <TabsContent value="catalog" className="space-y-6">
            <ProductCatalog selectedCrop={selectedCrop} />
          </TabsContent>

          <TabsContent value="my-listings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Prices</CardTitle>
                <p className="text-sm text-muted-foreground">Current market prices for agricultural products</p>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Crop
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            District
                          </th>
                          <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                            Price (RWF/kg)
                          </th>
                          <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                            Weekly Change
                          </th>
                          <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                            Demand
                          </th>
                          <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                            Supply
                          </th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {marketPrices.map((price) => (
                          <tr key={price.crop} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle font-medium">{price.crop}</td>
                            <td className="p-4 align-middle">{price.district}</td>
                            <td className="p-4 text-right align-middle">{price.currentPrice.toLocaleString()}</td>
                            <td
                              className={`p-4 text-right align-middle ${
                                Number(price.weeklyChange) > 0 ? 'text-red-500' : 'text-green-500'
                              }`}
                            >
                              {price.weeklyChange}%
                            </td>
                            <td className="p-4 text-right align-middle">
                              <Badge
                                variant="outline"
                                className={
                                  price.demand === 'High'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : price.demand === 'Medium'
                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                    : 'bg-green-50 text-green-700 border-green-200'
                                }
                              >
                                {price.demand}
                              </Badge>
                            </td>
                            <td className="p-4 text-right align-middle">
                              <Badge
                                variant="outline"
                                className={
                                  price.supply === 'High'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : price.supply === 'Medium'
                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                                }
                              >
                                {price.supply}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-orders">
            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
                <p className="text-sm text-muted-foreground">
                  View and manage your orders
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No orders yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mt-2">
                    Your orders will appear here once you make a purchase
                  </p>
                  <Button className="mt-4">Browse Products</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

