"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Loader2, MapPin, User, Sprout, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { sampleProducts } from "@/lib/products"
import { getDistrictsByProvince } from "@/lib/districts"
import type { DistrictCode, Province, CropType, Language } from "@/lib/types"
import { doc, setDoc, updateDoc, db } from "@/lib/firebase"
import { useTranslation } from "@/lib/i18n"

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Location", icon: MapPin },
  { id: 3, title: "Step 3", icon: Sprout },
  { id: 4, title: "Preferences", icon: Settings },
]

const CROPS: { value: CropType; label: string }[] = [
  { value: "maize", label: "Maize (Ibigori)" },
  { value: "beans", label: "Beans (Ibishyimbo)" },
  { value: "irish_potato", label: "Irish Potato (Ibirayi)" },
  { value: "sweet_potato", label: "Sweet Potato (Ibijumba)" },
  { value: "banana", label: "Banana (Amatooke)" },
  { value: "coffee", label: "Coffee (Ikawa)" },
  { value: "tea", label: "Tea (Icyayi)" },
  { value: "cassava", label: "Cassava (Imyumbati)" },
  { value: "rice", label: "Rice (Umuceri)" },
  { value: "sorghum", label: "Sorghum (Amasaka)" },
  { value: "wheat", label: "Wheat (Ingano)" },
  { value: "groundnuts", label: "Groundnuts (Ubunyobwa)" },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { user, updateProfile, userRole } = useAuth()
  const router = useRouter()
  const { t, i18n } = useTranslation()

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    district: "" as DistrictCode,
    sector: "",
    cell: "",
    village: "",
    language: "en" as Language,
    farmSize: "",
    primaryCrops: [] as CropType[],
    experienceLevel: "" as "beginner" | "intermediate" | "expert",
    hasSmartphone: true,
    preferredContactMethod: "app" as "app" | "sms" | "voice",
  })

  // Buyer-specific: allow selecting farmers to follow/contact during signup
  const [selectedFarmerIds, setSelectedFarmerIds] = useState<Set<string>>(new Set())
  const isBuyer = userRole === "buyer"

  const [selectedProvince, setSelectedProvince] = useState<Province | "">("")

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
    }
  }, [user, router])

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCropToggle = (crop: CropType) => {
    setFormData((prev) => ({
      ...prev,
      primaryCrops: prev.primaryCrops.includes(crop)
        ? prev.primaryCrops.filter((c) => c !== crop)
        : [...prev.primaryCrops, crop],
    }))
  }

  const handleLanguageChange = (language: Language) => {
    setFormData((prev) => ({ ...prev, language }))
    i18n.changeLanguage(language)
  }

  const handleSubmit = async () => {
    if (!user) return

    setLoading(true)
    setError("")

    try {
      const profile = {
        id: user.id,
        userId: user.id,
        name: formData.name,
        phone: formData.phone,
        district: formData.district,
        sector: formData.sector,
        cell: formData.cell,
        village: formData.village,
        language: formData.language,
        farmSize: Number.parseFloat(formData.farmSize),
        primaryCrops: formData.primaryCrops,
        experienceLevel: formData.experienceLevel,
        hasSmartphone: formData.hasSmartphone,
        preferredContactMethod: formData.preferredContactMethod,
        registrationDate: new Date(),
        profileComplete: true,
      }

      // Update both farmer profile and user document with the name
      await setDoc(doc(db, `farmers/${user.id}`), profile)
      await updateDoc(doc(db, `users/${user.id}`), { name: formData.name })
      await updateProfile(profile)
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message || "Failed to complete onboarding")
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.length > 0 && formData.phone.length > 0
      case 2:
        return formData.district && formData.sector && formData.cell && formData.village
      case 3:
        if (isBuyer) return true
        return formData.farmSize && formData.primaryCrops.length > 0 && formData.experienceLevel
      case 4:
        return true
      default:
        return false
    }
  }

  const progress = (currentStep / STEPS.length) * 100

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Smart Farm Link</h1>
            <span className="text-sm text-gray-600">
              Step {currentStep} of {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 ${step.id <= currentStep ? "text-green-600" : "text-gray-400"}`}
              >
                <step.icon className="h-5 w-5" />
                <span className="text-sm font-medium hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 3 && isBuyer ? "Explore Farmers" : currentStep === 3 ? "Farm Details" : STEPS[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Let's start with your basic information"}
              {currentStep === 2 && "Tell us where your farm is located"}
              {currentStep === 3 && !isBuyer && "Share details about your farming activities"}
              {currentStep === 3 && isBuyer && "Browse farmers and crops to connect with"}
              {currentStep === 4 && "Set your preferences for the best experience"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{t("fullName")}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t("Enter your full name")}
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t("phoneNumber")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+250 7XX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Preferred Language</Label>
                  <div className="flex space-x-4 mt-2">
                    <Button
                      type="button"
                      variant={formData.language === "en" ? "default" : "outline"}
                      onClick={() => handleLanguageChange("en")}
                    >
                      English
                    </Button>
                    <Button
                      type="button"
                      variant={formData.language === "rw" ? "default" : "outline"}
                      onClick={() => handleLanguageChange("rw")}
                    >
                      Kinyarwanda
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>{t("province")}</Label>
                  <Select value={selectedProvince} onValueChange={(value: Province) => setSelectedProvince(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kigali">Kigali</SelectItem>
                      <SelectItem value="Southern">Southern</SelectItem>
                      <SelectItem value="Northern">Northern</SelectItem>
                      <SelectItem value="Western">Western</SelectItem>
                      <SelectItem value="Eastern">Eastern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedProvince && (
                  <div>
                    <Label>District</Label>
                    <Select
                      value={formData.district}
                      onValueChange={(value: DistrictCode) => setFormData((prev) => ({ ...prev, district: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        {getDistrictsByProvince(selectedProvince).map((district) => (
                          <SelectItem key={district.id} value={district.id}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sector">Sector</Label>
                    <Input
                      id="sector"
                      value={formData.sector}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sector: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cell">Cell</Label>
                    <Input
                      id="cell"
                      value={formData.cell}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cell: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="village">Village</Label>
                    <Input
                      id="village"
                      value={formData.village}
                      onChange={(e) => setFormData((prev) => ({ ...prev, village: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Farm Details */}
              {currentStep === 3 && !isBuyer && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="farmSize">Farm Size (hectares)</Label>
                  <Input
                    id="farmSize"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 2.5"
                    value={formData.farmSize}
                    onChange={(e) => setFormData((prev) => ({ ...prev, farmSize: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Primary Crops (select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {CROPS.map((crop) => (
                      <div key={crop.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={crop.value}
                          checked={formData.primaryCrops.includes(crop.value)}
                          onCheckedChange={() => handleCropToggle(crop.value)}
                        />
                        <Label htmlFor={crop.value} className="text-sm">
                          {crop.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Farming Experience</Label>
                  <Select
                    value={formData.experienceLevel}
                    onValueChange={(value: "beginner" | "intermediate" | "expert") =>
                      setFormData((prev) => ({ ...prev, experienceLevel: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (3-10 years)</SelectItem>
                      <SelectItem value="expert">Expert (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

              {/* Step 3 for Buyer: Explore Farmers and Crops */}
              {currentStep === 3 && isBuyer && (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Discover farmers near you and the crops they sell. Select farmers to follow; you can contact them any time.
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from(
                      new Map(
                        sampleProducts.map((p) => [p.farmerId, { farmerId: p.farmerId, farmerName: p.farmerName, district: p.district }])
                      ).values()
                    ).map((farmer) => {
                      const isSelected = selectedFarmerIds.has(farmer.farmerId)
                      const crops = sampleProducts
                        .filter((p) => p.farmerId === farmer.farmerId)
                        .map((p) => p.name)
                        .slice(0, 4)
                      return (
                        <Card key={farmer.farmerId} className={`transition-shadow ${isSelected ? "ring-2 ring-green-600" : ""}`}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{farmer.farmerName}</CardTitle>
                            <CardDescription className="text-xs">{farmer.district}</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex flex-wrap gap-1 mb-3">
                              {crops.map((c) => (
                                <span key={c} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                  {c}
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => {
                                  setSelectedFarmerIds((prev) => {
                                    const next = new Set(prev)
                                    if (next.has(farmer.farmerId)) next.delete(farmer.farmerId)
                                    else next.add(farmer.farmerId)
                                    return next
                                  })
                                }}
                              >
                                {isSelected ? "Following" : "Follow"}
                              </Button>
                              <Button type="button" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => router.push("/buyer-dashboard")}>
                                View
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}

            {/* Step 4: Preferences */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smartphone"
                    checked={formData.hasSmartphone}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, hasSmartphone: checked as boolean }))
                    }
                  />
                  <Label htmlFor="smartphone">I have a smartphone</Label>
                </div>

                <div>
                  <Label>Preferred Contact Method</Label>
                  <Select
                    value={formData.preferredContactMethod}
                    onValueChange={(value: "app" | "sms" | "voice") =>
                      setFormData((prev) => ({ ...prev, preferredContactMethod: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="app">Mobile App</SelectItem>
                      <SelectItem value="sms">SMS Messages</SelectItem>
                      <SelectItem value="voice">Voice Calls</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">You're almost ready!</h3>
                  <p className="text-sm text-green-700">
                    Based on your location in {formData.district}, we'll provide personalized crop recommendations and
                    connect you with local markets.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                {t("back")}
              </Button>

              {currentStep < STEPS.length ? (
                <Button onClick={handleNext} disabled={!isStepValid()} className="bg-green-600 hover:bg-green-700">
                  {t("next")}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete Setup
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
