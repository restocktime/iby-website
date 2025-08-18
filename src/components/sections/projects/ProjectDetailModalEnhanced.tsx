'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { 
  XMarkIcon, 
  ArrowTopRightOnSquareIcon, 
  CodeBracketIcon,
  PlayIcon,
  EyeIcon,
  StarIcon,
  CalendarIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  FireIcon,
  LightBulbIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'
import { Project } from '@/types'
import { DemoRenderer } from './DemoRenderer'
import Link from 'next/link'

interface ProjectDetailModalEnhancedProps {
  project: Project
  onClose: () => void
}

export default function ProjectDetailModalEnhanced({ project, onClose }: ProjectDetailModalEnhancedProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'demo'>('overview')
  const modalRef = useRef<HTMLDivElement>(null)
  
  // Mouse tracking for subtle 3D effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [2, -2]))
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-2, 2]))

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!modalRef.current) return
    const rect = modalRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const handleExternalLink = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const getStatusInfo = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return { color: 'from-green-500 to-emerald-500', text: 'Live & Active', icon: '🟢' }
      case 'ongoing':
        return { color: 'from-blue-500 to-cyan-500', text: 'In Development', icon: '🔄' }
      case 'completed':
        return { color: 'from-purple-500 to-violet-500', text: 'Completed', icon: '✅' }
      default:
        return { color: 'from-gray-500 to-slate-500', text: 'Unknown', icon: '⚪' }
    }
  }

  const statusInfo = getStatusInfo(project.status)
  const primaryScreenshot = project.screenshots[0]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: EyeIcon },
    { id: 'technical', label: 'Technical', icon: CodeBracketIcon },
    ...(project.liveDemo ? [{ id: 'demo', label: 'Live Demo', icon: PlayIcon }] : [])
  ] as const

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          ref={modalRef}
          className="relative max-w-6xl w-full max-h-[95vh] bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.6
          }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)",
                "linear-gradient(45deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)",
                "linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-3 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-600/50 hover:bg-slate-700/50 transition-colors shadow-xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </motion.button>

          <div className="relative h-full flex flex-col">
            {/* Header Section */}
            <div className="relative p-8 pb-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Project Image */}
                {primaryScreenshot && (
                  <motion.div
                    className="w-full lg:w-80 h-48 lg:h-64 rounded-2xl overflow-hidden shadow-2xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={primaryScreenshot.url}
                      alt={primaryScreenshot.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </motion.div>
                )}

                {/* Project Info */}
                <div className="flex-1 space-y-6">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <motion.h1 
                        className="text-3xl lg:text-4xl font-bold text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {project.title}
                      </motion.h1>
                      
                      {project.featured && (
                        <motion.div
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-2xl shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                        >
                          <div className="flex items-center gap-2">
                            <StarIcon className="w-4 h-4" />
                            <span className="text-sm font-bold">Featured</span>
                          </div>
                        </motion.div>
                      )}

                      <motion.div
                        className={`bg-gradient-to-r ${statusInfo.color} text-white px-4 py-2 rounded-2xl shadow-lg`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{statusInfo.icon}</span>
                          <span className="text-sm font-medium">{statusInfo.text}</span>
                        </div>
                      </motion.div>
                    </div>

                    <motion.p 
                      className="text-slate-300 text-lg leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {project.description}
                    </motion.p>
                  </div>

                  {/* Action Buttons */}
                  <motion.div 
                    className="flex flex-wrap gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {project.liveUrl && (
                      <motion.button
                        onClick={() => handleExternalLink(project.liveUrl!)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition-colors shadow-xl"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                        Visit Live Site
                      </motion.button>
                    )}
                    
                    {project.githubUrl && (
                      <motion.button
                        onClick={() => handleExternalLink(project.githubUrl!)}
                        className="flex items-center gap-2 border-2 border-slate-600 hover:border-slate-500 text-white hover:bg-slate-800/50 px-6 py-3 rounded-2xl font-medium transition-colors shadow-xl"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CodeBracketIcon className="w-5 h-5" />
                        View Source
                      </motion.button>
                    )}

                    {/* Link to detailed project page */}
                    <Link href={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                      <motion.button
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-medium transition-colors shadow-xl"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <RocketLaunchIcon className="w-5 h-5" />
                        Full Case Study
                      </motion.button>
                    </Link>
                  </motion.div>

                  {/* Quick Stats */}
                  <motion.div 
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 text-center border border-slate-700/50">
                      <ChartBarIcon className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{project.metrics.performanceScore}/10</div>
                      <div className="text-xs text-slate-400">Performance</div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 text-center border border-slate-700/50">
                      <UsersIcon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{project.metrics.userEngagement.monthlyActiveUsers.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">Users</div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 text-center border border-slate-700/50">
                      <FireIcon className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{project.metrics.technicalComplexity}/10</div>
                      <div className="text-xs text-slate-400">Complexity</div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 text-center border border-slate-700/50">
                      <CalendarIcon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">
                        {new Date(project.endDate || project.startDate || '2023').getFullYear()}
                      </div>
                      <div className="text-xs text-slate-400">Year</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-8">
              <div className="flex gap-2 bg-slate-800/30 backdrop-blur-md rounded-2xl p-2 border border-slate-700/50">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'overview' | 'technical' | 'demo')}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 px-8 py-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* Long Description */}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <LightBulbIcon className="w-6 h-6 text-yellow-400" />
                        Project Overview
                      </h3>
                      <p className="text-slate-300 text-lg leading-relaxed">
                        {project.longDescription}
                      </p>
                    </div>

                    {/* Key Features */}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6">Key Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          "Real-time data processing",
                          "Advanced user interface",
                          "Scalable architecture", 
                          "Mobile-responsive design",
                          "Performance optimization",
                          "Security best practices"
                        ].map((feature, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                            <span className="text-slate-300">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'technical' && (
                  <motion.div
                    key="technical"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* Technologies */}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <CodeBracketIcon className="w-6 h-6 text-blue-400" />
                        Technologies Used
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {project.technologies.map((tech, index) => (
                          <motion.div
                            key={tech.name}
                            className="bg-slate-800/40 backdrop-blur-md rounded-xl p-4 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">⚡</div>
                              <h4 className="text-white font-medium">{tech.name}</h4>
                              <p className="text-slate-400 text-xs mt-1 capitalize">{tech.category}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Project Timeline */}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6">Development Timeline</h3>
                      <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-slate-400">Started</div>
                            <div className="text-white font-medium">
                              {new Date(project.startDate || '2023').toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex-1 mx-8">
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-slate-400">
                              {project.endDate ? 'Completed' : 'Ongoing'}
                            </div>
                            <div className="text-white font-medium">
                              {project.endDate 
                                ? new Date(project.endDate).toLocaleDateString()
                                : 'Present'
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'demo' && project.liveDemo && (
                  <motion.div
                    key="demo"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-[500px]"
                  >
                    <div className="h-full bg-slate-800/30 rounded-2xl border border-slate-700/30 overflow-hidden">
                      <DemoRenderer
                        liveDemo={project.liveDemo}
                        projectTitle={project.title}
                        projectId={project.id}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Glow Effects */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            animate={{
              boxShadow: [
                "0 0 0px rgba(59, 130, 246, 0)",
                "0 0 30px rgba(59, 130, 246, 0.1)",
                "0 0 60px rgba(147, 51, 234, 0.1)",
                "0 0 30px rgba(59, 130, 246, 0.1)",
                "0 0 0px rgba(59, 130, 246, 0)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}