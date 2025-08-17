'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NotificationAlert {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  channel: 'discord' | 'email' | 'sms' | 'webhook'
  source: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  resolved?: boolean
}

interface NotificationChannel {
  id: string
  name: string
  type: 'discord' | 'email' | 'sms' | 'webhook'
  status: 'active' | 'inactive' | 'error'
  lastSent: Date
  totalSent: number
  successRate: number
}

const sampleChannels: NotificationChannel[] = [
  {
    id: 'discord-main',
    name: 'Discord #alerts',
    type: 'discord',
    status: 'active',
    lastSent: new Date(Date.now() - 2 * 60 * 1000),
    totalSent: 1247,
    successRate: 99.8
  },
  {
    id: 'email-admin',
    name: 'Admin Email',
    type: 'email',
    status: 'active',
    lastSent: new Date(Date.now() - 5 * 60 * 1000),
    totalSent: 892,
    successRate: 98.5
  },
  {
    id: 'sms-urgent',
    name: 'SMS Alerts',
    type: 'sms',
    status: 'active',
    lastSent: new Date(Date.now() - 15 * 60 * 1000),
    totalSent: 156,
    successRate: 97.2
  },
  {
    id: 'webhook-api',
    name: 'API Webhook',
    type: 'webhook',
    status: 'active',
    lastSent: new Date(Date.now() - 1 * 60 * 1000),
    totalSent: 2341,
    successRate: 99.9
  }
]

let alertCounter = 0

const generateSampleAlert = (): NotificationAlert => {
  const channels: NotificationAlert['channel'][] = ['discord', 'email', 'sms', 'webhook']
  
  const alerts = [
    {
      type: 'error' as const,
      title: 'Website Down Alert',
      message: 'Client website example.com is returning 500 errors',
      source: 'Website Monitor',
      severity: 'critical' as const
    },
    {
      type: 'warning' as const,
      title: 'High Response Time',
      message: 'API response time exceeded 3 seconds threshold',
      source: 'API Gateway',
      severity: 'medium' as const
    },
    {
      type: 'success' as const,
      title: 'Scraper Completed',
      message: 'Google Shopping scraper finished successfully - 1,247 products updated',
      source: 'Google Scraper',
      severity: 'low' as const
    },
    {
      type: 'info' as const,
      title: 'Database Backup',
      message: 'Daily database backup completed successfully',
      source: 'Database',
      severity: 'low' as const
    },
    {
      type: 'warning' as const,
      title: 'Memory Usage High',
      message: 'Server memory usage at 85% - consider scaling',
      source: 'Server Health',
      severity: 'medium' as const
    }
  ]
  
  // Use counter for deterministic selection
  const alert = alerts[alertCounter % alerts.length]
  const channel = channels[alertCounter % channels.length]
  
  alertCounter++
  
  return {
    id: `alert-${Date.now()}-${alertCounter}`,
    ...alert,
    timestamp: new Date(),
    channel,
    resolved: alertCounter % 3 === 0 // Every third alert is resolved
  }
}

interface NotificationDemoProps {
  className?: string
}

const NotificationDemo: React.FC<NotificationDemoProps> = ({ className = '' }) => {
  const [alerts, setAlerts] = useState<NotificationAlert[]>([])
  const [channels] = useState<NotificationChannel[]>(sampleChannels)
  const [isLive, setIsLive] = useState(true)
  const [selectedChannel, setSelectedChannel] = useState<string>('all')

  useEffect(() => {
    // Initialize with some sample alerts
    const initialAlerts = Array.from({ length: 5 }, () => generateSampleAlert())
    setAlerts(initialAlerts)

    const interval = setInterval(() => {
      if (isLive && Math.random() > 0.3) {
        const newAlert = generateSampleAlert()
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]) // Keep only 10 most recent
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [isLive])

  const getChannelIcon = (type: NotificationChannel['type']) => {
    switch (type) {
      case 'discord': return '💬'
      case 'email': return '📧'
      case 'sms': return '📱'
      case 'webhook': return '🔗'
      default: return '📢'
    }
  }

  const getAlertIcon = (type: NotificationAlert['type']) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      case 'info': return 'ℹ️'
      default: return '📢'
    }
  }

  const getAlertColor = (type: NotificationAlert['type']) => {
    switch (type) {
      case 'success': return 'border-green-500/50 bg-green-500/10'
      case 'warning': return 'border-yellow-500/50 bg-yellow-500/10'
      case 'error': return 'border-red-500/50 bg-red-500/10'
      case 'info': return 'border-blue-500/50 bg-blue-500/10'
      default: return 'border-gray-500/50 bg-gray-500/10'
    }
  }

  const getSeverityColor = (severity: NotificationAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white'
      case 'high': return 'bg-orange-600 text-white'
      case 'medium': return 'bg-yellow-600 text-white'
      case 'low': return 'bg-green-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  const filteredAlerts = selectedChannel === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.channel === selectedChannel)

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Live Notification System</h3>
        <p className="text-gray-400">Real-time alerts and multi-channel notification demonstrations</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-400">
              {isLive ? 'Live Notifications' : 'Notifications Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded text-sm hover:bg-gray-600/50 transition-colors"
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Filter:</span>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="bg-gray-800/50 text-white rounded px-3 py-1 text-sm border border-gray-700/50"
          >
            <option value="all">All Channels</option>
            {channels.map(channel => (
              <option key={channel.id} value={channel.type}>
                {getChannelIcon(channel.type)} {channel.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Status */}
        <div className="lg:col-span-1">
          <h4 className="text-lg font-semibold text-white mb-4">Notification Channels</h4>
          <div className="space-y-3">
            {channels.map(channel => (
              <div
                key={channel.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getChannelIcon(channel.type)}</span>
                    <span className="text-white font-medium">{channel.name}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    channel.status === 'active' ? 'bg-green-400' :
                    channel.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
                  }`}></div>
                </div>
                
                <div className="text-sm text-gray-400 space-y-1">
                  <div>Last sent: {formatTimeAgo(channel.lastSent)}</div>
                  <div>Total sent: {channel.totalSent.toLocaleString()}</div>
                  <div>Success rate: {channel.successRate}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Alerts */}
        <div className="lg:col-span-2">
          <h4 className="text-lg font-semibold text-white mb-4">
            Live Alerts ({filteredAlerts.length})
          </h4>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {filteredAlerts.map(alert => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-lg border ${getAlertColor(alert.type)} ${
                    alert.resolved ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getAlertIcon(alert.type)}</span>
                      <span className="text-white font-medium">{alert.title}</span>
                      {alert.resolved && (
                        <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                          Resolved
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-lg">{getChannelIcon(alert.channel)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-2">{alert.message}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Source: {alert.source}</span>
                    <span>{formatTimeAgo(alert.timestamp)}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredAlerts.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">🔕</div>
                <div>No alerts for selected channel</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
          <div className="text-2xl font-bold text-blue-400">{alerts.length}</div>
          <div className="text-sm text-gray-400">Total Alerts</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
          <div className="text-2xl font-bold text-green-400">
            {alerts.filter(a => a.resolved).length}
          </div>
          <div className="text-sm text-gray-400">Resolved</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
          <div className="text-2xl font-bold text-red-400">
            {alerts.filter(a => a.severity === 'critical').length}
          </div>
          <div className="text-sm text-gray-400">Critical</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {channels.reduce((sum, c) => sum + c.totalSent, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Total Sent</div>
        </div>
      </div>
    </div>
  )
}

export default NotificationDemo