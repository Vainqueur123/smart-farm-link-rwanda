"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Upload, X, MapPin } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function CreateListingPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    crop: "",
    quantity: "",
    unit: "kg",
    pricePerUnit: "",
    quality: "Standard",
    harvestDate: "",
    availableUntil: "",
    description: "",
    organic: false,
    images: [] as string[],
  })
  const [loading, setLoading] = useState(false)

  const crops = [
    "Maize",
    "Irish Potatoes",
    "Coffee",
    "Beans",
    "Rice",
    "Cassava",
    "Sweet Potatoes",
    "Bananas",
    "Tea",
    "Wheat",
  ]
  const units = ["kg", "tons", "bags", "pieces"]
  const qualities = ["Premium", "Standard", "Basic"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Creating listing:", formData)
    setLoading(false)

    // Redirect to marketplace
    window.location.href = "/marketplace"
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // Simulate image upload
      const newImages = Array.from(files).map(
        (file, index) => `/placeholder.svg?height=200&width=300&query=${formData.crop || "crop"} ${index + 1}`,
      )
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5), // Max 5 images
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">{t("List Your Produce")}</h1>
          <p className="text-muted-foreground text-pretty">
            {t("Connect with buyers across Rwanda and get the best prices for your crops")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Basic Information")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crop">{t("Crop Type")} *</Label>
                  <Select
                    value={formData.crop}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, crop: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select crop type")} />
                    </SelectTrigger>
                    <SelectContent>
                      {crops.map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">{t("Quality Grade")} *</Label>
                  <Select
                    value={formData.quality}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, quality: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {qualities.map((quality) => (
                        <SelectItem key={quality} value={quality}>
                          {quality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">{t("Quantity")} *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">{t("Unit")} *</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">
                    {t("Price per")} {formData.unit} (RWF) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, pricePerUnit: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="harvestDate">{t("Harvest Date")} *</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, harvestDate: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availableUntil">{t("Available Until")} *</Label>
                  <Input
                    id="availableUntil"
                    type="date"
                    value={formData.availableUntil}
                    onChange={(e) => setFormData((prev) => ({ ...prev, availableUntil: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("Description")}</Label>
                <Textarea
                  id="description"
                  placeholder={t("Describe your produce quality, storage conditions, etc.")}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="organic"
                  checked={formData.organic}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, organic: checked as boolean }))}
                />
                <Label htmlFor="organic" className="text-sm">
                  {t("This is organic produce")}
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Photos")}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t("Add up to 5 photos of your produce. Good photos help attract buyers!")}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${t("Crop photo")} ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                {formData.images.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground text-center">{t("Add Photo")}</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Location")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {user?.district}, {user?.sector}
                </span>
                <Badge variant="secondary">{t("From your profile")}</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => window.history.back()}
            >
              {t("Cancel")}
            </Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? t("Creating Listing...") : t("Create Listing")}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
