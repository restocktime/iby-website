'use client'

import { motion } from 'framer-motion'
import { Calendar, ExternalLink, Github, TrendingUp } from 'lucide-react'
import { Project } from '@/types'

interface ProjectTimelineProps {
  projects: Project[]
  onProjectClick: (project: Project) => void
}

export function ProjectTimeline({ projects, onProjectClick }: ProjectTimelineProps) {
  // Sort projects by status priority and then by featured status
  const sortedProjects = [...projects].sort((a, b) => {
    const statusPriority = { active: 0, ongoing: 1, completed: 2 }
    const aStatus = statusPriority[a.status] ?? 3
    const bStatus = statusPriority[b.status] ?? 3
    
    if (aStatus !== bStatus) return aStatus - bStatus
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return a.title.localeCompare(b.title)
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'ongoing':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-slate-400'
      default:
        return 'bg-slate-400'
    }
  }

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'Currently Active'
      case 'ongoing':
        return 'In Development'
      case 'completed':
        return 'Completed'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {sortedProjects.map((project) => (
          <motion.div
            key={project.id}
            variants={itemVariants}
            layoutId={`timeline-${project.id}`}
            className="relative flex items-start gap-6"
          >
            {/* Timeline Dot */}
            <div className="relative z-10 flex-shrink-0">
              <div className={`w-4 h-4 rounded-full ${getStatusColor(project.status)} shadow-lg`} />
              <div className={`absolute inset-0 w-4 h-4 rounded-full ${getStatusColor(project.status)} animate-ping opacity-20`} />
            </div>

            {/* Project Card */}
            <motion.div
              className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-700 group"
              whileHover={{ scale: 1.02, x: 10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onProjectClick(project)}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Project Image */}
                {project.screenshots[0] && (
                  <div className="lg:w-1/3 h-48 lg:h-auto overflow-hidden">
                    <img
                      src={project.screenshots[0].url}
                      alt={project.screenshots[0].alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Project Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{getStatusLabel(project.status)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {project.liveUrl && (
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(project.liveUrl, '_blank', 'noopener,noreferrer')
                          }}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </motion.button>
                      )}
                      {project.githubUrl && (
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(project.githubUrl, '_blank', 'noopener,noreferrer')
                          }}
                          className="p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Github className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 6).map((tech) => (
                      <span
                        key={tech.name}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg"
                      >
                        {tech.name}
                      </span>
                    ))}
                    {project.technologies.length > 6 && (
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded-lg">
                        +{project.technologies.length - 6} more
                      </span>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Score: {project.metrics.performanceScore}/10</span>
                      </div>
                      <div>
                        Users: {project.metrics.userEngagement.monthlyActiveUsers.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">
                      Complexity: {project.metrics.technicalComplexity}/10
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}