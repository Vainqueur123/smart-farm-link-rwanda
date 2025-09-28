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
  | "maize"
  | "beans"
  | "sorghum"
  | "sweet_potato"
  | "cassava"
  | "irish_potato"
  | "banana"
  | "coffee"
  | "tea"
  | "rice"
  | "wheat"
  | "groundnuts"

export type PaymentMethod = "mtn_momo" | "airtel_money" | "bk_connect" | "cash"

export type Language = "rw" | "en" | "fr"

export interface FarmerProfile {
  id: string
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
