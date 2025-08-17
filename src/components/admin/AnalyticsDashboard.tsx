'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import RealTimeAnalyticsDashboard from './RealTimeAnalyticsDashboard'
import { ABTestManager } from './ABTestManager'

interface AnalyticsData {
  visitors: {
    total: number
    unique: number
    returning: number
  }
  pageViews: {
    total: number
    pages: Array<{ page: string; views: number }>
  }
  engagement: {
    averageSessionDuration: number
    bounceRate: number
    topSections: Array<{ section: string; timeSpent: number }>
  }
  traffic: Array<{
    date: string
    visitors: number
    pageViews: number
  }>
  devices: Array<{
    type: string
    count: number
  }>
  contactInquiries: {
    total: number
    byType: Array<{ type: string; count: number }>
  }
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [activeTab, setActiveTab] = useState<'overview' | 'realtime' | 'abtests'>('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    )
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } rounded-l-md border-r border-gray-300`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('realtime')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'realtime'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-r border-gray-300`}
            >
              Real-Time
            </button>
            <button
              onClick={() => setActiveTab('abtests')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'abtests'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } rounded-r-md`}
            >
              A/B Tests
            </button>
          </div>
          {activeTab === 'overview' && (
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          )}
        </div>
      </div>

      {activeTab === 'realtime' && <RealTimeAnalyticsDashboard />}
      {activeTab === 'abtests' && <ABTestManager />}
      {activeTab === 'overview' && (
        <div className="space-y-6">

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Total Visitors</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics.visitors.total.toLocaleString()}</p>
          <p className="text-sm text-gray-600">
            {analytics.visitors.unique} unique, {analytics.visitors.returning} returning
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Page Views</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics.pageViews.total.toLocaleString()}</p>
          <p className="text-sm text-gray-600">
            {(analytics.pageViews.total / analytics.visitors.total).toFixed(1)} per visitor
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Avg. Session Duration</h3>
          <p className="text-3xl font-bold text-gray-900">
            {Math.floor(analytics.engagement.averageSessionDuration / 60)}m {analytics.engagement.averageSessionDuration % 60}s
          </p>
          <p className="text-sm text-gray-600">
            {analytics.engagement.bounceRate}% bounce rate
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Contact Inquiries</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics.contactInquiries.total}</p>
          <p className="text-sm text-gray-600">
            {((analytics.contactInquiries.total / analytics.visitors.total) * 100).toFixed(1)}% conversion
          </p>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Traffic Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.traffic}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="visitors" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="pageViews" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.pageViews.pages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="page" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device Types */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Device Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.devices}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percent }) => `${type} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.devices.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section Engagement */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Section Engagement</h3>
        <div className="space-y-4">
          {analytics.engagement.topSections.map((section, index) => (
            <div key={section.section} className="flex items-center justify-between">
              <span className="font-medium">{section.section}</span>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${(section.timeSpent / Math.max(...analytics.engagement.topSections.map(s => s.timeSpent))) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-16 text-right">
                  {Math.floor(section.timeSpent / 60)}m {section.timeSpent % 60}s
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Inquiries Breakdown */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Contact Inquiries by Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {analytics.contactInquiries.byType.map((item) => (
            <div key={item.type} className="text-center">
              <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              <p className="text-sm text-gray-600 capitalize">{item.type}</p>
            </div>
          ))}
        </div>
      </div>
        </div>
      )}
    </div>
  )
}