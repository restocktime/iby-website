'use client'

import React, { useState } from 'react'
import { useScraperStatus } from '@/hooks/useLiveMetrics'
import CRMShowcase from './CRMShowcase'
import AnalyticsShowcase from './AnalyticsShowcase'
import NotificationDemo from './NotificationDemo'

interface ScraperStatusProps {
  className?: string
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'maintenance': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

interface ScraperData {
  id: string
  name: string
  status: string
  lastRun: string
  successRate: number
  averageResponseTime: number
  totalRuns: number
  dataPointsCollected: number
  nextScheduledRun?: string
}

const ScraperCard: React.FC<{ scraper: ScraperData }> = ({ scraper }) => {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-white truncate">{scraper.name}</h4>
        <StatusBadge status={scraper.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-gray-400">Success Rate</div>
          <div className="text-white font-medium">{scraper.successRate}%</div>
        </div>
        <div>
          <div className="text-gray-400">Avg Response</div>
          <div className="text-white font-medium">{scraper.averageResponseTime}s</div>
        </div>
        <div>
          <div className="text-gray-400">Total Runs</div>
          <div className="text-white font-medium">{scraper.totalRuns.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-400">Data Points</div>
          <div className="text-white font-medium">{scraper.dataPointsCollected.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700/50">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Last run: {formatTime(scraper.lastRun)}</span>
          {scraper.nextScheduledRun && (
            <span>Next: {formatTime(scraper.nextScheduledRun)}</span>
          )}
        </div>
      </div>
    </div>
  )
}

interface MetricsSummaryData {
  activeScrapers: number
  totalScrapers: number
  averageSuccessRate: number
  totalDataPoints: number
  systemUptime: number
}

interface ScrapersData {
  scrapers: ScraperData[]
  metrics: MetricsSummaryData
}

interface MonitoringSummary {
  onlineSites: number
  totalSites: number
  averageResponseTime: number
  alertsToday: number
}

interface WebsiteData {
  id: string
  url: string
  status: string
  responseTime: number
  uptime: number
  alerts: Array<{ message: string }>
}

interface MonitoringData {
  summary: MonitoringSummary
  websites: WebsiteData[]
}

interface DashboardData {
  scrapers?: ScrapersData
  monitoring?: MonitoringData
}

const MetricsSummary: React.FC<{ metrics: MetricsSummaryData }> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
        <div className="text-2xl font-bold text-white">{metrics.activeScrapers}</div>
        <div className="text-sm text-gray-400">Active Scrapers</div>
        <div className="text-xs text-green-400">of {metrics.totalScrapers} total</div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
        <div className="text-2xl font-bold text-white">{metrics.averageSuccessRate.toFixed(1)}%</div>
        <div className="text-sm text-gray-400">Success Rate</div>
        <div className="text-xs text-green-400">↗ +2.3% this week</div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
        <div className="text-2xl font-bold text-white">{(metrics.totalDataPoints / 1000000).toFixed(1)}M</div>
        <div className="text-sm text-gray-400">Data Points</div>
        <div className="text-xs text-blue-400">Collected today</div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
        <div className="text-2xl font-bold text-white">{metrics.systemUptime}%</div>
        <div className="text-sm text-gray-400">System Uptime</div>
        <div className="text-xs text-green-400">Last 30 days</div>
      </div>
    </div>
  )
}

const ScraperDashboard: React.FC<ScraperStatusProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'scrapers' | 'monitoring' | 'notifications' | 'crm' | 'analytics'>('scrapers')
  const { data, isLoading, error, lastUpdated } = useScraperStatus('all')

  // Type guard to ensure data has the expected structure
  const dashboardData = data as DashboardData | null
  const hasScrapersData = dashboardData?.scrapers
  const hasMonitoringData = dashboardData?.monitoring

  if (isLoading && !data) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800/30 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-400 mb-2">Failed to load scraper status</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Scraping & Monitoring Dashboard</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Live Status</span>
          </div>
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 mb-6 bg-gray-800/30 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('scrapers')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'scrapers'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Google Scrapers
        </button>
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'monitoring'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Website Monitoring
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'notifications'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Live Notifications
        </button>
        <button
          onClick={() => setActiveTab('crm')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'crm'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Custom CRM
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Analytics Implementation
        </button>
      </div>

      {activeTab === 'scrapers' && hasScrapersData && (
        <div>
          <MetricsSummary metrics={hasScrapersData.metrics} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hasScrapersData.scrapers.map((scraper: ScraperData) => (
              <ScraperCard key={scraper.id} scraper={scraper} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'monitoring' && hasMonitoringData && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <div className="text-2xl font-bold text-white">{hasMonitoringData.summary.onlineSites}</div>
              <div className="text-sm text-gray-400">Sites Online</div>
              <div className="text-xs text-green-400">of {hasMonitoringData.summary.totalSites} total</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <div className="text-2xl font-bold text-white">{hasMonitoringData.summary.averageResponseTime}ms</div>
              <div className="text-sm text-gray-400">Avg Response</div>
              <div className="text-xs text-green-400">↗ 15% faster</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <div className="text-2xl font-bold text-white">{hasMonitoringData.summary.alertsToday}</div>
              <div className="text-sm text-gray-400">Alerts Today</div>
              <div className="text-xs text-yellow-400">3 resolved</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <div className="text-2xl font-bold text-white">99.8%</div>
              <div className="text-sm text-gray-400">Uptime</div>
              <div className="text-xs text-green-400">Last 30 days</div>
            </div>
          </div>

          <div className="space-y-4">
            {hasMonitoringData.websites.slice(0, 5).map((website: WebsiteData) => (
              <div key={website.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{website.url}</div>
                    <div className="text-sm text-gray-400">
                      Response: {website.responseTime}ms | Uptime: {website.uptime}%
                    </div>
                  </div>
                  <StatusBadge status={website.status} />
                </div>
                
                {website.alerts.length > 0 && (
                  <div className="mt-3 p-2 bg-yellow-900/20 rounded border border-yellow-700/50">
                    <div className="text-sm text-yellow-200">
                      {website.alerts[0].message}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <NotificationDemo />
      )}

      {activeTab === 'crm' && (
        <CRMShowcase />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsShowcase />
      )}
    </div>
  )
}

export default ScraperDashboard