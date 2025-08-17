'use client'

import { useEffect, useRef, useCallback } from 'react'
import { getAnalytics } from '@/lib/advancedAnalytics'
import { HeatmapData, Point2D } from '@/types/analytics'

interface HeatmapTrackingOptions {
  trackClicks?: boolean
  trackHovers?: boolean
  trackScrolls?: boolean
  trackMouseMovement?: boolean
  throttleMs?: number
  excludeSelectors?: string[]
}

export function useHeatmapTracking(options: HeatmapTrackingOptions = {}) {
  const {
    trackClicks = true,
    trackHovers = true,
    trackScrolls = true,
    trackMouseMovement = false,
    throttleMs = 100,
    excludeSelectors = []
  } = options

  const analytics = getAnalytics()
  const mousePositions = useRef<Point2D[]>([])
  const lastMouseMove = useRef<number>(0)
  const scrollPositions = useRef<Array<{ x: number; y: number; timestamp: number }>>([])

  const shouldTrackElement = useCallback((element: Element): boolean => {
    return !excludeSelectors.some(selector => element.matches(selector))
  }, [excludeSelectors])

  const throttle = useCallback((func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout
    let lastExecTime = 0
    
    return function (this: any, ...args: any[]) {
      const currentTime = Date.now()
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args)
        lastExecTime = currentTime
      } else {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          func.apply(this, args)
          lastExecTime = Date.now()
        }, delay - (currentTime - lastExecTime))
      }
    }
  }, [])

  const handleClick = useCallback((event: MouseEvent) => {
    if (!trackClicks) return

    const target = event.target as Element
    if (!target || !shouldTrackElement(target)) return

    analytics.trackHeatmapInteraction(target as HTMLElement, 'click')
    
    // Track click coordinates
    analytics.trackEvent('heatmap_click', {
      coordinates: { x: event.clientX, y: event.clientY },
      pageX: event.pageX,
      pageY: event.pageY,
      element: target.tagName.toLowerCase(),
      elementText: target.textContent?.slice(0, 50) || '',
      timestamp: Date.now()
    })
  }, [trackClicks, analytics, shouldTrackElement])

  const handleMouseOver = useCallback((event: MouseEvent) => {
    if (!trackHovers) return

    const target = event.target as Element
    if (!target || !shouldTrackElement(target)) return

    analytics.trackHeatmapInteraction(target as HTMLElement, 'hover')
  }, [trackHovers, analytics, shouldTrackElement])

  const handleMouseMove = useCallback(throttle((event: MouseEvent) => {
    if (!trackMouseMovement) return

    const now = Date.now()
    if (now - lastMouseMove.current < throttleMs) return

    const position: Point2D = { x: event.clientX, y: event.clientY }
    mousePositions.current.push(position)
    lastMouseMove.current = now

    // Keep only last 100 positions to prevent memory issues
    if (mousePositions.current.length > 100) {
      mousePositions.current.shift()
    }

    // Track mouse movement patterns
    if (mousePositions.current.length % 10 === 0) {
      analytics.trackEvent('mouse_movement_pattern', {
        positions: mousePositions.current.slice(-10),
        timestamp: now
      })
    }
  }, throttleMs), [trackMouseMovement, throttleMs, analytics])

  const handleScroll = useCallback(throttle(() => {
    if (!trackScrolls) return

    const scrollData = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now()
    }

    scrollPositions.current.push(scrollData)

    // Keep only last 50 scroll positions
    if (scrollPositions.current.length > 50) {
      scrollPositions.current.shift()
    }

    const scrollDepth = Math.round(
      ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
    )

    analytics.trackEvent('scroll_tracking', {
      scrollX: scrollData.x,
      scrollY: scrollData.y,
      scrollDepth,
      viewportHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      timestamp: scrollData.timestamp
    })
  }, throttleMs), [trackScrolls, throttleMs, analytics])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const events: Array<[string, EventListener]> = []

    if (trackClicks) {
      events.push(['click', handleClick])
    }

    if (trackHovers) {
      events.push(['mouseover', handleMouseOver])
    }

    if (trackMouseMovement) {
      events.push(['mousemove', handleMouseMove])
    }

    if (trackScrolls) {
      events.push(['scroll', handleScroll])
    }

    // Add event listeners
    events.forEach(([eventName, handler]) => {
      document.addEventListener(eventName, handler, { passive: true })
    })

    return () => {
      // Remove event listeners
      events.forEach(([eventName, handler]) => {
        document.removeEventListener(eventName, handler)
      })
    }
  }, [handleClick, handleMouseOver, handleMouseMove, handleScroll])

  const getHeatmapData = useCallback(async (page?: string): Promise<HeatmapData[]> => {
    return analytics.getHeatmapData(page)
  }, [analytics])

  const getMouseTrail = useCallback((): Point2D[] => {
    return [...mousePositions.current]
  }, [])

  const getScrollPattern = useCallback(() => {
    return [...scrollPositions.current]
  }, [])

  const clearTrackingData = useCallback(() => {
    mousePositions.current = []
    scrollPositions.current = []
  }, [])

  return {
    getHeatmapData,
    getMouseTrail,
    getScrollPattern,
    clearTrackingData
  }
}