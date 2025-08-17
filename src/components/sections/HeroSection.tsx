'use client'

import { useRef, Suspense } from 'react'

import { motion, useScroll, useTransform } from 'framer-motion'
import CSSParticles from './hero/CSSParticles'
import TypewriterText from './hero/TypewriterText'
import FloatingCards from './hero/FloatingCards'
import ScrollIndicator from './hero/ScrollIndicator'
import Button from '@/components/ui/Button'
import { PerformanceWrapper, AdaptiveComponent } from '@/components/ui/PerformanceWrapper'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'

// Fallback component for low-performance devices
const SimpleBanner = () => (
  <section 
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    role="banner"
    aria-label="Hero section - Isaac Benyakar introduction"
  >
    <div className="container mx-auto px-8 sm:px-12 lg:px-16 text-center pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24">
      <h1 className="text-6xl md:text-8xl font-heading font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent tracking-tight leading-[0.9]">
        Isaac Benyakar
      </h1>
      <div className="text-2xl md:text-4xl text-white/90 mb-8 font-body font-medium" role="text" aria-label="Professional title">
        Full-Stack Developer & Automation Expert
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          size="lg" 
          className="bg-white text-blue-900 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="View my portfolio projects"
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
          className="border-white text-white hover:bg-white hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          aria-label="Navigate to contact section"
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

// Loading fallback
const HeroLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div className="text-center">
      <div className="animate-pulse">
        <div className="h-16 bg-white/20 rounded mb-4 w-96"></div>
        <div className="h-8 bg-white/10 rounded mb-8 w-64 mx-auto"></div>
        <div className="flex gap-4 justify-center">
          <div className="h-12 bg-white/20 rounded w-32"></div>
          <div className="h-12 bg-white/10 rounded w-32"></div>
        </div>
      </div>
    </div>
  </div>
)

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null)
  const { supportsWebGL, performanceLevel } = useDeviceCapabilities()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Parallax transforms for different layers - reduced on low performance
  const parallaxIntensity = performanceLevel === 'low' ? 0.3 : 1
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", `${50 * parallaxIntensity}%`])
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", `${25 * parallaxIntensity}%`])
  const particlesY = useTransform(scrollYProgress, [0, 1], ["0%", `${75 * parallaxIntensity}%`])

  return (
    <ErrorBoundary level="section" fallback={SimpleBanner}>
      <motion.section
        ref={containerRef}
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        role="banner"
        aria-label="Hero section - Isaac Benyakar introduction"
      >
        {/* Flowing Particle Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: particlesY }}
        >
          <CSSParticles />
        </motion.div>

        {/* Background Gradient Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-pink-900/20 z-10"
          style={{ y: backgroundY }}
        />

        {/* Main Content */}
        <motion.div 
          className="container mx-auto px-8 sm:px-12 lg:px-16 text-center relative z-20 pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24"
          style={{ y: contentY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-bold mb-8 sm:mb-10 lg:mb-12 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent tracking-tight leading-[0.85] m-0">
              Isaac Benyakar
            </h1>
            
            <div 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/90 mb-12 sm:mb-16 lg:mb-20 h-16 sm:h-20 lg:h-24 flex items-center justify-center m-0 font-body font-medium"
              role="text"
              aria-live="polite"
              aria-label="Professional title"
            >
              <Suspense fallback={<span>Full-Stack Developer & Automation Expert</span>}>
                <TypewriterText />
              </Suspense>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center mb-20 sm:mb-24 lg:mb-28"
          >
            <Button 
              size="lg" 
              className="bg-white text-blue-900 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="View my portfolio projects"
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
              className="border-white text-white hover:bg-white hover:text-blue-900 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              aria-label="Navigate to contact section"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get In Touch
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Project Cards */}
        <Suspense fallback={null}>
          <FloatingCards />
        </Suspense>

        {/* Scroll Indicator */}
        <ScrollIndicator />
      </motion.section>
    </ErrorBoundary>
  )
}

export default HeroSection