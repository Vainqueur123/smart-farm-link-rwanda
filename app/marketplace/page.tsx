"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { Search, Filter, MapPin, Star, ShoppingCart, Heart, Share2, ArrowUpDown, Plus, TrendingUp } from "lucide-react"

// Hooks
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/i18n"

// Components
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PricingInsights } from "@/components/pricing-insights"
import { BuyerNetwork } from "@/components/buyer-network"

// Types and Data
import { sampleProducts, productCategories, sortOptions } from "@/lib/products"
import { Product } from "@/lib/types"

// Slider Component
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

// Product Card Component
const ProductCard = ({
  id,
  name,
  description,
  pricePerKg,
  unit,
  district,
  rating,
  reviewCount,
  imageUrl,
  isOrganic,
  isVerified,
  harvestDate,
  isFavorite = false,
  inCart = false,
  isHighlighted = false,
  onAddToCart,
  onToggleFavorite,
  onContactSeller,
  onCallSeller
}: {
  id: string
  name: string
  description: string
  pricePerKg: number
  unit: string
  district: string
  rating: number
  reviewCount: number
  imageUrl: string
  isOrganic: boolean
  isVerified?: boolean
  harvestDate: string
  isFavorite?: boolean
  inCart?: boolean
  isHighlighted?: boolean
  onAddToCart?: (productId: string) => void
  onToggleFavorite?: (productId: string) => void
  onContactSeller?: (productId: string) => void
  onCallSeller?: (productId: string) => void
}) => {
  const { t } = useTranslation()

  return (
    <Card 
      id={`product-${id}`}
      className={`h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 ${
        isHighlighted ? 'ring-4 ring-green-500 shadow-2xl scale-105' : ''
      }`}
    >
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
            className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
          />
        </Button>
        {isOrganic && (
          <Badge variant="success" className="absolute top-2 left-2">
            {t("organic")}
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
          <span>Harvested: {format(new Date(harvestDate), "MMM d, yyyy")}</span>
          {isVerified && (
            <Badge variant="primary" className="ml-2">
              Verified
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 gap-2">
        {/* <Button
          variant={inCart ? "outline" : "default"}
          className="w-20px"
          onClick={() => onAddToCart?.(id)}
        >
          {inCart ? "In Cart" : "Add Cart"}
        </Button> */}
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => onContactSeller?.(id)}
        >
          Contact Seller
        </Button>
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => onCallSeller?.(id)}
        >
          Call
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function MarketplacePage() {
  const { user, farmerProfile } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()

  // State for products and filters
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [activeTab, setActiveTab] = useState("browse")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [cart, setCart] = useState<Set<string>>(new Set())
  const [highlightedProduct, setHighlightedProduct] = useState<string | null>(null)

  // Initialize filters state
  const [filters, setFilters] = useState({
    searchQuery: "",
    category: "all",
    district: "all",
    priceRange: [0, 5000],
    organicOnly: false,
    inStockOnly: true,
    sortBy: "popular",
  })

  // Load favorites and cart from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites")
    const savedCart = localStorage.getItem("cart")

    if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)))
    if (savedCart) setCart(new Set(JSON.parse(savedCart)))
  }, [])

  // Handle product parameter from URL (for "View Details" from orders)
  useEffect(() => {
    const productId = searchParams.get('product')
    if (productId) {
      console.log('Highlighting product:', productId)
      setHighlightedProduct(productId)
      
      // Scroll to the product after a short delay
      setTimeout(() => {
        const element = document.getElementById(`product-${productId}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 500)

      // Clear highlight after 5 seconds
      setTimeout(() => {
        setHighlightedProduct(null)
      }, 5000)
    }
  }, [searchParams])

  // Save favorites and contacted farmers to localStorage when they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(Array.from(cart)))
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

  const routerToConversation = async (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (!product || !user) return
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId: user.id, farmerId: product.farmerId, productId: product.id })
      })
      if (!res.ok) throw new Error('Failed to start conversation')
      const data = await res.json()
      router.push(`/messages/${encodeURIComponent(data.conversationId)}`)
    } catch (e) {
      console.error(e)
    }
  }

  const handleCallSeller = async (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (!product) return
    try {
      const res = await fetch(`/api/buyer/contact/${encodeURIComponent(product.farmerId)}`)
      const data = await res.json()
      const phone = data?.phone || '0785062969'
      const text = encodeURIComponent(`Hello, I'm interested in ${product.name}.`)
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${text}`, '_blank')
    } catch (e) {
      const text = encodeURIComponent(`Hello, I'm interested in ${product.name}.`)
      window.open(`https://wa.me/0785062969?text=${text}`, '_blank')
    }
  }

  // Filter and sort products with error handling
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      console.error("Products data is not an array:", products)
      return []
    }
    return products
      .filter((product: Product) => {
        // Search query filter
        const matchesSearch =
          product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(filters.searchQuery.toLowerCase())

        // Category filter
        const matchesCategory = filters.category === "all" || product.type === filters.category

        // District filter
        const matchesDistrict = filters.district === "all" || product.district === filters.district

        // Price range filter
        const [minPrice, maxPrice] = filters.priceRange
        const matchesPrice = product.pricePerKg >= minPrice && product.pricePerKg <= maxPrice

        // Organic filter
        const matchesOrganic = !filters.organicOnly || product.isOrganic

        // In stock filter
        const matchesInStock = !filters.inStockOnly || product.availableQuantity > 0

        return (
          matchesSearch &&
          matchesCategory &&
          matchesDistrict &&
          matchesPrice &&
          matchesOrganic &&
          matchesInStock
        )
      })
      .sort((a, b) => {
        // Sorting logic
        switch (filters.sortBy) {
          case "price-asc":
            return a.pricePerKg - b.pricePerKg
          case "price-desc":
            return b.pricePerKg - a.pricePerKg
          case "rating":
            return b.rating - a.rating
          case "newest":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          case "popular":
          default:
            return (b.reviewCount * b.rating) - (a.reviewCount * a.rating)
        }
      })
  }, [filters, products])

  // Generate market prices from products
  const marketPrices = useMemo(() => {
    return products.slice(0, 5).map((product: Product) => ({
      crop: product.name,
      district: product.district,
      currentPrice: product.pricePerKg,
      weeklyChange: parseFloat((Math.random() * 10 - 5).toFixed(1)),
      monthlyChange: parseFloat((Math.random() * 15 - 5).toFixed(1)),
      demand: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
      supply: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
      trend: Math.random() > 0.5 ? "up" : "down" as "up" | "down" | "stable",
    }))
  }, [products])

  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
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
          {user?.role === "farmer" && (
            <Button 
              onClick={() => router.push('/farm')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              List Your Product
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="browse">Browse Listings</TabsTrigger>
            <TabsTrigger value="prices">Market Prices</TabsTrigger>
            <TabsTrigger value="buyers">Buyer Network</TabsTrigger>
            <TabsTrigger value="catalog">Product Catalog</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
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
                        value={filters.district}
                        onValueChange={(value: string) => setFilters({ ...filters, district: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
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
                          <span>RWF {filters.priceRange[0].toLocaleString()}</span>
                          <span>RWF {filters.priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="organic"
                          checked={filters.organicOnly}
                          onCheckedChange={(checked: boolean | 'indeterminate') => setFilters({ ...filters, organicOnly: checked === true })}
                        />
                        <label
                          htmlFor="organic"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Organic Only
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="in-stock"
                          checked={filters.inStockOnly}
                          onCheckedChange={(checked: boolean | 'indeterminate') => setFilters({ ...filters, inStockOnly: checked === true })}
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
                      onValueChange={(value: string) => setFilters({ ...filters, sortBy: value })}
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
                        isHighlighted={highlightedProduct === product.id}
                        onToggleFavorite={handleToggleFavorite}
                        onAddToCart={handleAddToCart}
                        onContactSeller={routerToConversation}
                        onCallSeller={handleCallSeller}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No products found</h3>
                    <p className="text-muted-foreground text-center max-w-md mt-2">
                      Try adjusting your search or filters
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() =>
                        setFilters({
                          searchQuery: "",
                          category: "all",
                          district: "all",
                          priceRange: [0, 5000],
                          organicOnly: false,
                          inStockOnly: true,
                          sortBy: "popular",
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

          <TabsContent value="prices" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PricingInsights crop="maize" district="Kigali" currentPrice={350} />
              <PricingInsights crop="irish_potato" district="Musanze" currentPrice={280} />
            </div>

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
                            Monthly Change
                          </th>
                          <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                            Trend
                          </th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {marketPrices.map((price, index) => (
                          <tr key={index} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle font-medium">{price.crop}</td>
                            <td className="p-4 align-middle">{price.district}</td>
                            <td className="p-4 text-right align-middle font-medium">
                              {price.currentPrice.toLocaleString()}
                            </td>
                            <td className="p-4 text-right align-middle">
                              <span className={price.weeklyChange > 0 ? "text-green-600" : "text-red-600"}>
                                {price.weeklyChange > 0 ? "↑" : "↓"} {Math.abs(price.weeklyChange)}%
                              </span>
                            </td>
                            <td className="p-4 text-right align-middle">
                              <span className={price.monthlyChange > 0 ? "text-green-600" : "text-red-600"}>
                                {price.monthlyChange > 0 ? "↑" : "↓"} {Math.abs(price.monthlyChange)}%
                              </span>
                            </td>
                            <td className="p-4 text-right align-middle">
                              <Badge
                                variant={price.trend === "up" ? "default" : "destructive"}
                                className="gap-1"
                              >
                                <TrendingUp className="h-3.5 w-3.5" />
                                {price.trend === "up" ? "Rising" : "Falling"}
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

          <TabsContent value="buyers" className="space-y-6">
            <BuyerNetwork farmerDistrict={(user as any)?.district} />
          </TabsContent>

          <TabsContent value="catalog" className="space-y-6">
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
              <h3 className="text-lg font-medium">Product Catalog</h3>
              <p className="text-muted-foreground text-center max-w-md mt-2">
                Browse our catalog of agricultural products
              </p>
            </div>
          </TabsContent>

          <TabsContent value="my-listings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Listings</CardTitle>
                <p className="text-sm text-muted-foreground">Manage your product listings</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No listings yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mt-2">
                    You haven't listed any products yet. Start by adding your first product.
                  </p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
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
