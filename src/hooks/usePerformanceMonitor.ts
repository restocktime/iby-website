'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { PerformanceMetrics, PerformanceLevel } from '@/types'

interface PerformanceMonitorOptions {
  sampleInterval?: number
  memoryThreshold?: number
  fpsThreshold?: number
  onPerformanceDrop?: (metrics: PerformanceMetrics) => void
}

export function usePerformanceMonitor(options: PerformanceMonitorOptions = {}) {
  const {
    sampleInterval = 1000,
    memoryThreshold = 50 * 1024 * 1024, // 50MB
    fpsThreshold = 30,
    onPerformanceDrop
  } = options

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0
  })

  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>('high')
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(typeof performance !== 'undefined' ? performance.now() : Date.now())
  const animationFrameRef = useRef<number | null>(null)

  // FPS monitoring
  const measureFPS = useCallback(() => {
    if (typeof performance === 'undefined' || typeof requestAnimationFrame === 'undefined') return
    
    const now = performance.now()
    frameCountRef.current++

    if (now - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current))
      
      setMetrics(prev => ({ ...prev, fps }))
      
      frameCountRef.current = 0
      lastTimeRef.current = now
    }

    animationFrameRef.current = requestAnimationFrame(measureFPS)
  }, [])

  // Memory monitoring
  const measureMemory = useCallback(() => {
    if (typeof window === 'undefined') return
    
    const performance = window.performance as any
    if (performance.memory) {
      const memoryUsage = performance.memory.usedJSHeapSize
      setMetrics(prev => ({ ...prev, memoryUsage }))
      
      // Check if memory usage is too high
      if (memoryUsage > memoryThreshold && onPerformanceDrop) {
        onPerformanceDrop({ ...metrics, memoryUsage })
      }
    }
  }, [memoryThreshold, onPerformanceDrop, metrics])

  // Performance level calculation
  const calculatePerformanceLevel = useCallback((currentMetrics: PerformanceMetrics): PerformanceLevel => {
    const { fps, memoryUsage } = currentMetrics
    const memoryInMB = memoryUsage / (1024 * 1024)

    if (fps >= 50 && memoryInMB < 30) return 'high'
    if (fps >= 30 && memoryInMB < 50) return 'medium'
    return 'low'
  }, [])

  // Load time measurement
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    
    const measureLoadTime = () => {
      if (window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart
          setMetrics(prev => ({ ...prev, loadTime }))
        }
      }
    }

    if (document.readyState === 'complete') {
      measureLoadTime()
    } else {
      window.addEventListener('load', measureLoadTime)
      return () => window.removeEventListener('load', measureLoadTime)
    }
  }, [])

  // Start monitoring
  useEffect(() => {
    if (typeof requestAnimationFrame === 'undefined') return
    
    // Start FPS monitoring
    animationFrameRef.current = requestAnimationFrame(measureFPS)

    // Start memory monitoring
    const memoryInterval = setInterval(measureMemory, sampleInterval)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      clearInterval(memoryInterval)
    }
  }, [measureFPS, measureMemory, sampleInterval])

  // Update performance level when metrics change
  useEffect(() => {
    const newLevel = calculatePerformanceLevel(metrics)
    if (newLevel !== performanceLevel) {
      setPerformanceLevel(newLevel)
    }
  }, [metrics, performanceLevel, calculatePerformanceLevel])

  // Performance drop detection
  useEffect(() => {
    if (metrics.fps < fpsThreshold && onPerformanceDrop) {
      onPerformanceDrop(metrics)
    }
  }, [metrics.fps, fpsThreshold, onPerformanceDrop, metrics])

  const forceGarbageCollection = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).gc) {
      (window as any).gc()
    }
  }, [])

  const getPerformanceReport = useCallback(() => {
    return {
      ...metrics,
      performanceLevel,
      timestamp: Date.now(),
      recommendations: generateRecommendations(metrics, performanceLevel)
    }
  }, [metrics, performanceLevel])

  return {
    metrics,
    performanceLevel,
    forceGarbageCollection,
    getPerformanceReport
  }
}

function generateRecommendations(metrics: PerformanceMetrics, level: PerformanceLevel): string[] {
  const recommendations: string[] = []

  if (level === 'low') {
    recommendations.push('Consider reducing animation complexity')
    recommendations.push('Disable particle effects')
    recommendations.push('Use lower quality textures')
  }

  if (metrics.fps < 30) {
    recommendations.push('Reduce frame rate intensive operations')
    recommendations.push('Implement frame rate limiting')
  }

  if (metrics.memoryUsage > 50 * 1024 * 1024) {
    recommendations.push('Clean up unused objects')
    recommendations.push('Reduce texture resolution')
    recommendations.push('Implement object pooling')
  }

  return recommendations
}