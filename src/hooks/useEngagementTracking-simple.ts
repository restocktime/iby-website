'use client'

import { useState, useEffect, useCallback } from 'react'

interface EngagementMetrics {
  sessionDuration: number
  sectionsVisited: Set<string>
  interactionCount: number
  scrollDepth: number
  engagementScore: number
  lastActivity: Date
}

export function useEngagementTracking() {
  const [metrics, setMetrics] = useState<EngagementMetrics>({
    sessionDuration: 0,
    sectionsVisited: new Set(),
    interactionCount: 0,
    scrollDepth: 0,
    engagementScore: 0,
    lastActivity: new Date()
  })

  // Simple session duration counter
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        sessionDuration: prev.sessionDuration + 1
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const trackInteraction = useCallback((event: any) => {
    setMetrics(prev => ({
      ...prev,
      interactionCount: prev.interactionCount + 1,
      lastActivity: new Date()
    }))
  }, [])

  const trackScrollDepth = useCallback((depth: number) => {
    setMetrics(prev => ({
      ...prev,
      scrollDepth: Math.max(prev.scrollDepth, depth)
    }))
  }, [])

  const getEngagementScore = useCallback(() => {
    return Math.min(metrics.sessionDuration + metrics.interactionCount * 5, 100)
  }, [metrics.sessionDuration, metrics.interactionCount])

  const getEngagementLevel = useCallback(() => {
    const score = getEngagementScore()
    if (score >= 80) return 'high'
    if (score >= 50) return 'medium'
    if (score >= 20) return 'low'
    return 'minimal'
  }, [getEngagementScore])

  const isHighEngagementUser = useCallback(() => {
    return getEngagementScore() >= 70
  }, [getEngagementScore])

  return {
    session: null,
    metrics,
    trackInteraction,
    trackScrollDepth,
    getEngagementScore,
    getEngagementLevel,
    isHighEngagementUser
  }
}