"use client"

import { User, Product, Order, FarmerProfile, BuyerProfile } from "./types"

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Cache interface
interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

// Simple in-memory cache
class APICache {
  private cache = new Map<string, CacheEntry<any>>()

  set<T>(key: string, data: T, ttl: number = CACHE_DURATION): void {
    const now = Date.now()
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }
}

const cache = new APICache()

// API Service Class
class APIService {
  private baseURL: string
  private defaultHeaders: HeadersInit

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      "Content-Type": "application/json",
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache: boolean = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const cacheKey = `${options.method || "GET"}:${url}:${JSON.stringify(options.body || {})}`

    // Check cache for GET requests
    if (useCache && (!options.method || options.method === "GET")) {
      const cached = cache.get<T>(cacheKey)
      if (cached) {
        return cached
      }
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Cache successful GET requests
      if (useCache && (!options.method || options.method === "GET")) {
        cache.set(cacheKey, data)
      }

      return data
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // User Management
  async getUsers(): Promise<User[]> {
    return this.request<User[]>("/users")
  }

  async getUser(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`)
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const result = await this.request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, false)
    
    // Clear user-related cache
    cache.delete(`GET:${this.baseURL}/users`)
    cache.delete(`GET:${this.baseURL}/users/${id}`)
    
    return result
  }

  // Farmer Profiles
  async getFarmerProfile(id: string): Promise<FarmerProfile> {
    return this.request<FarmerProfile>(`/farmers/${id}`)
  }

  async updateFarmerProfile(id: string, data: Partial<FarmerProfile>): Promise<FarmerProfile> {
    const result = await this.request<FarmerProfile>(`/farmers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, false)
    
    cache.delete(`GET:${this.baseURL}/farmers/${id}`)
    return result
  }

  // Buyer Profiles
  async getBuyerProfile(id: string): Promise<BuyerProfile> {
    return this.request<BuyerProfile>(`/buyers/${id}`)
  }

  async updateBuyerProfile(id: string, data: Partial<BuyerProfile>): Promise<BuyerProfile> {
    const result = await this.request<BuyerProfile>(`/buyers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, false)
    
    cache.delete(`GET:${this.baseURL}/buyers/${id}`)
    return result
  }

  // Products
  async getProducts(filters?: {
    category?: string
    district?: string
    priceMin?: number
    priceMax?: number
    organic?: boolean
    search?: string
  }): Promise<Product[]> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    
    const queryString = params.toString()
    const endpoint = queryString ? `/products?${queryString}` : "/products"
    
    return this.request<Product[]>(endpoint)
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`)
  }

  async createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const result = await this.request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }, false)
    
    cache.delete(`GET:${this.baseURL}/products`)
    return result
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const result = await this.request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, false)
    
    cache.delete(`GET:${this.baseURL}/products`)
    cache.delete(`GET:${this.baseURL}/products/${id}`)
    return result
  }

  async deleteProduct(id: string): Promise<void> {
    await this.request<void>(`/products/${id}`, {
      method: "DELETE",
    }, false)
    
    cache.delete(`GET:${this.baseURL}/products`)
    cache.delete(`GET:${this.baseURL}/products/${id}`)
  }

  // Orders
  async getOrders(userId?: string): Promise<Order[]> {
    const endpoint = userId ? `/orders?userId=${userId}` : "/orders"
    return this.request<Order[]>(endpoint)
  }

  async getOrder(id: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}`)
  }

  async createOrder(data: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
    const result = await this.request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }, false)
    
    cache.delete(`GET:${this.baseURL}/orders`)
    return result
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<Order> {
    const result = await this.request<Order>(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, false)
    
    cache.delete(`GET:${this.baseURL}/orders`)
    cache.delete(`GET:${this.baseURL}/orders/${id}`)
    return result
  }

  // Analytics
  async getAnalytics(): Promise<any> {
    return this.request<any>("/analytics")
  }

  // Market Data
  async getMarketPrices(crop?: string, district?: string): Promise<any[]> {
    const params = new URLSearchParams()
    if (crop) params.append("crop", crop)
    if (district) params.append("district", district)
    
    const queryString = params.toString()
    const endpoint = queryString ? `/market-prices?${queryString}` : "/market-prices"
    
    return this.request<any[]>(endpoint)
  }

  // Search
  async search(query: string, type?: "products" | "users" | "all"): Promise<any> {
    const params = new URLSearchParams({ q: query })
    if (type) params.append("type", type)
    
    return this.request<any>(`/search?${params.toString()}`)
  }

  // File Upload
  async uploadFile(file: File, type: "product" | "profile" | "document"): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    const result = await this.request<{ url: string }>("/upload", {
      method: "POST",
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    }, false)

    return result
  }

  // Clear all cache
  clearCache(): void {
    cache.clear()
  }

  // Clear specific cache entries
  clearCachePattern(pattern: string): void {
    const keys = Array.from(cache["cache"].keys())
    keys.forEach(key => {
      if (key.includes(pattern)) {
        cache.delete(key)
      }
    })
  }
}

// Create singleton instance
export const apiService = new APIService()

// React hooks for API calls
export function useAPI() {
  return {
    // User methods
    getUsers: apiService.getUsers.bind(apiService),
    getUser: apiService.getUser.bind(apiService),
    updateUser: apiService.updateUser.bind(apiService),

    // Profile methods
    getFarmerProfile: apiService.getFarmerProfile.bind(apiService),
    updateFarmerProfile: apiService.updateFarmerProfile.bind(apiService),
    getBuyerProfile: apiService.getBuyerProfile.bind(apiService),
    updateBuyerProfile: apiService.updateBuyerProfile.bind(apiService),

    // Product methods
    getProducts: apiService.getProducts.bind(apiService),
    getProduct: apiService.getProduct.bind(apiService),
    createProduct: apiService.createProduct.bind(apiService),
    updateProduct: apiService.updateProduct.bind(apiService),
    deleteProduct: apiService.deleteProduct.bind(apiService),

    // Order methods
    getOrders: apiService.getOrders.bind(apiService),
    getOrder: apiService.getOrder.bind(apiService),
    createOrder: apiService.createOrder.bind(apiService),
    updateOrder: apiService.updateOrder.bind(apiService),

    // Analytics
    getAnalytics: apiService.getAnalytics.bind(apiService),
    getMarketPrices: apiService.getMarketPrices.bind(apiService),

    // Search
    search: apiService.search.bind(apiService),

    // File upload
    uploadFile: apiService.uploadFile.bind(apiService),

    // Cache management
    clearCache: apiService.clearCache.bind(apiService),
    clearCachePattern: apiService.clearCachePattern.bind(apiService),
  }
}

// Utility functions
export const apiUtils = {
  // Debounce function for search
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  // Retry function for failed requests
  retry: async <T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    try {
      return await fn()
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
        return apiUtils.retry(fn, retries - 1, delay * 2)
      }
      throw error
    }
  },

  // Batch requests
  batch: async <T>(
    requests: (() => Promise<T>)[]
  ): Promise<T[]> => {
    return Promise.all(requests.map(request => request()))
  }
}
