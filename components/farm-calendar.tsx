"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Calendar as CalendarIcon, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface Activity {
  id: string
  title: string
  type: "watering" | "fertilizing" | "harvesting" | "planting" | "pruning" | "pest_control"
  dueDate: Date
  priority: "high" | "medium" | "low"
  status: "pending" | "in_progress" | "completed"
  description?: string
  crop?: string
}

interface FarmCalendarProps {
  activities?: Activity[]
  onActivityUpdate?: (activities: Activity[]) => void
}

export function FarmCalendar({ activities: initialActivities, onActivityUpdate }: FarmCalendarProps) {
  const { t } = useTranslation()
  const [activities, setActivities] = useState<Activity[]>(initialActivities || [])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    type: "watering" as Activity["type"],
    dueDate: "",
    priority: "medium" as Activity["priority"],
    description: "",
    crop: ""
  })

  useEffect(() => {
    if (initialActivities) {
      setActivities(initialActivities)
    }
  }, [initialActivities])

  useEffect(() => {
    onActivityUpdate?.(activities)
  }, [activities, onActivityUpdate])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek }
  }

  const getActivitiesForDate = (date: Date) => {
    return activities.filter(activity => {
      const activityDate = new Date(activity.dueDate)
      return activityDate.toDateString() === date.toDateString()
    })
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

  const handleCreateActivity = () => {
    if (!formData.title || !formData.dueDate) return

    const newActivity: Activity = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      dueDate: new Date(formData.dueDate),
      priority: formData.priority,
      status: "pending",
      description: formData.description,
      crop: formData.crop
    }

    setActivities(prev => [...prev, newActivity])
    resetForm()
    setIsDialogOpen(false)
  }

  const handleUpdateActivity = () => {
    if (!editingActivity || !formData.title || !formData.dueDate) return

    const updatedActivity: Activity = {
      ...editingActivity,
      title: formData.title,
      type: formData.type,
      dueDate: new Date(formData.dueDate),
      priority: formData.priority,
      description: formData.description,
      crop: formData.crop
    }

    setActivities(prev => prev.map(activity => 
      activity.id === editingActivity.id ? updatedActivity : activity
    ))
    resetForm()
    setIsDialogOpen(false)
    setEditingActivity(null)
  }

  const handleDeleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id))
  }

  const handleCompleteActivity = (id: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, status: "completed" as Activity["status"] } : activity
    ))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      type: "watering",
      dueDate: "",
      priority: "medium",
      description: "",
      crop: ""
    })
    setEditingActivity(null)
  }

  const openEditDialog = (activity: Activity) => {
    setEditingActivity(activity)
    setFormData({
      title: activity.title,
      type: activity.type,
      dueDate: activity.dueDate.toISOString().split('T')[0],
      priority: activity.priority,
      description: activity.description || "",
      crop: activity.crop || ""
    })
    setIsDialogOpen(true)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const monthNames = [
    t("January"), t("February"), t("March"), t("April"), t("May"), t("June"),
    t("July"), t("August"), t("September"), t("October"), t("November"), t("December")
  ]
  const dayNames = [t("Sun"), t("Mon"), t("Tue"), t("Wed"), t("Thu"), t("Fri"), t("Sat")]

  const renderCalendarDays = () => {
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayActivities = getActivitiesForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()
      const isSelected = selectedDate?.toDateString() === date.toDateString()
      
      days.push(
        <div
          key={day}
          className={`h-24 p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
            isToday ? 'bg-green-50 border-green-300' : ''
          } ${isSelected ? 'bg-blue-50 border-blue-300' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${isToday ? 'text-green-600' : ''}`}>
              {day}
            </span>
            {dayActivities.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {dayActivities.length}
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            {dayActivities.slice(0, 2).map(activity => (
              <div
                key={activity.id}
                className={`text-xs p-1 rounded truncate ${getActivityStatusColor(activity.status)}`}
                title={activity.title}
              >
                {activity.title}
              </div>
            ))}
            {dayActivities.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayActivities.length - 2} {t("more")}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    return days
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("Calendar")}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold min-w-[200px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="p-3 text-center font-medium text-gray-600 border-b border-gray-200">
                {day}
              </div>
            ))}
            {/* Calendar days */}
            {renderCalendarDays()}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Activities */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {selectedDate.toLocaleDateString()} - {getActivitiesForDate(selectedDate).length} {t("activities")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getActivitiesForDate(selectedDate).length === 0 ? (
              <p className="text-muted-foreground">{t("No activities scheduled")}</p>
            ) : (
              <div className="space-y-3">
                {getActivitiesForDate(selectedDate).map(activity => (
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
                        {t(activity.type)} • {activity.crop && t(activity.crop)}
                      </p>
                      {activity.description && (
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {activity.status !== "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompleteActivity(activity.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(activity)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteActivity(activity.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Activity Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            {t("Add Activity")}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingActivity ? t("Edit Activity") : t("Create Activity")}
            </DialogTitle>
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
              <Select value={formData.type} onValueChange={(value: Activity["type"]) => 
                setFormData(prev => ({ ...prev, type: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="watering">{t("watering")}</SelectItem>
                  <SelectItem value="fertilizing">{t("fertilizing")}</SelectItem>
                  <SelectItem value="harvesting">{t("harvesting")}</SelectItem>
                  <SelectItem value="planting">{t("planting")}</SelectItem>
                  <SelectItem value="pruning">{t("pruning")}</SelectItem>
                  <SelectItem value="pest_control">{t("pest_control")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="crop">{t("Crop")}</Label>
              <Input
                id="crop"
                value={formData.crop}
                onChange={(e) => setFormData(prev => ({ ...prev, crop: e.target.value }))}
                placeholder={t("Enter crop name")}
              />
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
              <Select value={formData.priority} onValueChange={(value: Activity["priority"]) => 
                setFormData(prev => ({ ...prev, priority: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">{t("high")}</SelectItem>
                  <SelectItem value="medium">{t("medium")}</SelectItem>
                  <SelectItem value="low">{t("low")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">{t("Description")}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t("Enter activity description")}
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false)
                resetForm()
              }}>
                {t("cancel")}
              </Button>
              <Button 
                onClick={editingActivity ? handleUpdateActivity : handleCreateActivity}
                className="bg-green-600 hover:bg-green-700"
              >
                {editingActivity ? t("Update Activity") : t("Create Activity")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
