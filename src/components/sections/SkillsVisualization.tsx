'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SkillsRadarChart from './skills/SkillsRadarChart'
import TechnologyNetwork from './skills/TechnologyNetwork'
import ExperienceTimeline from './skills/ExperienceTimeline'
import GitHubStats from './skills/GitHubStats'

interface SkillsVisualizationProps {
  className?: string
}

const SkillsVisualization: React.FC<SkillsVisualizationProps> = ({ className = '' }) => {
  const [activeView, setActiveView] = useState<'radar' | 'network' | 'timeline' | 'github'>('radar')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const views = [
    { id: 'radar', label: 'Skills Radar', icon: '📊' },
    { id: 'network', label: 'Tech Network', icon: '🕸️' },
    { id: 'timeline', label: 'Experience', icon: '📅' },
    { id: 'github', label: 'GitHub Stats', icon: '📈' }
  ] as const

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
      transition={{ duration: 0.6 }}
      className={`space-y-8 ${className}`}
      role="region"
      aria-labelledby="skills-heading"
    >
      {/* Header */}
      <div className="text-center">
        <h2 id="skills-heading" className="text-3xl font-heading font-bold text-white mb-4">Skills & Expertise</h2>
        <p className="text-gray-400 max-w-2xl mx-auto font-body">
          Interactive visualization of my technical skills, experience timeline, and real-time GitHub contributions
        </p>
      </div>

      {/* View Selector */}
      <div className="flex justify-center">
        <div 
          className="flex space-x-1 bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-gray-700/50"
          role="tablist"
          aria-label="Skills visualization views"
        >
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-body font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                activeView === view.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
              role="tab"
              aria-selected={activeView === view.id}
              aria-controls={`${view.id}-panel`}
              id={`${view.id}-tab`}
            >
              <span role="img" aria-label={`${view.label} icon`}>{view.icon}</span>
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {activeView === 'radar' && (
            <motion.div
              key="radar"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              role="tabpanel"
              id="radar-panel"
              aria-labelledby="radar-tab"
            >
              <SkillsRadarChart />
            </motion.div>
          )}

          {activeView === 'network' && (
            <motion.div
              key="network"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              role="tabpanel"
              id="network-panel"
              aria-labelledby="network-tab"
            >
              <TechnologyNetwork />
            </motion.div>
          )}

          {activeView === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              role="tabpanel"
              id="timeline-panel"
              aria-labelledby="timeline-tab"
            >
              <ExperienceTimeline />
            </motion.div>
          )}

          {activeView === 'github' && (
            <motion.div
              key="github"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              role="tabpanel"
              id="github-panel"
              aria-labelledby="github-tab"
            >
              <GitHubStats />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default SkillsVisualization