'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue } from 'framer-motion'
import { 
  CodeBracketIcon, 
  CubeIcon, 
  ServerIcon, 
  DevicePhoneMobileIcon,
  CloudIcon,
  ChartBarIcon,
  CogIcon,
  CommandLineIcon,
  BoltIcon,
  StarIcon,
  FireIcon
} from '@heroicons/react/24/outline'

interface Skill {
  name: string
  level: number
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'cloud' | 'mobile'
  icon: React.ComponentType<{ className?: string }>
  color: string
  experience: string
  projects: number
}

interface SkillsVisualizationEnhancedProps {
  className?: string
}

const skills: Skill[] = [
  // Frontend
  { name: 'React', level: 95, category: 'frontend', icon: CodeBracketIcon, color: 'from-blue-400 to-cyan-400', experience: '4+ years', projects: 25 },
  { name: 'Next.js', level: 92, category: 'frontend', icon: CubeIcon, color: 'from-gray-400 to-gray-600', experience: '3+ years', projects: 18 },
  { name: 'TypeScript', level: 90, category: 'frontend', icon: CodeBracketIcon, color: 'from-blue-600 to-blue-700', experience: '3+ years', projects: 22 },
  { name: 'Tailwind CSS', level: 88, category: 'frontend', icon: CodeBracketIcon, color: 'from-teal-400 to-cyan-500', experience: '3+ years', projects: 20 },
  { name: 'Vue.js', level: 78, category: 'frontend', icon: CodeBracketIcon, color: 'from-green-400 to-green-600', experience: '2+ years', projects: 8 },
  
  // Backend
  { name: 'Node.js', level: 90, category: 'backend', icon: ServerIcon, color: 'from-green-500 to-green-600', experience: '4+ years', projects: 20 },
  { name: 'Python', level: 88, category: 'backend', icon: CommandLineIcon, color: 'from-yellow-400 to-yellow-600', experience: '5+ years', projects: 30 },
  { name: 'FastAPI', level: 85, category: 'backend', icon: BoltIcon, color: 'from-green-400 to-teal-500', experience: '2+ years', projects: 12 },
  { name: 'Express.js', level: 82, category: 'backend', icon: ServerIcon, color: 'from-gray-500 to-gray-600', experience: '3+ years', projects: 15 },
  
  // Database
  { name: 'PostgreSQL', level: 85, category: 'database', icon: ServerIcon, color: 'from-blue-500 to-blue-700', experience: '3+ years', projects: 18 },
  { name: 'MongoDB', level: 80, category: 'database', icon: ServerIcon, color: 'from-green-600 to-green-700', experience: '2+ years', projects: 10 },
  { name: 'Redis', level: 75, category: 'database', icon: ServerIcon, color: 'from-red-500 to-red-600', experience: '2+ years', projects: 8 },
  
  // Cloud & Tools
  { name: 'AWS', level: 82, category: 'cloud', icon: CloudIcon, color: 'from-orange-400 to-orange-600', experience: '2+ years', projects: 15 },
  { name: 'Docker', level: 80, category: 'tools', icon: CubeIcon, color: 'from-blue-400 to-blue-600', experience: '2+ years', projects: 12 },
  { name: 'Git', level: 90, category: 'tools', icon: CodeBracketIcon, color: 'from-orange-500 to-red-500', experience: '4+ years', projects: 35 },
  
  // Mobile
  { name: 'React Native', level: 75, category: 'mobile', icon: DevicePhoneMobileIcon, color: 'from-purple-400 to-purple-600', experience: '1+ years', projects: 5 },
]

const categories = [
  { id: 'all', name: 'All Skills', icon: StarIcon, color: 'from-white to-gray-300' },
  { id: 'frontend', name: 'Frontend', icon: CodeBracketIcon, color: 'from-blue-400 to-cyan-400' },
  { id: 'backend', name: 'Backend', icon: ServerIcon, color: 'from-green-400 to-green-600' },
  { id: 'database', name: 'Database', icon: ServerIcon, color: 'from-purple-400 to-purple-600' },
  { id: 'cloud', name: 'Cloud', icon: CloudIcon, color: 'from-orange-400 to-orange-600' },
  { id: 'tools', name: 'Tools', icon: CogIcon, color: 'from-gray-400 to-gray-600' },
  { id: 'mobile', name: 'Mobile', icon: DevicePhoneMobileIcon, color: 'from-pink-400 to-pink-600' },
]

