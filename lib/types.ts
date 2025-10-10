export type DistrictCode =
  | "Nyarugenge"
  | "Gasabo"
  | "Kicukiro" // Kigali
  | "Nyanza"
  | "Gisagara"
  | "Nyaruguru"
  | "Huye"
  | "Nyamagabe"
  | "Ruhango"
  | "Muhanga"
  | "Kamonyi" // Southern
  | "Rubavu"
  | "Nyabihu"
  | "Musanze"
  | "Burera"
  | "Gicumbi"
  | "Rulindo"
  | "Gakenke" // Northern
  | "Rusizi"
  | "Nyamasheke"
  | "Rutsiro"
  | "Karongi"
  | "Ngororero" // Western
  | "Rwamagana"
  | "Nyagatare"
  | "Gatsibo"
  | "Kayonza"
  | "Kirehe"
  | "Ngoma"
  | "Bugesera" // Eastern

export type Province = "Kigali" | "Southern" | "Northern" | "Western" | "Eastern"

export type CropType =
  | 'maize'
  | 'coffee'
  | 'tea'
  | 'beans'
  | 'potatoes'
  | 'mango'
  | 'banana'
  | 'apple'
  | 'avocado'
  | 'pineapple'
  | 'tomato'
  | 'onion'
  | 'cabbage'
  | 'carrot'
  | 'spinach'
  | 'rice'
  | 'wheat'
  | 'barley'
  | 'sorghum'
  | 'chili'
  | 'garlic'
  | 'ginger'
  | 'turmeric'
  | 'sweet_potato'
  | 'cassava'
  | 'irish_potato'
  | 'banana'
  | 'tea'
  | 'rice'
  | 'wheat'
  | 'groundnuts'
  | 'vegetables'
  | 'fruits'
  | 'spices'
  | 'avocado'
  | 'passion_fruit'
  | 'pineapple'
  | 'mango'
  | 'tomato'
  | 'onion'
  | 'carrot'
  | 'cabbage'
  | 'eggplant'
  | 'pepper'

export type PaymentMethod = 'mtn_momo' | 'airtel_money' | 'bk_connect' | 'cash' | 'bank_transfer'

export type Unit = 'kg' | 'g' | 'ton' | 'bag' | 'bunch' | 'piece' | 'liter' | 'dozen'

export interface Product {
  id: string
  name: string
  type: CropType
  description: string
  pricePerKg: number
  minOrderQuantity: number
  availableQuantity: number
  unit: string
  district: string
  farmerId: string
  farmerName: string
  rating: number
  reviewCount: number
  imageUrl: string
  isOrganic: boolean
  harvestDate: string
  paymentMethods?: PaymentMethod[]
  isVerified?: boolean
  createdAt: string
  updatedAt: string
  certifications?: string[]
  processingMethod?: string
  moistureContent?: number
  packaging?: string
  minOrderValue?: number
  deliveryOptions?: {
    pickup: boolean
    delivery: boolean
    shipping?: {
      available: boolean
      cost: number
      regions: string[]
    }
  }
  tags?: string[]
  viewCount?: number
  isBestSeller?: boolean
  isNewArrival?: boolean
  isOnSale?: boolean
  originalPrice?: number
  discountPercentage?: number
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock'
  soldQuantity?: number
  relatedProducts?: string[]
  faqs?: Array<{
    question: string
    answer: string
  }>
  returnPolicy?: string
  storageInstructions?: string
  shelfLife?: string
  nutritionalInfo?: Record<string, string>
  allergens?: string[]
  preparationInstructions?: string
  servingSuggestion?: string
  recipeIdeas?: string[]
  sustainabilityInfo?: {
    waterUsage?: string
    carbonFootprint?: string
    fairTrade?: boolean
    organicCertification?: string
  }
}

export type Language = "rw" | "en" | "fr"

export type UserRole = "farmer" | "buyer" | "admin" | "advisor"

