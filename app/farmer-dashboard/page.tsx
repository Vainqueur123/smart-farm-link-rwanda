"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  Image as ImageIcon,
  Upload,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  MapPin,
  Calendar
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FarmerOnly } from "@/components/role-guard"
import { useTranslation } from "@/lib/i18n"
import { Product, Order } from "@/lib/types"
import { format } from "date-fns"
import { LoadingSpinner, SkeletonCard } from "@/components/loading-spinner"

// Mock data for farmer dashboard
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Fresh Tomatoes",
    type: "tomato",
    description: "Freshly harvested organic tomatoes from our farm",
    pricePerKg: 800,
    minOrderQuantity: 5,
    availableQuantity: 50,
    unit: "kg",
    district: "Kicukiro",
    farmerId: "farmer-1",
    farmerName: "John Doe",
    rating: 4.5,
    reviewCount: 12,
    imageUrl: "/images/tomatoes.png",
    isOrganic: true,
    harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    stockStatus: "in_stock",
    soldQuantity: 25
  },
  {
    id: "2",
    name: "Irish Potatoes",
    type: "irish_potato",
    description: "High quality Irish potatoes, perfect for cooking",
    pricePerKg: 600,
    minOrderQuantity: 10,
    availableQuantity: 100,
    unit: "kg",
    district: "Kicukiro",
    farmerId: "farmer-1",
    farmerName: "John Doe",
    rating: 4.2,
    reviewCount: 8,
    imageUrl: "/images/irish_potato.jpg",
    isOrganic: false,
    harvestDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    stockStatus: "in_stock",
    soldQuantity: 40
  }
]

