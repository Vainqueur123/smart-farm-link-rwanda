"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sprout, Plus } from "@/lib/lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function FarmPage() {
  const { t } = useTranslation()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-green-600" />
            <h1 className="text-2xl font-bold">{t("My Farm")}</h1>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            {t("Add Crop")}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("Your crops")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t("You have no crops added yet. Click 'Add Crop' to get started.")}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
