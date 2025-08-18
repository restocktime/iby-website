'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'

interface MotionControlsProps {
  onMotionToggle?: (enabled: boolean) => void
  className?: string
}

export default function MotionControls({ onMotionToggle, className = '' }: MotionControlsProps) {
  const [motionEnabled, setMotionEnabled] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { isMobile } = useDeviceCapabilities()

  // Check for system preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    // If user prefers reduced motion, disable animations by default
    if (mediaQuery.matches) {
      setMotionEnabled(false)
    }

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
      if (event.matches) {
        setMotionEnabled(false)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Load saved preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('motion-preference')
    if (savedPreference !== null) {
      const enabled = savedPreference === 'true'
      setMotionEnabled(enabled)
    } else if (prefersReducedMotion) {
      // Default to disabled if system prefers reduced motion
      setMotionEnabled(false)
    }

    // Show controls after a delay
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [prefersReducedMotion])

  // Handle motion toggle
  const handleToggle = () => {
    const newState = !motionEnabled
    setMotionEnabled(newState)
    localStorage.setItem('motion-preference', newState.toString())
    
    if (onMotionToggle) {
      onMotionToggle(newState)
    }
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('motionPreferenceChange', { 
      detail: { enabled: newState } 
    }))
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`fixed bottom-6 right-6 z-50 ${className}`}
        >
          <motion.button
            onClick={handleToggle}
            className="group bg-white/95 backdrop-blur-lg border border-white/20 shadow-xl hover:shadow-2xl rounded-2xl p-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label={motionEnabled ? 'Disable animations' : 'Enable animations'}
            role="switch"
            aria-checked={motionEnabled}
            title={motionEnabled ? 'Disable animations' : 'Enable animations'}
          >
            <div className="flex items-center gap-3">
              {/* Icon */}
              <motion.div
                className="relative w-6 h-6"
                animate={{ rotate: motionEnabled ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {motionEnabled ? (
                  <motion.svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-blue-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.path
                      d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                      fill="currentColor"
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        rotate: {
                          duration: 8,
                          repeat: Infinity,
                          ease: 'linear'
                        },
                        scale: {
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }
                      }}
                    />
                    <motion.circle
                      cx="12"
                      cy="12"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      fill="none"
                      opacity="0.3"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  </motion.svg>
                ) : (
                  <motion.svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-slate-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <path
                      d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                    <motion.line
                      x1="3"
                      y1="21"
                      x2="21"
                      y2="3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />
                  </motion.svg>
                )}
              </motion.div>

              {/* Text (hidden on mobile) */}
              {!isMobile && (
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-slate-900">
                    {motionEnabled ? 'Animations On' : 'Animations Off'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {motionEnabled ? 'Click to disable' : 'Click to enable'}
                  </span>
                </div>
              )}

              {/* System preference indicator */}
              {prefersReducedMotion && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-2 h-2 bg-orange-400 rounded-full"
                  title="System prefers reduced motion"
                />
              )}
            </div>

            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 bg-blue-100 rounded-2xl pointer-events-none"
              initial={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 2, opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.4 }}
            />
          </motion.button>

          {/* Help tooltip */}
          <AnimatePresence>
            {prefersReducedMotion && motionEnabled && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-full right-0 mb-2 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl max-w-xs"
              >
                <div className="relative">
                  Your system prefers reduced motion, but animations are currently enabled. 
                  You can disable them using this control.
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Custom hook for components to use motion preferences
export const useMotionPreference = () => {
  const [motionEnabled, setMotionEnabled] = useState(true)

  useEffect(() => {
    // Check initial preference
    const savedPreference = localStorage.getItem('motion-preference')
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    if (savedPreference !== null) {
      setMotionEnabled(savedPreference === 'true')
    } else if (mediaQuery.matches) {
      setMotionEnabled(false)
    }

    // Listen for preference changes
    const handleMotionChange = (event: CustomEvent) => {
      setMotionEnabled(event.detail.enabled)
    }

    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches && localStorage.getItem('motion-preference') === null) {
        setMotionEnabled(false)
      }
    }

    window.addEventListener('motionPreferenceChange', handleMotionChange as EventListener)
    mediaQuery.addEventListener('change', handleMediaChange)

    return () => {
      window.removeEventListener('motionPreferenceChange', handleMotionChange as EventListener)
      mediaQuery.removeEventListener('change', handleMediaChange)
    }
  }, [])

  return { motionEnabled }
}