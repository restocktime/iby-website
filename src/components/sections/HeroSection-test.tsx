'use client'

import { useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

// Very simple particle system for testing
function SimpleParticles() {
  const meshRef = useRef<any>(null)

  // Simple rotating cube to test if 3D is working
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={meshRef} rotation={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      
      {/* Simple particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(Array.from({ length: 300 }, () => (Math.random() - 0.5) * 10)), 3]}
          />
        </bufferGeometry>
        <pointsMaterial color="white" size={0.1} />
      </points>
    </>
  )
}

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      {/* 3D Background - Very Simple Test */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <SimpleParticles />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 text-center relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Isaac Benyakar
          </h1>
          
          <div className="text-2xl md:text-4xl text-white/90 mb-8">
            Full-Stack Developer & Automation Expert
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-900 hover:bg-blue-50"
              onClick={() => {
                const projectsSection = document.getElementById('projects');
                projectsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View My Work
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-blue-900"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get In Touch
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection