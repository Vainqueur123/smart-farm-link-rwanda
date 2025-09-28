"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sprout, Droplets, Calendar, TrendingUp } from "lucide-react"
import type { CropType, DistrictCode } from "@/lib/types"
import { useTranslation } from "react-i18next"

interface CropCardProps {
  crop: CropType
  district: DistrictCode
  progress: number
  health: "excellent" | "good" | "fair" | "poor"
  nextActivity: string
}

export function CropCard({ crop, district, progress, health, nextActivity }: CropCardProps) {
  const { t } = useTranslation()

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "fair":
        return "bg-yellow-100 text-yellow-800"
      case "poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCropImage = (crop: CropType) => {
    // In production, these would be actual crop images
    return `/placeholder.svg?height=120&width=200&query=${crop} crop field in Rwanda`
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative">
        <img
          src={getCropImage(crop) || "/placeholder.svg"}
          alt={`${crop} field`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={getHealthColor(health)}>{health}</Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg capitalize">{t(crop)}</CardTitle>
          <Sprout className="h-5 w-5 text-green-600" />
        </div>
        <CardDescription>{district} District</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Growth Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Growth Progress</span>
            <span className="text-green-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Day 45</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>On track</span>
          </div>
        </div>

        {/* Next Activity */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Next: {nextActivity}</p>
              <p className="text-xs text-gray-600">Due in 2 days</p>
            </div>
            <Droplets className="h-4 w-4 text-blue-500" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
            Log Activity
          </Button>
          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
