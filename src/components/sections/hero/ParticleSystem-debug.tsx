'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ParticleSystem = () => {
  const cubeRef = useRef<THREE.Mesh>(null)
  const pointsRef = useRef<THREE.Points>(null)
  
  // Create cinematic particle field
  const particleCount = 2000
  const positions = new Float32Array(particleCount * 3)
  
  // Generate flowing particle positions
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    // Create depth and spread like IMAX
    positions[i3] = (Math.random() - 0.5) * 40     // x - wider spread
    positions[i3 + 1] = (Math.random() - 0.5) * 25 // y - taller spread
    positions[i3 + 2] = (Math.random() - 0.5) * 30 // z - deeper field
  }

  // Cinematic flowing animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Remove the test cube for production
    if (cubeRef.current) {
      cubeRef.current.visible = false // Hide the test cube
    }
    
    if (pointsRef.current) {
      // Slow, cinematic rotation
      pointsRef.current.rotation.y = time * 0.02
      pointsRef.current.rotation.x = Math.sin(time * 0.01) * 0.05
      pointsRef.current.rotation.z = Math.cos(time * 0.015) * 0.03
      
      // Individual particle flow
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        // Subtle flowing motion
        positions[i3] += Math.sin(time * 0.1 + i * 0.01) * 0.002
        positions[i3 + 1] += Math.cos(time * 0.08 + i * 0.02) * 0.001
        positions[i3 + 2] += Math.sin(time * 0.12 + i * 0.015) * 0.0015
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Test cube to see if 3D is working */}
      <mesh ref={cubeRef} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      
      {/* White particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={1.2}
          transparent
          opacity={0.6}
          sizeAttenuation={true}
        />
      </points>
    </>
  )
}

export default ParticleSystem