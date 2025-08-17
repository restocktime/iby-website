'use client'

import { useState, useEffect } from 'react'
import { throttle } from '@/lib/utils'

export interface ScrollProgress {
  progress: number // 0 to 1
  direction: 'up' | 'down'
  isAtTop: boolean
  isAtBottom: boolean
  currentSection: string | null
}

export function useScrollProgress(): ScrollProgress {
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
    progress: 0,
    direction: 'down',
    isAtTop: true,
    isAtBottom: false,
    currentSection: null
  })

  useEffect(() => {
    let lastScrollY = window.scrollY

    const updateScrollProgress = throttle(() => {
      const currentScrollY = window.scrollY
      const documentHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight
      const maxScroll = documentHeight - windowHeight

      const progress = maxScroll > 0 ? Math.min(currentScrollY / maxScroll, 1) : 0
      const direction = currentScrollY > lastScrollY ? 'down' : 'up'
      const isAtTop = currentScrollY < 10
      const isAtBottom = currentScrollY >= maxScroll - 10

      // Determine current section
      const sections = ['hero', 'about', 'projects', 'skills', 'contact']
      let currentSection: string | null = null

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + currentScrollY
          const elementBottom = elementTop + rect.height

          if (currentScrollY >= elementTop - 100 && currentScrollY < elementBottom - 100) {
            currentSection = sectionId
            break
          }
        }
      }

      setScrollProgress({
        progress,
        direction,
        isAtTop,
        isAtBottom,
        currentSection
      })

      lastScrollY = currentScrollY
    }, 16) // ~60fps

    // Initial calculation
    updateScrollProgress()

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    window.addEventListener('resize', updateScrollProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('resize', updateScrollProgress)
    }
  }, [])

  return scrollProgress
}