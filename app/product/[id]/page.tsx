"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  MapPin, 
  Star, 
  Phone, 
  MessageCircle,
  Share2,
  Calendar,
  Package
} from "lucide-react"
import { sampleProducts } from "@/lib/products"
import { useAuth } from "@/lib/auth-context"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const productId = params.id as string
  
  const [product, setProduct] = useState<any>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [inCart, setInCart] = useState(false)

  useEffect(() => {
    // Find product by ID
    const foundProduct = sampleProducts.find(p => p.id === productId)
    if (foundProduct) {
      setProduct(foundProduct)
    }

    // Load favorites and cart from localStorage
    const savedFavorites = localStorage.getItem("favorites")
    const savedCart = localStorage.getItem("cart")
    
    if (savedFavorites) {
      const favorites = new Set(JSON.parse(savedFavorites))
      setIsFavorite(favorites.has(productId))
    }
    
    if (savedCart) {
      const cart = new Set(JSON.parse(savedCart))
      setInCart(cart.has(productId))
    }
  }, [productId])

  const handleAddToCart = () => {
    const savedCart = localStorage.getItem("cart")
    const cart = savedCart ? new Set(JSON.parse(savedCart)) : new Set()
    cart.add(productId)
    localStorage.setItem("cart", JSON.stringify(Array.from(cart)))
    setInCart(true)
  }

  const handleToggleFavorite = () => {
    const savedFavorites = localStorage.getItem("favorites")
    const favorites = savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set()
    
    if (favorites.has(productId)) {
      favorites.delete(productId)
      setIsFavorite(false)
    } else {
      favorites.add(productId)
      setIsFavorite(true)
    }
    
    localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)))
  }

  const handleContactSeller = () => {
    if (product) {
      router.push(`/messages?sellerId=${product.sellerId}&sellerName=${encodeURIComponent(product.sellerName)}`)
    }
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Package className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Product not found</h3>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/marketplace')}>
            Back to Marketplace
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Product Details</h1>
            <p className="text-muted-foreground">View complete product information</p>
          </div>
        </div>

        {/* Product Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Image */}
          <Card>
            <CardContent className="p-6">
              <div className="relative h-96 rounded-lg overflow-hidden bg-gray-50">
                <ImageWithFallback
                  src={product.imageUrl}
                  alt={product.name}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                  fallbackSrc="/placeholder-product.png"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
                  onClick={handleToggleFavorite}
                >
                  <Heart
                    className={`h-6 w-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                  />
                </Button>
                {product.isOrganic && (
                  <Badge className="absolute top-4 left-4 bg-green-600">
                    Organic
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{product.name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium">{product.rating}</span>
                    <span className="text-gray-500 ml-1">({product.reviewCount} reviews)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price */}
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-3xl font-bold text-green-600">
                    RWF {product.pricePerKg.toLocaleString()}
                    <span className="text-lg text-gray-600">/{product.unit}</span>
                  </p>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-800">{product.description}</p>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{product.district}</span>
                </div>

                {/* Harvest Date */}
                {product.harvestDate && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <span>Harvested: {new Date(product.harvestDate).toLocaleDateString()}</span>
                  </div>
                )}

                {/* Category */}
                <div>
                  <Badge variant="outline" className="capitalize">
                    {product.category}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={inCart}
                    className="flex-1"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {inCart ? "In Cart" : "Add to Cart"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleContactSeller}
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Contact Seller
                  </Button>
                </div>

                {/* Seller Info */}
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium mb-2">Seller Information</p>
                    <p className="text-gray-800 font-semibold">{product.sellerName}</p>
                    <p className="text-sm text-gray-600">Verified Farmer</p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1" onClick={handleContactSeller}>
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
