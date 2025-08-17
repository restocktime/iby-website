'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Play, Eye, TrendingUp, Users } from 'lucide-react'
import { Project } from '@/types'
import { LivePreview } from './LivePreview'

interface ProjectCardProps {
  project: Project
  onClick: () => void
  index: number
}

export function ProjectCard({ project, onClick, index }: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleExternalLink = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'completed':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
    }
  }

  const primaryScreenshot = project.screenshots[0]

  return (
    <motion.div
      className="group relative bg-white/10 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-white/20 hover:border-white/40"
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 left-4 z-20">
          <motion.div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            ⭐ Featured
          </motion.div>
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-20">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      </div>

      {/* Project Image */}
      <div className="relative h-56 sm:h-64 overflow-hidden">
        {primaryScreenshot && (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse" />
            )}
            <img
              src={primaryScreenshot.url}
              alt={primaryScreenshot.alt}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        )}
        
        {/* Overlay with Actions */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/30"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isHovered ? 1 : 0, 
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            <span className="text-sm font-medium">Click to view details</span>
          </motion.div>
          
          <div className="absolute bottom-4 right-4 flex gap-2">
            {project.liveUrl && (
              <motion.button
                onClick={(e) => handleExternalLink(e, project.liveUrl!)}
                className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors border border-white/30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHovered ? 1 : 0, 
                  opacity: isHovered ? 1 : 0 
                }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            )}
            
            {project.githubUrl && (
              <motion.button
                onClick={(e) => handleExternalLink(e, project.githubUrl!)}
                className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors border border-white/30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHovered ? 1 : 0, 
                  opacity: isHovered ? 1 : 0 
                }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <Github className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>



      {/* Project Content */}
      <div className="p-8">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
            {project.title}
          </h3>
        </div>

        <p className="text-white/80 text-sm mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech.name}
              className="px-2 py-1 bg-white/10 backdrop-blur-sm text-white/90 text-xs rounded-lg border border-white/20"
            >
              {tech.name}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-1 bg-white/5 backdrop-blur-sm text-white/60 text-xs rounded-lg border border-white/10">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>

        {/* Metrics */}
        <div className="flex items-center justify-between text-sm text-white/70">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>{project.metrics.performanceScore}/10</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-400" />
              <span>{project.metrics.userEngagement.monthlyActiveUsers.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-xs text-white/60">
            Complexity: {project.metrics.technicalComplexity}/10
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <motion.div 
        className="absolute inset-0 rounded-2xl border-2 border-transparent pointer-events-none"
        animate={{ 
          borderColor: isHovered ? 'rgba(59, 130, 246, 0.5)' : 'transparent',
          boxShadow: isHovered ? '0 0 30px rgba(59, 130, 246, 0.3)' : '0 0 0px rgba(59, 130, 246, 0)'
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </motion.div>
  )
}