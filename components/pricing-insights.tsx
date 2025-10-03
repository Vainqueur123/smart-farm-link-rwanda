"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, BarChart3, Target } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface PricingInsight {
  crop: string
  district: string
  currentPrice: number
  averagePrice: number
  trend: "up" | "down" | "stable"
  weeklyChange: number
  monthlyChange: number
  demand: "high" | "medium" | "low"
  recommendation: "price_high" | "price_low" | "price_competitive"
}

interface PricingInsightsProps {
  crop: string
  district: string
  currentPrice?: number
}

export function PricingInsights({ crop, district, currentPrice }: PricingInsightsProps) {
  const { t } = useTranslation()
  const [insights, setInsights] = useState<PricingInsight | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPricingInsights()
  }, [crop, district])

  const loadPricingInsights = async () => {
    setLoading(true)
    // Mock pricing insights data
    const mockInsights: PricingInsight = {
      crop,
      district,
      currentPrice: currentPrice || 350,
      averagePrice: 320,
      trend: "up",
      weeklyChange: 5.2,
      monthlyChange: 12.8,
      demand: "high",
      recommendation: "price_competitive"
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setInsights(mockInsights)
    setLoading(false)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case "price_high":
        return t("Price above market average - consider reducing")
      case "price_low":
        return t("Price below market average - opportunity to increase")
      default:
        return t("Price is competitive with market trends")
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "price_high":
        return "bg-red-100 text-red-800"
      case "price_low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t("Pricing Insights")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!insights) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {t("Pricing Insights")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current vs Average Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t("Your Price")}</p>
            <p className="text-2xl font-bold">{insights.currentPrice.toLocaleString()} RWF</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("Market Average")}</p>
            <p className="text-2xl font-bold">{insights.averagePrice.toLocaleString()} RWF</p>
          </div>
        </div>

        {/* Price Comparison */}
        <div className="flex items-center justify-between">
          <span className="text-sm">{t("vs Market Average")}</span>
          <div className="flex items-center gap-2">
            {getTrendIcon(insights.currentPrice > insights.averagePrice ? "up" : "down")}
            <span className={`font-medium ${getTrendColor(insights.currentPrice > insights.averagePrice ? "up" : "down")}`}>
              {Math.abs(((insights.currentPrice - insights.averagePrice) / insights.averagePrice) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Market Trends */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">{t("Weekly Trend")}</span>
            <div className="flex items-center gap-2">
              {getTrendIcon(insights.trend)}
              <span className={`text-sm font-medium ${getTrendColor(insights.trend)}`}>
                {insights.weeklyChange > 0 ? "+" : ""}{insights.weeklyChange}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">{t("Monthly Trend")}</span>
            <div className="flex items-center gap-2">
              {getTrendIcon(insights.monthlyChange > 0 ? "up" : "down")}
              <span className={`text-sm font-medium ${getTrendColor(insights.monthlyChange > 0 ? "up" : "down")}`}>
                {insights.monthlyChange > 0 ? "+" : ""}{insights.monthlyChange}%
              </span>
            </div>
          </div>
        </div>

        {/* Demand Level */}
        <div className="flex items-center justify-between">
          <span className="text-sm">{t("Market Demand")}</span>
          <Badge variant={insights.demand === "high" ? "default" : insights.demand === "medium" ? "secondary" : "outline"}>
            {t(insights.demand.charAt(0).toUpperCase() + insights.demand.slice(1))}
          </Badge>
        </div>

        {/* Recommendation */}
        <div className="p-3 rounded-lg bg-muted">
          <div className="flex items-start gap-2">
            <Target className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium">{t("Pricing Recommendation")}</p>
              <p className="text-xs text-muted-foreground">{getRecommendationText(insights.recommendation)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

