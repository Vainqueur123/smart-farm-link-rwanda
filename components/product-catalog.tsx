"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Package, 
  Search, 
  Plus, 
  CheckCircle, 
  Star,
  Filter,
  Info
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface ProductTemplate {
  id: string
  name: string
  category: string
  unit: string
  attributes: ProductAttribute[]
  qualityGrades: QualityGrade[]
  description: string
  imageUrl?: string
  isPopular: boolean
}

interface ProductAttribute {
  name: string
  type: "text" | "number" | "select" | "boolean"
  required: boolean
  options?: string[]
  unit?: string
  description?: string
}

interface QualityGrade {
  grade: string
  description: string
  priceMultiplier: number
  requirements: string[]
}

interface ProductCatalogProps {
  onSelectTemplate?: (template: ProductTemplate) => void
  selectedCrop?: string
}

export function ProductCatalog({ onSelectTemplate, selectedCrop }: ProductCatalogProps) {
  const { t } = useTranslation()
  const [templates, setTemplates] = useState<ProductTemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<ProductTemplate[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplates()
  }, [])

  useEffect(() => {
    filterTemplates()
  }, [templates, searchQuery, selectedCategory, activeTab, selectedCrop])

  const loadTemplates = async () => {
    setLoading(true)
    // Mock product templates
    const mockTemplates: ProductTemplate[] = [
      {
        id: "maize_premium",
        name: "Maize (Premium)",
        category: "cereals",
        unit: "kg",
        attributes: [
          { name: "moisture_content", type: "number", required: true, unit: "%", description: "Moisture content percentage" },
          { name: "color", type: "select", required: true, options: ["yellow", "white", "mixed"], description: "Grain color" },
          { name: "size", type: "select", required: true, options: ["large", "medium", "small"], description: "Grain size" },
          { name: "organic", type: "boolean", required: false, description: "Certified organic" },
          { name: "storage_method", type: "select", required: true, options: ["silo", "bags", "granary"], description: "Storage method" }
        ],
        qualityGrades: [
          { grade: "A", description: "Premium quality", priceMultiplier: 1.2, requirements: ["moisture < 14%", "large grain", "no damage"] },
          { grade: "B", description: "Good quality", priceMultiplier: 1.0, requirements: ["moisture < 16%", "medium grain", "minimal damage"] },
          { grade: "C", description: "Standard quality", priceMultiplier: 0.8, requirements: ["moisture < 18%", "any size", "some damage"] }
        ],
        description: "High-quality maize with standardized attributes for consistent pricing",
        isPopular: true
      },
      {
        id: "irish_potato_standard",
        name: "Irish Potato (Standard)",
        category: "tubers",
        unit: "kg",
        attributes: [
          { name: "variety", type: "select", required: true, options: ["Kinigi", "Rutuku", "Sangema", "Other"], description: "Potato variety" },
          { name: "size", type: "select", required: true, options: ["large", "medium", "small"], description: "Tuber size" },
          { name: "damage_percentage", type: "number", required: true, unit: "%", description: "Percentage of damaged tubers" },
          { name: "storage_duration", type: "number", required: true, unit: "days", description: "Days in storage" },
          { name: "organic", type: "boolean", required: false, description: "Certified organic" }
        ],
        qualityGrades: [
          { grade: "Export", description: "Export quality", priceMultiplier: 1.3, requirements: ["damage < 5%", "large size", "fresh"] },
          { grade: "Local Premium", description: "Local premium", priceMultiplier: 1.1, requirements: ["damage < 10%", "medium+ size"] },
          { grade: "Standard", description: "Standard quality", priceMultiplier: 1.0, requirements: ["damage < 20%", "any size"] }
        ],
        description: "Standardized Irish potato listing with quality grades",
        isPopular: true
      },
      {
        id: "coffee_arabica",
        name: "Coffee (Arabica)",
        category: "cash_crops",
        unit: "kg",
        attributes: [
          { name: "processing_method", type: "select", required: true, options: ["washed", "natural", "honey"], description: "Coffee processing method" },
          { name: "grade", type: "select", required: true, options: ["AA", "A", "B", "C"], description: "Coffee grade" },
          { name: "moisture_content", type: "number", required: true, unit: "%", description: "Moisture content" },
          { name: "defect_count", type: "number", required: true, description: "Number of defects per 300g" },
          { name: "altitude", type: "number", required: true, unit: "m", description: "Growing altitude" },
          { name: "organic", type: "boolean", required: false, description: "Certified organic" }
        ],
        qualityGrades: [
          { grade: "Specialty", description: "Specialty coffee", priceMultiplier: 1.5, requirements: ["AA grade", "defects < 5", "altitude > 1500m"] },
          { grade: "Premium", description: "Premium quality", priceMultiplier: 1.2, requirements: ["A grade", "defects < 10", "altitude > 1200m"] },
          { grade: "Standard", description: "Standard quality", priceMultiplier: 1.0, requirements: ["B+ grade", "defects < 20"] }
        ],
        description: "Arabica coffee with detailed quality specifications",
        isPopular: true
      },
      {
        id: "beans_standard",
        name: "Beans (Standard)",
        category: "legumes",
        unit: "kg",
        attributes: [
          { name: "variety", type: "select", required: true, options: ["Red Kidney", "White Navy", "Black", "Mixed"], description: "Bean variety" },
          { name: "size", type: "select", required: true, options: ["large", "medium", "small"], description: "Bean size" },
          { name: "damage_percentage", type: "number", required: true, unit: "%", description: "Percentage of damaged beans" },
          { name: "moisture_content", type: "number", required: true, unit: "%", description: "Moisture content" },
          { name: "organic", type: "boolean", required: false, description: "Certified organic" }
        ],
        qualityGrades: [
          { grade: "Premium", description: "Premium quality", priceMultiplier: 1.2, requirements: ["damage < 5%", "moisture < 14%", "large size"] },
          { grade: "Standard", description: "Standard quality", priceMultiplier: 1.0, requirements: ["damage < 10%", "moisture < 16%"] },
          { grade: "Basic", description: "Basic quality", priceMultiplier: 0.8, requirements: ["damage < 20%", "moisture < 18%"] }
        ],
        description: "Standardized bean listing with quality specifications",
        isPopular: false
      }
    ]
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    setTemplates(mockTemplates)
    setLoading(false)
  }

  const filterTemplates = () => {
    let filtered = templates

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.attributes.some(attr => attr.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    // Tab filter
    if (activeTab === "popular") {
      filtered = filtered.filter(template => template.isPopular)
    }

    // Selected crop filter
    if (selectedCrop) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(selectedCrop.toLowerCase())
      )
    }

    setFilteredTemplates(filtered)
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "cereals":
        return t("Cereals")
      case "tubers":
        return t("Tubers")
      case "cash_crops":
        return t("Cash Crops")
      case "legumes":
        return t("Legumes")
      default:
        return category
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t("Product Catalog")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {t("Product Catalog")}
          <Badge variant="secondary">{filteredTemplates.length} {t("templates")}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("Search product templates...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder={t("All Categories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All Categories")}</SelectItem>
              <SelectItem value="cereals">{t("Cereals")}</SelectItem>
              <SelectItem value="tubers">{t("Tubers")}</SelectItem>
              <SelectItem value="cash_crops">{t("Cash Crops")}</SelectItem>
              <SelectItem value="legumes">{t("Legumes")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">{t("All")}</TabsTrigger>
            <TabsTrigger value="popular">{t("Popular")}</TabsTrigger>
            <TabsTrigger value="custom">{t("Custom")}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("No templates found")}</p>
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div>
                            <h3 className="font-semibold">{template.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{getCategoryLabel(template.category)}</Badge>
                              <span>•</span>
                              <span>{template.unit}</span>
                              {template.isPopular && (
                                <>
                                  <span>•</span>
                                  <Badge className="bg-yellow-100 text-yellow-800">
                                    <Star className="h-3 w-3 mr-1" />
                                    {t("Popular")}
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Info className="h-4 w-4 text-muted-foreground" />
                            <span>{template.attributes.length} {t("attributes")}</span>
                            <span className="text-muted-foreground">•</span>
                            <span>{template.qualityGrades.length} {t("quality grades")}</span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {template.attributes.slice(0, 3).map((attr) => (
                              <Badge key={attr.name} variant="secondary" className="text-xs">
                                {attr.name.replace(/_/g, " ")}
                              </Badge>
                            ))}
                            {template.attributes.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.attributes.length - 3} {t("more")}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => onSelectTemplate?.(template)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          {t("Use Template")}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Info className="h-4 w-4 mr-1" />
                          {t("Details")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

