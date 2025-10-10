"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import type { LucideIcon } from "lucide-react"

interface RecommendationCardProps {
  title: string
  description: string
  icon: LucideIcon
  type: "seasonal" | "soil" | "water" | "market" | "pest" | "fertilizer"
}

export function RecommendationCard({ title, description, icon: Icon, type }: RecommendationCardProps) {
  const { t } = useTranslation()
  const [isAdviceOpen, setIsAdviceOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const getTypeColor = (type: string) => {
    switch (type) {
      case "seasonal":
        return "bg-blue-100 text-blue-800"
      case "soil":
        return "bg-amber-100 text-amber-800"
      case "water":
        return "bg-cyan-100 text-cyan-800"
      case "market":
        return "bg-green-100 text-green-800"
      case "pest":
        return "bg-red-100 text-red-800"
      case "fertilizer":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "seasonal":
        return "Seasonal"
      case "soil":
        return "Soil Health"
      case "water":
        return "Water Management"
      case "market":
        return "Market Insight"
      case "pest":
        return "Pest Control"
      case "fertilizer":
        return "Fertilizer"
      default:
        return "General"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Icon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <Badge className={`mt-1 ${getTypeColor(type)}`} variant="secondary">
                {getTypeLabel(type)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm mb-4">{description}</CardDescription>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => setIsAdviceOpen(true)}
          >
            {t("Learn More")}
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => setIsAdviceOpen(true)}
          >
            {t("Apply")}
          </Button>
        </div>

        {isAdviceOpen && (
          <div className="mt-4 p-4 border rounded-lg bg-white shadow-sm">
            <p className="text-sm font-medium mb-2">{t("Ask for advice")}</p>
            <textarea
              className="w-full border rounded-md p-2 text-sm mb-2"
              rows={3}
              placeholder={t("Type your farming question")}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsAdviceOpen(false)}>
                {t("cancel")}
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  console.log("[advice]", { type, title, question })
                  setIsAdviceOpen(false)
                  setQuestion("")
                }}
                disabled={!question.trim()}
              >
                {t("Send")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
