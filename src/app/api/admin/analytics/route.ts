import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock analytics data - in production this would come from a real analytics service
const generateMockAnalytics = (range: string) => {
  const days = range === '1d' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 90
  
  // Generate traffic data
  const traffic = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    traffic.push({
      date: date.toISOString().split('T')[0],
      visitors: Math.floor(Math.random() * 100) + 50,
      pageViews: Math.floor(Math.random() * 300) + 150
    })
  }

  const totalVisitors = traffic.reduce((sum, day) => sum + day.visitors, 0)
  const totalPageViews = traffic.reduce((sum, day) => sum + day.pageViews, 0)

  return {
    visitors: {
      total: totalVisitors,
      unique: Math.floor(totalVisitors * 0.7),
      returning: Math.floor(totalVisitors * 0.3)
    },
    pageViews: {
      total: totalPageViews,
      pages: [
        { page: 'Home', views: Math.floor(totalPageViews * 0.4) },
        { page: 'Projects', views: Math.floor(totalPageViews * 0.25) },
        { page: 'Skills', views: Math.floor(totalPageViews * 0.2) },
        { page: 'Contact', views: Math.floor(totalPageViews * 0.15) }
      ]
    },
    engagement: {
      averageSessionDuration: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
      bounceRate: Math.floor(Math.random() * 30) + 25, // 25-55%
      topSections: [
        { section: 'Hero Section', timeSpent: Math.floor(Math.random() * 60) + 30 },
        { section: 'Project Showcase', timeSpent: Math.floor(Math.random() * 120) + 60 },
        { section: 'Skills Visualization', timeSpent: Math.floor(Math.random() * 90) + 45 },
        { section: 'Contact Form', timeSpent: Math.floor(Math.random() * 45) + 20 },
        { section: 'About Section', timeSpent: Math.floor(Math.random() * 75) + 35 }
      ]
    },
    traffic,
    devices: [
      { type: 'Desktop', count: Math.floor(totalVisitors * 0.6) },
      { type: 'Mobile', count: Math.floor(totalVisitors * 0.35) },
      { type: 'Tablet', count: Math.floor(totalVisitors * 0.05) }
    ],
    contactInquiries: {
      total: Math.floor(totalVisitors * 0.05), // 5% conversion rate
      byType: [
        { type: 'email', count: Math.floor(totalVisitors * 0.02) },
        { type: 'whatsapp', count: Math.floor(totalVisitors * 0.015) },
        { type: 'discord', count: Math.floor(totalVisitors * 0.01) },
        { type: 'form', count: Math.floor(totalVisitors * 0.005) }
      ]
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'

    const analytics = generateMockAnalytics(range)

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}