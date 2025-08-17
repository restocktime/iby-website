'use client'

import { useRef, useEffect, useCallback } from 'react'

export interface GestureEvent {
  type: 'swipe' | 'pinch' | 'tap' | 'longPress' | 'pan'
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  scale?: number
  velocity?: number
  duration?: number
  startPoint?: { x: number; y: number }
  endPoint?: { x: number; y: number }
}

export interface GestureHandlers {
  onSwipe?: (event: GestureEvent) => void
  onPinch?: (event: GestureEvent) => void
  onTap?: (event: GestureEvent) => void
  onLongPress?: (event: GestureEvent) => void
  onPan?: (event: GestureEvent) => void
}

interface TouchPoint {
  x: number
  y: number
  timestamp: number
}

export function useGestureRecognition(
  elementRef: React.RefObject<HTMLElement | null>,
  handlers: GestureHandlers,
  options: {
    swipeThreshold?: number
    pinchThreshold?: number
    longPressDelay?: number
    tapMaxDistance?: number
    panThreshold?: number
  } = {}
) {
  const {
    swipeThreshold = 50,
    pinchThreshold = 0.1,
    longPressDelay = 500,
    tapMaxDistance = 10,
    panThreshold = 10
  } = options

  const touchStartRef = useRef<TouchPoint[]>([])
  const touchCurrentRef = useRef<TouchPoint[]>([])
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isPanningRef = useRef(false)
  const initialDistanceRef = useRef<number>(0)

  const getDistance = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
  }, [])

  const getDirection = useCallback((start: TouchPoint, end: TouchPoint): 'up' | 'down' | 'left' | 'right' => {
    const deltaX = end.x - start.x
    const deltaY = end.y - start.y
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left'
    } else {
      return deltaY > 0 ? 'down' : 'up'
    }
  }, [])

  const getVelocity = useCallback((start: TouchPoint, end: TouchPoint): number => {
    const distance = getDistance(start, end)
    const time = end.timestamp - start.timestamp
    return time > 0 ? distance / time : 0
  }, [getDistance])

  const getTouchPoints = useCallback((touches: TouchList): TouchPoint[] => {
    return Array.from(touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }))
  }, [])

  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touchPoints = getTouchPoints(event.touches)
    touchStartRef.current = touchPoints
    touchCurrentRef.current = touchPoints
    isPanningRef.current = false

    // Clear any existing long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }

    // Set up long press detection for single touch
    if (touchPoints.length === 1) {
      longPressTimerRef.current = setTimeout(() => {
        if (handlers.onLongPress && touchStartRef.current.length === 1) {
          const startPoint = touchStartRef.current[0]
          const currentPoint = touchCurrentRef.current[0]
          
          // Only trigger if finger hasn't moved much
          if (getDistance(startPoint, currentPoint) < tapMaxDistance) {
            handlers.onLongPress({
              type: 'longPress',
              startPoint: { x: startPoint.x, y: startPoint.y },
              duration: longPressDelay
            })
          }
        }
      }, longPressDelay)
    }

    // Store initial distance for pinch detection
    if (touchPoints.length === 2) {
      initialDistanceRef.current = getDistance(touchPoints[0], touchPoints[1])
    }
  }, [getTouchPoints, handlers, longPressDelay, tapMaxDistance, getDistance])

  const handleTouchMove = useCallback((event: TouchEvent) => {
    event.preventDefault() // Prevent scrolling during gestures
    
    const touchPoints = getTouchPoints(event.touches)
    touchCurrentRef.current = touchPoints

    // Clear long press timer on movement
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }

    // Handle pinch gesture
    if (touchPoints.length === 2 && touchStartRef.current.length === 2 && handlers.onPinch) {
      const currentDistance = getDistance(touchPoints[0], touchPoints[1])
      const scale = currentDistance / initialDistanceRef.current
      
      if (Math.abs(scale - 1) > pinchThreshold) {
        handlers.onPinch({
          type: 'pinch',
          scale,
          distance: currentDistance
        })
      }
    }

    // Handle pan gesture
    if (touchPoints.length === 1 && touchStartRef.current.length === 1 && handlers.onPan) {
      const startPoint = touchStartRef.current[0]
      const currentPoint = touchPoints[0]
      const distance = getDistance(startPoint, currentPoint)
      
      if (distance > panThreshold) {
        if (!isPanningRef.current) {
          isPanningRef.current = true
        }
        
        handlers.onPan({
          type: 'pan',
          direction: getDirection(startPoint, currentPoint),
          distance,
          startPoint: { x: startPoint.x, y: startPoint.y },
          endPoint: { x: currentPoint.x, y: currentPoint.y }
        })
      }
    }
  }, [getTouchPoints, handlers, pinchThreshold, panThreshold, getDistance, getDirection])

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }

    const touchPoints = getTouchPoints(event.changedTouches)
    
    // Handle tap gesture
    if (touchStartRef.current.length === 1 && !isPanningRef.current && handlers.onTap) {
      const startPoint = touchStartRef.current[0]
      const endPoint = touchCurrentRef.current[0] || touchPoints[0]
      const distance = getDistance(startPoint, endPoint)
      const duration = endPoint.timestamp - startPoint.timestamp
      
      if (distance < tapMaxDistance && duration < 300) {
        handlers.onTap({
          type: 'tap',
          startPoint: { x: startPoint.x, y: startPoint.y },
          duration
        })
      }
    }

    // Handle swipe gesture
    if (touchStartRef.current.length === 1 && handlers.onSwipe) {
      const startPoint = touchStartRef.current[0]
      const endPoint = touchCurrentRef.current[0] || touchPoints[0]
      const distance = getDistance(startPoint, endPoint)
      const velocity = getVelocity(startPoint, endPoint)
      
      if (distance > swipeThreshold && velocity > 0.3) {
        handlers.onSwipe({
          type: 'swipe',
          direction: getDirection(startPoint, endPoint),
          distance,
          velocity,
          startPoint: { x: startPoint.x, y: startPoint.y },
          endPoint: { x: endPoint.x, y: endPoint.y }
        })
      }
    }

    // Reset state
    touchStartRef.current = []
    touchCurrentRef.current = []
    isPanningRef.current = false
    initialDistanceRef.current = 0
  }, [getTouchPoints, handlers, tapMaxDistance, swipeThreshold, getDistance, getDirection, getVelocity])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      
      // Clean up timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    isSupported: 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }
}