'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface GitHubRepo {
  id: string
  name: string
  description: string
  language: string
  stars: number
  forks: number
  lastUpdated: string
  isPrivate: boolean
  topics: string[]
}

interface GitHubStats {
  totalRepos: number
  totalStars: number
  totalForks: number
  totalCommits: number
  contributionStreak: number
  languageStats: { [key: string]: number }
  recentActivity: {
    commits: number
    pullRequests: number
    issues: number
  }
}

interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

// Mock data - in production, this would come from GitHub API
const mockRepos: GitHubRepo[] = [
  {
    id: 'sunday-edge-pro',
    name: 'sunday-edge-pro',
    description: 'Advanced sports betting analytics platform with ML prediction models',
    language: 'TypeScript',
    stars: 24,
    forks: 3,
    lastUpdated: '2024-01-15',
    isPrivate: false,
    topics: ['nextjs', 'typescript', 'machine-learning', 'sports-betting', 'analytics']
  },
  {
    id: 'google-scraper-suite',
    name: 'google-scraper-suite',
    description: 'Comprehensive web scraping toolkit for Google services',
    language: 'Python',
    stars: 156,
    forks: 42,
    lastUpdated: '2024-01-12',
    isPrivate: false,
    topics: ['python', 'web-scraping', 'selenium', 'beautifulsoup', 'automation']
  },
  {
    id: 'website-monitor-pro',
    name: 'website-monitor-pro',
    description: 'Advanced website monitoring system with real-time alerts',
    language: 'JavaScript',
    stars: 89,
    forks: 18,
    lastUpdated: '2024-01-10',
    isPrivate: false,
    topics: ['nodejs', 'monitoring', 'websocket', 'discord-bot', 'alerts']
  },
  {
    id: 'restocktime-platform',
    name: 'restocktime-platform',
    description: 'E-commerce inventory management and restock prediction system',
    language: 'JavaScript',
    stars: 67,
    forks: 12,
    lastUpdated: '2024-01-08',
    isPrivate: true,
    topics: ['react', 'nodejs', 'mongodb', 'inventory-management', 'e-commerce']
  },
  {
    id: 'healthcare-crm',
    name: 'healthcare-crm',
    description: 'HIPAA-compliant CRM system for healthcare providers',
    language: 'TypeScript',
    stars: 34,
    forks: 7,
    lastUpdated: '2024-01-05',
    isPrivate: true,
    topics: ['react', 'nodejs', 'postgresql', 'hipaa', 'healthcare']
  },
  {
    id: 'discord-automation-bots',
    name: 'discord-automation-bots',
    description: 'Collection of Discord bots for automation and notifications',
    language: 'Python',
    stars: 123,
    forks: 28,
    lastUpdated: '2024-01-03',
    isPrivate: false,
    topics: ['python', 'discord-bot', 'automation', 'notifications', 'webhooks']
  }
]

const mockStats: GitHubStats = {
  totalRepos: 47,
  totalStars: 493,
  totalForks: 110,
  totalCommits: 2847,
  contributionStreak: 127,
  languageStats: {
    'TypeScript': 35,
    'Python': 28,
    'JavaScript': 22,
    'HTML': 8,
    'CSS': 5,
    'Shell': 2
  },
  recentActivity: {
    commits: 156,
    pullRequests: 23,
    issues: 12
  }
}

// Generate mock contribution data for the last year
const generateContributionData = (): ContributionDay[] => {
  const data: ContributionDay[] = []
  const today = new Date('2024-01-15') // Fixed date for consistency
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Use deterministic "random" based on date for consistency
    const seed = date.getTime()
    const count = Math.floor((Math.sin(seed) * 10000) % 12)
    let level: 0 | 1 | 2 | 3 | 4 = 0
    
    if (count > 8) level = 4
    else if (count > 6) level = 3
    else if (count > 3) level = 2
    else if (count > 0) level = 1
    
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.abs(count),
      level
    })
  }
  
  return data
}

const languageColors: { [key: string]: string } = {
  'TypeScript': '#3178C6',
  'Python': '#3776AB',
  'JavaScript': '#F7DF1E',
  'HTML': '#E34F26',
  'CSS': '#1572B6',
  'Shell': '#89E051'
}

interface GitHubStatsProps {
  className?: string
}

