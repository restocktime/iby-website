'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TimelineEvent {
  id: string
  date: string
  title: string
  type: 'project' | 'skill' | 'milestone' | 'business'
  description: string
  technologies: string[]
  achievements: string[]
  impact?: {
    metric: string
    value: string
  }
  status: 'completed' | 'ongoing'
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 'start-programming',
    date: '2018-01',
    title: 'Started Programming Journey',
    type: 'milestone',
    description: 'Began learning programming with Python, focusing on automation and data manipulation.',
    technologies: ['Python', 'Basic Scripting'],
    achievements: [
      'Completed first automation script',
      'Built personal productivity tools',
      'Learned fundamental programming concepts'
    ],
    status: 'completed'
  },
  {
    id: 'web-scraping-mastery',
    date: '2019-06',
    title: 'Web Scraping Expertise',
    type: 'skill',
    description: 'Developed advanced web scraping capabilities with Python, Selenium, and BeautifulSoup.',
    technologies: ['Python', 'Selenium', 'BeautifulSoup', 'Requests'],
    achievements: [
      'Built first commercial scraper',
      'Mastered anti-detection techniques',
      'Created reusable scraping frameworks'
    ],
    impact: {
      metric: 'Data Points Collected',
      value: '1M+'
    },
    status: 'completed'
  },
  {
    id: 'react-learning',
    date: '2020-03',
    title: 'Frontend Development with React',
    type: 'skill',
    description: 'Transitioned to full-stack development, mastering React and modern frontend technologies.',
    technologies: ['React', 'JavaScript', 'HTML/CSS', 'Node.js'],
    achievements: [
      'Built first React application',
      'Learned component-based architecture',
      'Integrated frontend with backend APIs'
    ],
    status: 'completed'
  },
  {
    id: 'dream-cars-4u',
    date: '2020-09',
    title: 'Dream Cars 4 U LLC',
    type: 'business',
    description: 'Founded automotive business focusing on luxury car sales and customer relationship management.',
    technologies: ['Business Management', 'CRM Systems', 'Sales Automation'],
    achievements: [
      'Established successful automotive business',
      'Developed custom CRM solutions',
      'Built automated sales processes'
    ],
    impact: {
      metric: 'Revenue Generated',
      value: '$500K+'
    },
    status: 'ongoing'
  },
  {
    id: 'typescript-adoption',
    date: '2021-02',
    title: 'TypeScript & Advanced React',
    type: 'skill',
    description: 'Adopted TypeScript for type-safe development and advanced React patterns.',
    technologies: ['TypeScript', 'React', 'Next.js', 'Advanced Patterns'],
    achievements: [
      'Migrated projects to TypeScript',
      'Implemented advanced React patterns',
      'Improved code quality and maintainability'
    ],
    status: 'completed'
  },
  {
    id: 'restocktime-launch',
    date: '2021-08',
    title: 'Restocktime Platform',
    type: 'project',
    description: 'Launched e-commerce inventory management platform helping retailers optimize supply chain.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Stripe'],
    achievements: [
      'Served 1,200+ active retailers',
      'Reduced stockouts by 60%',
      'Generated $75K+ revenue for clients'
    ],
    impact: {
      metric: 'Active Users',
      value: '1,200+'
    },
    status: 'ongoing'
  },
  {
    id: 'nextjs-mastery',
    date: '2022-01',
    title: 'Next.js & Full-Stack Mastery',
    type: 'skill',
    description: 'Mastered Next.js for production applications with SSR, API routes, and optimization.',
    technologies: ['Next.js', 'Vercel', 'API Routes', 'SSR/SSG'],
    achievements: [
      'Built production Next.js applications',
      'Optimized for performance and SEO',
      'Implemented advanced deployment strategies'
    ],
    status: 'completed'
  },
  {
    id: 'shuk-online',
    date: '2022-06',
    title: 'Shuk Online E-commerce',
    type: 'project',
    description: 'Developed modern e-commerce platform for Middle Eastern grocery delivery.',
    technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe', 'Vercel'],
    achievements: [
      '800+ monthly active customers',
      '15% conversion rate achieved',
      'Multi-language support implemented'
    ],
    impact: {
      metric: 'Monthly Revenue',
      value: '$45K+'
    },
    status: 'ongoing'
  },
  {
    id: 'google-scraper-suite',
    date: '2022-11',
    title: 'Google Scraper Suite',
    type: 'project',
    description: 'Built comprehensive Google services scraping toolkit with anti-detection measures.',
    technologies: ['Python', 'Selenium', 'BeautifulSoup', 'Scrapy', 'Proxy Management'],
    achievements: [
      '90% success rate in data extraction',
      '150+ businesses using tools',
      'Zero detection incidents in 6 months'
    ],
    impact: {
      metric: 'Cost Savings',
      value: '$40K+'
    },
    status: 'ongoing'
  },
  {
    id: 'integrated-digital-frameworks',
    date: '2023-03',
    title: 'Integrated Digital Frameworks',
    type: 'business',
    description: 'Established digital solutions company providing custom development and automation services.',
    technologies: ['Full-Stack Development', 'Business Strategy', 'Client Management'],
    achievements: [
      'Served 50+ clients',
      'Built custom solutions across industries',
      'Established recurring revenue streams'
    ],
    impact: {
      metric: 'Client Satisfaction',
      value: '98%'
    },
    status: 'ongoing'
  },
  {
    id: 'sunday-edge-pro',
    date: '2023-08',
    title: 'Sunday Edge Pro Analytics',
    type: 'project',
    description: 'Launched advanced sports betting analytics platform with ML prediction models.',
    technologies: ['Next.js', 'TypeScript', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
    achievements: [
      '89.3% prediction accuracy achieved',
      '2,500+ active monthly users',
      '$150K+ revenue generated for users'
    ],
    impact: {
      metric: 'Prediction Accuracy',
      value: '89.3%'
    },
    status: 'ongoing'
  },
  {
    id: 'healthcare-crm',
    date: '2023-12',
    title: 'Healthcare CRM Solution',
    type: 'project',
    description: 'Developed HIPAA-compliant CRM system for healthcare providers.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'HIPAA Compliance', 'Stripe'],
    achievements: [
      'HIPAA compliance achieved',
      '300+ healthcare providers using system',
      '80% improvement in patient management efficiency'
    ],
    impact: {
      metric: 'Efficiency Gain',
      value: '80%'
    },
    status: 'completed'
  },
  {
    id: 'website-monitor-pro',
    date: '2024-04',
    title: 'Website Monitor Pro',
    type: 'project',
    description: 'Built advanced website monitoring system with real-time alerts and automated response.',
    technologies: ['Node.js', 'React', 'WebSocket', 'Puppeteer', 'Discord API'],
    achievements: [
      '99.9% uptime monitoring accuracy',
      '500+ websites under monitoring',
      '75% faster incident response time'
    ],
    impact: {
      metric: 'Response Time',
      value: '75% faster'
    },
    status: 'ongoing'
  }
]

