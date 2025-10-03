"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface Activity {
  id: string
  title: string
  type: "watering" | "fertilizing" | "harvesting"
  dueDate: Date
  priority: "high" | "medium" | "low"
  status: "pending" | "in_progress" | "completed"
}

interface SimpleCalendarProps {
  activities?: Activity[]
}

export function SimpleCalendar({ activities: initialActivities }: SimpleCalendarProps) {
  const { t } = useTranslation()
  const [activities, setActivities] = useState<Activity[]>(initialActivities || [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    type: "watering" as Activity["type"],
    dueDate: "",
    priority: "medium" as Activity["priority"]
  })

  const handleCreateActivity = () => {
    if (!formData.title || !formData.dueDate) return

    const newActivity: Activity = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      dueDate: new Date(formData.dueDate),
      priority: formData.priority,
      status: "pending"
    }

    setActivities(prev => [...prev, newActivity])
    setFormData({
      title: "",
      type: "watering",
      dueDate: "",
      priority: "medium"
    })
    setIsDialogOpen(false)
  }

  const getActivityStatusColor = (status: Activity["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getPriorityColor = (priority: Activity["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("Calendar")}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              {t("Add Activity")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("Create Activity")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t("Activity Title")}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t("Enter activity title")}
                />
              </div>
              
              <div>
                <Label htmlFor="type">{t("Activity Type")}</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Activity["type"] }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="watering">{t("watering")}</option>
                  <option value="fertilizing">{t("fertilizing")}</option>
                  <option value="harvesting">{t("harvesting")}</option>
                </select>
              </div>

              <div>
                <Label htmlFor="dueDate">{t("Due Date")}</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="priority">{t("Priority Level")}</Label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Activity["priority"] }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="high">{t("high")}</option>
                  <option value="medium">{t("medium")}</option>
                  <option value="low">{t("low")}</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button 
                  onClick={handleCreateActivity}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {t("Create Activity")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("Upcoming Activities")}</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-muted-foreground">{t("No activities scheduled")}</p>
          ) : (
            <div className="space-y-3">
              {activities.map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <Badge className={getPriorityColor(activity.priority)}>
                        {t(activity.priority)}
                      </Badge>
                      <Badge className={getActivityStatusColor(activity.status)}>
                        {t(activity.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t(activity.type)} • {activity.dueDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
