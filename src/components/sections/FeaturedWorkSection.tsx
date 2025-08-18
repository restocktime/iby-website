'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  GlobeAltIcon, 
  CogIcon, 
  WrenchScrewdriverIcon,
  CodeBracketIcon,
  ServerIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'

const categories = [
  {
    id: 'web-apps',
    title: 'Web Applications',
    description: 'Modern, responsive applications built with React, Next.js, and cutting-edge technologies.',
    icon: GlobeAltIcon,
    color: 'from-blue-500 to-cyan-500',
    count: 8,
    projects: ['E-commerce Platform', 'Real-time Dashboard', 'Social Media App']
  },
  {
    id: 'automation',
    title: 'Automation Tools',
    description: 'Custom automation solutions, web scrapers, and monitoring systems for business efficiency.',
    icon: CogIcon,
    color: 'from-purple-500 to-violet-500',
    count: 12,
    projects: ['Web Scraper Pro', 'Business Intelligence Tool', 'Process Automation']
  },
  {
    id: 'custom-solutions',
    title: 'Custom Solutions',
    description: 'Tailored CRM systems, analytics dashboards, and business process optimization.',
    icon: WrenchScrewdriverIcon,
    color: 'from-emerald-500 to-teal-500',
    count: 6,
    projects: ['Custom CRM', 'Analytics Dashboard', 'Inventory Management']
  }
]

const technologies = [
  { name: 'React', category: 'Frontend', color: 'text-blue-400' },
  { name: 'Next.js', category: 'Framework', color: 'text-gray-300' },
  { name: 'TypeScript', category: 'Language', color: 'text-blue-600' },
  { name: 'Python', category: 'Backend', color: 'text-yellow-400' },
  { name: 'Node.js', category: 'Runtime', color: 'text-green-400' },
  { name: 'PostgreSQL', category: 'Database', color: 'text-blue-500' },
  { name: 'MongoDB', category: 'Database', color: 'text-green-500' },
  { name: 'Tailwind CSS', category: 'Styling', color: 'text-cyan-400' },
  { name: 'Framer Motion', category: 'Animation', color: 'text-pink-400' },
  { name: 'Three.js', category: '3D Graphics', color: 'text-orange-400' }
]

export default function FeaturedWorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <motion.section
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isInView ? 0 : 50, opacity: isInView ? 1 : 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.div
              className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1] 
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <CodeBracketIcon className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Featured Work
            </h2>
            <motion.div
              className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl shadow-2xl"
              animate={{ 
                rotate: [0, -5, 5, 0],
                scale: [1, 1.05, 1] 
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            >
              <ServerIcon className="w-12 h-12 text-white" />
            </motion.div>
          </div>
          
          <motion.p 
            className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: isInView ? 0 : 30, opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Each project represents a unique challenge and innovative solution. Click on any project to explore detailed case studies with live demos, code insights, and lessons learned.
          </motion.p>

          {/* Animated Divider */}
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isInView ? 1 : 0 }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
          />
        </motion.div>

        {/* Project Categories */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isInView ? 0 : 50, opacity: isInView ? 1 : 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {categories.map((category, index) => {
            const Icon = category.icon
            
            return (
              <motion.div
                key={category.id}
                className="group relative bg-slate-800/30 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                }}
              >
                {/* Background Gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Icon */}
                <motion.div
                  className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className="w-10 h-10 text-white" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    {category.description}
                  </p>

                  {/* Project Count */}
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      className={`text-4xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    >
                      {category.count}
                    </motion.div>
                    <span className="text-slate-400 text-lg font-medium">Projects</span>
                  </div>

                  {/* Sample Projects */}
                  <div className="space-y-2">
                    {category.projects.map((project, projectIndex) => (
                      <motion.div
                        key={project}
                        className="flex items-center gap-3 text-sm text-slate-400"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5 + index * 0.2 + projectIndex * 0.1 }}
                      >
                        <div className={`w-2 h-2 bg-gradient-to-r ${category.color} rounded-full`} />
                        <span>{project}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 pointer-events-none"
                  initial={{ x: '-200%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 2, ease: "easeInOut" }}
                />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Technologies & Tools */}
        <motion.div
          className="text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isInView ? 0 : 50, opacity: isInView ? 1 : 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-white mb-8 flex items-center justify-center gap-3">
            <DevicePhoneMobileIcon className="w-8 h-8 text-blue-400" />
            Technologies & Tools
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl px-6 py-4 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 hover:bg-slate-700/40"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 + index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                }}
              >
                <div className="text-center">
                  <div className={`text-lg font-bold ${tech.color} mb-1 group-hover:scale-110 transition-transform`}>
                    {tech.name}
                  </div>
                  <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                    {tech.category}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}