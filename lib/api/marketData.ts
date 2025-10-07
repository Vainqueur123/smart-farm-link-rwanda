import { ProductPriceData } from "@/lib/marketData"

const API_BASE_URL = 'https://api.example.com' // Replace with actual API endpoint
const API_KEY = process.env.NEXT_PUBLIC_MARKET_DATA_API_KEY

interface ApiResponse {
  data: {
    product: string
    prices: {
      year: number
      price: number
    }[]
  }[]
}

export async function fetchMarketData(): Promise<ProductPriceData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/market-prices`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // Revalidate data every hour
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data: ApiResponse = await response.json()
    
    // Transform API response to match our frontend structure
    return data.data.map(item => ({
      product: item.product,
      yearlyPrices: item.prices.reduce((acc, curr) => {
        acc[curr.year.toString()] = curr.price
        return acc
      }, {} as Record<string, number>)
    }))
  } catch (error) {
    console.error('Error fetching market data:', error)
    throw error
  }
}

// Fallback to mock data if API fails
export async function getMarketDataWithFallback(): Promise<ProductPriceData[]> {
  try {
    return await fetchMarketData()
  } catch (error) {
    console.warn('Using mock data as fallback')
    const { mockMarketData } = await import('@/lib/marketData')
    return mockMarketData
  }
}
