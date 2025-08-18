'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useAnimationSettings } from '@/contexts/AnimationContext'
import { sectionVariants, createStaggerVariants } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface SectionTransitionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  stagger?: boolean
  staggerDelay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  threshold?: number
  triggerOnce?: boolean
  id?: string
  role?: string
  'aria-labelledby'?: string
  'aria-label'?: string
}

export function SectionTransition({
  children,
  className,
  delay = 0,
  stagger = false,
  staggerDelay = 0.1,
  direction = 'up',
  threshold = 0.1,
  triggerOnce = true,
  id,
  role,
  'aria-labelledby': ariaLabelledBy,
  'aria-label': ariaLabel
}: SectionTransitionProps) {
  const [ref, { isIntersecting }] = useIntersectionObserver({
    threshold,
    triggerOnce,
    rootMargin: '0px 0px -10% 0px'
  })

  const { shouldAnimate, getAnimationConfig } = useAnimationSettings()

  const getDirectionVariants = () => {
    const baseDistance = 60
    
    switch (direction) {
      case 'down':
        return {
          hidden: { opacity: 0, y: -baseDistance, scale: 0.95 },
          visible: { opacity: 1, y: 0, scale: 1 }
        }
      case 'left':
        return {
          hidden: { opacity: 0, x: baseDistance, scale: 0.95 },
          visible: { opacity: 1, x: 0, scale: 1 }
        }
      case 'right':
        return {
          hidden: { opacity: 0, x: -baseDistance, scale: 0.95 },
          visible: { opacity: 1, x: 0, scale: 1 }
        }
      case 'up':
      default:
        return {
          hidden: { opacity: 0, y: baseDistance, scale: 0.95 },
          visible: { opacity: 1, y: 0, scale: 1 }
        }
    }
  }

  const variants = stagger 
    ? createStaggerVariants(staggerDelay, delay)
    : {
        ...getDirectionVariants(),
        visible: {
          ...getDirectionVariants().visible,
          transition: getAnimationConfig({
            type: "spring",
            stiffness: 120,
            damping: 14,
            delay
          })
        }
      }

  if (!shouldAnimate) {
    return (
      <div 
        ref={ref as React.RefObject<HTMLDivElement>} 
        className={className} 
        id={id}
        role={role}
        aria-labelledby={ariaLabelledBy}
        aria-label={ariaLabel}
      >
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      id={id}
      role={role}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      variants={variants}
      initial="hidden"
      animate={isIntersecting ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  )
}

// Specialized component for staggered list animations
interface StaggeredListProps {
  children: React.ReactNode[]
  className?: string
  itemClassName?: string
  staggerDelay?: number
  threshold?: number
  role?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

export function StaggeredList({
  children,
  className,
  itemClassName,
  staggerDelay = 0.1,
  threshold = 0.1,
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy
}: StaggeredListProps) {
  const [ref, { isIntersecting }] = useIntersectionObserver({
    threshold,
    triggerOnce: true
  })

  const { shouldAnimate, getAnimationConfig } = useAnimationSettings()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: getAnimationConfig({
        type: "spring",
        stiffness: 120,
        damping: 14
      })
    }
  }

  if (!shouldAnimate) {
    return (
      <div 
        ref={ref as React.RefObject<HTMLDivElement>} 
        className={className}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {children.map((child, index) => (
          <div key={index} className={itemClassName}>
            {child}
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      variants={containerVariants}
      initial="hidden"
      animate={isIntersecting ? "visible" : "hidden"}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          className={itemClassName}
          variants={itemVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Component for parallax section transitions
interface ParallaxSectionProps {
  children: React.ReactNode
  className?: string
  speed?: number
  offset?: number
}

export function ParallaxSection({
  children,
  className,
  speed = 0.5,
  offset = 0
}: ParallaxSectionProps) {
  const [ref, { isIntersecting, entry }] = useIntersectionObserver({
    threshold: 0,
    triggerOnce: false
  })

  const { shouldAnimate } = useAnimationSettings()

  const getParallaxY = () => {
    if (!entry || !shouldAnimate || typeof window === 'undefined') return 0
    
    const elementTop = entry.boundingClientRect.top
    const elementHeight = entry.boundingClientRect.height
    const windowHeight = window.innerHeight
    
    // Calculate parallax offset based on element position
    const scrollProgress = (windowHeight - elementTop) / (windowHeight + elementHeight)
    return (scrollProgress - 0.5) * speed * 100 + offset
  }

  if (!shouldAnimate) {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={{
        y: isIntersecting ? getParallaxY() : 0
      }}
      transition={{ type: "spring", stiffness: 100, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}