const GitHubStats: React.FC<GitHubStatsProps> = ({ className = '' }) => {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [contributionData, setContributionData] = useState<ContributionDay[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'repos' | 'activity'>('overview')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setContributionData(generateContributionData())
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getContributionColor = (level: number) => {
    const colors = ['#161B22', '#0E4429', '#006D32', '#26A641', '#39D353']
    return colors[level] || colors[0]
  }

  const selectedRepoData = selectedRepo ? mockRepos.find(r => r.id === selectedRepo) : null

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">GitHub Statistics</h3>
        <p className="text-gray-400">Real-time GitHub activity and repository statistics</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-gray-700/50">
          {(['overview', 'repos', 'activity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-blue-400">{mockStats.totalRepos}</div>
              <div className="text-sm text-gray-400">Repositories</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-yellow-400">{mockStats.totalStars}</div>
              <div className="text-sm text-gray-400">Stars</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-green-400">{mockStats.totalCommits.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Commits</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-purple-400">{mockStats.contributionStreak}</div>
              <div className="text-sm text-gray-400">Day Streak</div>
            </div>
          </div>

          {/* Language Stats */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
            <h4 className="text-lg font-semibold text-white mb-4">Language Distribution</h4>
            <div className="space-y-3">
              {Object.entries(mockStats.languageStats).map(([language, percentage]) => (
                <div key={language} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 w-24">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: languageColors[language] || '#6B7280' }}
                    ></div>
                    <span className="text-sm text-gray-300">{language}</span>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: languageColors[language] || '#6B7280'
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-white w-10 text-right">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Repositories Tab */}
      {activeTab === 'repos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockRepos.map((repo) => (
              <motion.div
                key={repo.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedRepo(selectedRepo === repo.id ? null : repo.id)}
                className={`cursor-pointer transition-all ${
                  selectedRepo === repo.id
                    ? 'bg-gray-800/70 border-blue-500/50'
                    : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
                } backdrop-blur-sm rounded-lg p-4 border`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-white font-medium">{repo.name}</h4>
                    {repo.isPrivate && (
                      <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs">
                        Private
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <span>⭐</span>
                      <span>{repo.stars}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🍴</span>
                      <span>{repo.forks}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-3">{repo.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: languageColors[repo.language] || '#6B7280' }}
                    ></div>
                    <span className="text-sm text-gray-400">{repo.language}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Updated {formatDate(repo.lastUpdated)}
                  </span>
                </div>

                {selectedRepo === repo.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-700/50"
                  >
                    <div className="flex flex-wrap gap-1">
                      {repo.topics.map(topic => (
                        <span
                          key={topic}
                          className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          {/* Recent Activity Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-green-400">{mockStats.recentActivity.commits}</div>
              <div className="text-sm text-gray-400">Commits (30d)</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-blue-400">{mockStats.recentActivity.pullRequests}</div>
              <div className="text-sm text-gray-400">Pull Requests</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-purple-400">{mockStats.recentActivity.issues}</div>
              <div className="text-sm text-gray-400">Issues</div>
            </div>
          </div>

          {/* Contribution Graph */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
            <h4 className="text-lg font-semibold text-white mb-4">Contribution Activity</h4>
            
            {isClient ? (
              <div className="overflow-x-auto">
                <div className="grid grid-cols-53 gap-1 min-w-max">
                  {contributionData.map((day, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-sm cursor-pointer hover:ring-1 hover:ring-white/50"
                      style={{ backgroundColor: getContributionColor(day.level) }}
                      title={`${day.count} contributions on ${day.date}`}
                    ></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-20 bg-gray-700/30 rounded animate-pulse"></div>
            )}

            <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
              <span>Less</span>
              <div className="flex items-center space-x-1">
                {[0, 1, 2, 3, 4].map(level => (
                  <div
                    key={level}
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: getContributionColor(level) }}
                  ></div>
                ))}
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <h5 className="text-white font-medium mb-2">Activity Summary</h5>
            <div className="text-sm text-gray-400">
              Maintained a <span className="text-green-400 font-medium">{mockStats.contributionStreak}-day</span> contribution streak 
              with <span className="text-blue-400 font-medium">{mockStats.recentActivity.commits}</span> commits 
              in the last 30 days across <span className="text-purple-400 font-medium">{mockStats.totalRepos}</span> repositories.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GitHubStats