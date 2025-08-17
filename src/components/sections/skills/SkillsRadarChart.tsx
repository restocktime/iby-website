'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface SkillData {
  category: string
  skills: {
    name: string
    proficiency: number
    yearsOfExperience: number
    projects: string[]
  }[]
  averageProficiency: number
  color: string
}

const skillsData: SkillData[] = [
  {
    category: 'Frontend',
    averageProficiency: 8.5,
    color: '#3B82F6',
    skills: [
      { name: 'React', proficiency: 9, yearsOfExperience: 5, projects: ['Sunday Edge Pro', 'Restocktime', 'Shuk Online'] },
      { name: 'Next.js', proficiency: 9, yearsOfExperience: 4, projects: ['Sunday Edge Pro', 'Shuk Online'] },
      { name: 'TypeScript', proficiency: 9, yearsOfExperience: 5, projects: ['Sunday Edge Pro', 'Website Monitor Pro'] },
      { name: 'Vue.js', proficiency: 7, yearsOfExperience: 2, projects: ['Manufacturing CRM'] },
      { name: 'Tailwind CSS', proficiency: 9, yearsOfExperience: 3, projects: ['All Recent Projects'] }
    ]
  },
  {
    category: 'Backend',
    averageProficiency: 8.2,
    color: '#10B981',
    skills: [
      { name: 'Node.js', proficiency: 8, yearsOfExperience: 4, projects: ['Restocktime', 'Website Monitor Pro'] },
      { name: 'Python', proficiency: 9, yearsOfExperience: 6, projects: ['Sunday Edge Pro', 'Google Scraper Suite'] },
      { name: 'Express.js', proficiency: 8, yearsOfExperience: 4, projects: ['Restocktime', 'API Services'] },
      { name: 'FastAPI', proficiency: 7, yearsOfExperience: 2, projects: ['ML Services', 'Data APIs'] }
    ]
  },
  {
    category: 'Database',
    averageProficiency: 7.8,
    color: '#8B5CF6',
    skills: [
      { name: 'PostgreSQL', proficiency: 8, yearsOfExperience: 4, projects: ['Sunday Edge Pro', 'Healthcare CRM'] },
      { name: 'MongoDB', proficiency: 7, yearsOfExperience: 3, projects: ['Restocktime', 'E-commerce CRM'] },
      { name: 'Redis', proficiency: 7, yearsOfExperience: 3, projects: ['Sunday Edge Pro', 'Caching Systems'] },
      { name: 'Prisma', proficiency: 8, yearsOfExperience: 2, projects: ['Shuk Online', 'Modern Apps'] }
    ]
  },
  {
    category: 'Cloud & DevOps',
    averageProficiency: 7.5,
    color: '#F59E0B',
    skills: [
      { name: 'AWS', proficiency: 7, yearsOfExperience: 3, projects: ['Sunday Edge Pro', 'Scalable Apps'] },
      { name: 'Docker', proficiency: 8, yearsOfExperience: 3, projects: ['Sunday Edge Pro', 'Containerized Apps'] },
      { name: 'Vercel', proficiency: 8, yearsOfExperience: 3, projects: ['Shuk Online', 'Next.js Apps'] },
      { name: 'GitHub Actions', proficiency: 7, yearsOfExperience: 2, projects: ['CI/CD Pipelines'] }
    ]
  },
  {
    category: 'Automation & Scraping',
    averageProficiency: 8.8,
    color: '#EF4444',
    skills: [
      { name: 'Selenium', proficiency: 8, yearsOfExperience: 4, projects: ['Google Scraper Suite'] },
      { name: 'BeautifulSoup', proficiency: 9, yearsOfExperience: 5, projects: ['Web Scrapers', 'Data Extraction'] },
      { name: 'Scrapy', proficiency: 8, yearsOfExperience: 3, projects: ['Large Scale Scrapers'] },
      { name: 'Puppeteer', proficiency: 8, yearsOfExperience: 3, projects: ['Website Monitor Pro'] },
      { name: 'Discord Bots', proficiency: 9, yearsOfExperience: 3, projects: ['Notification Systems'] }
    ]
  },
  {
    category: 'Analytics & ML',
    averageProficiency: 7.2,
    color: '#06B6D4',
    skills: [
      { name: 'Google Analytics', proficiency: 8, yearsOfExperience: 4, projects: ['Client Implementations'] },
      { name: 'Machine Learning', proficiency: 7, yearsOfExperience: 2, projects: ['Sunday Edge Pro'] },
      { name: 'Data Analysis', proficiency: 7, yearsOfExperience: 3, projects: ['Business Intelligence'] },
      { name: 'Statistical Modeling', proficiency: 6, yearsOfExperience: 2, projects: ['Prediction Models'] }
    ]
  }
]

