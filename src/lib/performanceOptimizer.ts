import { memoryManager } from './memoryManager'

interface PerformanceConfig {
  enableMemoryManagement: boolean
  enableLazyLoading: boolean
  enableImageOptimization: boolean
  enableCodeSplitting: boolean
  maxMemoryUsage: number // in MB
  cleanupInterval: number // in ms
}

class PerformanceOptimizer {
  private config: PerformanceConfig
  private observers: Map<string, IntersectionObserver> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null
  private performanceEntries: PerformanceEntry[] = []

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enableMemoryManagement: true,
      enableLazyLoading: true,
      enableImageOptimization: true,
      enableCodeSplitting: true,
      maxMemoryUsage: 100, // 100MB
      cleanupInterval: 30000, // 30 seconds
      ...config
    }

    this.initialize()
  }

  private initialize() {
    if (typeof window === 'undefined') return

    // Start memory management
    if (this.config.enableMemoryManagement) {
      this.startMemoryManagement()
    }

    // Monitor performance
    this.startPerformanceMonitoring()

    // Setup cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup()
    })

    // Setup visibility change handler
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.onPageHidden()
      } else {
        this.onPageVisible()
      }
    })
  }

  private startMemoryManagement() {
    // Configure memory manager
    memoryManager.constructor(this.config.maxMemoryUsage)

    // Start periodic cleanup
    this.cleanupInterval = setInterval(() => {
      const freedMemory = memoryManager.cleanup()
      if (freedMemory > 0) {
        console.log(`Performance Optimizer: Freed ${Math.round(freedMemory / 1024 / 1024)}MB of memory`)
      }
    }, this.config.cleanupInterval)
  }

  private startPerformanceMonitoring() {
    if (!window.performance) return

    // Monitor navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.analyzeNavigationTiming()
      }, 0)
    })

    // Monitor resource timing
    const observer = new PerformanceObserver((list) => {
      this.performanceEntries.push(...list.getEntries())
      this.analyzeResourceTiming(list.getEntries())
    })

    try {
      observer.observe({ entryTypes: ['navigation', 'resource', 'measure', 'paint'] })
    } catch (e) {
      console.warn('Performance Observer not fully supported')
    }
  }

  private analyzeNavigationTiming() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (!navigation) return

    const metrics = {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      request: navigation.responseStart - navigation.requestStart,
      response: navigation.responseEnd - navigation.responseStart,
      dom: navigation.domContentLoadedEventEnd - navigation.responseEnd,
      load: navigation.loadEventEnd - navigation.loadEventStart,
      total: navigation.loadEventEnd - navigation.startTime
    }

    console.log('Navigation Timing:', metrics)

    // Warn about slow metrics
    if (metrics.total > 3000) {
      console.warn('Slow page load detected:', metrics.total + 'ms')
    }
  }

  private analyzeResourceTiming(entries: PerformanceEntry[]) {
    entries.forEach(entry => {
      if (entry.entryType === 'resource') {
        const resource = entry as PerformanceResourceTiming
        
        // Warn about slow resources
        if (resource.duration > 1000) {
          console.warn(`Slow resource: ${resource.name} (${Math.round(resource.duration)}ms)`)
        }

        // Warn about large resources
        if (resource.transferSize > 1024 * 1024) { // 1MB
          console.warn(`Large resource: ${resource.name} (${Math.round(resource.transferSize / 1024 / 1024)}MB)`)
        }
      }
    })
  }

  private onPageHidden() {
    // Aggressive cleanup when page is hidden
    if (this.config.enableMemoryManagement) {
      memoryManager.cleanup(true)
    }

    // Pause non-essential operations
    this.pauseNonEssentialOperations()
  }

  private onPageVisible() {
    // Resume operations when page becomes visible
    this.resumeOperations()
  }

  private pauseNonEssentialOperations() {
    // Pause animations, reduce update frequencies, etc.
    document.body.classList.add('performance-paused')
  }

  private resumeOperations() {
    // Resume normal operations
    document.body.classList.remove('performance-paused')
  }

  // Public methods for components to use

  createLazyObserver(
    callback: (entries: IntersectionObserverEntry[]) => void,
    options: IntersectionObserverInit = {}
  ): IntersectionObserver {
    if (!this.config.enableLazyLoading) {
      // Return a mock observer that immediately triggers
      return {
        observe: (element: Element) => {
          setTimeout(() => callback([{
            isIntersecting: true,
            target: element
          } as IntersectionObserverEntry]), 0)
        },
        unobserve: () => {},
        disconnect: () => {},
        root: null,
        rootMargin: '0px',
        thresholds: [0],
        takeRecords: () => []
      } as IntersectionObserver
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    })

    return observer
  }

  optimizeImage(src: string, options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'auto'
  } = {}): string {
    if (!this.config.enableImageOptimization) {
      return src
    }

    // In a real implementation, this would integrate with Next.js Image optimization
    // or a CDN service like Cloudinary
    const params = new URLSearchParams()
    
    if (options.width) params.set('w', options.width.toString())
    if (options.height) params.set('h', options.height.toString())
    if (options.quality) params.set('q', options.quality.toString())
    if (options.format && options.format !== 'auto') params.set('f', options.format)

    return params.toString() ? `${src}?${params.toString()}` : src
  }

  preloadResource(href: string, as: string, crossorigin?: string) {
    if (typeof document === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    if (crossorigin) link.crossOrigin = crossorigin

    document.head.appendChild(link)
  }

  prefetchResource(href: string) {
    if (typeof document === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href

    document.head.appendChild(link)
  }

  measurePerformance(name: string, fn: () => void | Promise<void>) {
    if (!window.performance?.mark) {
      return fn()
    }

    const startMark = `${name}-start`
    const endMark = `${name}-end`
    const measureName = `${name}-duration`

    performance.mark(startMark)
    
    const result = fn()
    
    if (result instanceof Promise) {
      return result.finally(() => {
        performance.mark(endMark)
        performance.measure(measureName, startMark, endMark)
      })
    } else {
      performance.mark(endMark)
      performance.measure(measureName, startMark, endMark)
      return result
    }
  }

  getPerformanceReport() {
    const memoryUsage = memoryManager.getMemoryUsage()
    const performanceEntries = this.performanceEntries.slice(-50) // Last 50 entries

    return {
      memoryUsage: Math.round(memoryUsage / 1024 / 1024), // MB
      performanceEntries,
      config: this.config,
      timestamp: Date.now()
    }
  }

  cleanup() {
    // Stop intervals
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }

    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()

    // Cleanup memory manager
    memoryManager.destroy()
  }
}

