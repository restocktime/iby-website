'use client'

import { useState, useEffect, useCallback } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Funnel, FunnelChart } from 'recharts'
import { HeatmapData, ConversionFunnel, RealTimeVisitor, AnalyticsInsight } from '@/types/analytics'

interface RealTimeMetrics {
  activeVisitors: number
  pageViews: number
  conversions: number
  bounceRate: number
  avgSessionDuration: number
  topPages: Array<{ page: string; visitors: number }>
  deviceBreakdown: Array<{ device: string; count: number }>
  trafficSources: Array<{ source: string; visitors: number }>
}

export function RealTimeAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null)
  const [visitors, setVisitors] = useState<RealTimeVisitor[]>([])
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([])
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel[]>([])
  const [insights, setInsights] = useState<AnalyticsInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h')

  const fetchRealTimeData = useCallback(async () => {
    try {
      const [metricsRes, visitorsRes, heatmapRes, funnelRes, insightsRes] = await Promise.all([
        fetch('/api/analytics/real-time/metrics'),
        fetch('/api/analytics/real-time/visitors'),
        fetch('/api/analytics/heatmap'),
        fetch('/api/analytics/conversion-funnel'),
        fetch('/api/analytics/insights')
      ])

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setMetrics(metricsData)
      }

      if (visitorsRes.ok) {
        const visitorsData = await visitorsRes.json()
        setVisitors(visitorsData)
      }

      if (heatmapRes.ok) {
        const heatmapResponse = await heatmapRes.json()
        setHeatmapData(heatmapResponse.heatmapData || [])
      }

      if (funnelRes.ok) {
        const funnelResponse = await funnelRes.json()
        setConversionFunnel(funnelResponse.funnel || [])
      }

      if (insightsRes.ok) {
        const insightsData = await insightsRes.json()
        setInsights(insightsData)
      }

    } catch (error) {
      console.error('Failed to fetch real-time analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRealTimeData()
    
    // Update every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000)
    
    return () => clearInterval(interval)
  }, [fetchRealTimeData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load real-time analytics</p>
      </div>
    )
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-Time Analytics</h2>
          <p className="text-sm text-gray-500">Live data updates every 30 seconds</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Active Visitors</h3>
          <p className="text-2xl font-bold text-green-600">{metrics.activeVisitors}</p>
          <p className="text-xs text-gray-600">Right now</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Page Views</h3>
          <p className="text-2xl font-bold text-blue-600">{metrics.pageViews}</p>
          <p className="text-xs text-gray-600">Last hour</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Conversions</h3>
          <p className="text-2xl font-bold text-purple-600">{metrics.conversions}</p>
          <p className="text-xs text-gray-600">
            {((metrics.conversions / metrics.pageViews) * 100).toFixed(1)}% rate
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Bounce Rate</h3>
          <p className="text-2xl font-bold text-orange-600">{metrics.bounceRate}%</p>
          <p className="text-xs text-gray-600">Single page visits</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Avg. Session</h3>
          <p className="text-2xl font-bold text-indigo-600">
            {Math.floor(metrics.avgSessionDuration / 60)}m {metrics.avgSessionDuration % 60}s
          </p>
          <p className="text-xs text-gray-600">Duration</p>
        </div>
      </div>

      {/* Active Visitors Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Active Visitors</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {visitors.map((visitor, index) => (
              <div key={visitor.sessionId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">{visitor.currentPage}</p>
                    <p className="text-xs text-gray-500">
                      {visitor.deviceType} • {visitor.timeOnPage}s on page
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Score: {visitor.engagementScore}</p>
                  <p className="text-xs text-gray-500">
                    {visitor.isReturning ? 'Returning' : 'New'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={metrics.trafficSources}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ source, percent }) => `${source} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="visitors"
              >
                {metrics.trafficSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap Data */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Page Interaction Heatmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {heatmapData.slice(0, 6).map((item, index) => (
            <div key={item.element} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{item.element.replace('-', ' ').toUpperCase()}</h4>
                <div 
                  className="w-4 h-4 rounded"
                  style={{ 
                    backgroundColor: `rgba(239, 68, 68, ${item.heatLevel})`,
                    border: '1px solid #e5e7eb'
                  }}
                ></div>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <p>Interactions: {item.interactions}</p>
                <p>Avg. Time: {item.avgTimeSpent.toFixed(1)}s</p>
                <p>Conversion: {(item.conversionRate * 100).toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Real-Time Conversion Funnel</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={conversionFunnel} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="step" type="category" width={150} />
            <Tooltip 
              formatter={(value, name) => [
                `${value} ${name === 'conversions' ? 'conversions' : 'visitors'}`,
                name === 'conversions' ? 'Conversions' : 'Visitors'
              ]}
            />
            <Bar dataKey="visitors" fill="#e5e7eb" />
            <Bar dataKey="conversions" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Analytics Insights */}
      {insights.length > 0 && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Real-Time Insights</h3>
          <div className="space-y-3">
            {insights.slice(0, 5).map((insight, index) => (
              <div 
                key={insight.id} 
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'success' ? 'border-green-500 bg-green-50' :
                  insight.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  insight.type === 'opportunity' ? 'border-blue-500 bg-blue-50' :
                  'border-gray-500 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <p className="text-xs text-gray-500 mt-2">{insight.recommendation}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold">{insight.value}</p>
                    <p className={`text-xs ${insight.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {insight.change > 0 ? '+' : ''}{insight.change}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Pages */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Top Pages (Real-Time)</h3>
        <div className="space-y-2">
          {metrics.topPages.map((page, index) => (
            <div key={page.page} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                <span className="text-sm font-medium">{page.page}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${(page.visitors / Math.max(...metrics.topPages.map(p => p.visitors))) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{page.visitors}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}