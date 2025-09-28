"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Sun, CloudRain, Droplets, Wind, Thermometer } from "lucide-react"
import type { DistrictCode } from "@/lib/types"

interface WeatherWidgetProps {
  district: DistrictCode
}

interface WeatherData {
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  condition: "sunny" | "cloudy" | "rainy"
  forecast: Array<{
    day: string
    condition: "sunny" | "cloudy" | "rainy"
    temp: number
    rain: number
  }>
}

export function WeatherWidget({ district }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock weather data - in production, this would fetch from Rwanda Meteorology Agency API
    const mockWeather: WeatherData = {
      temperature: Math.floor(Math.random() * 10) + 20, // 20-30°C
      humidity: Math.floor(Math.random() * 30) + 60, // 60-90%
      rainfall: Math.floor(Math.random() * 20), // 0-20mm
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
      condition: ["sunny", "cloudy", "rainy"][Math.floor(Math.random() * 3)] as "sunny" | "cloudy" | "rainy",
      forecast: Array.from({ length: 5 }, (_, i) => ({
        day: ["Today", "Tomorrow", "Wed", "Thu", "Fri"][i],
        condition: ["sunny", "cloudy", "rainy"][Math.floor(Math.random() * 3)] as "sunny" | "cloudy" | "rainy",
        temp: Math.floor(Math.random() * 8) + 22,
        rain: Math.floor(Math.random() * 15),
      })),
    }

    setTimeout(() => {
      setWeather(mockWeather)
      setLoading(false)
    }, 1000)
  }, [district])

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  const getWeatherAlert = (weather: WeatherData) => {
    if (weather.rainfall > 15) {
      return { type: "warning", message: "Heavy rain expected - protect crops" }
    }
    if (weather.temperature > 28) {
      return { type: "info", message: "Hot weather - increase watering" }
    }
    if (weather.humidity < 40) {
      return { type: "info", message: "Low humidity - monitor soil moisture" }
    }
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather</CardTitle>
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

  if (!weather) return null

  const alert = getWeatherAlert(weather)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Weather
          {getWeatherIcon(weather.condition)}
        </CardTitle>
        <CardDescription>{district} District</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current conditions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <span className="text-sm">{weather.temperature}°C</span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{weather.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <CloudRain className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{weather.rainfall}mm</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{weather.windSpeed} km/h</span>
          </div>
        </div>

        {/* Weather alert */}
        {alert && (
          <div
            className={`p-3 rounded-lg text-sm ${
              alert.type === "warning" ? "bg-yellow-50 text-yellow-800" : "bg-blue-50 text-blue-800"
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* 5-day forecast */}
        <div>
          <h4 className="text-sm font-medium mb-2">5-Day Forecast</h4>
          <div className="space-y-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="w-16">{day.day}</span>
                <div className="flex items-center space-x-2">
                  {getWeatherIcon(day.condition)}
                  <span>{day.temp}°C</span>
                  {day.rain > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {day.rain}mm
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
