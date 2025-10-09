"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  X, 
  Upload, 
  Image as ImageIcon,
  DollarSign,
  Package,
  MapPin,
  Calendar,
  CheckCircle
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { ImageUpload } from "@/components/image-upload"
import type { Product, CropType, DistrictCode } from "@/lib/types"

interface ProductListingFormProps {
  onSuccess?: (product: Product) => void
  onCancel?: () => void
  initialData?: Partial<Product>
}

export function ProductListingForm({ onSuccess, onCancel, initialData }: ProductListingFormProps) {
  const { t } = useTranslation()
  const { farmerProfile, userRole } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    type: initialData?.type || "",
    pricePerKg: initialData?.pricePerKg || 0,
    minOrderQuantity: initialData?.minOrderQuantity || 1,
    availableQuantity: initialData?.availableQuantity || 0,
    unit: initialData?.unit || "kg",
    district: initialData?.district || (farmerProfile?.district || "Kigali"),
    isOrganic: initialData?.isOrganic || false,
    harvestDate: initialData?.harvestDate || "",
    paymentMethods: initialData?.paymentMethods || ["mtn_momo"],
    imageUrl: initialData?.imageUrl || "",
    ...initialData
  })

  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const [errors, setErrors] = useState<Record<string, string>>({})

  const cropTypes: CropType[] = [
    "maize", "beans", "irish_potato", "sweet_potato", "banana", 
    "coffee", "tea", "cassava", "rice", "sorghum", "wheat", 
    "groundnuts", "tomato", "onion", "cabbage", "carrot", "spinach"
  ]

  const districts: DistrictCode[] = [
    "Nyarugenge", "Gasabo", "Kicukiro", "Nyanza", "Gisagara", 
    "Nyaruguru", "Huye", "Nyamagabe", "Ruhango", "Muhanga", 
    "Kamonyi", "Rubavu", "Nyabihu", "Musanze", "Burera", 
    "Gicumbi", "Rulindo", "Gakenke", "Rusizi", "Nyamasheke", 
    "Rutsiro", "Karongi", "Ngororero", "Rwamagana", "Nyagatare", 
    "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Bugesera"
  ]

  const paymentOptions = [
    { value: "mtn_momo", label: "MTN MoMo" },
    { value: "airtel_money", label: "Airtel Money" },
    { value: "bk_connect", label: "BK Connect" },
    { value: "cash", label: "Cash" },
    { value: "bank_transfer", label: "Bank Transfer" }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = t("Product name is required")
    if (!formData.description.trim()) newErrors.description = t("Description is required")
    if (!formData.type) newErrors.type = t("Crop type is required")
    if (formData.pricePerKg <= 0) newErrors.pricePerKg = t("Price must be greater than 0")
    if (formData.availableQuantity <= 0) newErrors.availableQuantity = t("Available quantity must be greater than 0")
    if (formData.minOrderQuantity <= 0) newErrors.minOrderQuantity = t("Minimum order must be greater than 0")
    if (!formData.harvestDate) newErrors.harvestDate = t("Harvest date is required")

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // In a real app, this would upload the image to a storage service first
      let imageUrl = formData.imageUrl || "/placeholder-product.png"
      
      if (selectedImage) {
        // Simulate image upload
        await new Promise(resolve => setTimeout(resolve, 500))
        // In real app: upload to Firebase Storage, AWS S3, etc.
        imageUrl = URL.createObjectURL(selectedImage)
      }

      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        type: formData.type as CropType,
        pricePerKg: formData.pricePerKg,
        minOrderQuantity: formData.minOrderQuantity,
        availableQuantity: formData.availableQuantity,
        unit: formData.unit,
        district: formData.district as DistrictCode,
        farmerId: farmerProfile?.id || "unknown",
        farmerName: farmerProfile?.name || "Unknown Farmer",
        rating: 0,
        reviewCount: 0,
        imageUrl: imageUrl,
        isOrganic: formData.isOrganic,
        harvestDate: formData.harvestDate,
        paymentMethods: formData.paymentMethods,
        isVerified: farmerProfile?.isVerified || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSuccess?.(newProduct)
    } catch (error) {
      console.error("Error creating product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handlePaymentMethodToggle = (method: string) => {
    const methods = formData.paymentMethods.includes(method)
      ? formData.paymentMethods.filter(m => m !== method)
      : [...formData.paymentMethods, method]
    handleInputChange("paymentMethods", methods)
  }

  if (userRole !== "farmer") {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">{t("Only farmers can list products")}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {initialData ? t("Edit Product") : t("List New Product")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("Basic Information")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t("Product Name")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={t("Enter product name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="type">{t("Crop Type")} *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                    <SelectValue placeholder={t("Select crop type")} />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {t(crop)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description">{t("Description")} *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder={t("Describe your product")}
                rows={3}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Pricing & Quantity */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("Pricing & Quantity")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="pricePerKg">{t("Price per kg")} (RWF) *</Label>
                <Input
                  id="pricePerKg"
                  type="number"
                  value={formData.pricePerKg}
                  onChange={(e) => handleInputChange("pricePerKg", Number(e.target.value))}
                  placeholder="0"
                  className={errors.pricePerKg ? "border-red-500" : ""}
                />
                {errors.pricePerKg && <p className="text-sm text-red-500 mt-1">{errors.pricePerKg}</p>}
              </div>

              <div>
                <Label htmlFor="availableQuantity">{t("Available Quantity")} *</Label>
                <Input
                  id="availableQuantity"
                  type="number"
                  value={formData.availableQuantity}
                  onChange={(e) => handleInputChange("availableQuantity", Number(e.target.value))}
                  placeholder="0"
                  className={errors.availableQuantity ? "border-red-500" : ""}
                />
                {errors.availableQuantity && <p className="text-sm text-red-500 mt-1">{errors.availableQuantity}</p>}
              </div>

              <div>
                <Label htmlFor="minOrderQuantity">{t("Minimum Order")} *</Label>
                <Input
                  id="minOrderQuantity"
                  type="number"
                  value={formData.minOrderQuantity}
                  onChange={(e) => handleInputChange("minOrderQuantity", Number(e.target.value))}
                  placeholder="1"
                  className={errors.minOrderQuantity ? "border-red-500" : ""}
                />
                {errors.minOrderQuantity && <p className="text-sm text-red-500 mt-1">{errors.minOrderQuantity}</p>}
              </div>
            </div>
          </div>

          {/* Location & Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("Location & Details")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="district">{t("District")}</Label>
                <Select value={formData.district} onValueChange={(value) => handleInputChange("district", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select district")} />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="harvestDate">{t("Harvest Date")} *</Label>
                <Input
                  id="harvestDate"
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => handleInputChange("harvestDate", e.target.value)}
                  className={errors.harvestDate ? "border-red-500" : ""}
                />
                {errors.harvestDate && <p className="text-sm text-red-500 mt-1">{errors.harvestDate}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOrganic"
                checked={formData.isOrganic}
                onCheckedChange={(checked) => handleInputChange("isOrganic", checked)}
              />
              <Label htmlFor="isOrganic">{t("Organic Product")}</Label>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("Payment Methods")}</h3>
            <div className="flex flex-wrap gap-2">
              {paymentOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={formData.paymentMethods.includes(option.value)}
                    onCheckedChange={() => handlePaymentMethodToggle(option.value)}
                  />
                  <Label htmlFor={option.value} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("product_image")}</h3>
            <ImageUpload
              onImageSelect={setSelectedImage}
              currentImage={formData.imageUrl}
              maxSize={5}
              disabled={isSubmitting}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {t("Cancel")}
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t("Creating...")}
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {initialData ? t("Update Product") : t("List Product")}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
