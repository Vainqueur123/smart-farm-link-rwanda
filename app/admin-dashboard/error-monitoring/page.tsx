"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  AlertTriangle, 
  Activity, 
  Download, 
  RefreshCw, 
  Filter,
  Search,
  Clock,
  User,
  MapPin,
  Monitor,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AdminOnly } from "@/components/role-guard"
import { useTranslation } from "@/lib/i18n"
import { errorMonitoring } from "@/lib/error-monitoring"
import { format, formatDistanceToNow } from "date-fns"

export default function ErrorMonitoringPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("overview")
  const [errorStats, setErrorStats] = useState(errorMonitoring.getErrorStats())
  const [performanceStats, setPerformanceStats] = useState(errorMonitoring.getPerformanceStats())
  const [errors, setErrors] = useState(errorMonitoring.getErrors())
  const [performanceLogs, setPerformanceLogs] = useState(errorMonitoring.getPerformanceLogs())
  const [filter, setFilter] = useState({
    level: "all" as "all" | "error" | "warning" | "info",
    page: "all",
    user: "all",
    startDate: "",
    endDate: ""
  })

  useEffect(() => {
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      setErrorStats(errorMonitoring.getErrorStats())
      setPerformanceStats(errorMonitoring.getPerformanceStats())
      setErrors(errorMonitoring.getErrors())
      setPerformanceLogs(errorMonitoring.getPerformanceLogs())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const refreshData = () => {
    setErrorStats(errorMonitoring.getErrorStats())
    setPerformanceStats(errorMonitoring.getPerformanceStats())
    setErrors(errorMonitoring.getErrors())
    setPerformanceLogs(errorMonitoring.getPerformanceLogs())
  }

  const exportLogs = () => {
    const logs = errorMonitoring.exportLogs()
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `error-logs-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearLogs = () => {
    if (confirm("Are you sure you want to clear all logs? This action cannot be undone.")) {
      errorMonitoring.clearLogs()
      refreshData()
    }
  }

  const filteredErrors = errors.filter(error => {
    if (filter.level !== "all" && error.level !== filter.level) return false
    if (filter.page !== "all" && error.page !== filter.page) return false
    if (filter.user !== "all" && error.userId !== filter.user) return false
    if (filter.startDate && new Date(error.timestamp) < new Date(filter.startDate)) return false
    if (filter.endDate && new Date(error.timestamp) > new Date(filter.endDate)) return false
    return true
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "bg-red-100 text-red-800"
      case "warning": return "bg-yellow-100 text-yellow-800"
      case "info": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error": return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "info": return <Activity className="h-4 w-4 text-blue-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <AdminOnly>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Error Monitoring</h1>
              <p className="text-gray-600">Monitor application errors and performance metrics</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={exportLogs}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={clearLogs} className="text-red-600 hover:text-red-700">
                Clear Logs
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Errors</p>
                    <p className="text-2xl font-bold text-red-600">{errorStats.total}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Last 24h</p>
                    <p className="text-2xl font-bold text-orange-600">{errorStats.last24h}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Load Time</p>
                    <p className="text-2xl font-bold text-blue-600">{performanceStats.averageLoadTime.toFixed(0)}ms</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Render Time</p>
                    <p className="text-2xl font-bold text-green-600">{performanceStats.averageRenderTime.toFixed(0)}ms</p>
                  </div>
                  <Monitor className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Error Levels */}
                <Card>
                  <CardHeader>
                    <CardTitle>Error Levels</CardTitle>
                    <CardDescription>Distribution of errors by severity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(errorStats.byLevel).map(([level, count]) => (
                        <div key={level} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getLevelIcon(level)}
                            <span className="capitalize">{level}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{count}</span>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  level === "error" ? "bg-red-500" :
                                  level === "warning" ? "bg-yellow-500" : "bg-blue-500"
                                }`}
                                style={{ width: `${(count / errorStats.total) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Error Pages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Error Pages</CardTitle>
                    <CardDescription>Pages with most errors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(errorStats.byPage)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([page, count]) => (
                        <div key={page} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">{page}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Errors */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Errors</CardTitle>
                  <CardDescription>Latest error occurrences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {errors.slice(0, 5).map((error) => (
                      <div key={error.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          {getLevelIcon(error.level)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {error.message}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">{error.page}</span>
                            {error.userId && (
                              <span className="text-xs text-gray-500">User: {error.userId}</span>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(error.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        <Badge className={getLevelColor(error.level)}>
                          {error.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Errors Tab */}
            <TabsContent value="errors" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="text-sm font-medium">Level</label>
                      <Select value={filter.level} onValueChange={(value) => setFilter({...filter, level: value as any})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="error">Errors</SelectItem>
                          <SelectItem value="warning">Warnings</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Page</label>
                      <Select value={filter.page} onValueChange={(value) => setFilter({...filter, page: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Pages</SelectItem>
                          {Object.keys(errorStats.byPage).map(page => (
                            <SelectItem key={page} value={page}>{page}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input
                        type="date"
                        value={filter.startDate}
                        onChange={(e) => setFilter({...filter, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <Input
                        type="date"
                        value={filter.endDate}
                        onChange={(e) => setFilter({...filter, endDate: e.target.value})}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        variant="outline" 
                        onClick={() => setFilter({level: "all", page: "all", user: "all", startDate: "", endDate: ""})}
                        className="w-full"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Error List */}
              <Card>
                <CardHeader>
                  <CardTitle>Error Logs ({filteredErrors.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredErrors.map((error) => (
                      <div key={error.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getLevelIcon(error.level)}
                            <Badge className={getLevelColor(error.level)}>
                              {error.level}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {format(error.timestamp, "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900 mb-2">{error.message}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Page:</span> {error.page}
                          </div>
                          {error.userId && (
                            <div>
                              <span className="font-medium">User:</span> {error.userId}
                            </div>
                          )}
                          {error.action && (
                            <div>
                              <span className="font-medium">Action:</span> {error.action}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">URL:</span> {error.url}
                          </div>
                        </div>
                        {error.stack && (
                          <details className="mt-3">
                            <summary className="cursor-pointer text-sm font-medium text-gray-700">
                              Stack Trace
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                              {error.stack}
                            </pre>
                          </details>
                        )}
                        {error.metadata && Object.keys(error.metadata).length > 0 && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm font-medium text-gray-700">
                              Metadata
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                              {JSON.stringify(error.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                    {filteredErrors.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No errors found matching the current filters.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Logs</span>
                        <span className="font-medium">{performanceStats.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last 24h</span>
                        <span className="font-medium">{performanceStats.last24h}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Load Time</span>
                        <span className="font-medium">{performanceStats.averageLoadTime.toFixed(0)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Render Time</span>
                        <span className="font-medium">{performanceStats.averageRenderTime.toFixed(0)}ms</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance by Page */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance by Page</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(performanceStats.byPage)
                        .sort(([,a], [,b]) => b.avgLoadTime - a.avgLoadTime)
                        .slice(0, 5)
                        .map(([page, stats]) => (
                        <div key={page} className="p-3 bg-gray-50 rounded">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">{page}</span>
                            <span className="text-sm text-gray-500">{stats.count} requests</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Load:</span> {stats.avgLoadTime.toFixed(0)}ms
                            </div>
                            <div>
                              <span className="text-gray-600">Render:</span> {stats.avgRenderTime.toFixed(0)}ms
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Logs */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Performance Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceLogs.slice(0, 10).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{log.page}</p>
                          <p className="text-sm text-gray-600">
                            {format(log.timestamp, "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{log.loadTime.toFixed(0)}ms</p>
                          <p className="text-sm text-gray-600">load time</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{log.renderTime.toFixed(0)}ms</p>
                          <p className="text-sm text-gray-600">render time</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Error Trends</CardTitle>
                    <CardDescription>Error patterns over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      Error trend charts would be implemented here
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                    <CardDescription>Performance metrics over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      Performance trend charts would be implemented here
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AdminOnly>
  )
}
