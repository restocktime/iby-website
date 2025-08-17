'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ParticleSystem = () => {
  const pointsRef = useRef<THREE.Points>(null)
  
  // Create simple particle positions
  const particleCount = 1000
  const positions = new Float32Array(particleCount * 3)
  
  // Generate random positions
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 30     // x
    positions[i3 + 1] = (Math.random() - 0.5) * 20 // y
    positions[i3 + 2] = (Math.random() - 0.5) * 20 // z
  }

  // Simple animation
  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime()
      pointsRef.current.rotation.y = time * 0.05
      pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="white"
          size={5}
          transparent
          opacity={1.0}
          sizeAttenuation={false}
        />
      </points>
    </>
  )
}

export default ParticleSystem