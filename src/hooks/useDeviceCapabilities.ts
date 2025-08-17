'use client'

import { useState, useEffect, useCallback } from 'react'
import { DeviceCapabilities, PerformanceLevel } from '@/types'

interface ExtendedDeviceCapabilities extends DeviceCapabilities {
  performanceLevel: PerformanceLevel
  memoryInfo?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
  connectionType?: string
  hardwareConcurrency: number
  supportsWebGL2: boolean
  supportsIntersectionObserver: boolean
  supportsResizeObserver: boolean
  prefersReducedMotion: boolean
  batteryLevel?: number
  isLowEndDevice: boolean
}

export function useDeviceCapabilities(): ExtendedDeviceCapabilities {
  const [capabilities, setCapabilities] = useState<ExtendedDeviceCapabilities>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    supportsWebGL: false,
    supportsTouch: false,
    screenWidth: 1920,
    screenHeight: 1080,
    pixelRatio: 1,
    performanceLevel: 'high',
    hardwareConcurrency: 4,
    supportsWebGL2: false,
    supportsIntersectionObserver: true,
    supportsResizeObserver: true,
    prefersReducedMotion: false,
    isLowEndDevice: false,
  })

  const detectPerformanceLevel = useCallback((): PerformanceLevel => {
    const { hardwareConcurrency, deviceMemory } = navigator as any
    const cores = hardwareConcurrency || 4
    const memory = deviceMemory || 4

    // Performance scoring based on device specs
    let score = 0
    
    // CPU cores scoring
    if (cores >= 8) score += 3
    else if (cores >= 4) score += 2
    else if (cores >= 2) score += 1

    // Memory scoring
    if (memory >= 8) score += 3
    else if (memory >= 4) score += 2
    else if (memory >= 2) score += 1

    // Connection type scoring
    const connection = (navigator as any).connection
    if (connection) {
      if (connection.effectiveType === '4g') score += 2
      else if (connection.effectiveType === '3g') score += 1
    }

    // WebGL capabilities scoring
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        if (renderer.includes('NVIDIA') || renderer.includes('AMD')) score += 2
        else if (renderer.includes('Intel')) score += 1
      }
    }

    if (score >= 8) return 'high'
    if (score >= 5) return 'medium'
    return 'low'
  }, [])

  const getBatteryLevel = useCallback(async (): Promise<number | undefined> => {
    try {
      const battery = await (navigator as any).getBattery?.()
      return battery?.level
    } catch {
      return undefined
    }
  }, [])

  const getMemoryInfo = useCallback(() => {
    const performance = window.performance as any
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      }
    }
    return undefined
  }, [])

  useEffect(() => {
    const updateCapabilities = async () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const pixelRatio = window.devicePixelRatio || 1

      // Device type detection
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024
      const isDesktop = width >= 1024

      // WebGL support detection
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      const gl2 = canvas.getContext('webgl2')
      const supportsWebGL = !!gl
      const supportsWebGL2 = !!gl2

      // Touch support detection
      const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      // API support detection
      const supportsIntersectionObserver = 'IntersectionObserver' in window
      const supportsResizeObserver = 'ResizeObserver' in window

      // Motion preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Hardware info
      const hardwareConcurrency = navigator.hardwareConcurrency || 4
      const connection = (navigator as any).connection
      const connectionType = connection?.effectiveType || 'unknown'

      // Performance level detection
      const performanceLevel = detectPerformanceLevel()

      // Low-end device detection
      const isLowEndDevice = performanceLevel === 'low' || 
        (isMobile && hardwareConcurrency <= 2) ||
        ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2)

      // Memory info
      const memoryInfo = getMemoryInfo()

      // Battery level
      const batteryLevel = await getBatteryLevel()

      setCapabilities({
        isMobile,
        isTablet,
        isDesktop,
        supportsWebGL,
        supportsWebGL2,
        supportsTouch,
        screenWidth: width,
        screenHeight: height,
        pixelRatio,
        performanceLevel,
        memoryInfo,
        connectionType,
        hardwareConcurrency,
        supportsIntersectionObserver,
        supportsResizeObserver,
        prefersReducedMotion,
        batteryLevel,
        isLowEndDevice,
      })
    }

    updateCapabilities()
    window.addEventListener('resize', updateCapabilities)
    
    // Listen for connection changes
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', updateCapabilities)
    }

    // Listen for motion preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionQuery.addEventListener('change', updateCapabilities)

    return () => {
      window.removeEventListener('resize', updateCapabilities)
      if (connection) {
        connection.removeEventListener('change', updateCapabilities)
      }
      motionQuery.removeEventListener('change', updateCapabilities)
    }
  }, [detectPerformanceLevel, getBatteryLevel, getMemoryInfo])

  return capabilities
}