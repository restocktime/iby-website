'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

export interface AnimationState {
  isReducedMotion: boolean
  globalAnimationsEnabled: boolean
  currentSection: string | null
  animationQuality: 'low' | 'medium' | 'high'
  performanceMode: boolean
  interactionCount: number
}

export interface AnimationActions {
  setGlobalAnimationsEnabled: (enabled: boolean) => void
  setCurrentSection: (section: string | null) => void
  setAnimationQuality: (quality: 'low' | 'medium' | 'high') => void
  setPerformanceMode: (enabled: boolean) => void
  incrementInteractionCount: () => void
  resetInteractionCount: () => void
}

export interface AnimationContextValue extends AnimationState, AnimationActions {}

const AnimationContext = createContext<AnimationContextValue | null>(null)

export function useAnimationContext() {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error('useAnimationContext must be used within AnimationProvider')
  }
  return context
}

interface AnimationProviderProps {
  children: React.ReactNode
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const shouldReduceMotion = useReducedMotion()
  
  const [state, setState] = useState<AnimationState>({
    isReducedMotion: shouldReduceMotion || false,
    globalAnimationsEnabled: true,
    currentSection: null,
    animationQuality: 'high',
    performanceMode: false,
    interactionCount: 0
  })

  // Auto-detect performance mode based on device capabilities
  useEffect(() => {
    const detectPerformanceMode = () => {
      // Check for low-end device indicators
      const isLowEnd = 
        navigator.hardwareConcurrency <= 2 ||
        (navigator as any).deviceMemory <= 2 ||
        /Android.*Chrome\/[.0-9]*\s(Mobile|Tablet)/.test(navigator.userAgent)

      if (isLowEnd) {
        setState(prev => ({
          ...prev,
          performanceMode: true,
          animationQuality: 'low'
        }))
      }
    }

    detectPerformanceMode()
  }, [])

  // Update reduced motion preference
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isReducedMotion: shouldReduceMotion || false
    }))
  }, [shouldReduceMotion])

  // Auto-adjust animation quality based on interaction count
  useEffect(() => {
    if (state.interactionCount > 50 && state.animationQuality === 'high') {
      setState(prev => ({
        ...prev,
        animationQuality: 'medium'
      }))
    } else if (state.interactionCount > 100 && state.animationQuality === 'medium') {
      setState(prev => ({
        ...prev,
        animationQuality: 'low',
        performanceMode: true
      }))
    }
  }, [state.interactionCount, state.animationQuality])

  const setGlobalAnimationsEnabled = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, globalAnimationsEnabled: enabled }))
  }, [])

  const setCurrentSection = useCallback((section: string | null) => {
    setState(prev => ({ ...prev, currentSection: section }))
  }, [])

  const setAnimationQuality = useCallback((quality: 'low' | 'medium' | 'high') => {
    setState(prev => ({ ...prev, animationQuality: quality }))
  }, [])

  const setPerformanceMode = useCallback((enabled: boolean) => {
    setState(prev => ({ 
      ...prev, 
      performanceMode: enabled,
      animationQuality: enabled ? 'low' : 'high'
    }))
  }, [])

  const incrementInteractionCount = useCallback(() => {
    setState(prev => ({ ...prev, interactionCount: prev.interactionCount + 1 }))
  }, [])

  const resetInteractionCount = useCallback(() => {
    setState(prev => ({ ...prev, interactionCount: 0 }))
  }, [])

  const contextValue: AnimationContextValue = {
    ...state,
    setGlobalAnimationsEnabled,
    setCurrentSection,
    setAnimationQuality,
    setPerformanceMode,
    incrementInteractionCount,
    resetInteractionCount
  }

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  )
}

// Hook for getting animation settings based on context
export function useAnimationSettings() {
  const context = useAnimationContext()
  
  const shouldAnimate = context.globalAnimationsEnabled && !context.isReducedMotion
  
  const getAnimationConfig = useCallback((baseConfig: any) => {
    if (!shouldAnimate) {
      return { duration: 0 }
    }

    switch (context.animationQuality) {
      case 'low':
        return {
          ...baseConfig,
          duration: (baseConfig.duration || 0.3) * 0.5,
          ease: 'easeOut'
        }
      case 'medium':
        return {
          ...baseConfig,
          duration: (baseConfig.duration || 0.3) * 0.75
        }
      case 'high':
      default:
        return baseConfig
    }
  }, [shouldAnimate, context.animationQuality])

  const getSpringConfig = useCallback((baseConfig: any) => {
    if (!shouldAnimate) {
      return { duration: 0 }
    }

    switch (context.animationQuality) {
      case 'low':
        return {
          type: 'tween',
          duration: 0.2,
          ease: 'easeOut'
        }
      case 'medium':
        return {
          ...baseConfig,
          stiffness: (baseConfig.stiffness || 200) * 0.8,
          damping: (baseConfig.damping || 20) * 1.2
        }
      case 'high':
      default:
        return baseConfig
    }
  }, [shouldAnimate, context.animationQuality])

  return {
    shouldAnimate,
    animationQuality: context.animationQuality,
    performanceMode: context.performanceMode,
    getAnimationConfig,
    getSpringConfig,
    incrementInteraction: context.incrementInteractionCount
  }
}