import { NextRequest, NextResponse } from 'next/server'
import { RealTimeVisitor } from '@/types/analytics'

export async function GET(request: NextRequest) {
  try {
    // Generate mock real-time visitor data
    const visitors: RealTimeVisitor[] = []
    const pages = ['/', '/projects', '/contact', '/skills', '/about']
    const devices = ['Desktop', 'Mobile', 'Tablet']
    const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'Australia']
    const cities = ['New York', 'Toronto', 'London', 'Berlin', 'Sydney']

    const visitorCount = Math.floor(Math.random() * 25) + 5

    for (let i = 0; i < visitorCount; i++) {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const deviceType = devices[Math.floor(Math.random() * devices.length)]
      const currentPage = pages[Math.floor(Math.random() * pages.length)]
      const country = countries[Math.floor(Math.random() * countries.length)]
      const city = cities[Math.floor(Math.random() * cities.length)]
      
      visitors.push({
        sessionId,
        currentPage,
        timeOnPage: Math.floor(Math.random() * 300) + 30, // 30 seconds to 5 minutes
        engagementScore: Math.floor(Math.random() * 100),
        deviceType,
        location: { country, city },
        referrer: Math.random() > 0.5 ? 'https://google.com' : undefined,
        isReturning: Math.random() > 0.7
      })
    }

    // Sort by engagement score (highest first)
    visitors.sort((a, b) => b.engagementScore - a.engagementScore)

    return NextResponse.json({
      visitors,
      totalActive: visitors.length,
      summary: {
        newVisitors: visitors.filter(v => !v.isReturning).length,
        returningVisitors: visitors.filter(v => v.isReturning).length,
        avgEngagement: Math.round(visitors.reduce((sum, v) => sum + v.engagementScore, 0) / visitors.length),
        topPage: pages.reduce((top, page) => {
          const pageVisitors = visitors.filter(v => v.currentPage === page).length
          const topPageVisitors = visitors.filter(v => v.currentPage === top).length
          return pageVisitors > topPageVisitors ? page : top
        }, pages[0])
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Real-time visitors fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}