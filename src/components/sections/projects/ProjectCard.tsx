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
  const [showPreview, setShowPreview] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handlePreviewToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowPreview(!showPreview)
  }

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
      className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-700"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
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
      <div className="relative h-48 overflow-hidden">
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
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          {project.liveUrl && (
            <motion.button
              onClick={(e) => handlePreviewToggle(e)}
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPreview ? <Eye className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </motion.button>
          )}
          
          {project.liveUrl && (
            <motion.button
              onClick={(e) => handleExternalLink(e, project.liveUrl!)}
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ExternalLink className="w-5 h-5" />
            </motion.button>
          )}
          
          {project.githubUrl && (
            <motion.button
              onClick={(e) => handleExternalLink(e, project.githubUrl!)}
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Live Preview */}
      {showPreview && project.liveUrl && (
        <div className="relative h-48 border-t border-slate-200 dark:border-slate-700">
          <LivePreview
            url={project.liveUrl}
            title={project.title}
            credentials={project.demoCredentials}
          />
        </div>
      )}

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech.name}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg"
            >
              {tech.name}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded-lg">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>

        {/* Metrics */}
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{project.metrics.performanceScore}/10</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{project.metrics.userEngagement.monthlyActiveUsers.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-xs">
            Complexity: {project.metrics.technicalComplexity}/10
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/20 transition-colors pointer-events-none" />
    </motion.div>
  )
}