import { NextRequest, NextResponse } from 'next/server'
import { AdvancedAnalyticsEvent } from '@/types/analytics'

// In-memory storage for demo purposes
// In production, this would use a proper database
const events: AdvancedAnalyticsEvent[] = []
const sessions = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const { events: incomingEvents } = await request.json()

    if (!Array.isArray(incomingEvents)) {
      return NextResponse.json(
        { error: 'Events must be an array' },
        { status: 400 }
      )
    }

    // Process and store events
    for (const eventData of incomingEvents) {
      const event: AdvancedAnalyticsEvent = {
        ...eventData,
        timestamp: new Date(eventData.timestamp),
        ip: request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown'
      }

      events.push(event)

      // Update session data
      let session = sessions.get(event.sessionId)
      if (!session) {
        session = {
          sessionId: event.sessionId,
          userId: event.userId,
          startTime: event.timestamp,
          lastActivity: event.timestamp,
          events: [],
          pageViews: new Set(),
          interactions: 0,
          conversions: 0,
          deviceInfo: {
            userAgent: event.userAgent,
            viewport: event.viewport
          }
        }
        sessions.set(event.sessionId, session)
      }

      session.events.push(event)
      session.lastActivity = event.timestamp
      session.pageViews.add(event.page)

      // Count interactions and conversions
      if (['click', 'hover', 'scroll'].some(type => event.event.includes(type))) {
        session.interactions++
      }

      if (event.event === 'conversion' || event.event.includes('conversion')) {
        session.conversions++
      }
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Processed ${incomingEvents.length} analytics events`)
    }

    return NextResponse.json({
      success: true,
      processed: incomingEvents.length
    })

  } catch (error) {
    console.error('Analytics events processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionId = searchParams.get('sessionId')
  const eventType = searchParams.get('eventType')
  const page = searchParams.get('page')
  const limit = parseInt(searchParams.get('limit') || '100')

  try {
    let filteredEvents = [...events]

    // Apply filters
    if (sessionId) {
      filteredEvents = filteredEvents.filter(e => e.sessionId === sessionId)
    }

    if (eventType) {
      filteredEvents = filteredEvents.filter(e => e.event === eventType)
    }

    if (page) {
      filteredEvents = filteredEvents.filter(e => e.page === page)
    }

    // Sort by timestamp (newest first) and limit
    filteredEvents = filteredEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)

    return NextResponse.json({
      events: filteredEvents,
      total: filteredEvents.length,
      totalStored: events.length
    })

  } catch (error) {
    console.error('Analytics events fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}