const SkillsVisualizationEnhanced: React.FC<SkillsVisualizationEnhancedProps> = ({ className = '' }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid')
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 20)
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 20)
  }

  return (
    <motion.div
      ref={containerRef}
      className={`space-y-12 ${className}`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: isInView ? 0 : 50, opacity: isInView ? 1 : 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <motion.div
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <BoltIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <motion.div
            className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-xl"
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <FireIcon className="w-8 h-8 text-white" />
          </motion.div>
        </div>
        <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
          A comprehensive showcase of my technical skills and experience across various technologies and frameworks
        </p>
      </motion.div>

      {/* View Toggle */}
      <motion.div 
        className="flex justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: isInView ? 1 : 0.8, opacity: isInView ? 1 : 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2 border border-slate-700/50 shadow-xl">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <CubeIcon className="w-4 h-4" />
                Grid View
              </div>
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                viewMode === 'chart'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-4 h-4" />
                Chart View
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div 
        className="flex justify-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: isInView ? 0 : 30, opacity: isInView ? 1 : 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="flex flex-wrap justify-center gap-3 bg-slate-900/50 backdrop-blur-xl rounded-3xl p-4 border border-slate-700/50 shadow-2xl">
          {categories.map((category, index) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id
            
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${category.color} text-white shadow-xl scale-105`
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:scale-105'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
                {category.id !== 'all' && (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {skills.filter(s => s.category === category.id).length}
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Skills Display */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {filteredSkills.map((skill, index) => {
              const Icon = skill.icon
              const isHovered = hoveredSkill === skill.name
              
              return (
                <motion.div
                  key={skill.name}
                  className="group relative"
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <motion.div
                    className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-slate-700/50 shadow-2xl overflow-hidden"
                    whileHover={{ 
                      scale: 1.05, 
                      rotateY: 5,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)"
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Background Gradient */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-5`}
                      animate={{ opacity: isHovered ? 0.1 : 0.05 }}
                    />

                    {/* Icon */}
                    <motion.div
                      className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${skill.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-xl relative z-10`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </motion.div>

                    {/* Content */}
                    <div className="relative z-10 min-w-0 px-1">
                      <h3 className="text-sm sm:text-lg font-bold text-white mb-2 break-words leading-tight">{skill.name}</h3>
                      <p className="text-slate-400 text-xs mb-3 break-words leading-relaxed">{skill.experience} experience</p>

                      {/* Progress Bar */}
                      <div className="mb-3 sm:mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-slate-300 truncate">Proficiency</span>
                          <span className="text-xs font-bold text-white ml-2">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2 sm:h-3 overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative`}
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-white/20"
                              animate={{ x: ['0%', '100%'] }}
                              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            />
                          </motion.div>
                        </div>
                      </div>

                      {/* Projects Count */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 truncate">Projects</span>
                        <span className="font-bold text-white ml-2">{skill.projects}</span>
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                      initial={{ x: '-200%' }}
                      animate={{ x: isHovered ? '200%' : '-200%' }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Glow Effect */}
                    <motion.div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${skill.color} opacity-0 blur-xl`}
                      animate={{ opacity: isHovered ? 0.3 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ zIndex: -1 }}
                    />
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="chart"
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              {filteredSkills.map((skill, index) => {
                const Icon = skill.icon
                
                return (
                  <motion.div
                    key={skill.name}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl hover:bg-slate-700/30 transition-colors"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <motion.div
                      className={`w-12 h-12 bg-gradient-to-br ${skill.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>

                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                        <h3 className="text-lg font-bold text-white break-words">{skill.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400">
                          <span className="break-words">{skill.experience}</span>
                          <span className="whitespace-nowrap">{skill.projects} projects</span>
                          <span className="font-bold text-white">{skill.level}%</span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative`}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-white/20 rounded-full"
                            animate={{ 
                              opacity: hoveredSkill === skill.name ? [0.3, 0.6, 0.3] : 0.3 
                            }}
                            transition={{ 
                              repeat: hoveredSkill === skill.name ? Infinity : 0, 
                              duration: 1.5 
                            }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Summary */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: isInView ? 0 : 50, opacity: isInView ? 1 : 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        {[
          { label: 'Total Skills', value: skills.length, color: 'from-blue-500 to-cyan-500' },
          { label: 'Years Experience', value: '5+', color: 'from-green-500 to-emerald-500' },
          { label: 'Projects Completed', value: '35+', color: 'from-purple-500 to-violet-500' },
          { label: 'Avg. Proficiency', value: `${Math.round(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length)}%`, color: 'from-orange-500 to-red-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-slate-700/50 text-center shadow-xl"
            whileHover={{ scale: 1.05, y: -5 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + index * 0.1 }}
          >
            <motion.div
              className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 sm:mb-2`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.6 + index * 0.1, type: "spring", stiffness: 200 }}
            >
              {stat.value}
            </motion.div>
            <div className="text-slate-400 text-xs sm:text-sm font-medium break-words">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default SkillsVisualizationEnhanced