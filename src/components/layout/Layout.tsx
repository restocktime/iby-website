'use client'

import { ReactNode, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import { ScrollTracker } from './ScrollTracker'
import { MobileNavigation } from '../mobile/MobileNavigation'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'
import { AnimationProvider } from '@/contexts/AnimationContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { isMobile, supportsTouch } = useDeviceCapabilities()

  // Enable smooth scrolling globally
  useEffect(() => {
    // Add smooth scrolling behavior to html element
    document.documentElement.style.scrollBehavior = 'smooth'
    
    // Add touch-action optimization for mobile
    if (supportsTouch) {
      document.body.style.touchAction = 'pan-y'
    }

    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
      if (supportsTouch) {
        document.body.style.touchAction = 'auto'
      }
    }
  }, [supportsTouch])

  // Handle touch gestures for mobile navigation
  useEffect(() => {
    if (!supportsTouch) return

    let startY = 0
    let startTime = 0

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
      startTime = Date.now()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY
      const endTime = Date.now()
      const deltaY = startY - endY
      const deltaTime = endTime - startTime

      // Quick downward swipe to scroll to next section
      if (deltaY < -100 && deltaTime < 300) {
        const currentSection = getCurrentSection()
        const nextSection = getNextSection(currentSection)
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
      // Quick upward swipe to scroll to previous section
      else if (deltaY > 100 && deltaTime < 300) {
        const currentSection = getCurrentSection()
        const prevSection = getPreviousSection(currentSection)
        if (prevSection) {
          prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [supportsTouch])

  const getCurrentSection = (): Element | null => {
    const sections = ['hero', 'about', 'projects', 'skills', 'contact']
    
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId)
      if (element) {
        const rect = element.getBoundingClientRect()
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          return element
        }
      }
    }
    
    return null
  }

  const getNextSection = (currentSection: Element | null): Element | null => {
    if (!currentSection) return null
    
    const sections = ['hero', 'about', 'projects', 'skills', 'contact']
    const currentIndex = sections.indexOf(currentSection.id)
    
    if (currentIndex >= 0 && currentIndex < sections.length - 1) {
      return document.getElementById(sections[currentIndex + 1])
    }
    
    return null
  }

  const getPreviousSection = (currentSection: Element | null): Element | null => {
    if (!currentSection) return null
    
    const sections = ['hero', 'about', 'projects', 'skills', 'contact']
    const currentIndex = sections.indexOf(currentSection.id)
    
    if (currentIndex > 0) {
      return document.getElementById(sections[currentIndex - 1])
    }
    
    return null
  }

  return (
    <AnimationProvider>
      <div className="min-h-screen flex flex-col relative">
        <Header />
        
        <motion.main 
          className={`flex-1 ${isMobile ? 'pb-20' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.main>
        
        <Footer />
        <ScrollToTop />
        <ScrollTracker />
        <MobileNavigation />

        {/* Mobile Touch Indicator */}
        {isMobile && supportsTouch && (
          <motion.div
            className="fixed bottom-20 right-6 z-30 bg-black/20 backdrop-blur-sm rounded-full p-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <motion.div
                className="w-1 h-4 bg-white/60 rounded-full"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </AnimationProvider>
  )
}