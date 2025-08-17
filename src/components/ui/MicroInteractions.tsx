'use client'

import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useAnimationSettings } from '@/contexts/AnimationContext'
import { useGestureRecognition } from '@/hooks/useGestureRecognition'
import { usePhysicsAnimation } from '@/hooks/usePhysicsAnimation'
import { springConfigs } from '@/lib/animations'
import { cn } from '@/lib/utils'

// Magnetic Button Component
interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  strength?: number
  className?: string
}

export function MagneticButton({ 
  children, 
  strength = 0.3, 
  className, 
  ...props 
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { shouldAnimate, incrementInteraction } = useAnimationSettings()
  // Simple magnetic effect using motion values
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    incrementInteraction()
    props.onClick?.(e)
  }

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
      className={cn(
        "relative px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors hover:bg-blue-700 overflow-hidden",
        className
      )}
      style={shouldAnimate ? { x, y } : undefined}
      whileHover={shouldAnimate ? { scale: 1.05 } : undefined}
      whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
      onClick={handleClick}
      {...filteredProps}
    >
      {/* Ripple effect */}
      {shouldAnimate && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-lg"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 2, opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.5 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// Floating Card Component
interface FloatingCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export function FloatingCard({ children, className, intensity = 1 }: FloatingCardProps) {
  const { shouldAnimate } = useAnimationSettings()
  
  return (
    <motion.div
      className={cn("bg-white rounded-xl shadow-lg p-6", className)}
      animate={shouldAnimate ? {
        y: [0, -10 * intensity, 0],
        rotateX: [0, 2 * intensity, 0],
        rotateY: [0, -1 * intensity, 0]
      } : undefined}
      transition={shouldAnimate ? {
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut"
      } : undefined}
      whileHover={shouldAnimate ? {
        y: -15 * intensity,
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
      } : undefined}
    >
      {children}
    </motion.div>
  )
}

// Physics-based Draggable Component
interface DraggableProps {
  children: React.ReactNode
  className?: string
  bounds?: { x: { min: number; max: number }; y: { min: number; max: number } }
  onDragEnd?: (x: number, y: number) => void
}

export function Draggable({ children, className, bounds, onDragEnd }: DraggableProps) {
  const { shouldAnimate, incrementInteraction } = useAnimationSettings()
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = () => {
    setIsDragging(true)
    incrementInteraction()
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number; y: number } }) => {
    setIsDragging(false)
    onDragEnd?.(info.point.x, info.point.y)
  }

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn("cursor-grab active:cursor-grabbing", className)}
      drag
      dragConstraints={bounds ? {
        left: bounds.x.min,
        right: bounds.x.max,
        top: bounds.y.min,
        bottom: bounds.y.max
      } : undefined}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      whileDrag={{ scale: 1.1, rotate: 5, zIndex: 1000 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      animate={{
        boxShadow: isDragging 
          ? "0 25px 50px rgba(0,0,0,0.25)" 
          : "0 10px 25px rgba(0,0,0,0.1)"
      }}
    >
      {children}
    </motion.div>
  )
}

// Morphing Shape Component
interface MorphingShapeProps {
  shapes: string[]
  className?: string
  duration?: number
}

export function MorphingShape({ shapes, className, duration = 3 }: MorphingShapeProps) {
  const { shouldAnimate } = useAnimationSettings()
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0)

  React.useEffect(() => {
    if (!shouldAnimate) return

    const interval = setInterval(() => {
      setCurrentShapeIndex((prev) => (prev + 1) % shapes.length)
    }, duration * 1000)

    return () => clearInterval(interval)
  }, [shapes.length, duration, shouldAnimate])

  if (!shouldAnimate) {
    return (
      <svg className={className} viewBox="0 0 100 100">
        <path d={shapes[0]} fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg className={className} viewBox="0 0 100 100">
      <motion.path
        d={shapes[currentShapeIndex]}
        fill="currentColor"
        animate={{ d: shapes[currentShapeIndex] }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </svg>
  )
}

// Liquid Button Component
interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  liquidColor?: string
}

export function LiquidButton({ children, liquidColor = "#3b82f6", ...props }: LiquidButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { shouldAnimate, incrementInteraction } = useAnimationSettings()
  const [isHovered, setIsHovered] = useState(false)
  
  const liquidX = useMotionValue(0)
  const liquidY = useMotionValue(0)
  const liquidScale = useMotionValue(0)

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

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!shouldAnimate || !buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    liquidX.set(x)
    liquidY.set(y)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (shouldAnimate) {
      liquidScale.set(1)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (shouldAnimate) {
      liquidScale.set(0)
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    incrementInteraction()
    
    if (shouldAnimate) {
      // Create ripple effect
      liquidScale.set(0)
      liquidScale.set(3)
      setTimeout(() => liquidScale.set(0), 600)
    }
    
    props.onClick?.(e)
  }

  return (
    <motion.button
      ref={buttonRef}
      className="relative px-8 py-4 bg-gray-100 text-gray-800 rounded-full font-medium overflow-hidden transition-colors hover:bg-gray-200"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={shouldAnimate ? { scale: 1.05 } : undefined}
      whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
      {...filteredProps}
    >
      {/* Liquid effect */}
      {shouldAnimate && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${liquidX}px ${liquidY}px, ${liquidColor} 0%, transparent 70%)`,
            scale: liquidScale,
            x: liquidX,
            y: liquidY
          }}
        />
      )}
      
      <span className="relative z-10 mix-blend-difference text-white">
        {children}
      </span>
    </motion.button>
  )
}

// Particle Trail Component
interface ParticleTrailProps {
  children: React.ReactNode
  particleCount?: number
  particleColor?: string
  className?: string
}

export function ParticleTrail({ 
  children, 
  particleCount = 20, 
  particleColor = "#3b82f6",
  className 
}: ParticleTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { shouldAnimate } = useAnimationSettings()
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!shouldAnimate) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    setParticles(prev => [
      { id: Date.now(), x, y },
      ...prev.slice(0, particleCount - 1)
    ])
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
    >
      {children}
      
      {/* Particle trail */}
      {shouldAnimate && particles.map((particle, index) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            backgroundColor: particleColor,
            left: particle.x - 4,
            top: particle.y - 4
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ 
            opacity: 0, 
            scale: 0,
            x: (Math.random() - 0.5) * 20,
            y: (Math.random() - 0.5) * 20
          }}
          transition={{ 
            duration: 1,
            delay: index * 0.05,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}

// Elastic Scale Component
interface ElasticScaleProps {
  children: React.ReactNode
  className?: string
  scaleIntensity?: number
}

export function ElasticScale({ children, className, scaleIntensity = 1.1 }: ElasticScaleProps) {
  const { shouldAnimate, incrementInteraction } = useAnimationSettings()

  return (
    <motion.div
      className={className}
      whileHover={shouldAnimate ? { scale: scaleIntensity } : undefined}
      whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
      transition={shouldAnimate ? springConfigs.bouncy : undefined}
      onClick={() => incrementInteraction()}
    >
      {children}
    </motion.div>
  )
}