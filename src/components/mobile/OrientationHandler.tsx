'use client'

import { useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DevicePhoneMobileIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'

interface OrientationHandlerProps {
  children: ReactNode
  preferredOrientation?: 'portrait' | 'landscape' | 'any'
  showOrientationPrompt?: boolean
}

type OrientationType = 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary'

export function OrientationHandler({
  children,
  preferredOrientation = 'any',
  showOrientationPrompt = true
}: OrientationHandlerProps) {
  const [orientation, setOrientation] = useState<OrientationType>('portrait-primary')
  const [showPrompt, setShowPrompt] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const { isMobile } = useDeviceCapabilities()

  useEffect(() => {
    if (!isMobile) return

    const updateOrientation = () => {
      const screen = window.screen as any
      const orientation = screen.orientation || screen.mozOrientation || screen.msOrientation
      
      if (orientation) {
        setOrientation(orientation.type || orientation)
      } else {
        // Fallback based on dimensions
        const isLandscape = window.innerWidth > window.innerHeight
        setOrientation(isLandscape ? 'landscape-primary' : 'portrait-primary')
      }

      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    const checkOrientationPrompt = () => {
      if (!showOrientationPrompt || preferredOrientation === 'any') return

      const isPortrait = orientation.includes('portrait')
      const isLandscape = orientation.includes('landscape')
      
      const shouldShowPrompt = 
        (preferredOrientation === 'portrait' && isLandscape) ||
        (preferredOrientation === 'landscape' && isPortrait)

      setShowPrompt(shouldShowPrompt)
    }

    // Initial setup
    updateOrientation()
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', updateOrientation)
    window.addEventListener('resize', updateOrientation)
    
    // Check if we should show orientation prompt
    const promptTimer = setTimeout(checkOrientationPrompt, 1000)

    return () => {
      window.removeEventListener('orientationchange', updateOrientation)
      window.removeEventListener('resize', updateOrientation)
      clearTimeout(promptTimer)
    }
  }, [isMobile, orientation, preferredOrientation, showOrientationPrompt])

  const handleRotateDevice = () => {
    // Try to lock orientation if supported
    if (screen.orientation && 'lock' in screen.orientation) {
      const targetOrientation: string = preferredOrientation === 'portrait' 
        ? 'portrait-primary' 
        : 'landscape-primary'
      
      (screen.orientation as any).lock(targetOrientation).catch(() => {
        // Orientation lock not supported or failed
        console.log('Orientation lock not supported')
      })
    }
    
    setShowPrompt(false)
  }

  const getOrientationStyles = () => {
    const isLandscape = orientation.includes('landscape')
    
    return {
      minHeight: isLandscape ? '100vh' : 'auto',
      transform: isLandscape && preferredOrientation === 'portrait' 
        ? 'rotate(90deg)' 
        : 'none'
    }
  }

  return (
    <div style={getOrientationStyles()}>
      {children}
      
      {/* Orientation Prompt */}
      <AnimatePresence>
        {showPrompt && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-2xl p-8 max-w-sm w-full text-center border border-slate-700"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center"
              >
                <DevicePhoneMobileIcon className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-xl font-semibold text-white mb-4">
                Rotate Your Device
              </h3>
              
              <p className="text-slate-300 mb-6 leading-relaxed">
                For the best experience, please rotate your device to{' '}
                <span className="font-semibold text-sky-400">
                  {preferredOrientation}
                </span>{' '}
                orientation.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleRotateDevice}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  Got it
                </button>
                
                <button
                  onClick={() => setShowPrompt(false)}
                  className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook for orientation-aware animations
export function useOrientationAnimations() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const { isMobile } = useDeviceCapabilities()

  useEffect(() => {
    if (!isMobile) return

    const updateOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight
      setOrientation(isLandscape ? 'landscape' : 'portrait')
    }

    updateOrientation()
    window.addEventListener('orientationchange', updateOrientation)
    window.addEventListener('resize', updateOrientation)

    return () => {
      window.removeEventListener('orientationchange', updateOrientation)
      window.removeEventListener('resize', updateOrientation)
    }
  }, [isMobile])

  const getAnimationVariants = (baseVariants: any) => {
    if (!isMobile) return baseVariants

    return {
      ...baseVariants,
      portrait: {
        ...baseVariants.initial,
        scale: orientation === 'portrait' ? 1 : 0.9,
        opacity: orientation === 'portrait' ? 1 : 0.8
      },
      landscape: {
        ...baseVariants.animate,
        scale: orientation === 'landscape' ? 1 : 0.9,
        opacity: orientation === 'landscape' ? 1 : 0.8
      }
    }
  }

  return {
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    getAnimationVariants
  }
}