'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useAnimationSettings } from '@/contexts/AnimationContext'
import { springConfigs } from '@/lib/animations'

export interface PhysicsConfig {
  mass?: number
  stiffness?: number
  damping?: number
  velocity?: number
  restDelta?: number
  restSpeed?: number
}

export interface UsePhysicsAnimationOptions {
  initialValue?: number
  config?: PhysicsConfig
  bounds?: { min: number; max: number }
  onUpdate?: (value: number) => void
  onRest?: () => void
}

export function usePhysicsAnimation(options: UsePhysicsAnimationOptions = {}) {
  const {
    initialValue = 0,
    config = springConfigs.gentle,
    bounds,
    onUpdate,
    onRest
  } = options

  const { shouldAnimate } = useAnimationSettings()
  const motionValue = useMotionValue(initialValue)
  const springValue = useSpring(motionValue, config)
  const isRestingRef = useRef(false)

  // Apply bounds if specified
  const boundedValue = useTransform(springValue, (value) => 
    bounds ? Math.max(bounds.min, Math.min(bounds.max, value)) : value
  )

  // Handle updates and rest detection
  useEffect(() => {
    const unsubscribe = boundedValue.onChange((value) => {
      onUpdate?.(value)
      
      // Detect when animation comes to rest
      const velocity = boundedValue.getVelocity()
      const isAtRest = Math.abs(velocity) < ('restSpeed' in config ? config.restSpeed || 0.01 : 0.01)
      
      if (isAtRest && !isRestingRef.current) {
        isRestingRef.current = true
        onRest?.()
      } else if (!isAtRest && isRestingRef.current) {
        isRestingRef.current = false
      }
    })

    return unsubscribe
  }, [boundedValue, onUpdate, onRest, config])

  const animate = useCallback((targetValue: number, customConfig?: PhysicsConfig) => {
    if (!shouldAnimate) {
      motionValue.set(targetValue)
      return
    }

    // Set the target value
    motionValue.set(targetValue)
    isRestingRef.current = false
  }, [motionValue, springValue, shouldAnimate])

  const stop = useCallback(() => {
    springValue.stop()
    isRestingRef.current = true
  }, [springValue])

  const impulse = useCallback((force: number) => {
    if (!shouldAnimate) return
    
    const currentValue = motionValue.get()
    
    // Apply impulse by setting the target value
    animate(currentValue + force * 0.1)
    isRestingRef.current = false
  }, [motionValue, shouldAnimate, animate])

  return {
    value: boundedValue,
    animate,
    stop,
    impulse,
    isResting: isRestingRef.current,
    set: motionValue.set,
    get: motionValue.get
  }
}

// Hook for 2D physics animations
export function usePhysics2D(options: {
  initialX?: number
  initialY?: number
  config?: PhysicsConfig
  bounds?: { x: { min: number; max: number }; y: { min: number; max: number } }
  onUpdate?: (x: number, y: number) => void
  onRest?: () => void
} = {}) {
  const {
    initialX = 0,
    initialY = 0,
    config = springConfigs.gentle,
    bounds,
    onUpdate,
    onRest
  } = options

  const xAnimation = usePhysicsAnimation({
    initialValue: initialX,
    config,
    bounds: bounds?.x,
    onUpdate: onUpdate ? (x) => onUpdate(x, yAnimation.get()) : undefined
  })

  const yAnimation = usePhysicsAnimation({
    initialValue: initialY,
    config,
    bounds: bounds?.y,
    onUpdate: onUpdate ? (y) => onUpdate(xAnimation.get(), y) : undefined,
    onRest
  })

  const animateTo = useCallback((x: number, y: number, customConfig?: PhysicsConfig) => {
    xAnimation.animate(x, customConfig)
    yAnimation.animate(y, customConfig)
  }, [xAnimation, yAnimation])

  const applyForce = useCallback((fx: number, fy: number) => {
    xAnimation.impulse(fx)
    yAnimation.impulse(fy)
  }, [xAnimation, yAnimation])

  const stop = useCallback(() => {
    xAnimation.stop()
    yAnimation.stop()
  }, [xAnimation, yAnimation])

  return {
    x: xAnimation.value,
    y: yAnimation.value,
    animateTo,
    applyForce,
    stop,
    isResting: xAnimation.isResting && yAnimation.isResting,
    setX: xAnimation.set,
    setY: yAnimation.set,
    getX: xAnimation.get,
    getY: yAnimation.get
  }
}

