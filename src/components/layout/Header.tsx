'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'
import { useGestureRecognition } from '@/hooks/useGestureRecognition'
import { useAnimationSettings } from '@/contexts/AnimationContext'
import { navVariants, springConfigs } from '@/lib/animations'
import { cn } from '@/lib/utils'
import NavigationItem from './NavigationItem'
import CTAButton from './CTAButton'

type NavigationMode = 'minimal' | 'expanded' | 'contextual'

interface NavigationSection {
  id: string
  label: string
  href: string
  isActive?: boolean
}

const navigationSections: NavigationSection[] = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [navigationMode, setNavigationMode] = useState<NavigationMode>('expanded')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { scrollPosition, scrollDirection } = useScrollPosition()
  const { supportsTouch } = useDeviceCapabilities()
  const { shouldAnimate, incrementInteraction } = useAnimationSettings()
  const headerRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Magnetic effect for logo
  const logoX = useMotionValue(0)
  const logoY = useMotionValue(0)
  const logoSpringX = useSpring(logoX, springConfigs.gentle)
  const logoSpringY = useSpring(logoY, springConfigs.gentle)

  // Calculate scroll progress
  useEffect(() => {
    const calculateScrollProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrollPosition / totalHeight, 1)
      setScrollProgress(progress)
    }

    calculateScrollProgress()
  }, [scrollPosition])

  // Determine navigation mode based on scroll position and direction
  useEffect(() => {
    if (scrollPosition < 100) {
      setNavigationMode('expanded')
    } else if (scrollDirection === 'up' || scrollPosition < 200) {
      setNavigationMode('contextual')
    } else if (scrollDirection === 'down' && scrollPosition > 200) {
      setNavigationMode('minimal')
    }
  }, [scrollPosition, scrollDirection])

  // Track active section based on scroll position
  useEffect(() => {
    const sections = navigationSections.map(section => 
      document.getElementById(section.id.replace('#', ''))
    ).filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: [0.5], rootMargin: '-20% 0px -20% 0px' }
    )

    sections.forEach(section => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  // Handle smooth scrolling to sections with interaction tracking
  const handleSectionClick = (href: string) => {
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
    
    setIsMobileMenuOpen(false)
    incrementInteraction()
  }

  // Magnetic effect for logo
  const handleLogoMouseMove = (event: React.MouseEvent) => {
    if (!shouldAnimate) return
    
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (event.clientX - centerX) * 0.2
    const deltaY = (event.clientY - centerY) * 0.2

    logoX.set(deltaX)
    logoY.set(deltaY)
  }

  const handleLogoMouseLeave = () => {
    logoX.set(0)
    logoY.set(0)
  }

  // Gesture recognition for mobile menu
  useGestureRecognition(mobileMenuRef, {
    onSwipe: (event) => {
      if (event.direction === 'up' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
  })

  // Touch gesture handling for mobile
  useEffect(() => {
    if (!supportsTouch || !headerRef.current) return

    let startY = 0
    let startTime = 0

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
      startTime = Date.now()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY
      const endTime = Date.now()
      const deltaY = startY - endY
      const deltaTime = endTime - startTime

      // Quick upward swipe to show navigation
      if (deltaY > 50 && deltaTime < 300 && scrollPosition > 200) {
        setNavigationMode('expanded')
      }
    }

    const header = headerRef.current
    header.addEventListener('touchstart', handleTouchStart)
    header.addEventListener('touchend', handleTouchEnd)

    return () => {
      header.removeEventListener('touchstart', handleTouchStart)
      header.removeEventListener('touchend', handleTouchEnd)
    }
  }, [supportsTouch, scrollPosition])

  const getHeaderClasses = () => {
    const baseClasses = 'fixed top-0 left-0 right-0 z-50 transition-all duration-500'
    
    switch (navigationMode) {
      case 'minimal':
        return cn(baseClasses, 'transform -translate-y-full', {
          'translate-y-0': scrollDirection === 'up'
        })
      case 'contextual':
        return cn(baseClasses, 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-white/20')
      case 'expanded':
      default:
        return cn(baseClasses, {
          'bg-white/90 backdrop-blur-xl shadow-xl border-b border-white/20': scrollPosition > 50,
          'bg-transparent': scrollPosition <= 50
        })
    }
  }

  const getLogoClasses = () => {
    return cn(
      'font-bold transition-all duration-300',
      navigationMode === 'minimal' ? 'text-lg' : 'text-2xl',
      scrollPosition > 50 ? 'text-neutral-900' : 'text-white'
    )
  }

  return (
    <>
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-[60] origin-left"
        style={{ scaleX: scrollProgress }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress }}
        transition={{ duration: 0.1 }}
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuenow={Math.round(scrollProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <motion.header
        ref={headerRef}
        className={getHeaderClasses()}
        initial={{ y: 0 }}
        animate={{ 
          y: navigationMode === 'minimal' && scrollDirection === 'down' ? -100 : 0 
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        role="banner"
        aria-label="Main navigation"
      >
        <nav className="container mx-auto px-6 sm:px-8" role="navigation" aria-label="Main navigation">
          <div className={cn(
            'flex items-center justify-between transition-all duration-300',
            navigationMode === 'minimal' ? 'py-3' : 'py-5'
          )}>
            {/* Logo with magnetic effect */}
            <motion.div
              style={shouldAnimate ? { x: logoSpringX, y: logoSpringY } : undefined}
              whileHover={shouldAnimate ? { scale: 1.05 } : undefined}
              whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
              onMouseMove={handleLogoMouseMove}
              onMouseLeave={handleLogoMouseLeave}
            >
              <Link
                href="/"
                className={cn(getLogoClasses(), "relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1")}
                onClick={() => handleSectionClick('#hero')}
                aria-label="Isaac Benyakar - Go to homepage"
              >
                Isaac Benyakar
                {/* Subtle glow effect */}
                {shouldAnimate && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-lg -z-10"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </Link>
            </motion.div>

            {/* Desktop Navigation - Clean and Simple */}
            <div className="hidden md:flex items-center space-x-2" role="menubar">
              {navigationSections.map((section) => (
                <NavigationItem
                  key={section.id}
                  label={section.label}
                  href={section.href}
                  isActive={activeSection === section.id}
                  isScrolled={scrollPosition > 50}
                  onClick={() => handleSectionClick(section.href)}
                />
              ))}
              
              <CTAButton onClick={() => handleSectionClick('#contact')}>
                Get In Touch
              </CTAButton>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-lg relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen)
                incrementInteraction()
              }}
              whileHover={shouldAnimate ? { scale: 1.05 } : undefined}
              whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {/* Ripple effect */}
              {shouldAnimate && (
                <motion.div
                  className="absolute inset-0 bg-blue-100 rounded-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  whileTap={{ scale: 2, opacity: [0, 0.3, 0] }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <motion.div
                animate={isMobileMenuOpen ? 'open' : 'closed'}
                className="w-6 h-6 relative"
              >
                <motion.span
                  className={cn(
                    'absolute block h-0.5 w-6 rounded-sm',
                    scrollPosition > 50 ? 'bg-neutral-900' : 'bg-white'
                  )}
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 8 }
                  }}
                  style={{ top: '6px' }}
                />
                <motion.span
                  className={cn(
                    'absolute block h-0.5 w-6 rounded-sm',
                    scrollPosition > 50 ? 'bg-neutral-900' : 'bg-white'
                  )}
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                  style={{ top: '12px' }}
                />
                <motion.span
                  className={cn(
                    'absolute block h-0.5 w-6 rounded-sm',
                    scrollPosition > 50 ? 'bg-neutral-900' : 'bg-white'
                  )}
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -8 }
                  }}
                  style={{ top: '18px' }}
                />
              </motion.div>
            </motion.button>
          </div>
        </nav>

        {/* Enhanced Mobile Menu with gesture support */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              id="mobile-menu"
              className="md:hidden bg-white/95 backdrop-blur-lg border-t border-neutral-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={shouldAnimate ? springConfigs.gentle : { duration: 0.3, ease: 'easeInOut' }}
              drag="y"
              dragConstraints={{ top: -50, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y < -30 || info.velocity.y < -500) {
                  setIsMobileMenuOpen(false)
                }
              }}
              role="menu"
              aria-label="Mobile navigation menu"
            >
              <div className="container mx-auto px-4 py-4">
                {/* Drag indicator */}
                {shouldAnimate && (
                  <motion.div
                    className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"
                    animate={{
                      opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut"
                    }}
                  />
                )}
                
                <motion.div
                  className="flex flex-col space-y-2"
                  initial="hidden"
                  animate="visible"
                  variants={shouldAnimate ? {
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2
                      }
                    }
                  } : undefined}
                >
                  {navigationSections.map((section) => (
                    <motion.button
                      key={section.id}
                      onClick={() => handleSectionClick(section.href)}
                      className={cn(
                        'text-left px-4 py-3 rounded-lg text-base font-medium transition-colors relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        activeSection === section.id
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-neutral-700 hover:text-blue-600 hover:bg-neutral-50'
                      )}
                      variants={shouldAnimate ? {
                        hidden: { opacity: 0, x: 20 },
                        visible: { opacity: 1, x: 0 }
                      } : undefined}
                      whileHover={shouldAnimate ? { scale: 1.02, x: 4 } : undefined}
                      whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
                      role="menuitem"
                      aria-current={activeSection === section.id ? 'page' : undefined}
                      aria-label={`Navigate to ${section.label} section`}
                    >
                      {/* Mobile item ripple effect */}
                      {shouldAnimate && (
                        <motion.div
                          className="absolute inset-0 bg-blue-100 rounded-lg"
                          initial={{ scale: 0, opacity: 0 }}
                          whileTap={{ scale: 1.5, opacity: [0, 0.3, 0] }}
                          transition={{ duration: 0.4 }}
                        />
                      )}
                      <span className="relative z-10">{section.label}</span>
                    </motion.button>
                  ))}
                  
                  <motion.button
                    onClick={() => handleSectionClick('#contact')}
                    className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    variants={shouldAnimate ? {
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    } : undefined}
                    whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
                    aria-label="Get in touch - Navigate to contact section"
                  >
                    {/* CTA button ripple effect */}
                    {shouldAnimate && (
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-lg"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ scale: 2, opacity: [0, 0.5, 0] }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">Get In Touch</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}