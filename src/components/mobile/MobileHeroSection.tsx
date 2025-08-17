'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'
import { MobileGestureHandler, useHapticFeedback } from './MobileGestureHandler'
import { MobileAnimation, MobileTouchButton } from './MobileAnimations'
import { OrientationHandler } from './OrientationHandler'

interface MobileHeroSectionProps {
  children: React.ReactNode
}

export function MobileHeroSection({ children }: MobileHeroSectionProps) {
  const { isMobile, isLowEndDevice, performanceLevel } = useDeviceCapabilities()
  const { triggerHaptic } = useHapticFeedback()
  const heroRef = useRef<HTMLElement>(null)

  const handleSwipeUp = () => {
    triggerHaptic('light')
    const projectsSection = document.getElementById('projects')
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleDoubleTap = () => {
    triggerHaptic('medium')
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (!isMobile) {
    return <>{children}</>
  }

  return (
    <OrientationHandler preferredOrientation="portrait">
      <MobileGestureHandler
        onSwipeUp={handleSwipeUp}
        onDoubleTap={handleDoubleTap}
        className="min-h-screen"
      >
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
          style={{
            // Optimize for mobile viewport - use dynamic viewport height
            minHeight: '100dvh', // Dynamic viewport height for mobile
          }}
        >
          {/* Mobile-optimized background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900" />
          
          {/* Simplified particle effect for mobile */}
          {!isLowEndDevice && performanceLevel !== 'low' && (
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.1),transparent_50%)]" />
            </div>
          )}

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-8">
            <MobileAnimation type="fade" delay={0.2}>
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                Isaac Benyakar
              </motion.h1>
            </MobileAnimation>

            <MobileAnimation type="slide" direction="up" delay={0.4}>
              <div className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 max-w-sm">
                Full-Stack Developer & Automation Expert
              </div>
            </MobileAnimation>

            <MobileAnimation type="scale" delay={0.6}>
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <MobileTouchButton
                  onClick={() => {
                    const projectsSection = document.getElementById('projects')
                    projectsSection?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg active:shadow-md transition-all duration-200"
                >
                  View My Work
                </MobileTouchButton>
                
                <MobileTouchButton
                  onClick={() => {
                    const contactSection = document.getElementById('contact')
                    contactSection?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full py-4 border-2 border-white/30 text-white font-semibold rounded-xl backdrop-blur-sm hover:bg-white/10 active:bg-white/20 transition-all duration-200"
                >
                  Get In Touch
                </MobileTouchButton>
              </div>
            </MobileAnimation>

            {/* Mobile-specific interaction hints */}
            <MobileAnimation type="fade" delay={1.0}>
              <div className="mt-8 text-center">
                <div className="text-white/60 text-sm mb-2">
                  Swipe up to explore projects
                </div>
                <div className="text-white/40 text-xs">
                  Double tap to contact me
                </div>
              </div>
            </MobileAnimation>
          </div>

          {/* Mobile scroll indicator */}
          <MobileAnimation type="bounce" delay={1.2}>
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <motion.div
                  className="w-1 h-3 bg-white/60 rounded-full mt-2"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </MobileAnimation>

          {/* Performance indicator for debugging */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-4 left-4 text-xs text-white/50 bg-black/20 px-2 py-1 rounded">
              {performanceLevel} | {isLowEndDevice ? 'Low-end' : 'Standard'}
            </div>
          )}
        </section>
      </MobileGestureHandler>
    </OrientationHandler>
  )
}