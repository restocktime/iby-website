'use client'

import { useEffect } from 'react'
import { useEngagementTracking } from '@/hooks/useEngagementTracking-simple'

export function ScrollTracker() {
  const { trackScrollDepth, trackInteraction } = useEngagementTracking()

  useEffect(() => {
    let lastScrollTop = 0
    let maxScrollDepth = 0

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / scrollHeight) * 100

      // Update max scroll depth
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent
        trackScrollDepth(scrollPercent)
      }

      // Track scroll interactions
      lastScrollTop = scrollTop

      // Throttle scroll events
      if (Math.abs(scrollTop - lastScrollTop) > 50) {
        trackInteraction({
          eventType: 'scroll',
          element: 'page',
          timestamp: new Date(),
          duration: 0
        })
      }

      // Track section visibility
      const sections = ['hero', 'about', 'projects', 'skills', 'contact']
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0
          
          if (isVisible) {
            trackInteraction({
              eventType: 'scroll',
              element: `${sectionId}-section`,
              timestamp: new Date(),
              duration: 0
            })
          }
        }
      })
    }

    // Throttled scroll handler
    let ticking = false
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScrollHandler, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler)
    }
  }, [trackScrollDepth, trackInteraction])

  return null // This component doesn't render anything
}