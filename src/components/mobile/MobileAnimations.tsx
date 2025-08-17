'use client'

import { ReactNode } from 'react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'
import { useOrientationAnimations } from './OrientationHandler'

interface MobileAnimationProps {
  children: ReactNode
  type?: 'fade' | 'slide' | 'scale' | 'bounce' | 'flip'
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
  className?: string
  disabled?: boolean
}

export function MobileAnimation({
  children,
  type = 'fade',
  direction = 'up',
  delay = 0,
  duration,
  className = '',
  disabled = false
}: MobileAnimationProps) {
  const { isMobile, isLowEndDevice, performanceLevel } = useDeviceCapabilities()
  const { orientation, getAnimationVariants } = useOrientationAnimations()
  const shouldReduceMotion = useReducedMotion()

  // Disable animations for low-end devices or if user prefers reduced motion
  if (disabled || shouldReduceMotion || (isLowEndDevice && performanceLevel === 'low')) {
    return <div className={className}>{children}</div>
  }

  // Adjust animation duration based on device performance
  const getOptimizedDuration = () => {
    if (duration) return duration
    
    const baseDuration = 0.6
    
    if (performanceLevel === 'low') return baseDuration * 1.5
    if (performanceLevel === 'medium') return baseDuration * 1.2
    return baseDuration
  }

  // Create animation variants based on type and direction
  const createVariants = (): Variants => {
    const optimizedDuration = getOptimizedDuration()
    
    const baseVariants: Variants = {
      initial: {},
      animate: {},
      exit: {}
    }

    switch (type) {
      case 'fade':
        baseVariants.initial = { opacity: 0 }
        baseVariants.animate = { opacity: 1 }
        baseVariants.exit = { opacity: 0 }
        break

      case 'slide':
        const slideDistance = isMobile ? 30 : 50
        const slideMap = {
          up: { y: slideDistance },
          down: { y: -slideDistance },
          left: { x: slideDistance },
          right: { x: -slideDistance }
        }
        
        baseVariants.initial = { 
          opacity: 0, 
          ...slideMap[direction] 
        }
        baseVariants.animate = { 
          opacity: 1, 
          x: 0, 
          y: 0 
        }
        baseVariants.exit = { 
          opacity: 0, 
          ...slideMap[direction] 
        }
        break

      case 'scale':
        const scaleAmount = isMobile ? 0.9 : 0.8
        baseVariants.initial = { 
          opacity: 0, 
          scale: scaleAmount 
        }
        baseVariants.animate = { 
          opacity: 1, 
          scale: 1 
        }
        baseVariants.exit = { 
          opacity: 0, 
          scale: scaleAmount 
        }
        break

      case 'bounce':
        baseVariants.initial = { 
          opacity: 0, 
          y: isMobile ? 20 : 30,
          scale: 0.9 
        }
        baseVariants.animate = { 
          opacity: 1, 
          y: 0,
          scale: 1,
          transition: {
            type: 'spring',
            damping: 15,
            stiffness: 300,
            duration: optimizedDuration
          }
        }
        baseVariants.exit = { 
          opacity: 0, 
          y: isMobile ? 20 : 30,
          scale: 0.9 
        }
        break

      case 'flip':
        baseVariants.initial = { 
          opacity: 0, 
          rotateX: direction === 'up' || direction === 'down' ? 90 : 0,
          rotateY: direction === 'left' || direction === 'right' ? 90 : 0
        }
        baseVariants.animate = { 
          opacity: 1, 
          rotateX: 0,
          rotateY: 0
        }
        baseVariants.exit = { 
          opacity: 0, 
          rotateX: direction === 'up' || direction === 'down' ? -90 : 0,
          rotateY: direction === 'left' || direction === 'right' ? -90 : 0
        }
        break
    }

    return getAnimationVariants(baseVariants)
  }

  const variants = createVariants()

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: getOptimizedDuration(),
        delay,
        ease: isMobile ? 'easeOut' : 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}

// Specialized mobile scroll animations
export function MobileScrollAnimation({
  children,
  threshold = 0.1,
  className = ''
}: {
  children: ReactNode
  threshold?: number
  className?: string
}) {
  const { isMobile, isLowEndDevice } = useDeviceCapabilities()
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion || isLowEndDevice) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: isMobile ? 20 : 40 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: isMobile ? 0.4 : 0.6,
          ease: 'easeOut'
        }
      }}
      viewport={{ 
        once: true, 
        amount: threshold,
        margin: isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px'
      }}
    >
      {children}
    </motion.div>
  )
}

// Touch-optimized button animations
export function MobileTouchButton({
  children,
  onClick,
  className = '',
  hapticFeedback = true,
  ...props
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
  hapticFeedback?: boolean
  [key: string]: any
}) {
  const { isMobile } = useDeviceCapabilities()

  const handleClick = () => {
    if (hapticFeedback && navigator.vibrate) {
      navigator.vibrate([10])
    }
    onClick?.()
  }

  if (!isMobile) {
    return (
      <button onClick={handleClick} className={className} {...props}>
        {children}
      </button>
    )
  }

  return (
    <motion.button
      onClick={handleClick}
      className={className}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Staggered mobile animations for lists
export function MobileStaggerContainer({
  children,
  staggerDelay = 0.1,
  className = ''
}: {
  children: ReactNode
  staggerDelay?: number
  className?: string
}) {
  const { isLowEndDevice } = useDeviceCapabilities()
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion || isLowEndDevice) {
    return <div className={className}>{children}</div>
  }

  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  )
}

export function MobileStaggerItem({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  const { isMobile } = useDeviceCapabilities()

  const itemVariants: Variants = {
    initial: { 
      opacity: 0, 
      y: isMobile ? 15 : 25 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.5,
        ease: 'easeOut'
      }
    }
  }

  return (
    <motion.div
      className={className}
      variants={itemVariants}
    >
      {children}
    </motion.div>
  )
}