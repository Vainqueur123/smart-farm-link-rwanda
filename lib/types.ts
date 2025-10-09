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

export type UserRole = "farmer" | "buyer" | "advisor" | "admin"

export interface FarmerProfile {
  id: string
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
  registrationDate: Date
  profileComplete: boolean
  avatar?: string
  role: UserRole
  email: string
  isVerified: boolean
  rating?: number
  totalSales?: number
  joinDate: Date
}

export interface BuyerProfile {
  id: string
  name?: string
  phone: string
  district: DistrictCode
  sector: string
  cell: string
  village: string
  language: Language
  businessType: "individual" | "restaurant" | "hotel" | "supermarket" | "wholesaler" | "exporter"
  preferredCrops: CropType[]
  budgetRange: {
    min: number
    max: number
  }
  preferredContactMethod: "app" | "sms" | "voice"
  registrationDate: Date
  profileComplete: boolean
  avatar?: string
  role: UserRole
  email: string
  isVerified: boolean
  rating?: number
  totalPurchases?: number
  joinDate: Date
}

export interface AdvisorProfile {
  id: string
  name?: string
  phone: string
  district: DistrictCode
  sector: string
  cell: string
  village: string
  language: Language
  specialization: CropType[]
  experienceYears: number
  qualifications: string[]
  certifications: string[]
  preferredContactMethod: "app" | "sms" | "voice"
  registrationDate: Date
  profileComplete: boolean
  avatar?: string
  role: UserRole
  email: string
  isVerified: boolean
  rating?: number
  totalAdviceGiven?: number
  joinDate: Date
  hourlyRate?: number
  availability: "available" | "busy" | "unavailable"
}

export interface AdminProfile {
  id: string
  name?: string
  phone: string
  email: string
  role: UserRole
  permissions: string[]
  registrationDate: Date
  profileComplete: boolean
  avatar?: string
  isVerified: boolean
  joinDate: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error" | "message"
  isRead: boolean
  createdAt: Date
  actionUrl?: string
  actionText?: string
  relatedUserId?: string
  relatedProductId?: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  type: "text" | "image" | "voice" | "file"
  isRead: boolean
  createdAt: Date
  updatedAt: Date
  replyToId?: string
  attachments?: string[]
  productId?: string
}

export interface Chat {
  id: string
  participants: string[]
  lastMessage?: Message
  lastActivity: Date
  productId?: string
  isActive: boolean
  createdAt: Date
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

export interface Transaction {
  id: string
  buyerId: string
  sellerId: string
  listingId: string
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
