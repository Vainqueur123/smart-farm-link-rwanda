"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, Globe, Smartphone, Wifi, Volume2, Shield, Download, Trash2, RefreshCw } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { offlineService } from "@/lib/offline-service"
import { voiceService } from "@/lib/voice-service"

export default function SettingsPage() {
  const { user, farmerProfile } = useAuth()
  const { t, currentLanguage, setLanguage } = useTranslation()
  const [settings, setSettings] = useState({
    notifications: {
      marketAlerts: true,
      paymentUpdates: true,
      weatherUpdates: true,
      farmingTips: false,
      smsBackup: true,
    },
    voice: {
      enabled: true,
      language: currentLanguage,
      autoSpeak: false,
      voiceCommands: true,
    },
    offline: {
      autoSync: true,
      cacheImages: true,
      offlineMode: true,
      syncFrequency: 30, // minutes
    },
    privacy: {
      shareLocation: true,
      publicProfile: false,
      dataCollection: true,
    },
  })
  const [cacheSize, setCacheSize] = useState("0 MB")
  const [offlineItems, setOfflineItems] = useState(0)

  useEffect(() => {
    loadCacheInfo()
  }, [])

  const loadCacheInfo = async () => {
    // Mock cache size calculation
    setCacheSize("12.5 MB")

    const pendingData = await offlineService.getPendingData()
    setOfflineItems(pendingData.length)
  }

  const handleSettingChange = (category: string, setting: string, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }))
  }

  const clearCache = async () => {
    // In real implementation, this would clear IndexedDB cache
    console.log("[v0] Clearing offline cache")
    setCacheSize("0 MB")
  }

  const forceSync = async () => {
    await offlineService.syncPendingData()
    await loadCacheInfo()
  }

  const testVoice = async () => {
    await voiceService.speak(
      currentLanguage === "en" ? "Voice assistant is working correctly" : "Ubufasha bw'ijwi bukora neza",
      { language: currentLanguage === "en" ? "en-US" : "rw-RW" },
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">{t("Settings")}</h1>
          <p className="text-muted-foreground text-pretty">{t("Manage your account and app preferences")}</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">{t("Profile")}</TabsTrigger>
            <TabsTrigger value="notifications">{t("Notifications")}</TabsTrigger>
            <TabsTrigger value="voice">{t("Voice")}</TabsTrigger>
            <TabsTrigger value="offline">{t("Offline")}</TabsTrigger>
            <TabsTrigger value="privacy">{t("Privacy")}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t("Profile Information")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("Phone Number")}</Label>
                    <Input value={farmerProfile?.phone || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("District")}</Label>
                    <Input value={farmerProfile?.district || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("Sector")}</Label>
                    <Input value={farmerProfile?.sector || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("Farm Size")}</Label>
                    <Input value={`${farmerProfile?.farmSize || 0} hectares`} disabled />
                  </div>
                </div>
                <Button variant="outline">{t("Edit Profile")}</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t("Language Settings")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t("App Language")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("Choose your preferred language for the app interface")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={currentLanguage === "en" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLanguage("en")}
                    >
                      English
                    </Button>
                    <Button
                      variant={currentLanguage === "rw" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLanguage("rw")}
                    >
                      Kinyarwanda
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {t("Notification Preferences")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("Market Price Alerts")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("Get notified when crop prices change in your district")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.marketAlerts}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "marketAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("Payment Updates")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("Receive notifications about payment status changes")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.paymentUpdates}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "paymentUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("Weather Updates")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("Get weather forecasts and farming recommendations")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.weatherUpdates}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "weatherUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("Farming Tips")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("Receive helpful farming tips and best practices")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.farmingTips}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "farmingTips", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("SMS Backup")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("Receive important notifications via SMS when offline")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={settings.notifications.smsBackup}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "smsBackup", checked)}
                      />
                      <Badge variant="secondary">
                        <Smartphone className="h-3 w-3 mr-1" />
                        {t("SMS")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  {t("Voice Assistant Settings")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("Enable Voice Assistant")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("Use voice commands to navigate and control the app")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.voice.enabled}
                      onCheckedChange={(checked) => handleSettingChange("voice", "enabled", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("Voice Commands")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("Respond to voice commands like 'open marketplace'")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.voice.voiceCommands}
                      onCheckedChange={(checked) => handleSettingChange("voice", "voiceCommands", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("Auto-speak Responses")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("Automatically read out important information")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.voice.autoSpeak}
                      onCheckedChange={(checked) => handleSettingChange("voice", "autoSpeak", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>{t("Voice Language")}</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={settings.voice.language === "en" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSettingChange("voice", "language", "en")}
                      >
                        English
                      </Button>
                      <Button
                        variant={settings.voice.language === "rw" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSettingChange("voice", "language", "rw")}
                      >
                        Kinyarwanda
                      </Button>
                    </div>
                  </div>

                  <Button variant="outline" onClick={testVoice}>
                    <Volume2 className="h-4 w-4 mr-2" />
                    {t("Test Voice")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  {t("Offline & Sync Settings")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("Offline Mode")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("Allow the app to work without internet connection")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.offline.offlineMode}
                      onCheckedChange={(checked) => handleSettingChange("offline", "offlineMode", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("Auto Sync")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("Automatically sync data when connection is available")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.offline.autoSync}
                      onCheckedChange={(checked) => handleSettingChange("offline", "autoSync", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("Cache Images")}</p>
                      <p className="text-sm text-muted-foreground">{t("Download images for offline viewing")}</p>
                    </div>
                    <Switch
                      checked={settings.offline.cacheImages}
                      onCheckedChange={(checked) => handleSettingChange("offline", "cacheImages", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t("Storage Used")}</p>
                        <p className="text-sm text-muted-foreground">{t("Offline data and cache")}</p>
                      </div>
                      <Badge variant="outline">{cacheSize}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t("Pending Sync Items")}</p>
                        <p className="text-sm text-muted-foreground">{t("Data waiting to be synced")}</p>
                      </div>
                      <Badge variant={offlineItems > 0 ? "secondary" : "outline"}>
                        {offlineItems} {t("items")}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={forceSync}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {t("Sync Now")}
                      </Button>
                      <Button variant="outline" onClick={clearCache}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("Clear Cache")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t("Privacy & Security")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("Share Location")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("Allow the app to use your location for district-specific features")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.shareLocation}
                      onCheckedChange={(checked) => handleSettingChange("privacy", "shareLocation", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("Public Profile")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("Make your farmer profile visible to other users")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.publicProfile}
                      onCheckedChange={(checked) => handleSettingChange("privacy", "publicProfile", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("Data Collection")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("Allow anonymous usage data collection to improve the app")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.dataCollection}
                      onCheckedChange={(checked) => handleSettingChange("privacy", "dataCollection", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      {t("Download My Data")}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      {t("Download a copy of all your data stored in Smart Farm Link")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
