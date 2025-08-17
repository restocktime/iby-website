'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useMemoryManager } from '@/lib/memoryManager'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'

const ParticleSystem = () => {
  const pointsRef = useRef<THREE.Points>(null)
  const secondaryPointsRef = useRef<THREE.Points>(null)
  const { register, touch, dispose } = useMemoryManager()
  const { performanceLevel, isLowEndDevice } = useDeviceCapabilities()
  
  // Adjust particle count based on performance
  const particleCount = useMemo(() => {
    if (isLowEndDevice || performanceLevel === 'low') return 500
    if (performanceLevel === 'medium') return 1000
    return 2000
  }, [performanceLevel, isLowEndDevice])
  
  // Generate particle positions
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      // Create a more interesting distribution
      const i3 = i * 3
      const radius = Math.random() * 20 + 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
    }
    
    return positions
  }, [particleCount])

  // Register components with memory manager
  useEffect(() => {
    if (pointsRef.current) {
      register('hero-particles-main', pointsRef.current, 'high')
    }
    if (secondaryPointsRef.current) {
      register('hero-particles-secondary', secondaryPointsRef.current, 'medium')
    }

    return () => {
      dispose('hero-particles-main')
      dispose('hero-particles-secondary')
    }
  }, [register, dispose])

  // Touch resources to mark as recently used
  useEffect(() => {
    const interval = setInterval(() => {
      touch('hero-particles-main')
      touch('hero-particles-secondary')
    }, 5000)

    return () => clearInterval(interval)
  }, [touch])

  // Animate particles with performance awareness
  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime()
      
      // Reduce animation complexity on low-end devices
      const animationIntensity = isLowEndDevice ? 0.5 : 1
      
      // Rotate the entire particle system
      pointsRef.current.rotation.x = time * 0.05 * animationIntensity
      pointsRef.current.rotation.y = time * 0.1 * animationIntensity
      
      // Skip individual particle animation on low-end devices
      if (!isLowEndDevice && performanceLevel !== 'low') {
        // Update individual particle positions for flowing effect
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
        
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3
          const originalY = positions[i3 + 1]
          
          // Add subtle floating motion
          positions[i3 + 1] = originalY + Math.sin(time + i * 0.01) * 0.1 * animationIntensity
          positions[i3] += Math.sin(time * 0.5 + i * 0.02) * 0.002 * animationIntensity
          positions[i3 + 2] += Math.cos(time * 0.3 + i * 0.02) * 0.002 * animationIntensity
        }
        
        pointsRef.current.geometry.attributes.position.needsUpdate = true
      }
    }
  })

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      {/* Main particle system */}
      <Points ref={pointsRef} positions={positions}>
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={isLowEndDevice ? 0.03 : 0.05}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={isLowEndDevice ? 0.6 : 0.8}
        />
      </Points>
      
      {/* Secondary particle layer - only on medium/high performance */}
      {performanceLevel !== 'low' && (
        <Points ref={secondaryPointsRef} positions={positions}>
          <PointMaterial
            transparent
            color="#3b82f6"
            size={isLowEndDevice ? 0.02 : 0.03}
            sizeAttenuation={true}
            depthWrite={false}
            opacity={0.4}
          />
        </Points>
      )}
    </>
  )
}

export default ParticleSystem