const typeColors = {
  project: '#3B82F6',
  skill: '#10B981',
  milestone: '#8B5CF6',
  business: '#F59E0B'
}

const typeIcons = {
  project: '🚀',
  skill: '🎯',
  milestone: '🏆',
  business: '💼'
}

interface ExperienceTimelineProps {
  className?: string
}

const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ className = '' }) => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>('all')

  const filteredEvents = filterType === 'all' 
    ? timelineEvents 
    : timelineEvents.filter(event => event.type === filterType)

  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  const getYearsAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const years = now.getFullYear() - date.getFullYear()
    const months = now.getMonth() - date.getMonth()
    
    if (years === 0) {
      return months === 0 ? 'This month' : `${months} month${months > 1 ? 's' : ''} ago`
    }
    
    const totalMonths = years * 12 + months
    if (totalMonths < 12) {
      return `${totalMonths} month${totalMonths > 1 ? 's' : ''} ago`
    }
    
    return `${years} year${years > 1 ? 's' : ''} ago`
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Experience Timeline</h3>
        <p className="text-gray-400">Journey through projects, skills, and milestones</p>
      </div>

      {/* Filter Controls */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-gray-700/50">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Events
          </button>
          {Object.entries(typeColors).map(([type, color]) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{typeIcons[type as keyof typeof typeIcons]}</span>
              <span className="capitalize">{type}s</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Timeline */}
        <div className="flex-1">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>

            <div className="space-y-8">
              {sortedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start space-x-6"
                >
                  {/* Timeline Dot */}
                  <div className="relative z-10">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white"
                      style={{ backgroundColor: typeColors[event.type] }}
                    ></div>
                  </div>

                  {/* Event Card */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedEvent(
                      selectedEvent === event.id ? null : event.id
                    )}
                    className={`flex-1 cursor-pointer transition-all ${
                      selectedEvent === event.id
                        ? 'bg-gray-800/70 border-blue-500/50'
                        : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
                    } backdrop-blur-sm rounded-lg p-4 border`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{typeIcons[event.type]}</span>
                        <div>
                          <h4 className="text-white font-medium">{event.title}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <span>{formatDate(event.date)}</span>
                            <span>•</span>
                            <span>{getYearsAgo(event.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {event.status === 'ongoing' && (
                          <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                            Ongoing
                          </span>
                        )}
                        <span
                          className="px-2 py-1 rounded text-xs text-white"
                          style={{ backgroundColor: typeColors[event.type] }}
                        >
                          {event.type}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">{event.description}</p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {event.technologies.slice(0, 4).map(tech => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {event.technologies.length > 4 && (
                        <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded text-xs">
                          +{event.technologies.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Impact Metric */}
                    {event.impact && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-400">{event.impact.metric}:</span>
                        <span className="text-blue-400 font-medium">{event.impact.value}</span>
                      </div>
                    )}

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {selectedEvent === event.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-700/50"
                        >
                          <div className="space-y-3">
                            <div>
                              <h5 className="text-white font-medium mb-2">Key Achievements</h5>
                              <ul className="space-y-1">
                                {event.achievements.map((achievement, i) => (
                                  <li key={i} className="flex items-start space-x-2 text-sm text-gray-300">
                                    <span className="text-green-400 mt-1">✓</span>
                                    <span>{achievement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h5 className="text-white font-medium mb-2">Technologies Used</h5>
                              <div className="flex flex-wrap gap-1">
                                {event.technologies.map(tech => (
                                  <span
                                    key={tech}
                                    className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="lg:w-80">
          <h4 className="text-lg font-semibold text-white mb-4">Timeline Summary</h4>
          
          <div className="space-y-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <div className="text-sm text-gray-400 mb-3">Event Types</div>
              <div className="space-y-2">
                {Object.entries(typeColors).map(([type, color]) => {
                  const count = timelineEvents.filter(e => e.type === type).length
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                        <span className="text-gray-300 capitalize">{type}s</span>
                      </div>
                      <span className="text-white">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <div className="text-sm text-gray-400 mb-3">Key Metrics</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Years of Experience</span>
                  <span className="text-white">6+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Major Projects</span>
                  <span className="text-white">{timelineEvents.filter(e => e.type === 'project').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Businesses Founded</span>
                  <span className="text-white">{timelineEvents.filter(e => e.type === 'business').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Ongoing Projects</span>
                  <span className="text-white">{timelineEvents.filter(e => e.status === 'ongoing').length}</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-400">
              Click on any timeline event to see detailed achievements and technologies used.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExperienceTimeline