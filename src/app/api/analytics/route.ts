import { NextRequest, NextResponse } from 'next/server'

interface AnalyticsEvent {
  event: string
  properties: Record<string, unknown>
  timestamp: string
}

interface SessionData {
  sessionId: string
  events: AnalyticsEvent[]
  startTime: string
  lastActivity: string
  deviceInfo: Record<string, unknown>
  engagementScore: number
}

// In-memory storage for demo purposes
// In production, this would use a proper database
const sessions = new Map<string, SessionData>()
const events: AnalyticsEvent[] = []

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { sessionId, event, properties } = data

    if (!sessionId || !event) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionId,
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    }

    // Store the event
    events.push(analyticsEvent)

    // Update session data
    let session = sessions.get(sessionId)
    if (!session) {
      session = {
        sessionId,
        events: [],
        startTime: analyticsEvent.timestamp,
        lastActivity: analyticsEvent.timestamp,
        deviceInfo: properties.deviceInfo || {},
        engagementScore: 0
      }
      sessions.set(sessionId, session)
    }

    session.events.push(analyticsEvent)
    session.lastActivity = analyticsEvent.timestamp
    session.engagementScore = calculateEngagementScore(session)

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', {
        event,
        sessionId,
        engagementScore: session.engagementScore
      })
    }

    return NextResponse.json({
      success: true,
      engagementScore: session.engagementScore
    })

  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action')
  const sessionId = searchParams.get('sessionId')

  try {
    switch (action) {
      case 'session':
        if (!sessionId) {
          return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
        }
        
        const session = sessions.get(sessionId)
        if (!session) {
          return NextResponse.json({ error: 'Session not found' }, { status: 404 })
        }

        return NextResponse.json(session)

      case 'stats':
        const stats = generateAnalyticsStats()
        return NextResponse.json(stats)

      case 'heatmap':
        const heatmapData = generateHeatmapData()
        return NextResponse.json(heatmapData)

      case 'engagement':
        const engagementData = generateEngagementData()
        return NextResponse.json(engagementData)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateEngagementScore(session: SessionData): number {
  const { events, startTime } = session
  
  // Calculate session duration in minutes
  const duration = (new Date().getTime() - new Date(startTime).getTime()) / (1000 * 60)
  
  // Count different types of interactions
  const interactions = events.filter(e => 
    ['click', 'hover', 'scroll'].includes(e.event.split('_')[1])
  ).length
  
  // Count unique sections visited
  const sectionsVisited = new Set(
    events
      .filter(e => typeof e.properties.element === 'string' && e.properties.element.includes('section'))
      .map(e => typeof e.properties.element === 'string' ? e.properties.element.replace('-section', '') : '')
  ).size

  // Calculate scroll depth (mock calculation)
  const scrollEvents = events.filter(e => e.event === 'user_interaction' && e.properties.eventType === 'scroll')
  const maxScrollDepth = scrollEvents.length > 0 ? Math.min(scrollEvents.length * 10, 100) : 0

  // Scoring algorithm
  const timeScore = Math.min(duration / 5, 1) * 25 // Max 25 points for 5+ minutes
  const sectionScore = Math.min(sectionsVisited / 6, 1) * 25 // Max 25 points for all sections
  const interactionScore = Math.min(interactions / 20, 1) * 25 // Max 25 points for 20+ interactions
  const scrollScore = Math.min(maxScrollDepth / 100, 1) * 25 // Max 25 points for 100% scroll

  return Math.round(timeScore + sectionScore + interactionScore + scrollScore)
}

function generateAnalyticsStats() {
  const totalSessions = sessions.size
  const totalEvents = events.length
  const avgEngagement = Array.from(sessions.values())
    .reduce((sum, session) => sum + session.engagementScore, 0) / totalSessions || 0

  const deviceBreakdown = Array.from(sessions.values()).reduce((acc, session) => {
    const deviceType = session.deviceInfo.isMobile ? 'mobile' : 
                      session.deviceInfo.isTablet ? 'tablet' : 'desktop'
    acc[deviceType] = (acc[deviceType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topEvents = events.reduce((acc, event) => {
    acc[event.event] = (acc[event.event] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalSessions,
    totalEvents,
    avgEngagement: Math.round(avgEngagement),
    deviceBreakdown,
    topEvents: Object.entries(topEvents)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .reduce((acc, [event, count]) => ({ ...acc, [event]: count }), {}),
    engagementDistribution: {
      high: Array.from(sessions.values()).filter(s => s.engagementScore >= 70).length,
      medium: Array.from(sessions.values()).filter(s => s.engagementScore >= 40 && s.engagementScore < 70).length,
      low: Array.from(sessions.values()).filter(s => s.engagementScore < 40).length
    }
  }
}

function generateHeatmapData() {
  // Mock heatmap data based on interaction events
  const elementInteractions = events.reduce((acc, event) => {
    if (typeof event.properties.element === 'string') {
      acc[event.properties.element] = (acc[event.properties.element] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  return {
    elements: Object.entries(elementInteractions)
      .map(([element, count]) => ({
        element,
        interactions: count,
        heatLevel: Math.min(count / 10, 1) // Normalize to 0-1
      }))
      .sort((a, b) => b.interactions - a.interactions)
  }
}

function generateEngagementData() {
  const sessionsArray = Array.from(sessions.values())
  
  return {
    totalSessions: sessionsArray.length,
    
    averageSessionDuration: sessionsArray.reduce((sum, s) => {
      const duration = (new Date(s.lastActivity).getTime() - new Date(s.startTime).getTime()) / (1000 * 60)
      return sum + duration
    }, 0) / sessionsArray.length || 0,
    
    avgEngagement: Math.round(sessionsArray.reduce((sum, s) => sum + s.engagementScore, 0) / sessionsArray.length || 0),
    
    bounceRate: sessionsArray.filter(s => s.events.length <= 2).length / sessionsArray.length || 0,
    
    engagementDistribution: {
      high: sessionsArray.filter(s => s.engagementScore >= 70).length,
      medium: sessionsArray.filter(s => s.engagementScore >= 40 && s.engagementScore < 70).length,
      low: sessionsArray.filter(s => s.engagementScore < 40).length
    },
    
    engagementBySection: {
      hero: sessionsArray.filter(s => s.events.some(e => typeof e.properties.element === 'string' && e.properties.element.includes('hero'))).length,
      projects: sessionsArray.filter(s => s.events.some(e => typeof e.properties.element === 'string' && e.properties.element.includes('project'))).length,
      skills: sessionsArray.filter(s => s.events.some(e => typeof e.properties.element === 'string' && e.properties.element.includes('skills'))).length,
      contact: sessionsArray.filter(s => s.events.some(e => typeof e.properties.element === 'string' && e.properties.element.includes('contact'))).length
    },
    
    conversionFunnel: {
      visited: sessionsArray.length,
      engaged: sessionsArray.filter(s => s.engagementScore > 40).length,
      highlyEngaged: sessionsArray.filter(s => s.engagementScore > 70).length,
      contacted: events.filter(e => e.event === 'contact_form_submit').length
    },
    
    topEngagementSources: {
      direct: Math.floor(sessionsArray.length * 0.4),
      search: Math.floor(sessionsArray.length * 0.3),
      social: Math.floor(sessionsArray.length * 0.2),
      referral: Math.floor(sessionsArray.length * 0.1)
    }
  }
}