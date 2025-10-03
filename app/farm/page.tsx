"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sprout, Plus } from "@/lib/lucide-react"
import { useTranslation } from "@/lib/i18n"
import { useAuth } from "@/lib/auth-context"

export default function FarmPage() {
  const { t } = useTranslation()
  const { farmerProfile, updateProfile } = useAuth()
  const [selectedCrop, setSelectedCrop] = useState<string>("")
  const [customCrop, setCustomCrop] = useState<string>("")
  const availableCrops = [
    "maize",
    "beans",
    "irish_potato",
    "sweet_potato",
    "banana",
    "coffee",
    "tea",
    "cassava",
    "rice",
    "sorghum",
    "wheat",
    "groundnuts",
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-green-600" />
            <h1 className="text-2xl font-bold">{t("My Farm")}</h1>
          </div>
          <div className="flex gap-2 items-center">
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("Select a crop")} />
              </SelectTrigger>
              <SelectContent>
                {availableCrops.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {t(crop)}
                  </SelectItem>
                ))}
                <SelectItem value="other">{t("Other")}</SelectItem>
              </SelectContent>
            </Select>
            {selectedCrop === "other" && (
              <Input
                placeholder={t("Enter custom crop")}
                value={customCrop}
                onChange={(e) => setCustomCrop(e.target.value)}
                className="w-48"
              />
            )}
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={async () => {
                const cropToAdd = selectedCrop === "other" ? customCrop.trim().toLowerCase() : selectedCrop
                if (!cropToAdd) return
                const current = farmerProfile?.primaryCrops || []
                if (current.includes(cropToAdd)) {
                  alert(t("Crop already added"))
                  return
                }
                await updateProfile({ primaryCrops: [...current, cropToAdd] })
                setSelectedCrop("")
                setCustomCrop("")
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("Add")}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("Your crops")}</CardTitle>
          </CardHeader>
          <CardContent>
            {farmerProfile && farmerProfile.primaryCrops.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {farmerProfile.primaryCrops.map((crop) => (
                  <div key={crop} className="flex items-center gap-2 border rounded-full pl-3 pr-1 py-1">
                    <span className="text-sm">{t(crop)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        const next = (farmerProfile.primaryCrops || []).filter((c) => c !== crop)
                        await updateProfile({ primaryCrops: next })
                      }}
                    >
                      {t("Remove")}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                {t("You have no crops added yet. Click 'Add Crop' to get started.")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
