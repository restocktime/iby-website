'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

interface ContactStats {
  totalInquiries: number
  averageResponseTime: string
  priorityDistribution: {
    urgent: number
    high: number
    medium: number
    low: number
  }
  methodPreferences: {
    email: number
    whatsapp: number
    discord: number
  }
  conversionRate: number
}

interface EngagementStats {
  totalSessions: number
  avgEngagement: number
  engagementDistribution: {
    high: number
    medium: number
    low: number
  }
  conversionFunnel: {
    visited: number
    engaged: number
    highlyEngaged: number
    contacted: number
  }
}

export function ContactAnalytics() {
  const [contactStats, setContactStats] = useState<ContactStats | null>(null)
  const [engagementStats, setEngagementStats] = useState<EngagementStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [contactResponse, engagementResponse] = await Promise.all([
          fetch('/api/contact?action=stats'),
          fetch('/api/analytics?action=engagement')
        ])

        if (contactResponse.ok && engagementResponse.ok) {
          const contactData = await contactResponse.json()
          const engagementData = await engagementResponse.json()
          
          setContactStats(contactData)
          setEngagementStats(engagementData)
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!contactStats || !engagementStats) {
    return (
      <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-6">
        <p className="text-red-300">Failed to load analytics data</p>
      </div>
    )
  }

  const methodIcons = {
    email: EnvelopeIcon,
    whatsapp: PhoneIcon,
    discord: ChatBubbleLeftRightIcon
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <ChartBarIcon className="h-6 w-6 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">Contact & Engagement Analytics</h3>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-400/30 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <EnvelopeIcon className="h-8 w-8 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-white">{contactStats.totalInquiries}</div>
              <div className="text-blue-300 text-sm">Total Inquiries</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-400/30 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-8 w-8 text-green-400" />
            <div>
              <div className="text-2xl font-bold text-white">{contactStats.averageResponseTime}</div>
              <div className="text-green-300 text-sm">Avg Response</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-400/30 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <UserGroupIcon className="h-8 w-8 text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-white">{engagementStats.avgEngagement}</div>
              <div className="text-purple-300 text-sm">Avg Engagement</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-400/30 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <ArrowTrendingUpIcon className="h-8 w-8 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold text-white">{Math.round(contactStats.conversionRate * 100)}%</div>
              <div className="text-yellow-300 text-sm">Conversion Rate</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Priority Distribution</h4>
          <div className="space-y-3">
            {Object.entries(contactStats.priorityDistribution).map(([priority, count]) => {
              const total = Object.values(contactStats.priorityDistribution).reduce((a, b) => a + b, 0)
              const percentage = total > 0 ? (count / total) * 100 : 0
              
              const colors = {
                urgent: 'bg-red-400',
                high: 'bg-orange-400',
                medium: 'bg-yellow-400',
                low: 'bg-green-400'
              }
              
              return (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${colors[priority as keyof typeof colors]}`} />
                    <span className="text-gray-300 capitalize">{priority}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{count}</span>
                    <span className="text-gray-400 text-sm">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact Method Preferences */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Contact Method Preferences</h4>
          <div className="space-y-3">
            {Object.entries(contactStats.methodPreferences).map(([method, count]) => {
              const total = Object.values(contactStats.methodPreferences).reduce((a, b) => a + b, 0)
              const percentage = total > 0 ? (count / total) * 100 : 0
              const Icon = methodIcons[method as keyof typeof methodIcons]
              
              return (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300 capitalize">{method}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{count}</span>
                    <span className="text-gray-400 text-sm">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Conversion Funnel</h4>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(engagementStats.conversionFunnel).map(([stage, count], index) => {
            const percentage = index === 0 ? 100 : (count / engagementStats.conversionFunnel.visited) * 100
            
            return (
              <div key={stage} className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{count}</div>
                <div className="text-gray-300 text-sm capitalize mb-2">{stage.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div className="text-xs text-gray-400">{percentage.toFixed(1)}%</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}