// Global instance
export const performanceOptimizer = new PerformanceOptimizer()

// React hook for using performance optimizer
export function usePerformanceOptimizer() {
  return {
    createLazyObserver: performanceOptimizer.createLazyObserver.bind(performanceOptimizer),
    optimizeImage: performanceOptimizer.optimizeImage.bind(performanceOptimizer),
    preloadResource: performanceOptimizer.preloadResource.bind(performanceOptimizer),
    prefetchResource: performanceOptimizer.prefetchResource.bind(performanceOptimizer),
    measurePerformance: performanceOptimizer.measurePerformance.bind(performanceOptimizer),
    getPerformanceReport: performanceOptimizer.getPerformanceReport.bind(performanceOptimizer)
  }
}

// Utility for measuring component render time
export function withPerformanceMeasurement<P extends object>(
  Component: React.ComponentType<P>,
  name?: string
) {
  const componentName = name || Component.displayName || Component.name || 'Component'
  
  const MeasuredComponent = (props: P) => {
    const element = React.createElement(Component, props)
    performanceOptimizer.measurePerformance(`render-${componentName}`, () => {
      // Performance measurement for render
    })
    return element
  }

  MeasuredComponent.displayName = `withPerformanceMeasurement(${componentName})`
  
  return MeasuredComponent
}

// Export React for the HOC
import React from 'react'