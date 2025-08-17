'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { getAnalytics } from '@/lib/advancedAnalytics'
import { getABTesting } from '@/lib/abTesting'
import { useHeatmapTracking } from '@/hooks/useHeatmapTracking'
import { useConversionTracking } from '@/hooks/useConversionTracking'

interface AnalyticsContextType {
  trackEvent: (event: string, properties?: Record<string, unknown>) => void
  trackConversion: (type: string, value?: number, formData?: Record<string, unknown>) => void
  trackPageView: (page?: string) => void
  getVariant: (testId: string) => string | null
  isInVariant: (testId: string, variantId: string) => boolean
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

interface AnalyticsProviderProps {
  children: ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const analytics = getAnalytics()
  const abTesting = getABTesting()
  
  // Initialize tracking hooks
  useHeatmapTracking({
    trackClicks: true,
    trackHovers: true,
    trackScrolls: true,
    trackMouseMovement: false,
    throttleMs: 100,
    excludeSelectors: ['.no-track', '[data-no-track]']
  })

  const {
    trackConversion: trackConversionHook,
    trackFormSubmission,
    trackContactMethodClick,
    trackProjectInterest
  } = useConversionTracking({
    autoTrackForms: true,
    autoTrackClicks: true,
    trackScrollMilestones: true,
    trackTimeOnPage: true
  })

  useEffect(() => {
    // Track initial page view
    analytics.trackPageView()

    // Initialize common A/B tests
    initializeABTests()

    // Set up global error tracking
    window.addEventListener('error', (event) => {
      analytics.trackEvent('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      })
    })

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      analytics.trackEvent('unhandled_promise_rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      })
    })

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      analytics.trackEvent('page_visibility_change', {
        hidden: document.hidden,
        visibilityState: document.visibilityState
      })
    })

    // Track performance metrics
    if ('performance' in window && 'getEntriesByType' in performance) {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          analytics.trackEvent('page_performance', {
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            firstPaint: getFirstPaint(),
            firstContentfulPaint: getFirstContentfulPaint(),
            largestContentfulPaint: getLargestContentfulPaint()
          })
        }
      }, 1000)
    }

    return () => {
      analytics.destroy()
    }
  }, [analytics])

  const initializeABTests = async () => {
    try {
      // Initialize hero CTA test
      const heroVariant = await abTesting.initializeTest('test_hero_cta')
      if (heroVariant) {
        document.documentElement.setAttribute('data-hero-variant', heroVariant)
      }

      // Initialize contact form test
      const contactVariant = await abTesting.initializeTest('test_contact_form')
      if (contactVariant) {
        document.documentElement.setAttribute('data-contact-variant', contactVariant)
      }

      // Initialize project cards test
      const projectVariant = await abTesting.initializeTest('test_project_cards')
      if (projectVariant) {
        document.documentElement.setAttribute('data-project-variant', projectVariant)
      }
    } catch (error) {
      console.error('Failed to initialize A/B tests:', error)
    }
  }

  const trackEvent = (event: string, properties?: Record<string, unknown>) => {
    analytics.trackEvent(event, properties)
  }

  const trackConversion = (type: string, value?: number, formData?: Record<string, unknown>) => {
    trackConversionHook(type as any, value, formData)
  }

  const trackPageView = (page?: string) => {
    analytics.trackPageView(page)
  }

  const getVariant = (testId: string): string | null => {
    return abTesting.getVariant(testId)
  }

  const isInVariant = (testId: string, variantId: string): boolean => {
    return abTesting.isInVariant(testId, variantId)
  }

  const contextValue: AnalyticsContextType = {
    trackEvent,
    trackConversion,
    trackPageView,
    getVariant,
    isInVariant
  }

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics(): AnalyticsContextType {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

// Performance metrics helpers
function getFirstPaint(): number | undefined {
  const paintEntries = performance.getEntriesByType('paint')
  const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')
  return firstPaint?.startTime
}

function getFirstContentfulPaint(): number | undefined {
  const paintEntries = performance.getEntriesByType('paint')
  const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')
  return firstContentfulPaint?.startTime
}

function getLargestContentfulPaint(): Promise<number | undefined> {
  return new Promise((resolve) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        resolve(lastEntry?.startTime)
        observer.disconnect()
      })
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
        
        // Fallback timeout
        setTimeout(() => {
          observer.disconnect()
          resolve(undefined)
        }, 5000)
      } catch (error) {
        resolve(undefined)
      }
    } else {
      resolve(undefined)
    }
  })
}