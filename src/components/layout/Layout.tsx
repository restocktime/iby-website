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

  // Enable smooth scrolling globally (but not on mobile)
  useEffect(() => {
    // Only enable smooth scrolling on desktop
    if (!isMobile) {
      document.documentElement.style.scrollBehavior = 'smooth'
    } else {
      // Force auto scroll behavior on mobile
      document.documentElement.style.scrollBehavior = 'auto'
    }
    
    // Add touch-action optimization for mobile
    if (supportsTouch) {
      document.body.style.touchAction = 'pan-y'
    }

    return () => {
      if (!isMobile) {
        document.documentElement.style.scrollBehavior = 'auto'
      }
      if (supportsTouch) {
        document.body.style.touchAction = 'auto'
      }
    }
  }, [supportsTouch, isMobile])

  // Handle touch gestures for mobile navigation (DISABLED to fix scroll issues)
  useEffect(() => {
    // Disable touch gesture navigation on mobile to prevent scroll offset issues
    // This was causing the scroll jumping behavior
    return
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