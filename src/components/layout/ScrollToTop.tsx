'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { useGestureRecognition } from '@/hooks/useGestureRecognition'
import { useAnimationSettings } from '@/contexts/AnimationContext'
import { springConfigs } from '@/lib/animations'
import QuickActionButton from '@/components/ui/QuickActionButton'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { scrollPosition } = useScrollPosition()
  const { scrollToTop } = useSmoothScroll()
  const { shouldAnimate, incrementInteraction } = useAnimationSettings()
  const buttonRef = useRef<HTMLDivElement>(null)

  // Magnetic effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, springConfigs.gentle)
  const springY = useSpring(y, springConfigs.gentle)

  useEffect(() => {
    setIsVisible(scrollPosition > 300)
  }, [scrollPosition])

  // Enhanced scroll to top with interaction tracking
  const handleScrollToTop = () => {
    scrollToTop()
    incrementInteraction()
  }

  // Magnetic effect on mouse move
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!shouldAnimate || !buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (event.clientX - centerX) * 0.3
    const deltaY = (event.clientY - centerY) * 0.3

    x.set(deltaX)
    y.set(deltaY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  // Gesture recognition for mobile
  useGestureRecognition(buttonRef, {
    onTap: () => {
      handleScrollToTop()
    },
    onLongPress: () => {
      // Long press to scroll to bottom
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      })
      incrementInteraction()
    }
  })

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={buttonRef}
          className="fixed bottom-6 right-6 z-50"
          style={shouldAnimate ? { x: springX, y: springY } : undefined}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={shouldAnimate ? springConfigs.bouncy : { duration: 0.2 }}
        >
          <QuickActionButton
            onClick={handleScrollToTop}
            tooltip="Scroll to top (long press for bottom)"
            variant="primary"
            className="relative overflow-hidden"
          >
            {/* Pulsing ring effect */}
            {shouldAnimate && isHovered && (
              <motion.div
                className="absolute inset-0 border-2 border-white/30 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              />
            )}

            {/* Progress indicator ring */}
            {shouldAnimate && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, transparent ${360 - (scrollPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 360}deg, rgba(255,255,255,0.3) ${360 - (scrollPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 360}deg)`
                }}
              />
            )}

            <motion.svg
              className="w-5 h-5 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ y: 0 }}
              animate={shouldAnimate ? { y: [-2, 2, -2] } : undefined}
              transition={shouldAnimate ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </motion.svg>
          </QuickActionButton>
        </motion.div>
      )}
    </AnimatePresence>
  )
}