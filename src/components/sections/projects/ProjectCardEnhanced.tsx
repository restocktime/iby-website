'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { 
  ArrowTopRightOnSquareIcon, 
  CodeBracketIcon, 
  PlayIcon, 
  EyeIcon, 
  StarIcon,
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { Project } from '@/types'
import Link from 'next/link'

interface ProjectCardEnhancedProps {
  project: Project
  onClick: () => void
  index: number
}

export function ProjectCardEnhanced({ project, onClick, index }: ProjectCardEnhancedProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Mouse position tracking for 3D effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]))
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]))

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  const handleExternalLink = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const getStatusInfo = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return { color: 'from-green-500 to-emerald-500', icon: '🟢', text: 'Live & Active' }
      case 'ongoing':
        return { color: 'from-blue-500 to-cyan-500', icon: '🔄', text: 'In Development' }
      case 'completed':
        return { color: 'from-purple-500 to-violet-500', icon: '✅', text: 'Completed' }
      default:
        return { color: 'from-gray-500 to-slate-500', icon: '⚪', text: 'Unknown' }
    }
  }

  const statusInfo = getStatusInfo(project.status)
  const primaryScreenshot = project.screenshots[0]

  return (
    <motion.div
      ref={cardRef}
      className="group relative perspective-1000 cursor-pointer"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.15,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={{ z: 50 }}
    >
      {/* Main Card */}
      <motion.div
        className="relative w-full h-[520px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl border border-slate-700/50 shadow-2xl"
        style={{
          transformStyle: "preserve-3d",
        }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)"
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 opacity-60"
          style={{
            background: `linear-gradient(135deg, 
              rgba(59, 130, 246, 0.1) 0%, 
              rgba(147, 51, 234, 0.1) 35%, 
              rgba(236, 72, 153, 0.1) 100%)`,
          }}
          animate={{
            background: isHovered ? [
              `linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 35%, rgba(236, 72, 153, 0.2) 100%)`,
              `linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(236, 72, 153, 0.2) 35%, rgba(59, 130, 246, 0.2) 100%)`,
              `linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 35%, rgba(236, 72, 153, 0.2) 100%)`
            ] : `linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 35%, rgba(236, 72, 153, 0.1) 100%)`
          }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
        />

        {/* Featured Badge */}
        {project.featured && (
          <motion.div
            className="absolute top-6 left-6 z-30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-4 py-2 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <StarIcon className="w-4 h-4" />
                <span className="text-sm font-bold">Featured</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Status Badge */}
        <motion.div
          className="absolute top-6 right-6 z-30"
          initial={{ scale: 0, x: 50 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <div className={`bg-gradient-to-r ${statusInfo.color} text-white px-4 py-2 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm`}>
            <div className="flex items-center gap-2">
              <span className="text-xs">{statusInfo.icon}</span>
              <span className="text-sm font-medium">{statusInfo.text}</span>
            </div>
          </div>
        </motion.div>

        {/* Project Image */}
        <div className="relative h-64 overflow-hidden">
          {primaryScreenshot && (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                </div>
              )}
              <motion.img
                src={primaryScreenshot.url}
                alt={primaryScreenshot.alt}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  filter: isHovered ? 'brightness(1.1) contrast(1.1)' : 'brightness(1) contrast(1)',
                }}
                onLoad={() => setImageLoaded(true)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
            </>
          )}
          
          {/* Overlay with Hover Actions */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="flex items-center gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ 
                  y: isHovered ? 0 : 20, 
                  opacity: isHovered ? 1 : 0 
                }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {/* View Details Button */}
                <motion.div
                  className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/20 shadow-xl"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <EyeIcon className="w-5 h-5" />
                    <span className="font-medium">View Details</span>
                  </div>
                </motion.div>

                {/* External Links */}
                <div className="flex gap-2">
                  {project.liveUrl && (
                    <motion.button
                      onClick={(e) => handleExternalLink(e, project.liveUrl!)}
                      className="bg-blue-500/20 backdrop-blur-md text-blue-300 p-3 rounded-2xl border border-blue-400/20 hover:bg-blue-500/30 transition-colors shadow-xl"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: isHovered ? 1 : 0, 
                        opacity: isHovered ? 1 : 0 
                      }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <GlobeAltIcon className="w-5 h-5" />
                    </motion.button>
                  )}
                  
                  {project.githubUrl && (
                    <motion.button
                      onClick={(e) => handleExternalLink(e, project.githubUrl!)}
                      className="bg-gray-500/20 backdrop-blur-md text-gray-300 p-3 rounded-2xl border border-gray-400/20 hover:bg-gray-500/30 transition-colors shadow-xl"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: isHovered ? 1 : 0, 
                        opacity: isHovered ? 1 : 0 
                      }}
                      transition={{ delay: 0.25, type: "spring", stiffness: 200 }}
                    >
                      <CodeBracketIcon className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="relative p-8 space-y-6">
          {/* Title and Description */}
          <div>
            <motion.h3 
              className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {project.title}
            </motion.h3>
            <motion.p 
              className="text-slate-300 leading-relaxed text-sm line-clamp-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {project.description}
            </motion.p>
          </div>

          {/* Technologies */}
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {project.technologies.slice(0, 3).map((tech, techIndex) => (
              <motion.span
                key={tech.name}
                className="px-3 py-1.5 bg-white/5 backdrop-blur-sm text-white/80 text-xs rounded-xl border border-white/10 font-medium"
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + techIndex * 0.1 }}
              >
                {tech.name}
              </motion.span>
            ))}
            {project.technologies.length > 3 && (
              <motion.span 
                className="px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-300 text-xs rounded-xl border border-blue-500/20 font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
              >
                +{project.technologies.length - 3} more
              </motion.span>
            )}
          </motion.div>

          {/* Metrics */}
          <motion.div 
            className="flex items-center justify-between pt-4 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-green-400">
                <ChartBarIcon className="w-4 h-4" />
                <span className="font-medium">{project.metrics.performanceScore}/10</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <UsersIcon className="w-4 h-4" />
                <span className="font-medium">{project.metrics.userEngagement.monthlyActiveUsers.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              <span>Complexity: {project.metrics.technicalComplexity}/10</span>
            </div>
          </motion.div>
        </div>

        {/* Glowing Border Effect */}
        <motion.div 
          className="absolute inset-0 rounded-3xl pointer-events-none"
          animate={{ 
            boxShadow: isHovered 
              ? [
                  '0 0 0px rgba(59, 130, 246, 0)',
                  '0 0 20px rgba(59, 130, 246, 0.3)',
                  '0 0 40px rgba(59, 130, 246, 0.2)',
                  '0 0 20px rgba(59, 130, 246, 0.3)',
                ] 
              : '0 0 0px rgba(59, 130, 246, 0)'
          }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
        />

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 pointer-events-none"
          initial={{ x: '-200%' }}
          animate={{ x: isHovered ? '200%' : '-200%' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  )
}