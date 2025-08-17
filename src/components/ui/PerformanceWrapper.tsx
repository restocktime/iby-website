'use client'

import React, { Suspense, lazy, useMemo } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'
import { useLazyLoad, useLazy3D, useLazyAnimation } from '@/hooks/useLazyLoad'
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'

interface PerformanceWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  lowPerformanceFallback?: React.ReactNode
  enableLazyLoading?: boolean
  enable3D?: boolean
  enableAnimations?: boolean
  performanceLevel?: 'low' | 'medium' | 'high' | 'auto'
  priority?: 'low' | 'medium' | 'high'
  className?: string
}

interface AdaptiveComponentProps {
  highPerformance: React.ComponentType<any>
  mediumPerformance?: React.ComponentType<any>
  lowPerformance?: React.ComponentType<any>
  fallback?: React.ComponentType<any>
  props?: any
}

// Loading skeleton component
const LoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className || 'h-32'}`}>
    <div className="flex items-center justify-center h-full text-gray-400">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  </div>
)

// Performance-aware wrapper component
export const PerformanceWrapper: React.FC<PerformanceWrapperProps> = ({
  children,
  fallback = <LoadingSkeleton />,
  lowPerformanceFallback,
  enableLazyLoading = true,
  enable3D = false,
  enableAnimations = true,
  performanceLevel = 'auto',
  priority = 'medium',
  className
}) => {
  const deviceCapabilities = useDeviceCapabilities()
  const { performanceLevel: detectedLevel, isLowEndDevice } = deviceCapabilities

  // Determine effective performance level
  const effectivePerformanceLevel = performanceLevel === 'auto' ? detectedLevel : performanceLevel

  // Performance monitoring
  const { metrics } = usePerformanceMonitor({
    onPerformanceDrop: (metrics) => {
      console.warn('Performance drop detected:', metrics)
    }
  })

  // Lazy loading hooks
  const lazyLoad = useLazyLoad({
    threshold: 0.1,
    rootMargin: '50px',
    performanceAware: true
  })

  const lazy3D = useLazy3D({
    enableOn: effectivePerformanceLevel === 'high' ? 'always' : 'high-performance'
  })

  const lazyAnimation = useLazyAnimation({
    respectMotionPreference: true
  })

  // Determine what to render based on performance
  const shouldRender = useMemo(() => {
    // Always render high priority content
    if (priority === 'high') return true

    // Check lazy loading
    if (enableLazyLoading && !lazyLoad.shouldLoad) return false

    // Check 3D requirements
    if (enable3D && !lazy3D.shouldLoad) return false

    // Check animation requirements
    if (enableAnimations && !lazyAnimation.shouldLoad) return false

    return true
  }, [
    priority,
    enableLazyLoading,
    lazyLoad.shouldLoad,
    enable3D,
    lazy3D.shouldLoad,
    enableAnimations,
    lazyAnimation.shouldLoad
  ])

  // Render low performance fallback if needed
  if (isLowEndDevice && effectivePerformanceLevel === 'low' && lowPerformanceFallback) {
    return (
      <ErrorBoundary level="component">
        <div ref={lazyLoad.ref as React.RefObject<HTMLDivElement>} className={className}>
          {lowPerformanceFallback}
        </div>
      </ErrorBoundary>
    )
  }

  // Render loading state
  if (!shouldRender) {
    return (
      <div ref={lazyLoad.ref as React.RefObject<HTMLDivElement>} className={className}>
        {fallback}
      </div>
    )
  }

  // Render main content
  return (
    <ErrorBoundary level="component">
      <div ref={lazyLoad.ref as React.RefObject<HTMLDivElement>} className={className}>
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

// Adaptive component that renders different versions based on performance
export const AdaptiveComponent: React.FC<AdaptiveComponentProps> = ({
  highPerformance: HighPerformanceComponent,
  mediumPerformance: MediumPerformanceComponent,
  lowPerformance: LowPerformanceComponent,
  fallback: FallbackComponent,
  props = {}
}) => {
  const { performanceLevel } = useDeviceCapabilities()

  const ComponentToRender = useMemo(() => {
    switch (performanceLevel) {
      case 'high':
        return HighPerformanceComponent
      case 'medium':
        return MediumPerformanceComponent || HighPerformanceComponent
      case 'low':
        return LowPerformanceComponent || MediumPerformanceComponent || FallbackComponent || HighPerformanceComponent
      default:
        return HighPerformanceComponent
    }
  }, [performanceLevel, HighPerformanceComponent, MediumPerformanceComponent, LowPerformanceComponent, FallbackComponent])

  return (
    <ErrorBoundary level="component">
      <ComponentToRender {...props} />
    </ErrorBoundary>
  )
}

// HOC for making components performance-aware
export function withPerformanceOptimization<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<PerformanceWrapperProps, 'children'> = {}
) {
  const PerformanceOptimizedComponent = (props: P) => (
    <PerformanceWrapper {...options}>
      <Component {...props} />
    </PerformanceWrapper>
  )

  PerformanceOptimizedComponent.displayName = `withPerformanceOptimization(${Component.displayName || Component.name})`
  
  return PerformanceOptimizedComponent
}

// Lazy loading HOC
export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }))
  
  const LazyLoadedComponent = (props: P) => (
    <Suspense fallback={fallback || <LoadingSkeleton />}>
      <LazyComponent {...props} />
    </Suspense>
  )

  LazyLoadedComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`
  
  return LazyLoadedComponent
}

// Performance monitoring component
export const PerformanceMonitor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { metrics, performanceLevel } = usePerformanceMonitor()

  // Show performance warning in development
  if (process.env.NODE_ENV === 'development' && performanceLevel === 'low') {
    console.warn('Low performance detected:', metrics)
  }

  return <>{children}</>
}