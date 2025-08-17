'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, ExternalLink, Github, Users, TrendingUp, 
  Clock, Star, Award, Code, 
  Globe, Monitor, Key, Copy, CheckCircle
} from 'lucide-react'
import { Project } from '@/types'
import { LivePreview } from './LivePreview'
import LiveMetrics from './LiveMetrics'
import ScraperDashboard from './ScraperDashboard'

interface ProjectDetailModalProps {
  project: Project
  onClose: () => void
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'metrics' | 'preview'>('overview')
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Globe },
    { id: 'technical' as const, label: 'Technical', icon: Code },
    { id: 'metrics' as const, label: 'Metrics', icon: TrendingUp },
    ...(project.liveUrl ? [{ id: 'preview' as const, label: 'Live Preview', icon: Monitor }] : [])
  ]

  const getCategoryColor = (category: Project['category']) => {
    const colors = {
      'web-development': 'from-blue-500 to-cyan-500',
      'automation': 'from-green-500 to-emerald-500',
      'crm': 'from-purple-500 to-violet-500',
      'analytics': 'from-orange-500 to-red-500',
      'e-commerce': 'from-pink-500 to-rose-500',
      'scraping': 'from-yellow-500 to-amber-500',
      'monitoring': 'from-indigo-500 to-blue-500'
    }
    return colors[category] || 'from-slate-500 to-slate-600'
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative bg-gradient-to-r ${getCategoryColor(project.category)} p-6 text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-start gap-4">
            {project.screenshots[0] && (
              <img
                src={project.screenshots[0].url}
                alt={project.screenshots[0].alt}
                className="w-20 h-20 rounded-xl object-cover shadow-lg"
              />
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">{project.title}</h2>
                {project.featured && (
                  <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Featured
                  </div>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
              
              <p className="text-white/90 text-lg mb-4">{project.description}</p>
              
              <div className="flex items-center gap-4">
                {project.liveUrl && (
                  <motion.button
                    onClick={() => window.open(project.liveUrl, '_blank', 'noopener,noreferrer')}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Site
                  </motion.button>
                )}
                
                {project.githubUrl && (
                  <motion.button
                    onClick={() => window.open(project.githubUrl, '_blank', 'noopener,noreferrer')}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github className="w-4 h-4" />
                    View Code
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center gap-2 px-6 py-4 font-medium transition-colors relative
                  ${activeTab === id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Case Study */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Case Study</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Challenge</h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">{project.caseStudy.challenge}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Solution</h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">{project.caseStudy.solution}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Results</h4>
                      <ul className="text-slate-600 dark:text-slate-300 text-sm space-y-1">
                        {project.caseStudy.results.map((result, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Screenshots Gallery */}
                {project.screenshots.length > 1 && (
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {project.screenshots.map((screenshot) => (
                        <motion.div
                          key={screenshot.id}
                          className="relative group cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img
                            src={screenshot.url}
                            alt={screenshot.alt}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          {screenshot.caption && (
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <p className="text-white text-sm text-center p-2">{screenshot.caption}</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Testimonial */}
                {project.caseStudy.testimonial && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl">
                    <div className="flex items-start gap-4">
                      {project.caseStudy.testimonial.avatar && (
                        <img
                          src={project.caseStudy.testimonial.avatar}
                          alt={project.caseStudy.testimonial.author}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <blockquote className="text-slate-700 dark:text-slate-300 italic mb-3">
                          &ldquo;{project.caseStudy.testimonial.content}&rdquo;
                        </blockquote>
                        <div className="text-sm">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {project.caseStudy.testimonial.author}
                          </div>
                          <div className="text-slate-600 dark:text-slate-400">
                            {project.caseStudy.testimonial.role} at {project.caseStudy.testimonial.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'technical' && (
              <motion.div
                key="technical"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Technologies */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Technologies Used</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.technologies.map((tech) => (
                      <div key={tech.name} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{tech.name}</h4>
                          <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                            {tech.category}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Proficiency</span>
                            <span className="text-slate-900 dark:text-white">{tech.proficiency}/10</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${tech.proficiency * 10}%` }}
                            />
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {tech.yearsOfExperience} years experience
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demo Credentials */}
                {project.demoCredentials && (
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Demo Access</h3>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 bg-white dark:bg-slate-700 px-3 py-2 rounded border text-sm">
                              {project.demoCredentials.username}
                            </code>
                            <button
                              onClick={() => copyToClipboard(project.demoCredentials!.username, 'username')}
                              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                            >
                              {copiedText === 'username' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 bg-white dark:bg-slate-700 px-3 py-2 rounded border text-sm">
                              {project.demoCredentials.password}
                            </code>
                            <button
                              onClick={() => copyToClipboard(project.demoCredentials!.password, 'password')}
                              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                            >
                              {copiedText === 'password' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      {project.demoCredentials.instructions && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Key className="w-4 h-4 text-blue-600 mt-0.5" />
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                              {project.demoCredentials.instructions}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'metrics' && (
              <motion.div
                key="metrics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Live Metrics */}
                <LiveMetrics 
                  projectId={project.id} 
                  className="mb-6"
                  showRealTimeIndicator={true}
                />

                {/* Scraper Dashboard for scraping/monitoring projects */}
                {(project.category === 'scraping' || project.category === 'monitoring') && (
                  <ScraperDashboard className="mb-6" />
                )}

                {/* Static Performance Metrics */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Historical Performance</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Performance</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {project.metrics.performanceScore}/10
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Users</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {project.metrics.userEngagement.monthlyActiveUsers.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Session</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {Math.round(project.metrics.userEngagement.averageSessionDuration / 60)}m
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Complexity</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {project.metrics.technicalComplexity}/10
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Impact */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Business Impact</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Revenue Impact</span>
                        <span className="font-semibold text-green-600">
                          ${project.metrics.businessImpact.revenueImpact.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Cost Savings</span>
                        <span className="font-semibold text-blue-600">
                          ${project.metrics.businessImpact.costSavings.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Efficiency Gain</span>
                        <span className="font-semibold text-purple-600">
                          {project.metrics.businessImpact.efficiencyGain}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">User Satisfaction</span>
                        <span className="font-semibold text-yellow-600">
                          {project.metrics.businessImpact.userSatisfactionScore}/10
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Bounce Rate</span>
                        <span className="font-semibold text-red-600">
                          {project.metrics.userEngagement.bounceRate}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Conversion Rate</span>
                        <span className="font-semibold text-green-600">
                          {project.metrics.userEngagement.conversionRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'preview' && project.liveUrl && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-[500px]"
              >
                <LivePreview
                  url={project.liveUrl}
                  title={project.title}
                  credentials={project.demoCredentials}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}