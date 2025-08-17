'use client'

import { useEffect, useState } from 'react'

interface GlobalParticlesProps {
  density?: 'light' | 'medium' | 'heavy'
  color?: string
  opacity?: number
  variant?: 'default' | 'gradient' | 'colorful'
}

const GlobalParticles = ({ 
  density = 'light', 
  color = 'white',
  opacity = 0.4,
  variant = 'default'
}: GlobalParticlesProps) => {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    opacity: number
    duration: number
    delay: number
    colorVariant?: string
  }>>([])

  useEffect(() => {
    // Adjust particle count based on density
    const particleCount = density === 'heavy' ? 120 : density === 'medium' ? 80 : 50
    
    // Color variants for different themes
    const colorVariants = {
      default: [color],
      gradient: ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'],
      colorful: ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']
    }
    
    const colors = colorVariants[variant] || [color]
    
    const particleArray = []
    for (let i = 0; i < particleCount; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1, // Larger particles
        opacity: (Math.random() * opacity) + 0.15,
        duration: Math.random() * 20 + 15, // Smoother animation
        delay: Math.random() * 6,
        colorVariant: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    setParticles(particleArray)
  }, [density, opacity, color, variant])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          role="presentation"
          aria-hidden="true"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: variant === 'gradient' 
              ? `radial-gradient(circle, ${particle.colorVariant}40, ${particle.colorVariant}10)`
              : particle.colorVariant || color,
            opacity: particle.opacity,
            animation: `enhancedFloat ${particle.duration}s infinite ease-in-out ${particle.delay}s, enhancedTwinkle 4s infinite ease-in-out ${particle.delay}s`,
            filter: variant !== 'default' ? 'blur(0.5px)' : 'none',
            boxShadow: variant === 'gradient' ? `0 0 ${particle.size * 2}px ${particle.colorVariant}20` : 'none'
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes enhancedFloat {
          0% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
          25% {
            transform: translateY(-25px) translateX(12px) scale(1.1);
          }
          50% {
            transform: translateY(-15px) translateX(-8px) scale(0.9);
          }
          75% {
            transform: translateY(-35px) translateX(18px) scale(1.05);
          }
          100% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
        }
        
        @keyframes enhancedTwinkle {
          0%, 100% {
            opacity: 0.2;
            filter: brightness(1);
          }
          25% {
            opacity: 0.6;
            filter: brightness(1.2);
          }
          50% {
            opacity: 0.9;
            filter: brightness(1.4);
          }
          75% {
            opacity: 0.4;
            filter: brightness(1.1);
          }
        }
      `}</style>
    </div>
  )
}

export default GlobalParticles