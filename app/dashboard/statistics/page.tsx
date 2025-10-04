"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts'
import { format } from 'date-fns'
import { productOptions, getPriceDistribution, getPriceTrendData } from "@/lib/marketData"

export default function StatisticsPage() {
  const [selectedProduct, setSelectedProduct] = useState(productOptions[0].value)

  const priceTrendData = useMemo(() => 
    getPriceTrendData(selectedProduct),
    [selectedProduct]
  )

  const priceDistribution = useMemo(
    () => getPriceDistribution(selectedProduct),
    [selectedProduct]
  )

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-RW', { 
      style: 'currency', 
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg text-sm">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-gray-600">
            <span className="font-medium">Price:</span> {formatCurrency(payload[0].value)}
          </p>
          {payload[0].payload.change && (
            <p className={`${payload[0].payload.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {payload[0].payload.change >= 0 ? '↑' : '↓'} 
              {Math.abs(payload[0].payload.change)}% from previous year
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const BarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg text-sm">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-gray-600">
            <span className="font-medium">Price Range:</span> {label}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Count:</span> {payload[0].value} year{payload[0].value !== 1 ? 's' : ''}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Market Statistics</h1>
            <p className="text-sm text-gray-500 mt-1">Analyze price trends and distributions for agricultural products</p>
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {productOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Price Trend (Last 5 Years)</CardTitle>
            <p className="text-sm text-gray-500">Annual average price changes for {selectedProduct}</p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={priceTrendData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="year"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(Number(value))}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    name="Price"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Price Distribution</CardTitle>
            <p className="text-sm text-gray-500">Price range distribution over the last 5 years</p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priceDistribution}
                  margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                  barCategoryGap={10}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="range"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    height={50}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    width={20}
                  />
                  <Tooltip content={<BarTooltip />} />
                  <Bar 
                    dataKey="count"
                    name="Years in range"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  >
                    {priceDistribution.map((entry, index) => (
                      <Label
                        key={`label-${index}`}
                        value={entry.count}
                        position="top"
                        className="text-xs fill-gray-500"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}
