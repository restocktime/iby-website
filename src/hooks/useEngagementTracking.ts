'use client'

import { useState, useEffect, useCallback } from 'react'
import { InteractionEvent, UserSession, DeviceCapabilities } from '@/types'

interface EngagementMetrics {
  sessionDuration: number
  sectionsVisited: Set<string>
  interactionCount: number
  scrollDepth: number
  engagementScore: number
  lastActivity: Date
}

export function useEngagementTracking() {
  const [session, setSession] = useState<UserSession | null>(null)
  const [metrics, setMetrics] = useState<EngagementMetrics>({
    sessionDuration: 0,
    sectionsVisited: new Set(),
    interactionCount: 0,
    scrollDepth: 0,
    engagementScore: 0,
    lastActivity: new Date()
  })

  // Initialize session
  useEffect(() => {
    // Only initialize on client side to avoid hydration mismatch
    if (typeof window === 'undefined') return

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const deviceInfo = getDeviceCapabilities()
    
    const newSession: UserSession = {
      sessionId,
      visitDuration: 0,
      sectionsVisited: [],
      interactionEvents: [],
      deviceInfo,
      engagementScore: 0
    }

    setSession(newSession)
    
    // Track session start
    trackAnalyticsEvent('session_start', {
      sessionId,
      deviceType: deviceInfo.isMobile ? 'mobile' : deviceInfo.isTablet ? 'tablet' : 'desktop',
      timestamp: new Date().toISOString()
    })

    return () => {
      // Track session end
      if (newSession) {
        trackAnalyticsEvent('session_end', {
          sessionId: newSession.sessionId,
          duration: metrics.sessionDuration,
          engagementScore: metrics.engagementScore,
          sectionsVisited: Array.from(metrics.sectionsVisited),
          timestamp: new Date().toISOString()
        })
      }
    }
  }, [])

  // Update session duration
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        sessionDuration: prev.sessionDuration + 1
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Calculate engagement score
  useEffect(() => {
    const calculateEngagementScore = () => {
      const {
        sessionDuration,
        sectionsVisited,
        interactionCount,
        scrollDepth
      } = metrics

      // Base score components
      const timeScore = Math.min(sessionDuration / 300, 1) * 25 // Max 25 points for 5+ minutes
      const sectionScore = Math.min(sectionsVisited.size / 6, 1) * 25 // Max 25 points for visiting all sections
      const interactionScore = Math.min(interactionCount / 20, 1) * 25 // Max 25 points for 20+ interactions
      const scrollScore = Math.min(scrollDepth / 100, 1) * 25 // Max 25 points for 100% scroll

      const totalScore = timeScore + sectionScore + interactionScore + scrollScore

      setMetrics(prev => ({
        ...prev,
        engagementScore: Math.round(totalScore)
      }))

      // Update session
      if (session) {
        setSession(prev => prev ? {
          ...prev,
          visitDuration: sessionDuration,
          sectionsVisited: Array.from(sectionsVisited),
          engagementScore: Math.round(totalScore)
        } : null)
      }
    }

    calculateEngagementScore()
  }, [metrics.sessionDuration, metrics.sectionsVisited.size, metrics.interactionCount, metrics.scrollDepth, session])

  const trackInteraction = useCallback((event: Omit<InteractionEvent, 'coordinates'>) => {
    const fullEvent: InteractionEvent = {
      ...event,
      coordinates: event.eventType === 'click' || event.eventType === 'hover' 
        ? { x: 0, y: 0 } // Would be populated with actual mouse coordinates in real implementation
        : undefined
    }

    setMetrics(prev => ({
      ...prev,
      interactionCount: prev.interactionCount + 1,
      lastActivity: new Date()
    }))

    if (session) {
      setSession(prev => prev ? {
        ...prev,
        interactionEvents: [...prev.interactionEvents, fullEvent]
      } : null)
    }

    // Track specific section visits
    if (event.element.includes('section')) {
      const sectionName = event.element.replace('-section', '')
      setMetrics(prev => ({
        ...prev,
        sectionsVisited: new Set([...prev.sectionsVisited, sectionName])
      }))
    }

    // Track analytics event
    trackAnalyticsEvent('user_interaction', {
      sessionId: session?.sessionId,
      eventType: event.eventType,
      element: event.element,
      timestamp: event.timestamp.toISOString()
    })
  }, [session])

  const trackScrollDepth = useCallback((depth: number) => {
    setMetrics(prev => ({
      ...prev,
      scrollDepth: Math.max(prev.scrollDepth, depth)
    }))
  }, [])

  const getEngagementScore = useCallback(() => {
    return metrics.engagementScore
  }, [metrics.engagementScore])

  const getEngagementLevel = useCallback(() => {
    const score = metrics.engagementScore
    if (score >= 80) return 'high'
    if (score >= 50) return 'medium'
    if (score >= 20) return 'low'
    return 'minimal'
  }, [metrics.engagementScore])

  const isHighEngagementUser = useCallback(() => {
    return metrics.engagementScore >= 70
  }, [metrics.engagementScore])

  return {
    session,
    metrics,
    trackInteraction,
    trackScrollDepth,
    getEngagementScore,
    getEngagementLevel,
    isHighEngagementUser
  }
}

function getDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      supportsWebGL: false,
      supportsTouch: false,
      screenWidth: 1920,
      screenHeight: 1080,
      pixelRatio: 1
    }
  }

  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(userAgent)
  const isTablet = /tablet|ipad/.test(userAgent)
  const isDesktop = !isMobile && !isTablet

  // Test WebGL support
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  const supportsWebGL = !!gl

  return {
    isMobile,
    isTablet,
    isDesktop,
    supportsWebGL,
    supportsTouch: 'ontouchstart' in window,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1
  }
}

function trackAnalyticsEvent(eventName: string, properties: Record<string, unknown>) {
  // Send to analytics API
  fetch('/api/analytics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId: properties.sessionId,
      event: eventName,
      properties
    })
  }).catch(error => {
    console.warn('Failed to send analytics event:', error)
  })

  // Also log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties)
  }
  
  // Store in localStorage for persistence
  try {
    const existingEvents = JSON.parse(localStorage.getItem('engagement_events') || '[]')
    existingEvents.push({
      event: eventName,
      properties,
      timestamp: new Date().toISOString()
    })
    
    // Keep only last 100 events
    if (existingEvents.length > 100) {
      existingEvents.splice(0, existingEvents.length - 100)
    }
    
    localStorage.setItem('engagement_events', JSON.stringify(existingEvents))
  } catch (error) {
    console.warn('Failed to store analytics event:', error)
  }
}