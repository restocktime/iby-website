'use client'

import { useState, useEffect } from 'react'
import { useAnalytics } from '@/components/providers/AnalyticsProvider'

interface ABTestHookResult {
  variant: string | null
  isLoading: boolean
  trackConversion: (value?: number) => void
}

export function useABTest(testId: string): ABTestHookResult {
  const [variant, setVariant] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { getVariant, trackConversion: trackAnalyticsConversion } = useAnalytics()

  useEffect(() => {
    const initializeTest = async () => {
      try {
        const assignedVariant = getVariant(testId)
        setVariant(assignedVariant)
      } catch (error) {
        console.error(`Failed to initialize A/B test ${testId}:`, error)
        setVariant(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeTest()
  }, [testId, getVariant])

  const trackConversion = (value?: number) => {
    if (variant) {
      trackAnalyticsConversion('ab_test_conversion', value, {
        testId,
        variantId: variant
      })
    }
  }

  return {
    variant,
    isLoading,
    trackConversion
  }
}

// Convenience hook for checking if user is in a specific variant
export function useABTestVariant(testId: string, variantId: string): boolean {
  const { variant } = useABTest(testId)
  return variant === variantId
}

// Hook for conditional rendering based on A/B test
export function useABTestComponent<T>(
  testId: string,
  variants: Record<string, T>,
  defaultComponent: T
): T {
  const { variant, isLoading } = useABTest(testId)
  
  if (isLoading) {
    return defaultComponent
  }
  
  return variant && variants[variant] ? variants[variant] : defaultComponent
}