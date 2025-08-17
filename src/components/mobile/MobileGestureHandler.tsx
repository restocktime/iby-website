'use client'

import { useRef, useEffect, ReactNode } from 'react'
import { useGestureRecognition, GestureEvent } from '@/hooks/useGestureRecognition'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'

interface MobileGestureHandlerProps {
  children: ReactNode
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onPinchZoom?: (scale: number) => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  enableHapticFeedback?: boolean
  className?: string
}

export function MobileGestureHandler({
  children,
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  onPinchZoom,
  onDoubleTap,
  onLongPress,
  enableHapticFeedback = true,
  className = ''
}: MobileGestureHandlerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isMobile, supportsTouch } = useDeviceCapabilities()
  const lastTapRef = useRef<number>(0)

  // Haptic feedback function
  const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHapticFeedback || !navigator.vibrate) return
    
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    }
    
    navigator.vibrate(patterns[type])
  }

  // Gesture handlers
  const handleSwipe = (event: GestureEvent) => {
    if (!event.direction) return
    
    triggerHapticFeedback('light')
    
    switch (event.direction) {
      case 'up':
        onSwipeUp?.()
        break
      case 'down':
        onSwipeDown?.()
        break
      case 'left':
        onSwipeLeft?.()
        break
      case 'right':
        onSwipeRight?.()
        break
    }
  }

  const handlePinch = (event: GestureEvent) => {
    if (event.scale && onPinchZoom) {
      triggerHapticFeedback('medium')
      onPinchZoom(event.scale)
    }
  }

  const handleTap = (event: GestureEvent) => {
    const now = Date.now()
    const timeSinceLastTap = now - lastTapRef.current
    
    if (timeSinceLastTap < 300 && onDoubleTap) {
      // Double tap detected
      triggerHapticFeedback('medium')
      onDoubleTap()
      lastTapRef.current = 0 // Reset to prevent triple tap
    } else {
      lastTapRef.current = now
    }
  }

  const handleLongPress = (event: GestureEvent) => {
    if (onLongPress) {
      triggerHapticFeedback('heavy')
      onLongPress()
    }
  }

  // Register gesture recognition
  useGestureRecognition(
    containerRef,
    {
      onSwipe: handleSwipe,
      onPinch: handlePinch,
      onTap: handleTap,
      onLongPress: handleLongPress
    },
    {
      swipeThreshold: 50,
      pinchThreshold: 0.1,
      longPressDelay: 500,
      tapMaxDistance: 10
    }
  )

  // Add touch-action CSS for better gesture handling
  useEffect(() => {
    const container = containerRef.current
    if (!container || !supportsTouch) return

    // Prevent default touch behaviors that might interfere
    const preventDefaultTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault() // Prevent pinch-to-zoom on multi-touch
      }
    }

    container.addEventListener('touchstart', preventDefaultTouch, { passive: false })
    container.addEventListener('touchmove', preventDefaultTouch, { passive: false })

    return () => {
      container.removeEventListener('touchstart', preventDefaultTouch)
      container.removeEventListener('touchmove', preventDefaultTouch)
    }
  }, [supportsTouch])

  // Only render gesture handling on mobile devices
  if (!isMobile || !supportsTouch) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      ref={containerRef}
      className={`touch-manipulation select-none ${className}`}
      style={{
        touchAction: 'pan-x pan-y pinch-zoom',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      {children}
    </div>
  )
}

// Hook for programmatic haptic feedback
export function useHapticFeedback() {
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!navigator.vibrate) return false
    
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    }
    
    try {
      navigator.vibrate(patterns[type])
      return true
    } catch (error) {
      console.warn('Haptic feedback not supported:', error)
      return false
    }
  }

  const triggerCustomPattern = (pattern: number[]) => {
    if (!navigator.vibrate) return false
    
    try {
      navigator.vibrate(pattern)
      return true
    } catch (error) {
      console.warn('Custom haptic pattern not supported:', error)
      return false
    }
  }

  return {
    triggerHaptic,
    triggerCustomPattern,
    isSupported: 'vibrate' in navigator
  }
}