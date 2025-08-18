'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

interface FlowingParticlesProps {
  particleCount?: number
  color?: string
  followMouse?: boolean
  className?: string
}

export default function FlowingParticles({ 
  particleCount = 200,
  color = '#ffffff',
  followMouse = true,
  className = ''
}: FlowingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const mouseRef = useRef({ x: 0, y: 0, isActive: false })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mouse tracking
  useEffect(() => {
    if (!followMouse || !mounted) return

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

    const handleMouseEnter = () => {
      mouseRef.current.isActive = true
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener('mouseenter', handleMouseEnter)
      canvas.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (canvas) {
        canvas.removeEventListener('mouseenter', handleMouseEnter)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [followMouse, mounted])

  useEffect(() => {
    if (!mounted) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      const hue = 200 + Math.random() * 60 // Blue to purple range
      const saturation = 70 + Math.random() * 30
      const lightness = 60 + Math.random() * 40
      
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.4 + 0.4,
        color: `hsl(${hue}, ${saturation}%, ${lightness}%)`
      })
    }

    const animate = () => {
      // Clear canvas completely for crisp animation
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Enhanced mouse attraction with varying force
        if (mouseRef.current.isActive) {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 400) {
            // Stronger attraction when closer, weaker when farther
            const force = Math.pow((400 - distance) / 400, 2) * 0.05
            const attraction = Math.min(force, 0.02)
            particle.vx += (dx / distance) * attraction
            particle.vy += (dy / distance) * attraction
          }
        }

        // Particle flocking behavior - like fish schooling
        let separationX = 0, separationY = 0, separationCount = 0
        let alignmentX = 0, alignmentY = 0, alignmentCount = 0
        let cohesionX = 0, cohesionY = 0, cohesionCount = 0

        particles.forEach((other, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - other.x
            const dy = particle.y - other.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            // Separation - avoid crowding neighbors
            if (distance > 0 && distance < 25) {
              separationX += dx / distance
              separationY += dy / distance
              separationCount++
            }

            // Alignment - steer towards average heading of neighbors
            if (distance > 0 && distance < 50) {
              alignmentX += other.vx
              alignmentY += other.vy
              alignmentCount++
            }

            // Cohesion - steer towards average position of neighbors
            if (distance > 0 && distance < 50) {
              cohesionX += other.x
              cohesionY += other.y
              cohesionCount++
            }
          }
        })

        // Apply separation (strongest force)
        if (separationCount > 0) {
          separationX /= separationCount
          separationY /= separationCount
          particle.vx += separationX * 0.015
          particle.vy += separationY * 0.015
        }

        // Apply alignment (medium force)
        if (alignmentCount > 0) {
          alignmentX /= alignmentCount
          alignmentY /= alignmentCount
          particle.vx += (alignmentX - particle.vx) * 0.008
          particle.vy += (alignmentY - particle.vy) * 0.008
        }

        // Apply cohesion (gentle force)
        if (cohesionCount > 0) {
          cohesionX /= cohesionCount
          cohesionY /= cohesionCount
          particle.vx += (cohesionX - particle.x) * 0.005
          particle.vy += (cohesionY - particle.y) * 0.005
        }

        // Add flowing ambient movement
        const time = Date.now() * 0.001
        particle.vx += Math.sin(time + index * 0.01) * 0.001
        particle.vy += Math.cos(time + index * 0.01) * 0.001

        // Apply very gentle damping for fluid motion
        particle.vx *= 0.995
        particle.vy *= 0.995

        // Limit speed with different max speeds for variety
        const baseSpeed = 1.8 + Math.sin(index) * 0.3
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
        if (speed > baseSpeed) {
          particle.vx = (particle.vx / speed) * baseSpeed
          particle.vy = (particle.vy / speed) * baseSpeed
        }

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Smooth edge wrapping
        if (particle.x < -10) particle.x = canvas.width + 10
        if (particle.x > canvas.width + 10) particle.x = -10
        if (particle.y < -10) particle.y = canvas.height + 10
        if (particle.y > canvas.height + 10) particle.y = -10

        // Draw particle with enhanced glow effect
        ctx.save()
        
        // Outer glow
        const outerGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 6
        )
        outerGradient.addColorStop(0, particle.color.replace('hsl', 'hsla').replace(')', ', 0.3)'))
        outerGradient.addColorStop(0.3, particle.color.replace('hsl', 'hsla').replace(')', ', 0.1)'))
        outerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        ctx.fillStyle = outerGradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 6, 0, Math.PI * 2)
        ctx.fill()
        
        // Inner glow
        const innerGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        )
        innerGradient.addColorStop(0, particle.color.replace('hsl', 'hsla').replace(')', ', 0.8)'))
        innerGradient.addColorStop(0.7, particle.color.replace('hsl', 'hsla').replace(')', ', 0.4)'))
        innerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        ctx.fillStyle = innerGradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
        ctx.fill()
        
        // Core particle with shimmer effect
        const shimmer = Math.sin(Date.now() * 0.003 + index * 0.1) * 0.3 + 0.7
        ctx.fillStyle = particle.color.replace('hsl', 'hsla').replace(')', `, ${particle.opacity * shimmer})`)
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      })

      // Draw connecting lines for nearby particles
      particles.forEach((particle, index) => {
        particles.forEach((otherParticle, otherIndex) => {
          if (index < otherIndex) { // Avoid drawing lines twice
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 60) {
              ctx.save()
              const opacity = (60 - distance) / 60 * 0.15
              ctx.strokeStyle = `rgba(135, 206, 250, ${opacity})`
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.stroke()
              ctx.restore()
            }
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particleCount, color, mounted])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  )
}