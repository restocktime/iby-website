'use client'

import { useEffect, useState } from 'react'

const CSSParticles = () => {
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
    // Generate particles
    const particleArray = []
    for (let i = 0; i < 150; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5
      })
    }
    setParticles(particleArray)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `float ${particle.duration}s infinite linear ${particle.delay}s, twinkle 3s infinite ease-in-out ${particle.delay}s`
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-5px);
          }
          75% {
            transform: translateY(-30px) translateX(15px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}

export default CSSParticles