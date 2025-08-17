import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Generate mock real-time metrics
    const now = new Date()
    const baseMetrics = {
      activeVisitors: Math.floor(Math.random() * 50) + 10,
      pageViews: Math.floor(Math.random() * 200) + 50,
      conversions: Math.floor(Math.random() * 15) + 2,
      bounceRate: Math.floor(Math.random() * 30) + 25,
      avgSessionDuration: Math.floor(Math.random() * 180) + 120
    }

    const topPages = [
      { page: '/', visitors: Math.floor(Math.random() * 30) + 20 },
      { page: '/projects', visitors: Math.floor(Math.random() * 20) + 10 },
      { page: '/contact', visitors: Math.floor(Math.random() * 15) + 8 },
      { page: '/skills', visitors: Math.floor(Math.random() * 12) + 5 },
      { page: '/about', visitors: Math.floor(Math.random() * 10) + 3 }
    ].sort((a, b) => b.visitors - a.visitors)

    const deviceBreakdown = [
      { device: 'Desktop', count: Math.floor(baseMetrics.activeVisitors * 0.6) },
      { device: 'Mobile', count: Math.floor(baseMetrics.activeVisitors * 0.3) },
      { device: 'Tablet', count: Math.floor(baseMetrics.activeVisitors * 0.1) }
    ]

    const trafficSources = [
      { source: 'Direct', visitors: Math.floor(baseMetrics.activeVisitors * 0.4) },
      { source: 'Search', visitors: Math.floor(baseMetrics.activeVisitors * 0.3) },
      { source: 'Social', visitors: Math.floor(baseMetrics.activeVisitors * 0.2) },
      { source: 'Referral', visitors: Math.floor(baseMetrics.activeVisitors * 0.1) }
    ]

    return NextResponse.json({
      ...baseMetrics,
      topPages,
      deviceBreakdown,
      trafficSources,
      timestamp: now.toISOString(),
      lastUpdated: now.toISOString()
    })

  } catch (error) {
    console.error('Real-time metrics fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}