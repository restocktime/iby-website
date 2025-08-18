'use client'

import React, { useRef, useState, Suspense } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { 
  FolderIcon,
  WrenchScrewdriverIcon,
  BoltIcon,
  EnvelopeIcon,
  UserIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'
import FlowingParticles from '@/components/sections/hero/FlowingParticles'

const navigationItems = [
  {
    name: 'About',
    href: '/about',
    icon: UserIcon,
    description: 'Learn about my background and experience',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: FolderIcon,
    description: 'Explore my portfolio of work',
    color: 'from-purple-500 to-violet-500'
  },
  {
    name: 'Skills',
    href: '/skills',
    icon: CodeBracketIcon,
    description: 'View my technical expertise',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    name: 'Web Dev',
    href: '/services/web-development',
    icon: WrenchScrewdriverIcon,
    description: 'Modern web development services',
    color: 'from-orange-500 to-red-500'
  },
  {
    name: 'Automation',
    href: '/services/automation',
    icon: BoltIcon,
    description: 'Custom automation solutions',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    name: 'Contact',
    href: '/contact',
    icon: EnvelopeIcon,
    description: 'Get in touch with me',
    color: 'from-pink-500 to-rose-500'
  }
]

export default function HomeNavigation() {
  const containerRef = useRef<HTMLElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Parallax transforms for different layers
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const particlesY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 100,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 100
    })
  }

  return (
    <motion.section 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Moving Mouse-Following Particles */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: particlesY }}
      >
        <Suspense fallback={<div />}>
          <FlowingParticles
            particleCount={180}
            color="#87CEEB"
            followMouse={true}
          />
        </Suspense>
      </motion.div>

      {/* Same background effects as hero with mouse tracking */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        style={{ y: backgroundY }}
      >
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            x: mousePosition.x * 0.1,
            y: mousePosition.y * 0.1
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            x: mousePosition.x * -0.05,
            y: mousePosition.y * -0.05
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            x: mousePosition.x * 0.08,
            y: mousePosition.y * 0.08
          }}
        />
      </motion.div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* No header text - just the navigation cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationItems.map((item, index) => {
            const Icon = item.icon
            
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link href={item.href}>
                  <motion.div
                    className="group relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 cursor-pointer overflow-hidden"
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Background gradient on hover */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />

                    {/* Icon */}
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                        {item.name}
                      </h3>
                      <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                        {item.description}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <motion.div
                      className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.div>

                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                      initial={{ x: '-200%' }}
                      whileHover={{ x: '200%' }}
                      transition={{ duration: 1, ease: 'easeInOut' }}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-slate-400 mb-6">
            Ready to start a project or have questions?
          </p>
          <Link href="/contact">
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-2xl font-medium transition-all duration-300 shadow-xl hover:shadow-2xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Let&apos;s Talk
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  )
}