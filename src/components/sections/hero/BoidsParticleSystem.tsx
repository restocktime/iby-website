'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Boids algorithm constants
const BOID_COUNT = 1500
const SEPARATION_RADIUS = 25
const ALIGNMENT_RADIUS = 50
const COHESION_RADIUS = 50
const MAX_SPEED = 2
const MAX_FORCE = 0.03
const MOUSE_RADIUS = 100
const MOUSE_FORCE = 0.5

// Boid interface
interface Boid {
  x: number
  y: number
  vx: number
  vy: number
}

interface BoidsParticleSystemProps {
  enabled?: boolean
  density?: 'low' | 'medium' | 'high'
  color?: string
  opacity?: number
  followMouse?: boolean
  className?: string
}

export default function BoidsParticleSystem({ 
  enabled = true,
  density = 'high',
  color = '#ffffff',
  opacity = 0.8,
  followMouse = true,
  className = ''
}: BoidsParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const workerRef = useRef<Worker>()
  const [webGPUSupported, setWebGPUSupported] = useState(false)
  const [fallbackMode, setFallbackMode] = useState(false)
  const mouseRef = useRef({ x: 0, y: 0, isActive: false })

  // Adjust particle count based on density
  const getParticleCount = () => {
    switch (density) {
      case 'low': return 500
      case 'medium': return 1000
      case 'high': return BOID_COUNT
      default: return BOID_COUNT
    }
  }

  // Initialize WebGPU detection
  useEffect(() => {
    const checkWebGPUSupport = async () => {
      if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
        try {
          const adapter = await (navigator as any).gpu.requestAdapter()
          if (adapter) {
            const device = await adapter.requestDevice()
            if (device) {
              setWebGPUSupported(true)
              return
            }
          }
        } catch (error) {
          console.log('WebGPU not available, falling back to Canvas2D')
        }
      }
      setFallbackMode(true)
    }

    checkWebGPUSupport()
  }, [])

  // Mouse tracking
  useEffect(() => {
    if (!followMouse) return

    const handleMouseMove = (event: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        mouseRef.current.x = event.clientX - rect.left
        mouseRef.current.y = event.clientY - rect.top
        mouseRef.current.isActive = true
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false
    }

    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [followMouse])

  // Canvas 2D fallback implementation
  const initCanvas2DSystem = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize boids
    const boids: Boid[] = []
    const particleCount = getParticleCount()

    for (let i = 0; i < particleCount; i++) {
      boids.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      })
    }

    // Vector utility functions
    const magnitude = (vx: number, vy: number) => Math.sqrt(vx * vx + vy * vy)
    const normalize = (vx: number, vy: number) => {
      const mag = magnitude(vx, vy)
      return mag > 0 ? { x: vx / mag, y: vy / mag } : { x: 0, y: 0 }
    }
    const limit = (vx: number, vy: number, max: number) => {
      const mag = magnitude(vx, vy)
      return mag > max ? { x: (vx / mag) * max, y: (vy / mag) * max } : { x: vx, y: vy }
    }

    // Boids algorithm implementation
    const separate = (boid: Boid, boids: Boid[]) => {
      let steerX = 0, steerY = 0, count = 0

      for (const other of boids) {
        const dist = magnitude(boid.x - other.x, boid.y - other.y)
        if (dist > 0 && dist < SEPARATION_RADIUS) {
          const diff = normalize(boid.x - other.x, boid.y - other.y)
          steerX += diff.x / dist
          steerY += diff.y / dist
          count++
        }
      }

      if (count > 0) {
        steerX /= count
        steerY /= count
        const normalized = normalize(steerX, steerY)
        steerX = normalized.x * MAX_SPEED - boid.vx
        steerY = normalized.y * MAX_SPEED - boid.vy
        return limit(steerX, steerY, MAX_FORCE)
      }

      return { x: 0, y: 0 }
    }

    const align = (boid: Boid, boids: Boid[]) => {
      let sumVx = 0, sumVy = 0, count = 0

      for (const other of boids) {
        const dist = magnitude(boid.x - other.x, boid.y - other.y)
        if (dist > 0 && dist < ALIGNMENT_RADIUS) {
          sumVx += other.vx
          sumVy += other.vy
          count++
        }
      }

      if (count > 0) {
        sumVx /= count
        sumVy /= count
        const normalized = normalize(sumVx, sumVy)
        const steerX = normalized.x * MAX_SPEED - boid.vx
        const steerY = normalized.y * MAX_SPEED - boid.vy
        return limit(steerX, steerY, MAX_FORCE)
      }

      return { x: 0, y: 0 }
    }

    const cohesion = (boid: Boid, boids: Boid[]) => {
      let sumX = 0, sumY = 0, count = 0

      for (const other of boids) {
        const dist = magnitude(boid.x - other.x, boid.y - other.y)
        if (dist > 0 && dist < COHESION_RADIUS) {
          sumX += other.x
          sumY += other.y
          count++
        }
      }

      if (count > 0) {
        sumX /= count
        sumY /= count
        const steerX = sumX - boid.x
        const steerY = sumY - boid.y
        const normalized = normalize(steerX, steerY)
        const finalSteerX = normalized.x * MAX_SPEED - boid.vx
        const finalSteerY = normalized.y * MAX_SPEED - boid.vy
        return limit(finalSteerX, finalSteerY, MAX_FORCE)
      }

      return { x: 0, y: 0 }
    }

    const seek = (boid: Boid, targetX: number, targetY: number) => {
      const steerX = targetX - boid.x
      const steerY = targetY - boid.y
      const normalized = normalize(steerX, steerY)
      const finalSteerX = normalized.x * MAX_SPEED - boid.vx
      const finalSteerY = normalized.y * MAX_SPEED - boid.vy
      return limit(finalSteerX, finalSteerY, MAX_FORCE * MOUSE_FORCE)
    }

    const animate = () => {
      if (!enabled) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Update boids
      for (const boid of boids) {
        // Apply boids rules
        const sep = separate(boid, boids)
        const ali = align(boid, boids)
        const coh = cohesion(boid, boids)

        // Weight the forces
        const accX = sep.x * 2 + ali.x * 1 + coh.x * 1
        const accY = sep.y * 2 + ali.y * 1 + coh.y * 1

        // Mouse interaction
        if (mouseRef.current.isActive) {
          const mouseDist = magnitude(boid.x - mouseRef.current.x, boid.y - mouseRef.current.y)
          if (mouseDist < MOUSE_RADIUS) {
            const mouseForce = seek(boid, mouseRef.current.x, mouseRef.current.y)
            boid.vx += mouseForce.x
            boid.vy += mouseForce.y
          }
        }

        // Apply forces
        boid.vx += accX
        boid.vy += accY

        // Limit speed
        const limited = limit(boid.vx, boid.vy, MAX_SPEED)
        boid.vx = limited.x
        boid.vy = limited.y

        // Update position
        boid.x += boid.vx
        boid.y += boid.vy

        // Wrap around edges
        if (boid.x < 0) boid.x = canvas.offsetWidth
        if (boid.x > canvas.offsetWidth) boid.x = 0
        if (boid.y < 0) boid.y = canvas.offsetHeight
        if (boid.y > canvas.offsetHeight) boid.y = 0
      }

      // Draw boids
      ctx.fillStyle = color
      ctx.globalAlpha = opacity

      for (const boid of boids) {
        ctx.beginPath()
        ctx.arc(boid.x, boid.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }

  // Initialize the particle system
  useEffect(() => {
    if (!canvasRef.current) return

    let cleanup: (() => void) | undefined

    if (webGPUSupported && !fallbackMode) {
      console.log('Initializing WebGPU Boids system...')
      // TODO: Implement WebGPU system
      cleanup = initCanvas2DSystem() // Fallback for now
    } else {
      console.log('Initializing Canvas2D Boids system...')
      cleanup = initCanvas2DSystem()
    }

    return () => {
      if (cleanup) cleanup()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [webGPUSupported, fallbackMode, enabled, density, color, opacity])

  return (
    <motion.canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ 
        mixBlendMode: 'screen',
        filter: 'blur(0.5px)' 
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: enabled ? opacity : 0 }}
      transition={{ duration: 1 }}
      aria-hidden="true"
    />
  )
}