interface SkillsRadarChartProps {
  className?: string
}

const SkillsRadarChart: React.FC<SkillsRadarChartProps> = ({ className = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      drawRadarChart()
    }
  }, [selectedCategory, isClient])

  const drawRadarChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = Math.min(centerX, centerY) - 60

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid circles
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (maxRadius * i) / 5, 0, 2 * Math.PI)
      ctx.stroke()
    }

    // Draw axes and labels
    const angleStep = (2 * Math.PI) / skillsData.length
    skillsData.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2
      const x = centerX + Math.cos(angle) * maxRadius
      const y = centerY + Math.sin(angle) * maxRadius

      // Draw axis line
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()

      // Draw category label
      ctx.fillStyle = skill.color
      ctx.font = '14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      const labelX = centerX + Math.cos(angle) * (maxRadius + 30)
      const labelY = centerY + Math.sin(angle) * (maxRadius + 30)
      ctx.fillText(skill.category, labelX, labelY)
    })

    // Draw skill proficiency polygon
    ctx.strokeStyle = selectedCategory ? '#3B82F6' : '#60A5FA'
    ctx.fillStyle = selectedCategory ? 'rgba(59, 130, 246, 0.2)' : 'rgba(96, 165, 250, 0.1)'
    ctx.lineWidth = 2
    ctx.beginPath()

    skillsData.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2
      const proficiency = selectedCategory === skill.category ? 10 : skill.averageProficiency
      const radius = (maxRadius * proficiency) / 10
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw proficiency points
    skillsData.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2
      const proficiency = selectedCategory === skill.category ? 10 : skill.averageProficiency
      const radius = (maxRadius * proficiency) / 10
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      ctx.fillStyle = skill.color
      ctx.beginPath()
      ctx.arc(x, y, selectedCategory === skill.category ? 8 : 5, 0, 2 * Math.PI)
      ctx.fill()

      // Add white border
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 2
      ctx.stroke()
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Skills Proficiency Radar</h3>
        <p className="text-gray-400">Interactive visualization of technical expertise across different domains</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Radar Chart */}
        <div className="flex-1 flex justify-center">
          <div className="relative">
            {isClient ? (
              <canvas
                ref={canvasRef}
                width={500}
                height={500}
                className="max-w-full h-auto"
              />
            ) : (
              <div className="w-[500px] h-[500px] bg-gray-800/30 animate-pulse rounded-full flex items-center justify-center">
                <div className="text-gray-400">Loading radar chart...</div>
              </div>
            )}
            
            {/* Proficiency Scale */}
            <div className="absolute top-4 right-4 bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
              <div className="text-sm text-gray-400 mb-2">Proficiency Scale</div>
              {[10, 8, 6, 4, 2].map(level => (
                <div key={level} className="flex items-center space-x-2 text-xs text-gray-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
                  <span>{level}/10</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills List */}
        <div className="flex-1 space-y-4">
          <h4 className="text-lg font-semibold text-white">Skill Categories</h4>
          
          <div className="space-y-3">
            {skillsData.map((category) => (
              <motion.div
                key={category.category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.category ? null : category.category
                )}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedCategory === category.category
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700/50 bg-gray-800/50 hover:border-gray-600/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-white font-medium">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      {category.averageProficiency.toFixed(1)}/10
                    </div>
                    <div className="text-xs text-gray-400">avg proficiency</div>
                  </div>
                </div>

                {selectedCategory === category.category && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-2"
                  >
                    {category.skills.map((skill) => (
                      <div
                        key={skill.name}
                        onMouseEnter={() => setHoveredSkill(skill.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        className="flex items-center justify-between p-2 bg-gray-700/30 rounded"
                      >
                        <div>
                          <div className="text-sm text-white">{skill.name}</div>
                          <div className="text-xs text-gray-400">
                            {skill.yearsOfExperience} years experience
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">
                            {skill.proficiency}/10
                          </div>
                          <div className="w-16 h-1 bg-gray-600 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-400 transition-all duration-500"
                              style={{ width: `${skill.proficiency * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Skill Details Tooltip */}
          {hoveredSkill && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-4 right-4 bg-gray-800 border border-gray-700 rounded-lg p-4 max-w-xs z-50"
            >
              {skillsData.map(category => 
                category.skills.map(skill => 
                  skill.name === hoveredSkill && (
                    <div key={skill.name}>
                      <div className="text-white font-medium mb-1">{skill.name}</div>
                      <div className="text-sm text-gray-400 mb-2">
                        Used in: {skill.projects.join(', ')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {skill.yearsOfExperience} years • {skill.proficiency}/10 proficiency
                      </div>
                    </div>
                  )
                )
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SkillsRadarChart