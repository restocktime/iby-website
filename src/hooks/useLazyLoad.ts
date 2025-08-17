'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useDeviceCapabilities } from './useDeviceCapabilities'

interface LazyLoadOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  fallbackDelay?: number
  performanceAware?: boolean
}

interface LazyLoadResult {
  isVisible: boolean
  isLoaded: boolean
  shouldLoad: boolean
  ref: React.RefObject<HTMLElement | null>
  load: () => void
  unload: () => void
}

export function useLazyLoad(options: LazyLoadOptions = {}): LazyLoadResult {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    fallbackDelay = 100,
    performanceAware = true
  } = options

  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const elementRef = useRef<HTMLElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { performanceLevel, isLowEndDevice, supportsIntersectionObserver } = useDeviceCapabilities()

  const load = useCallback(() => {
    setIsLoaded(true)
    setShouldLoad(true)
  }, [])

  const unload = useCallback(() => {
    setIsLoaded(false)
    setShouldLoad(false)
  }, [])

  // Performance-aware loading decision
  const shouldLoadBasedOnPerformance = useCallback(() => {
    if (!performanceAware) return true
    
    // Don't load heavy content on low-end devices unless explicitly visible
    if (isLowEndDevice && performanceLevel === 'low') {
      return isVisible
    }
    
    // Load immediately on high-performance devices
    if (performanceLevel === 'high') {
      return true
    }
    
    // Load when visible on medium performance devices
    return isVisible
  }, [performanceAware, isLowEndDevice, performanceLevel, isVisible])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Fallback for browsers without IntersectionObserver
    if (!supportsIntersectionObserver) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true)
        if (shouldLoadBasedOnPerformance()) {
          load()
        }
      }, fallbackDelay)
      return
    }

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        const visible = entry.isIntersecting

        setIsVisible(visible)

        if (visible && shouldLoadBasedOnPerformance()) {
          load()
          
          // Stop observing if triggerOnce is true
          if (triggerOnce && observerRef.current) {
            observerRef.current.unobserve(element)
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [threshold, rootMargin, triggerOnce, fallbackDelay, supportsIntersectionObserver, shouldLoadBasedOnPerformance, load])

  // Update shouldLoad based on performance changes
  useEffect(() => {
    if (isVisible && shouldLoadBasedOnPerformance() && !isLoaded) {
      load()
    } else if (!shouldLoadBasedOnPerformance() && isLoaded) {
      unload()
    }
  }, [isVisible, shouldLoadBasedOnPerformance, isLoaded, load, unload])

  return {
    isVisible,
    isLoaded,
    shouldLoad,
    ref: elementRef,
    load,
    unload
  }
}

// Hook for lazy loading 3D scenes specifically
export function useLazy3D(options: LazyLoadOptions & { 
  enableOn?: 'always' | 'high-performance' | 'medium-and-high' 
} = {}) {
  const { enableOn = 'medium-and-high', ...lazyOptions } = options
  const { performanceLevel, supportsWebGL, supportsWebGL2 } = useDeviceCapabilities()
  const lazyLoad = useLazyLoad(lazyOptions)

  const should3DLoad = useCallback(() => {
    // Check WebGL support first
    if (!supportsWebGL) return false

    // Check performance requirements
    switch (enableOn) {
      case 'always':
        return true
      case 'high-performance':
        return performanceLevel === 'high'
      case 'medium-and-high':
        return performanceLevel === 'high' || performanceLevel === 'medium'
      default:
        return false
    }
  }, [supportsWebGL, performanceLevel, enableOn])

  return {
    ...lazyLoad,
    shouldLoad: lazyLoad.shouldLoad && should3DLoad(),
    supportsWebGL,
    supportsWebGL2,
    performanceLevel
  }
}

// Hook for lazy loading animations
export function useLazyAnimation(options: LazyLoadOptions & {
  respectMotionPreference?: boolean
} = {}) {
  const { respectMotionPreference = true, ...lazyOptions } = options
  const { prefersReducedMotion, performanceLevel } = useDeviceCapabilities()
  const lazyLoad = useLazyLoad(lazyOptions)

  const shouldAnimationLoad = useCallback(() => {
    // Respect user's motion preferences
    if (respectMotionPreference && prefersReducedMotion) {
      return false
    }

    // Disable complex animations on low performance devices
    if (performanceLevel === 'low') {
      return false
    }

    return true
  }, [respectMotionPreference, prefersReducedMotion, performanceLevel])

  return {
    ...lazyLoad,
    shouldLoad: lazyLoad.shouldLoad && shouldAnimationLoad(),
    prefersReducedMotion,
    performanceLevel
  }
}