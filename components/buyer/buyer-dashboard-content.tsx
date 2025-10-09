"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Star, 
  Heart,
  Plus,
  MessageCircle,
  History,
  Loader2,
  AlertCircle
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/i18n"
import { Order, Product, PaymentMethod, OrderItem } from "@/lib/types"
import { DollarSign, ShoppingBag, PackageCheck } from "lucide-react"

type ProductCategory = 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'meat' | 'other';

// Define a custom product type for mock data
interface MockProduct {
  id: string;
  name: string;
  description: string;
  pricePerKg: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  category: ProductCategory;
  unit: 'kg' | 'g' | 'piece' | 'bunch';
  availableQuantity: number;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
}

// Define a custom order item type for mock data
interface MockOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  imageUrl?: string;
  category: ProductCategory;
}

type DashboardStats = {
  totalSpent: number;
  totalOrders: number;
  deliveredOrders: number;
  favoriteItems: number;
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Mock data for development
const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "Fresh Tomatoes",
    description: "Organic tomatoes fresh from the farm",
    pricePerKg: 1000,
    imageUrl: "/images/tomatoes.png",
    rating: 4.5,
    reviewCount: 24,
    category: "vegetables",
    unit: "kg",
    availableQuantity: 50,
    sellerId: "seller-1",
    sellerName: "Green Valley Farms",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Organic Bananas",
    description: "Sweet and fresh organic bananas",
    pricePerKg: 1500,
    imageUrl: "/images/bananas.jpg",
    rating: 4.7,
    reviewCount: 32,
    category: "fruits",
    unit: "bunch",
    availableQuantity: 30,
    sellerId: "seller-2",
    sellerName: "Tropical Delights",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function BuyerDashboardContent() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  
  // State management
  const [activeTab, setActiveTab] = useState("overview")
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [cart, setCart] = useState<Set<string>>(new Set())
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setIsLoadingOrders(true);
      
      try {
        // In a real app, fetch from your API
        // const response = await fetch('/api/buyer/orders');
        // const data = await response.json();
        // setOrders(data.orders || []);
        
        // Mock data for development
        const mockOrders: Order[] = [
          {
            id: "order-1",
            buyerId: "user-1",
            sellerId: "seller-1",
            items: [
              {
                id: "item-1",
                orderId: "order-1",
                productId: "1",
                productName: "Fresh Tomatoes",
                quantity: 2,
                unit: "kg",
                pricePerUnit: 1000,
                totalPrice: 2000,
                imageUrl: "/images/tomatoes.png",
                category: 'vegetables'
              } as unknown as OrderItem
            ],
            totalAmount: 2000,
            currency: "RWF",
            status: "delivered",
            paymentStatus: "paid",
            paymentMethod: 'mobile_money' as PaymentMethod,
            deliveryAddress: {
              district: "Kicukiro",
              address: "KN 123 St, Kigali",
              contactPhone: user?.phone || ""
            },
            deliveryMethod: "delivery",
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            actualDelivery: new Date().toISOString(),
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
          } as unknown as Order
        ];
        
        const formattedOrders = mockOrders.map(order => ({
          ...order,
          estimatedDelivery: order.estimatedDelivery instanceof Date ? order.estimatedDelivery : new Date(order.estimatedDelivery || Date.now()),
          actualDelivery: order.actualDelivery ? (order.actualDelivery instanceof Date ? order.actualDelivery : new Date(order.actualDelivery)) : undefined,
          createdAt: order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt || Date.now()),
          updatedAt: order.updatedAt instanceof Date ? order.updatedAt : new Date(order.updatedAt || Date.now())
        }));
        setOrders(formattedOrders);
        setRecentOrders(formattedOrders.slice(0, 3)); // Show only 3 most recent orders
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setIsLoadingOrders(false);
      }
    };
    
    fetchOrders();
  }, [user]);
  
  // Fetch recommended products
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setIsLoadingProducts(true);
      
      try {
        // In a real app, fetch from your API
        // const response = await fetch('/api/products/recommended');
        // const data = await response.json();
        // setRecommendedProducts(data.products || []);
        
        // Mock data for development
        setRecommendedProducts(mockProducts as unknown as Product[]);
      } catch (err) {
        console.error('Error fetching recommended products:', err);
        // Don't show error to user for recommended products
      } finally {
        setIsLoadingProducts(false);
      }
    };
    
    fetchRecommendedProducts();
  }, []);
  
  // Load favorites from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
    }
  }, []);
  
  // Save favorites to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
    }
  }, [favorites]);
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Toggle favorite status
  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };
  
  // Add to cart
  const addToCart = (productId: string) => {
    const newCart = new Set(cart);
    newCart.add(productId);
    setCart(newCart);
  };

  // Format date helper
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Calculate dashboard stats
  const stats: DashboardStats = {
    totalSpent: 0,
    totalOrders: 0,
    deliveredOrders: 0,
    favoriteItems: 0
  };

  if (orders) {
    stats.totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    stats.totalOrders = orders.length;
    stats.deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  }
  
  if (favorites) {
    stats.favoriteItems = favorites.size;
  }

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isLoadingOrders || isLoadingProducts) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

if (isLoadingOrders || isLoadingProducts) {
return (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
      <p className="text-gray-600">Loading your dashboard...</p>
    </div>
  </div>
);
}

if (error) {
return (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
      <p className="text-red-500 mb-4">Error: {error}</p>
      <Button 
        onClick={() => window.location.reload()}
        variant="outline"
      >
        Try Again
      </Button>
    </div>
  </div>
  );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RWF {stats.totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteItems}</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Track Your Orders</CardTitle>
          <CardDescription>Check the status of your recent orders</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Badge variant={order.status === 'delivered' ? 'success' : 
                                  order.status === 'shipped' ? 'default' : 
                                  order.status === 'processing' ? 'secondary' : 
                                  order.status === 'cancelled' ? 'destructive' : 'outline'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent orders</h3>
              <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
              <div className="mt-6">
                <Button onClick={() => router.push('/marketplace')}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Browse Marketplace
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