// Hook for magnetic field effect
export function useMagneticField(
  elementRef: React.RefObject<HTMLElement>,
  options: {
    strength?: number
    maxDistance?: number
    returnSpeed?: number
    config?: PhysicsConfig
  } = {}
) {
  const {
    strength = 0.3,
    maxDistance = 100,
    returnSpeed = 0.8,
    config = springConfigs.gentle
  } = options

  const physics = usePhysics2D({ config })
  const { shouldAnimate } = useAnimationSettings()

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!shouldAnimate || !elementRef.current) return

    const rect = elementRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = event.clientX - centerX
    const deltaY = event.clientY - centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance
      const targetX = deltaX * strength * force
      const targetY = deltaY * strength * force
      
      physics.animateTo(targetX, targetY)
    }
  }, [elementRef, physics, shouldAnimate, strength, maxDistance])

  const handleMouseLeave = useCallback(() => {
    physics.animateTo(0, 0, {
      ...config,
      stiffness: (config.stiffness ?? 300) * returnSpeed
    })
  }, [physics, config, returnSpeed])

  useEffect(() => {
    if (!shouldAnimate) return

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave, shouldAnimate])

  return {
    x: physics.x,
    y: physics.y,
    reset: () => physics.animateTo(0, 0)
  }
}

// Hook for particle system physics
export function useParticleSystem(
  particleCount: number,
  options: {
    bounds?: { width: number; height: number }
    gravity?: number
    friction?: number
    repulsion?: number
    attraction?: { x: number; y: number; strength: number }
  } = {}
) {
  const {
    bounds = { width: 800, height: 600 },
    gravity = 0.1,
    friction = 0.99,
    repulsion = 50,
    attraction
  } = options

  const { shouldAnimate } = useAnimationSettings()
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    mass: number
  }>>([])

  // Initialize particles
  useEffect(() => {
    if (!shouldAnimate) return

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * bounds.width,
      y: Math.random() * bounds.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      mass: Math.random() * 0.5 + 0.5
    }))
  }, [particleCount, bounds, shouldAnimate])

  // Animation loop
  useEffect(() => {
    if (!shouldAnimate) return

    let animationId: number

    const animate = () => {
      particlesRef.current.forEach((particle, i) => {
        // Apply gravity
        particle.vy += gravity

        // Apply attraction
        if (attraction) {
          const dx = attraction.x - particle.x
          const dy = attraction.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance > 0) {
            const force = attraction.strength / (distance * distance)
            particle.vx += (dx / distance) * force
            particle.vy += (dy / distance) * force
          }
        }

        // Apply repulsion between particles
        particlesRef.current.forEach((other, j) => {
          if (i === j) return
          
          const dx = other.x - particle.x
          const dy = other.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < repulsion && distance > 0) {
            const force = (repulsion - distance) / distance
            particle.vx -= (dx / distance) * force * 0.1
            particle.vy -= (dy / distance) * force * 0.1
          }
        })

        // Apply friction
        particle.vx *= friction
        particle.vy *= friction

        // Update position
        const newX = particle.x + particle.vx
        const newY = particle.y + particle.vy

        // Boundary collision
        if (newX < 0 || newX > bounds.width) {
          particle.vx *= -0.8
        } else {
          particle.x = newX
        }

        if (newY < 0 || newY > bounds.height) {
          particle.vy *= -0.8
        } else {
          particle.y = newY
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [shouldAnimate, gravity, friction, repulsion, attraction, bounds])

  return {
    particles: particlesRef.current,
    updateAttraction: (newAttraction: { x: number; y: number; strength: number }) => {
      Object.assign(attraction || {}, newAttraction)
    }
  }
}