export interface User {
  id: string
  email: string
  role: UserRole
  name?: string
  phone?: string
  avatar?: string
  isActive: boolean
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

export interface FarmerProfile {
  id: string
  userId: string
  name?: string
  phone: string
  district: DistrictCode
  sector: string
  cell: string
  village: string
  language: Language
  farmSize: number // in hectares
  primaryCrops: CropType[]
  experienceLevel: "beginner" | "intermediate" | "expert"
  hasSmartphone: boolean
  preferredContactMethod: "app" | "sms" | "voice"
  notificationsEnabled?: boolean
  registrationDate: Date
  profileComplete: boolean
  avatar?: string
  bio?: string
  certifications?: string[]
  farmLocation?: {
    coordinates: [number, number]
    address: string
  }
  businessLicense?: string
  bankAccount?: {
    accountNumber: string
    bankName: string
  }
}

export interface BuyerProfile {
  id: string
  userId: string
  name?: string
  phone?: string
  company?: string
  businessType: "individual" | "restaurant" | "retailer" | "wholesaler" | "processor"
  location: {
    district: DistrictCode
    address: string
    coordinates?: [number, number]
  }
  preferredCategories: CropType[]
  budgetRange: {
    min: number
    max: number
  }
  paymentMethods: PaymentMethod[]
  deliveryPreferences: {
    pickup: boolean
    delivery: boolean
    maxDistance: number // in km
  }
  notificationsEnabled?: boolean
  registrationDate: Date
  profileComplete: boolean
  avatar?: string
  businessLicense?: string
  taxId?: string
}

export interface FarmActivity {
  id: string
  farmerId: string
  cropId: string
  activityType: "planting" | "watering" | "fertilizing" | "harvesting" | "weeding" | "pest_control"
  scheduledDate: Date
  completedDate?: Date
  notes?: string
  voiceNote?: string // Firebase Storage URL
  images?: string[]
  districtRecommendation: boolean
  weatherDependant: boolean
  status: "scheduled" | "completed" | "overdue" | "cancelled"
}

export interface MarketListing {
  id: string
  sellerId: string
  cropType: CropType
  quantity: number
  unit: "kg" | "ton" | "bag"
  pricePerUnit: number
  quality: "A" | "B" | "C"
  harvestDate: Date
  location: {
    district: DistrictCode
    sector: string
    coordinates?: [number, number]
  }
  availableUntil: Date
  preferredPayment: PaymentMethod[]
  description: string
  images: string[]
  verified: boolean
  status: "active" | "sold" | "expired" | "reserved"
  createdAt: Date
}

export interface Order {
  id: string
  buyerId: string
  sellerId: string
  items: OrderItem[]
  totalAmount: number
  currency: "RWF"
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "disputed"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentMethod: PaymentMethod
  deliveryAddress: {
    district: DistrictCode
    address: string
    coordinates?: [number, number]
    contactPhone: string
  }
  deliveryMethod: "pickup" | "delivery"
  estimatedDelivery?: Date
  actualDelivery?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unit: string
  pricePerUnit: number
  totalPrice: number
  imageUrl?: string
}

export interface Transaction {
  id: string
  orderId: string
  buyerId: string
  sellerId: string
  amount: number
  currency: "RWF"
  paymentMethod: PaymentMethod
  status: "pending" | "completed" | "failed" | "disputed" | "cancelled"
  transactionDate: Date
  escrowEnabled: boolean
  deliveryConfirmed: boolean
  platformFee: number
  districtTax?: number
  notes?: string
}

export type MessageStatus = 'waiting' | 'sent' | 'delivered' | 'seen'

export interface Message {
  id: string
  senderId: string
  receiverId: string
  orderId?: string
  productId?: string
  content: string
  type: "text" | "image" | "file"
  isRead: boolean
  status: MessageStatus
  createdAt: Date
  sentAt?: Date
  deliveredAt?: Date
  seenAt?: Date
  attachments?: string[]
}

export interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Analytics {
  totalUsers: number
  totalFarmers: number
  totalBuyers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  topSellingProducts: Array<{
    productId: string
    productName: string
    salesCount: number
    revenue: number
  }>
  userGrowth: Array<{
    date: string
    farmers: number
    buyers: number
  }>
  revenueByMonth: Array<{
    month: string
    revenue: number
    orders: number
  }>
}

export interface DistrictProfile {
  id: DistrictCode
  name: string
  province: Province
  coordinates: [number, number]
  population: number
  farmingHouseholds: number
  soilTypes: string[]
  climateZone: string
  recommendedCrops: CropType[]
  marketDays: string[]
  averageIncome: number
  povertyRate: number
  cropProductivity: Record<CropType, number>
  priceVolatility: Record<CropType, number>
}
