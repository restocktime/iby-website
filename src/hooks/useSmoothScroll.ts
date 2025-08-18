'use client'

import { useCallback } from 'react'

export interface SmoothScrollOptions {
  duration?: number
  easing?: (t: number) => number
  offset?: number
}

export function useSmoothScroll() {
  const scrollToElement = useCallback((
    target: string | Element,
    options: SmoothScrollOptions = {}
  ) => {
    const {
      duration = 800,
      easing = (t: number) => t * (2 - t), // easeOutQuad
      offset = 0
    } = options

    const targetElement = typeof target === 'string' 
      ? document.getElementById(target.replace('#', ''))
      : target

    if (!targetElement) return

    // Check if mobile device
    const isMobile = window.innerWidth < 768
    
    if (isMobile || duration === 0) {
      // Use instant scroll on mobile to prevent scroll jumping
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo(0, targetPosition)
      return
    }

    const startPosition = window.pageYOffset
    const targetPosition = targetElement.getBoundingClientRect().top + startPosition - offset
    const distance = targetPosition - startPosition
    let startTime: number | null = null

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      
      const easedProgress = easing(progress)
      const currentPosition = startPosition + (distance * easedProgress)
      
      window.scrollTo(0, currentPosition)
      
      if (progress < 1) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation)
  }, [])

  const scrollToTop = useCallback((options: SmoothScrollOptions = {}) => {
    const { duration = 600, easing = (t: number) => t * (2 - t) } = options
    
    const startPosition = window.pageYOffset
    let startTime: number | null = null

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      
      const easedProgress = easing(progress)
      const currentPosition = startPosition * (1 - easedProgress)
      
      window.scrollTo(0, currentPosition)
      
      if (progress < 1) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation)
  }, [])

  const scrollToSection = useCallback((sectionId: string, options: SmoothScrollOptions = {}) => {
    scrollToElement(`#${sectionId}`, { offset: 80, ...options })
  }, [scrollToElement])

  return {
    scrollToElement,
    scrollToTop,
    scrollToSection
  }
}