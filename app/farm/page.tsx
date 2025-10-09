"use client"

import { useState } from "react"
import { HorizontalDashboardLayout } from "@/components/horizontal-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sprout, Plus } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { useAuth } from "@/lib/auth-context"

export default function FarmPage() {
  const { t } = useTranslation()
  const { farmerProfile, updateProfile } = useAuth()
  const [selectedCrop, setSelectedCrop] = useState<string>("")
  const [customCrop, setCustomCrop] = useState<string>("")
  const [isAddingCrop, setIsAddingCrop] = useState(false)
  
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

  const handleAddCrop = async () => {
    if (!selectedCrop && !customCrop.trim()) return
    
    const cropToAdd = selectedCrop || customCrop.trim().toLowerCase().replace(/\s+/g, '_')
    
    if (farmerProfile?.primaryCrops?.includes(cropToAdd)) {
      alert("This crop is already in your farm")
      return
    }

    try {
      const updatedCrops = [...(farmerProfile?.primaryCrops || []), cropToAdd]
      await updateProfile({ primaryCrops: updatedCrops })
      setSelectedCrop("")
      setCustomCrop("")
      setIsAddingCrop(false)
    } catch (error) {
      console.error("Error adding crop:", error)
    }
  }

  const handleRemoveCrop = async (cropToRemove: string) => {
    try {
      const updatedCrops = farmerProfile?.primaryCrops?.filter(crop => crop !== cropToRemove) || []
      await updateProfile({ primaryCrops: updatedCrops })
    } catch (error) {
      console.error("Error removing crop:", error)
    }
  }

  return (
    <HorizontalDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-green-600" />
            <h1 className="text-2xl font-bold">{t("My Farm")}</h1>
          </div>
          <Button
            onClick={() => setIsAddingCrop(!isAddingCrop)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAddingCrop ? t("Cancel") : t("Add Crop")}
          </Button>
        </div>

        {isAddingCrop && (
          <Card>
            <CardHeader>
              <CardTitle>{t("Add New Crop")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">{t("Select Crop")}</label>
                  <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Choose from list")} />
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
                </div>
                {selectedCrop === "other" && (
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">{t("Custom Crop")}</label>
                    <Input
                      placeholder={t("Enter crop name")}
                      value={customCrop}
                      onChange={(e) => setCustomCrop(e.target.value)}
                    />
                  </div>
                )}
                <Button onClick={handleAddCrop} disabled={!selectedCrop && !customCrop.trim()}>
                  {t("Add")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t("Your Crops")}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {farmerProfile?.primaryCrops?.length || 0} crops registered
            </p>
          </CardHeader>
          <CardContent>
            {farmerProfile && farmerProfile.primaryCrops && farmerProfile.primaryCrops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {farmerProfile.primaryCrops.map((crop) => (
                  <div key={crop} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sprout className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{t(crop)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCrop(crop)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("No crops added yet")}</h3>
                <p className="text-muted-foreground mb-4">
                  {t("Add some crops to start managing your farm")}
                </p>
                <Button onClick={() => setIsAddingCrop(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("Add Your First Crop")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Farm Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("Farm Size")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{farmerProfile?.farmSize || 0} hectares</div>
              <p className="text-xs text-muted-foreground">{t("Total farm area")}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("Crops Grown")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{farmerProfile?.primaryCrops?.length || 0}</div>
              <p className="text-xs text-muted-foreground">{t("Different crop types")}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("Experience Level")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{farmerProfile?.experienceLevel || t("Not set")}</div>
              <p className="text-xs text-muted-foreground">{t("Farming experience")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </HorizontalDashboardLayout>
  )
}
