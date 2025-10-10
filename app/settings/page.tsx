"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { HorizontalDashboardLayout } from "@/components/horizontal-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Smartphone, 
  Mail, 
  MapPin, 
  Save,
  Edit,
  Eye,
  EyeOff
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function SettingsPage() {
  const { user, userProfile, userRole } = useAuth()
  const { t, i18n } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const [profileData, setProfileData] = useState({
    name: userProfile?.name || "",
    email: user?.email || "",
    phone: userProfile?.phone || "",
    district: (userProfile as any)?.district || "",
    language: i18n.language || "rw",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisible: true,
      contactVisible: true,
      locationVisible: false,
    }
  })

  const handleSave = async () => {
    try {
      // In a real app, this would save to Firestore
      console.log("Saving settings...", profileData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state to reflect changes
      if (userProfile) {
        // Update the user profile with new data
        console.log("Settings saved successfully!")
      }
      
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving settings:", error)
    }
  }

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language)
    setProfileData(prev => ({ ...prev, language: language as "rw" | "en" }))
  }

  return (
    <HorizontalDashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t("settings")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("manage_your_account_settings")}</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  {t("cancel")}
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  {t("save")}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                {t("edit")}
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
            <TabsTrigger value="notifications">{t("notifications")}</TabsTrigger>
            <TabsTrigger value="privacy">{t("privacy")}</TabsTrigger>
            <TabsTrigger value="security">{t("security")}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t("profile_information")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t("full_name")}</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t("email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t("phone_number")}</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">{t("district")}</Label>
                    <Input
                      id="district"
                      value={profileData.district}
                      onChange={(e) => setProfileData(prev => ({ ...prev, district: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t("language_preferences")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="language">{t("preferred_language")}</Label>
                  <Select value={profileData.language} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rw">Kinyarwanda</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {t("notification_preferences")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t("email_notifications")}</Label>
                    <p className="text-sm text-gray-500">{t("receive_notifications_via_email")}</p>
                  </div>
                  <Switch
                    checked={profileData.notifications.email}
                    onCheckedChange={(checked) => 
                      setProfileData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t("push_notifications")}</Label>
                    <p className="text-sm text-gray-500">{t("receive_push_notifications")}</p>
                  </div>
                  <Switch
                    checked={profileData.notifications.push}
                    onCheckedChange={(checked) => 
                      setProfileData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t("sms_notifications")}</Label>
                    <p className="text-sm text-gray-500">{t("receive_sms_notifications")}</p>
                  </div>
                  <Switch
                    checked={profileData.notifications.sms}
                    onCheckedChange={(checked) => 
                      setProfileData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, sms: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t("privacy_settings")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t("profile_visibility")}</Label>
                    <p className="text-sm text-gray-500">{t("make_profile_visible_to_other_users")}</p>
                  </div>
                  <Switch
                    checked={profileData.privacy.profileVisible}
                    onCheckedChange={(checked) => 
                      setProfileData(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, profileVisible: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t("contact_visibility")}</Label>
                    <p className="text-sm text-gray-500">{t("show_contact_information")}</p>
                  </div>
                  <Switch
                    checked={profileData.privacy.contactVisible}
                    onCheckedChange={(checked) => 
                      setProfileData(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, contactVisible: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t("location_visibility")}</Label>
                    <p className="text-sm text-gray-500">{t("show_location_information")}</p>
                  </div>
                  <Switch
                    checked={profileData.privacy.locationVisible}
                    onCheckedChange={(checked) => 
                      setProfileData(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, locationVisible: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t("security_settings")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current-password">{t("current_password")}</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-password">{t("new_password")}</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">{t("confirm_password")}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
                <Button className="w-full">
                  {t("update_password")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HorizontalDashboardLayout>
  )
}