const mockOrders: Order[] = [
  {
    id: "1",
    buyerId: "buyer-1",
    sellerId: "farmer-1",
    items: [
      {
        productId: "1",
        productName: "Fresh Tomatoes",
        quantity: 10,
        unit: "kg",
        pricePerUnit: 800,
        totalPrice: 8000,
        imageUrl: "/images/tomatoes.png"
      }
    ],
    totalAmount: 8000,
    currency: "RWF",
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "mtn_momo",
    deliveryAddress: {
      district: "Gasabo",
      address: "Kigali, Rwanda",
      contactPhone: "0780000001"
    },
    deliveryMethod: "delivery",
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
]

export default function FarmerDashboardPage() {
  const { user, farmerProfile, loading } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("overview")
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    type: "tomato",
    description: "",
    pricePerKg: 0,
    minOrderQuantity: 1,
    availableQuantity: 0,
    unit: "kg",
    isOrganic: false,
    harvestDate: new Date().toISOString(),
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading farmer dashboard..." />
      </div>
    )
  }

  if (!user || !farmerProfile) return null

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    lowStockProducts: products.filter(p => p.availableQuantity < 10).length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800"
      case "processing": return "bg-blue-100 text-blue-800"
      case "shipped": return "bg-purple-100 text-purple-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.pricePerKg || !newProduct.availableQuantity) return

    const product: Product = {
      id: `product-${Date.now()}`,
      name: newProduct.name!,
      type: newProduct.type as any,
      description: newProduct.description || "",
      pricePerKg: newProduct.pricePerKg!,
      minOrderQuantity: newProduct.minOrderQuantity || 1,
      availableQuantity: newProduct.availableQuantity!,
      unit: newProduct.unit || "kg",
      district: farmerProfile.district,
      farmerId: user.id,
      farmerName: farmerProfile.name || "Farmer",
      rating: 0,
      reviewCount: 0,
      imageUrl: "/placeholder-product.png",
      isOrganic: newProduct.isOrganic || false,
      harvestDate: newProduct.harvestDate || new Date().toISOString(),
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stockStatus: newProduct.availableQuantity! > 10 ? "in_stock" : "low_stock",
      soldQuantity: 0
    }

    setProducts(prev => [product, ...prev])
    setNewProduct({
      name: "",
      type: "tomato",
      description: "",
      pricePerKg: 0,
      minOrderQuantity: 1,
      availableQuantity: 0,
      unit: "kg",
      isOrganic: false,
      harvestDate: new Date().toISOString(),
    })
    setIsAddingProduct(false)
  }

  const handleUpdateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p))
    setEditingProduct(null)
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
  }

  const handleOrderStatusUpdate = (orderId: string, status: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: status as any, updatedAt: new Date() }
        : order
    ))
  }

  return (
    <FarmerOnly>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {t("welcome")}, {farmerProfile.name || "Farmer"}!
                </h1>
                <div className="flex items-center space-x-4 text-green-100">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{farmerProfile.district}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Package className="h-4 w-4" />
                    <span>{stats.totalProducts} {t("products")}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">RWF {stats.totalRevenue.toLocaleString()}</div>
                <div className="text-green-100">{t("Total Revenue")}</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t("Products")}</p>
                    <p className="text-2xl font-bold text-green-600">{stats.totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t("Orders")}</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t("Pending")}</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t("Revenue")}</p>
                    <p className="text-2xl font-bold text-purple-600">RWF {stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t("Low Stock")}</p>
                    <p className="text-2xl font-bold text-red-600">{stats.lowStockProducts}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
                <TabsTrigger value="products">{t("Products")}</TabsTrigger>
                <TabsTrigger value="orders">{t("Orders")}</TabsTrigger>
                <TabsTrigger value="analytics">{t("Analytics")}</TabsTrigger>
                <TabsTrigger value="profile">{t("Profile")}</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Orders */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>{t("Recent Orders")}</CardTitle>
                        <CardDescription>{t("Latest customer orders")}</CardDescription>
                      </div>
                      <Button size="sm" onClick={() => setActiveTab("orders")}>
                        {t("View All")}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{order.items[0]?.productName}</p>
                                <p className="text-sm text-gray-600">
                                  {format(order.createdAt, "MMM d, yyyy")}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">RWF {order.totalAmount.toLocaleString()}</p>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Low Stock Alert */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        {t("Low Stock Alert")}
                      </CardTitle>
                      <CardDescription>{t("Products running low on inventory")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {products.filter(p => p.availableQuantity < 10).map((product) => (
                          <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                            <div>
                              <p className="font-medium text-red-900">{product.name}</p>
                              <p className="text-sm text-red-600">
                                Only {product.availableQuantity} {product.unit} left
                              </p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                              <Edit className="h-4 w-4 mr-1" />
                              {t("Restock")}
                            </Button>
                          </div>
                        ))}
                        {products.filter(p => p.availableQuantity < 10).length === 0 && (
                          <p className="text-gray-500 text-center py-4">
                            {t("All products are well stocked")}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Selling Products */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Top Selling Products")}</CardTitle>
                    <CardDescription>{t("Your best performing products")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {products
                        .sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0))
                        .slice(0, 5)
                        .map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600">
                                {product.soldQuantity || 0} {product.unit} sold
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">RWF {product.pricePerKg.toLocaleString()}</p>
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
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{t("Product Management")}</h2>
                    <p className="text-gray-600">{t("Manage your product listings")}</p>
                  </div>
                  <Button onClick={() => setIsAddingProduct(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("Add Product")}
                  </Button>
                </div>

                {/* Add/Edit Product Form */}
                {(isAddingProduct || editingProduct) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {isAddingProduct ? t("Add New Product") : t("Edit Product")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">{t("Product Name")}</Label>
                          <Input
                            id="name"
                            value={isAddingProduct ? newProduct.name : editingProduct?.name}
                            onChange={(e) => {
                              if (isAddingProduct) {
                                setNewProduct(prev => ({ ...prev, name: e.target.value }))
                              } else if (editingProduct) {
                                setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)
                              }
                            }}
                            placeholder="Enter product name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="type">{t("Product Type")}</Label>
                          <Select
                            value={isAddingProduct ? newProduct.type : editingProduct?.type}
                            onValueChange={(value) => {
                              if (isAddingProduct) {
                                setNewProduct(prev => ({ ...prev, type: value as any }))
                              } else if (editingProduct) {
                                setEditingProduct(prev => prev ? { ...prev, type: value as any } : null)
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tomato">Tomato</SelectItem>
                              <SelectItem value="irish_potato">Irish Potato</SelectItem>
                              <SelectItem value="maize">Maize</SelectItem>
                              <SelectItem value="beans">Beans</SelectItem>
                              <SelectItem value="onion">Onion</SelectItem>
                              <SelectItem value="cabbage">Cabbage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="price">{t("Price per kg (RWF)")}</Label>
                          <Input
                            id="price"
                            type="number"
                            value={isAddingProduct ? newProduct.pricePerKg : editingProduct?.pricePerKg}
                            onChange={(e) => {
                              if (isAddingProduct) {
                                setNewProduct(prev => ({ ...prev, pricePerKg: Number(e.target.value) }))
                              } else if (editingProduct) {
                                setEditingProduct(prev => prev ? { ...prev, pricePerKg: Number(e.target.value) } : null)
                              }
                            }}
                            placeholder="Enter price"
                          />
                        </div>
                        <div>
                          <Label htmlFor="quantity">{t("Available Quantity")}</Label>
                          <Input
                            id="quantity"
                            type="number"
                            value={isAddingProduct ? newProduct.availableQuantity : editingProduct?.availableQuantity}
                            onChange={(e) => {
                              if (isAddingProduct) {
                                setNewProduct(prev => ({ ...prev, availableQuantity: Number(e.target.value) }))
                              } else if (editingProduct) {
                                setEditingProduct(prev => prev ? { ...prev, availableQuantity: Number(e.target.value) } : null)
                              }
                            }}
                            placeholder="Enter quantity"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">{t("Description")}</Label>
                        <Textarea
                          id="description"
                          value={isAddingProduct ? newProduct.description : editingProduct?.description}
                          onChange={(e) => {
                            if (isAddingProduct) {
                              setNewProduct(prev => ({ ...prev, description: e.target.value }))
                            } else if (editingProduct) {
                              setEditingProduct(prev => prev ? { ...prev, description: e.target.value } : null)
                            }
                          }}
                          placeholder="Enter product description"
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <Button
                          onClick={() => {
                            if (isAddingProduct) {
                              handleAddProduct()
                            } else if (editingProduct) {
                              handleUpdateProduct(editingProduct)
                            }
                          }}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isAddingProduct ? t("Add Product") : t("Update Product")}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsAddingProduct(false)
                            setEditingProduct(null)
                            setNewProduct({
                              name: "",
                              type: "tomato",
                              description: "",
                              pricePerKg: 0,
                              minOrderQuantity: 1,
                              availableQuantity: 0,
                              unit: "kg",
                              isOrganic: false,
                              harvestDate: new Date().toISOString(),
                            })
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          {t("Cancel")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <Badge variant={product.stockStatus === "in_stock" ? "default" : "destructive"}>
                            {product.stockStatus === "in_stock" ? t("In Stock") : t("Low Stock")}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">{t("Price")}:</span>
                            <span className="font-medium">RWF {product.pricePerKg.toLocaleString()}/kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">{t("Available")}:</span>
                            <span className="font-medium">{product.availableQuantity} {product.unit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">{t("Sold")}:</span>
                            <span className="font-medium">{product.soldQuantity || 0} {product.unit}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm ml-1">{product.rating}</span>
                              <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
                            </div>
                            {product.isOrganic && (
                              <Badge variant="secondary" className="text-xs">
                                {t("Organic")}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingProduct(product)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            {t("Edit")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{t("Order Management")}</h2>
                    <p className="text-gray-600">{t("Manage customer orders and deliveries")}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">Order #{order.id}</h3>
                            <p className="text-sm text-gray-600">
                              {format(order.createdAt, "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">RWF {order.totalAmount.toLocaleString()}</p>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-500" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-gray-600">
                                  {item.quantity} {item.unit} × RWF {item.pricePerUnit.toLocaleString()}
                                </p>
                              </div>
                              <p className="font-medium">RWF {item.totalPrice.toLocaleString()}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            <p>{t("Delivery")}: {order.deliveryMethod}</p>
                            <p>{t("Payment")}: {order.paymentMethod.replace('_', ' ')}</p>
                            {order.estimatedDelivery && (
                              <p>{t("Estimated Delivery")}: {format(order.estimatedDelivery, "MMM d, yyyy")}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {order.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleOrderStatusUpdate(order.id, "confirmed")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  {t("Confirm")}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOrderStatusUpdate(order.id, "cancelled")}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  {t("Cancel")}
                                </Button>
                              </>
                            )}
                            {order.status === "confirmed" && (
                              <Button
                                size="sm"
                                onClick={() => handleOrderStatusUpdate(order.id, "shipped")}
                              >
                                <Package className="h-4 w-4 mr-1" />
                                {t("Mark as Shipped")}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{t("Sales Analytics")}</h2>
                    <p className="text-gray-600">{t("Track your sales performance and insights")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("Sales Overview")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>{t("Total Sales")}</span>
                          <span className="font-bold">RWF {stats.totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t("Total Orders")}</span>
                          <span className="font-bold">{stats.totalOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t("Average Order Value")}</span>
                          <span className="font-bold">
                            RWF {stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() : 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t("Product Performance")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {products
                          .sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0))
                          .slice(0, 5)
                          .map((product) => (
                          <div key={product.id} className="flex items-center justify-between">
                            <span className="text-sm">{product.name}</span>
                            <div className="text-right">
                              <span className="font-medium">{product.soldQuantity || 0} {product.unit}</span>
                              <p className="text-xs text-gray-500">
                                RWF {(product.soldQuantity || 0) * product.pricePerKg}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{t("Farm Profile")}</h2>
                    <p className="text-gray-600">{t("Manage your farm information and settings")}</p>
                  </div>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    {t("Edit Profile")}
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("Basic Information")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">{t("Name")}</label>
                        <p className="text-lg">{farmerProfile.name || "Not set"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">{t("Phone")}</label>
                        <p className="text-lg">{farmerProfile.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">{t("District")}</label>
                        <p className="text-lg">{farmerProfile.district}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">{t("Farm Size")}</label>
                        <p className="text-lg">{farmerProfile.farmSize} hectares</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t("Crop Information")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">{t("Primary Crops")}</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {farmerProfile.primaryCrops.map((crop) => (
                            <Badge key={crop} variant="secondary">
                              {crop}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">{t("Experience Level")}</label>
                        <p className="text-lg capitalize">{farmerProfile.experienceLevel}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">{t("Registration Date")}</label>
                        <p className="text-lg">{format(farmerProfile.registrationDate, "MMM d, yyyy")}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DashboardLayout>
    </FarmerOnly>
  )
}
