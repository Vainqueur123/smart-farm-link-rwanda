"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi, WifiOff, Send as Sync, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { offlineService, type SyncStatus } from "@/lib/offline-service"
import { useTranslation } from "@/lib/i18n"

export function OfflineIndicator() {
  const { t } = useTranslation()
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    lastSync: Date.now(),
    pendingItems: 0,
    syncInProgress: false,
  })

  useEffect(() => {
    const updateStatus = () => {
      setSyncStatus(offlineService.getSyncStatus())
    }

    // Update status every 5 seconds
    const interval = setInterval(updateStatus, 5000)
    updateStatus()

    return () => clearInterval(interval)
  }, [])

  const handleManualSync = async () => {
    await offlineService.syncPendingData()
    setSyncStatus(offlineService.getSyncStatus())
  }

  if (syncStatus.isOnline && syncStatus.pendingItems === 0) {
    return (
      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
        <Wifi className="h-3 w-3 mr-1" />
        {t("Online")}
      </Badge>
    )
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {syncStatus.isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm font-medium">{syncStatus.isOnline ? t("Online") : t("Offline Mode")}</span>
          </div>

          {syncStatus.pendingItems > 0 && (
            <Badge variant="secondary">
              {syncStatus.pendingItems} {t("pending")}
            </Badge>
          )}
        </div>

        {!syncStatus.isOnline && (
          <div className="bg-orange-100 p-2 rounded text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-800">{t("Working Offline")}</p>
                <p className="text-orange-700">{t("Your data will sync automatically when connection is restored")}</p>
              </div>
            </div>
          </div>
        )}

        {syncStatus.pendingItems > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {syncStatus.pendingItems} {t("items waiting to sync")}
              </span>
            </div>

            {syncStatus.isOnline && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualSync}
                disabled={syncStatus.syncInProgress}
                className="w-full bg-transparent"
              >
                {syncStatus.syncInProgress ? (
                  <>
                    <Sync className="h-3 w-3 mr-2 animate-spin" />
                    {t("Syncing...")}
                  </>
                ) : (
                  <>
                    <Sync className="h-3 w-3 mr-2" />
                    {t("Sync Now")}
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {syncStatus.isOnline && syncStatus.pendingItems === 0 && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-3 w-3" />
            <span>{t("All data synced")}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
