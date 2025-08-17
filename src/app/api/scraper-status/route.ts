import { NextRequest, NextResponse } from 'next/server'

export interface ScraperStatus {
  id: string
  name: string
  type: 'google-search' | 'google-maps' | 'google-shopping' | 'website-monitor'
  status: 'active' | 'paused' | 'error' | 'maintenance'
  lastRun: string
  successRate: number
  totalRuns: number
  averageResponseTime: number
  dataPointsCollected: number
  errorCount: number
  nextScheduledRun?: string
}

export interface MonitoringMetrics {
  totalScrapers: number
  activeScrapers: number
  totalDataPoints: number
  averageSuccessRate: number
  totalWebsitesMonitored: number
  alertsSentToday: number
  systemUptime: number
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // 'scrapers' | 'monitors' | 'all'
  
  try {
    if (type === 'scrapers') {
      const scraperData = await getScraperStatus()
      return NextResponse.json(scraperData)
    } else if (type === 'monitors') {
      const monitorData = await getMonitoringStatus()
      return NextResponse.json(monitorData)
    } else {
      // Return all data
      const [scraperData, monitorData] = await Promise.all([
        getScraperStatus(),
        getMonitoringStatus()
      ])
      
      return NextResponse.json({
        scrapers: scraperData,
        monitoring: monitorData,
        lastUpdated: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Error fetching scraper/monitor status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch status data' },
      { status: 500 }
    )
  }
}

async function getScraperStatus(): Promise<{ scrapers: ScraperStatus[], metrics: MonitoringMetrics }> {
  try {
    // In production, this would fetch from actual scraper management system
    // For now, return realistic mock data that updates dynamically
    
    const now = new Date()
    const scrapers: ScraperStatus[] = [
      {
        id: 'google-search-main',
        name: 'Google Search Results Scraper',
        type: 'google-search',
        status: 'active',
        lastRun: new Date(now.getTime() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        successRate: 94.2,
        totalRuns: 15847,
        averageResponseTime: 2.3,
        dataPointsCollected: 2847592,
        errorCount: 23,
        nextScheduledRun: new Date(now.getTime() + 10 * 60 * 1000).toISOString()
      },
      {
        id: 'google-maps-business',
        name: 'Google Maps Business Scraper',
        type: 'google-maps',
        status: 'active',
        lastRun: new Date(now.getTime() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
        successRate: 97.8,
        totalRuns: 8934,
        averageResponseTime: 3.1,
        dataPointsCollected: 1245789,
        errorCount: 12,
        nextScheduledRun: new Date(now.getTime() + 15 * 60 * 1000).toISOString()
      },
      {
        id: 'google-shopping-prices',
        name: 'Google Shopping Price Monitor',
        type: 'google-shopping',
        status: 'active',
        lastRun: new Date(now.getTime() - 1 * 60 * 1000).toISOString(), // 1 minute ago
        successRate: 91.5,
        totalRuns: 12456,
        averageResponseTime: 1.8,
        dataPointsCollected: 3456789,
        errorCount: 45,
        nextScheduledRun: new Date(now.getTime() + 5 * 60 * 1000).toISOString()
      },
      {
        id: 'competitor-monitor',
        name: 'Competitor Website Monitor',
        type: 'website-monitor',
        status: 'active',
        lastRun: new Date(now.getTime() - 30 * 1000).toISOString(), // 30 seconds ago
        successRate: 99.1,
        totalRuns: 45678,
        averageResponseTime: 0.9,
        dataPointsCollected: 987654,
        errorCount: 8,
        nextScheduledRun: new Date(now.getTime() + 2 * 60 * 1000).toISOString()
      },
      {
        id: 'price-tracking-bot',
        name: 'E-commerce Price Tracker',
        type: 'website-monitor',
        status: 'paused',
        lastRun: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        successRate: 88.7,
        totalRuns: 23456,
        averageResponseTime: 2.7,
        dataPointsCollected: 1876543,
        errorCount: 67
      }
    ]
    
    const metrics: MonitoringMetrics = {
      totalScrapers: scrapers.length,
      activeScrapers: scrapers.filter(s => s.status === 'active').length,
      totalDataPoints: scrapers.reduce((sum, s) => sum + s.dataPointsCollected, 0),
      averageSuccessRate: scrapers.reduce((sum, s) => sum + s.successRate, 0) / scrapers.length,
      totalWebsitesMonitored: 247,
      alertsSentToday: 12,
      systemUptime: 99.8
    }
    
    return { scrapers, metrics }
  } catch (error) {
    console.error('Error getting scraper status:', error)
    throw error
  }
}

async function getMonitoringStatus() {
  try {
    // Mock monitoring data - in production this would come from actual monitoring system
    const now = new Date()
    
    return {
      websites: [
        {
          id: 'client-site-1',
          url: 'https://example-client.com',
          status: 'online',
          responseTime: 245,
          uptime: 99.9,
          lastCheck: new Date(now.getTime() - 30 * 1000).toISOString(),
          ssl: { valid: true, expiresIn: 89 },
          alerts: []
        },
        {
          id: 'client-site-2',
          url: 'https://another-client.com',
          status: 'online',
          responseTime: 189,
          uptime: 99.7,
          lastCheck: new Date(now.getTime() - 45 * 1000).toISOString(),
          ssl: { valid: true, expiresIn: 156 },
          alerts: []
        },
        {
          id: 'client-site-3',
          url: 'https://slow-client.com',
          status: 'slow',
          responseTime: 3200,
          uptime: 98.2,
          lastCheck: new Date(now.getTime() - 60 * 1000).toISOString(),
          ssl: { valid: true, expiresIn: 23 },
          alerts: [
            {
              type: 'performance',
              message: 'Response time above threshold',
              timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString()
            }
          ]
        }
      ],
      summary: {
        totalSites: 247,
        onlineSites: 244,
        slowSites: 2,
        offlineSites: 1,
        averageResponseTime: 892,
        totalAlerts: 3,
        alertsToday: 12
      }
    }
  } catch (error) {
    console.error('Error getting monitoring status:', error)
    throw error
  }
}