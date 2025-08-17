'use client'

import { useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useScroll, useTransform } from 'framer-motion'
import ParticleSystem from './hero/ParticleSystem'
import TypewriterText from './hero/TypewriterText'
import ScrollIndicator from './hero/ScrollIndicator'
import Button from '@/components/ui/Button'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

// Simple loading fallback for 3D content
const ParticleLoading = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-pink-900/20">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/50 to-slate-900/50" />
  </div>
)

// Fallback component for when 3D fails
const SimpleBanner = () => (
  <section 
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    role="banner"
    aria-label="Hero section - Isaac Benyakar introduction"
  >
    <div className="container mx-auto px-6 text-center">
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
    </div>
  </section>
)

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const particlesY = useTransform(scrollYProgress, [0, 1], ["0%", "75%"])

  return (
    <ErrorBoundary level="section" fallback={SimpleBanner}>
      <motion.section
        ref={containerRef}
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        role="banner"
        aria-label="Hero section - Isaac Benyakar introduction"
      >
        {/* 3D Particle Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: particlesY }}
        >
          <ErrorBoundary level="component" fallback={({ error, retry }) => <ParticleLoading />}>
            <Suspense fallback={<ParticleLoading />}>
              <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                className="w-full h-full"
                gl={{ 
                  antialias: true,
                  alpha: true,
                  powerPreference: 'high-performance'
                }}
                dpr={[1, 2]}
              >
                <ParticleSystem />
              </Canvas>
            </Suspense>
          </ErrorBoundary>
        </motion.div>

        {/* Background Gradient Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-pink-900/20 z-10"
          style={{ y: backgroundY }}
        />

        {/* Main Content */}
        <motion.div 
          className="container mx-auto px-6 text-center relative z-20"
          style={{ y: contentY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Isaac Benyakar
            </h1>
            
            <div 
              className="text-2xl md:text-4xl text-white/90 mb-8 h-16 flex items-center justify-center"
              role="text"
              aria-live="polite"
              aria-label="Professional title"
            >
              <ErrorBoundary level="component" fallback={<span>Full-Stack Developer & Automation Expert</span>}>
                <Suspense fallback={<span>Full-Stack Developer & Automation Expert</span>}>
                  <TypewriterText />
                </Suspense>
              </ErrorBoundary>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button 
              size="lg" 
              className="bg-white text-blue-900 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300"
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
              className="border-white text-white hover:bg-white hover:text-blue-900 transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get In Touch
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <ScrollIndicator />
      </motion.section>
    </ErrorBoundary>
  )
}

export default HeroSection