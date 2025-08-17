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
  
  // Generate flowing particle field
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Create flowing particle distribution
      const radius = Math.random() * 25 + 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)     // x
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) // y  
      positions[i3 + 2] = radius * Math.cos(phi) - 10              // z
      
      // Mostly white particles with some subtle color variation
      const brightness = Math.random() * 0.3 + 0.7
      const colorVariation = Math.random()
      
      if (colorVariation < 0.7) {
        // Pure white particles
        colors[i3] = brightness
        colors[i3 + 1] = brightness
        colors[i3 + 2] = brightness
      } else if (colorVariation < 0.85) {
        // Slightly blue-white
        colors[i3] = brightness * 0.9
        colors[i3 + 1] = brightness * 0.95
        colors[i3 + 2] = brightness
      } else {
        // Slightly warm white
        colors[i3] = brightness
        colors[i3 + 1] = brightness * 0.95
        colors[i3 + 2] = brightness * 0.9
      }
      
      // Vary particle sizes for depth - much smaller
      sizes[i] = Math.random() * 0.8 + 0.2
    }
    
    return { positions, colors, sizes }
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

  // Animate flowing particles
  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime()
      const animationIntensity = isLowEndDevice ? 0.5 : 1
      
      // Gentle rotation of the entire particle system
      pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1 * animationIntensity
      pointsRef.current.rotation.y = time * 0.05 * animationIntensity
      pointsRef.current.rotation.z = Math.cos(time * 0.08) * 0.05 * animationIntensity
      
      // Individual particle movement for flowing effect
      if (!isLowEndDevice && performanceLevel !== 'low') {
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
        const colors = pointsRef.current.geometry.attributes.color?.array as Float32Array
        
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3
          
          // Create smooth flowing motion
          const flowSpeed = 0.2 * animationIntensity
          const waveAmplitude = 1.5 * animationIntensity
          
          // Enhanced flowing motion with multiple wave patterns
          positions[i3] += Math.sin(time * flowSpeed + i * 0.008) * 0.008 * animationIntensity
          positions[i3 + 1] += Math.cos(time * flowSpeed * 0.7 + i * 0.012) * 0.006 * animationIntensity
          positions[i3 + 2] += Math.sin(time * flowSpeed * 1.1 + i * 0.01) * 0.01 * animationIntensity
          
          // Add gentle wave-like motion
          const wave1 = Math.sin(time * 0.3 + i * 0.05) * waveAmplitude
          const wave2 = Math.cos(time * 0.4 + i * 0.08) * waveAmplitude * 0.7
          positions[i3 + 1] += (wave1 + wave2) * 0.0008
          
          // Subtle pulsing/breathing effect on colors
          if (colors) {
            const pulse = Math.sin(time * 1.5 + i * 0.05) * 0.2 + 0.8
            const originalIntensity = 0.9 // Base brightness
            
            colors[i3] = originalIntensity * pulse
            colors[i3 + 1] = originalIntensity * pulse
            colors[i3 + 2] = originalIntensity * pulse
          }
        }
        
        pointsRef.current.geometry.attributes.position.needsUpdate = true
        if (colors) {
          pointsRef.current.geometry.attributes.color.needsUpdate = true
        }
      }
    }
    
    // Animate secondary layer with different pattern
    if (secondaryPointsRef.current) {
      const time = state.clock.getElapsedTime()
      const animationIntensity = isLowEndDevice ? 0.5 : 1
      
      secondaryPointsRef.current.rotation.x = -time * 0.03 * animationIntensity
      secondaryPointsRef.current.rotation.y = Math.sin(time * 0.2) * 0.1 * animationIntensity
      secondaryPointsRef.current.rotation.z = time * 0.02 * animationIntensity
    }
  })

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      
      {/* Main flowing white particles */}
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={sizes}
            itemSize={1}
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          vertexColors
          size={isLowEndDevice ? 0.3 : 0.5}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={isLowEndDevice ? 0.6 : 0.8}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Secondary flowing layer - smaller particles */}
      {performanceLevel !== 'low' && (
        <Points ref={secondaryPointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={positions}
              itemSize={3}
              args={[positions, 3]}
            />
          </bufferGeometry>
          <PointMaterial
            transparent
            color="#ffffff"
            size={isLowEndDevice ? 0.2 : 0.3}
            sizeAttenuation={true}
            depthWrite={false}
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </Points>
      )}
      
      {/* Additional sparkle layer for extra magic */}
      {performanceLevel === 'high' && (
        <Points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={Math.floor(particleCount * 0.3)}
              array={positions.slice(0, Math.floor(particleCount * 0.3) * 3)}
              itemSize={3}
              args={[positions.slice(0, Math.floor(particleCount * 0.3) * 3), 3]}
            />
          </bufferGeometry>
          <PointMaterial
            transparent
            color="#ffffff"
            size={0.1}
            sizeAttenuation={true}
            depthWrite={false}
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </Points>
      )}
    </>
  )
}

export default ParticleSystem