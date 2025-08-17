'use client'

import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useAnimationSettings } from '@/contexts/AnimationContext'
import { useGestureRecognition } from '@/hooks/useGestureRecognition'
import { buttonVariants, springConfigs } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  ripple?: boolean
  magnetic?: boolean
  children: React.ReactNode
}

export function AnimatedButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  ripple = true,
  magnetic = false,
  className,
  children,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { shouldAnimate, getSpringConfig, incrementInteraction } = useAnimationSettings()
  
  // Magnetic effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, springConfigs.gentle)
  const springY = useSpring(y, springConfigs.gentle)

  // Ripple effect
  const rippleX = useMotionValue(0)
  const rippleY = useMotionValue(0)
  const rippleScale = useMotionValue(0)

  // Handle mouse movement for magnetic effect
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!magnetic || !shouldAnimate) return

    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (event.clientX - centerX) * 0.3
    const deltaY = (event.clientY - centerY) * 0.3

    x.set(deltaX)
    y.set(deltaY)
  }

  const handleMouseLeave = () => {
    if (!magnetic) return
    x.set(0)
    y.set(0)
  }

  // Handle click with ripple effect
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    incrementInteraction()

    if (ripple && shouldAnimate && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const rippleXPos = event.clientX - rect.left
      const rippleYPos = event.clientY - rect.top

      rippleX.set(rippleXPos)
      rippleY.set(rippleYPos)
      rippleScale.set(0)
      
      // Animate ripple
      rippleScale.set(1)
      setTimeout(() => rippleScale.set(0), 600)
    }

    onClick?.(event)
  }

  // Gesture recognition for mobile
  useGestureRecognition(buttonRef, {
    onTap: () => {
      if (buttonRef.current) {
        buttonRef.current.click()
      }
    }
  })

  const baseClasses = cn(
    'relative overflow-hidden font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    {
      // Variants
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': variant === 'secondary',
      'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500': variant === 'ghost',
      'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500': variant === 'outline',
      
      // Sizes
      'px-3 py-1.5 text-sm rounded-md': size === 'sm',
      'px-4 py-2 text-base rounded-lg': size === 'md',
      'px-6 py-3 text-lg rounded-xl': size === 'lg',
    },
    className
  )

  // Filter out conflicting props
  const { 
    onAnimationStart, 
    onAnimationEnd, 
    onDragStart,
    onDragEnd,
    onDrag,
    onTransitionEnd,
    ...filteredProps 
  } = props

  return (
    <motion.button
      ref={buttonRef}
      className={baseClasses}
      variants={shouldAnimate ? buttonVariants : undefined}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      animate={loading ? "loading" : "idle"}
      style={magnetic ? { x: springX, y: springY } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      transition={getSpringConfig(springConfigs.snappy)}
      {...filteredProps}
    >
      {/* Ripple effect */}
      {ripple && shouldAnimate && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${rippleX}px ${rippleY}px, rgba(255,255,255,0.3) 0%, transparent 70%)`
          }}
          animate={{
            scale: 4,
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}

      {/* Button content */}
      <motion.span
        className={cn("relative z-10", loading && "opacity-0")}
        initial={{ opacity: 1 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </motion.button>
  )
}