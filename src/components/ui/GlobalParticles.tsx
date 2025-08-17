'use client'

import { useEffect, useState } from 'react'

interface GlobalParticlesProps {
  density?: 'light' | 'medium' | 'heavy'
  color?: string
  opacity?: number
}

const GlobalParticles = ({ 
  density = 'light', 
  color = 'white',
  opacity = 0.4 
}: GlobalParticlesProps) => {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    opacity: number
    duration: number
    delay: number
  }>>([])

  useEffect(() => {
    // Adjust particle count based on density
    const particleCount = density === 'heavy' ? 100 : density === 'medium' ? 60 : 30
    
    const particleArray = []
    for (let i = 0; i < particleCount; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: (Math.random() * opacity) + 0.1,
        duration: Math.random() * 25 + 15,
        delay: Math.random() * 8
      })
    }
    setParticles(particleArray)
  }, [density, opacity])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: color,
            opacity: particle.opacity,
            animation: `gentleFloat ${particle.duration}s infinite linear ${particle.delay}s, subtleTwinkle 4s infinite ease-in-out ${particle.delay}s`
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes gentleFloat {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-15px) translateX(8px);
          }
          50% {
            transform: translateY(-8px) translateX(-4px);
          }
          75% {
            transform: translateY(-22px) translateX(12px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }
        
        @keyframes subtleTwinkle {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  )
}

export default GlobalParticles