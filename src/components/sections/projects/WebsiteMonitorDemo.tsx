'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Activity, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react'

interface MonitoringData {
  id: string
  url: string
  status: 'online' | 'offline' | 'checking'
  responseTime: number
  uptime: number
  lastCheck: string
  statusCode: number
}

const mockWebsites: MonitoringData[] = [
  { id: '1', url: 'https://example.com', status: 'online', responseTime: 245, uptime: 99.9, lastCheck: '2s ago', statusCode: 200 },
  { id: '2', url: 'https://mystore.com', status: 'checking', responseTime: 0, uptime: 98.5, lastCheck: 'checking...', statusCode: 0 },
  { id: '3', url: 'https://blog.site', status: 'online', responseTime: 156, uptime: 100, lastCheck: '1s ago', statusCode: 200 },
  { id: '4', url: 'https://api.service', status: 'offline', responseTime: 0, uptime: 95.2, lastCheck: '30s ago', statusCode: 503 },
  { id: '5', url: 'https://dashboard.app', status: 'online', responseTime: 89, uptime: 99.8, lastCheck: '3s ago', statusCode: 200 }
]

export function WebsiteMonitorDemo() {
  const [websites, setWebsites] = useState<MonitoringData[]>(mockWebsites)
  const [isRunning, setIsRunning] = useState(false)
  const [totalChecks, setTotalChecks] = useState(1247)
  const [alertsToday, setAlertsToday] = useState(3)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setWebsites(prev => prev.map(site => {
        // Simulate status changes
        const rand = Math.random()
        let newStatus = site.status
        let newResponseTime = site.responseTime
        let newStatusCode = site.statusCode

        if (site.status === 'checking') {
          // Complete the check
          newStatus = rand > 0.1 ? 'online' : 'offline'
          newResponseTime = newStatus === 'online' ? Math.floor(Math.random() * 300) + 50 : 0
          newStatusCode = newStatus === 'online' ? 200 : (rand > 0.5 ? 503 : 404)
        } else if (rand < 0.05) {
          // Start a new check
          newStatus = 'checking'
          newResponseTime = 0
          newStatusCode = 0
        } else if (rand < 0.02 && site.status === 'online') {
          // Occasional offline
          newStatus = 'offline'
          newResponseTime = 0
          newStatusCode = rand > 0.5 ? 503 : 404
          setAlertsToday(prev => prev + 1)
        } else if (rand < 0.03 && site.status === 'offline') {
          // Come back online
          newStatus = 'online'
          newResponseTime = Math.floor(Math.random() * 300) + 50
          newStatusCode = 200
        }

        return {
          ...site,
          status: newStatus,
          responseTime: newResponseTime,
          statusCode: newStatusCode,
          lastCheck: newStatus === 'checking' ? 'checking...' : `${Math.floor(Math.random() * 10) + 1}s ago`
        }
      }))

      setTotalChecks(prev => prev + Math.floor(Math.random() * 3) + 1)
    }, 2000)

    return () => clearInterval(interval)
  }, [isRunning])

  const getStatusIcon = (status: MonitoringData['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'offline':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case 'checking':
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />
    }
  }

  const getStatusColor = (status: MonitoringData['status']) => {
    switch (status) {
      case 'online':
        return 'text-green-400 bg-green-400/10'
      case 'offline':
        return 'text-red-400 bg-red-400/10'
      case 'checking':
        return 'text-yellow-400 bg-yellow-400/10'
    }
  }

  const onlineCount = websites.filter(w => w.status === 'online').length
  const offlineCount = websites.filter(w => w.status === 'offline').length
  const avgResponseTime = Math.round(websites.filter(w => w.status === 'online').reduce((acc, w) => acc + w.responseTime, 0) / onlineCount) || 0

  return (
    <div className="bg-slate-900 rounded-xl p-6 text-white max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Website Monitor Pro</h3>
            <p className="text-slate-400 text-sm">Real-time monitoring dashboard</p>
          </div>
        </div>
        
        <motion.button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isRunning 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRunning ? 'Stop Demo' : 'Start Demo'}
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-slate-400">Online</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{onlineCount}</div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-slate-400">Offline</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{offlineCount}</div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-400">Avg Response</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{avgResponseTime}ms</div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-400">Total Checks</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{totalChecks.toLocaleString()}</div>
        </div>
      </div>

      {/* Website List */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold mb-4">Monitored Websites</h4>
        <AnimatePresence>
          {websites.map((website) => (
            <motion.div
              key={website.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={website.status === 'checking' ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: website.status === 'checking' ? Infinity : 0 }}
                >
                  {getStatusIcon(website.status)}
                </motion.div>
                
                <div>
                  <div className="font-medium">{website.url}</div>
                  <div className="text-sm text-slate-400">
                    Last check: {website.lastCheck}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-slate-400">Response Time</div>
                  <div className="font-medium">
                    {website.responseTime > 0 ? `${website.responseTime}ms` : '-'}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-slate-400">Uptime</div>
                  <div className="font-medium">{website.uptime}%</div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(website.status)}`}>
                  {website.status === 'checking' ? 'Checking...' : website.statusCode || website.status}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Live Activity Feed */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 bg-slate-800 rounded-lg p-4"
        >
          <h5 className="font-semibold mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Live Activity
          </h5>
          <div className="space-y-2 text-sm">
            <div className="text-slate-300">
              <span className="text-green-400">✓</span> https://example.com responded in 245ms
            </div>
            <div className="text-slate-300">
              <span className="text-yellow-400">⟳</span> Checking https://mystore.com...
            </div>
            <div className="text-slate-300">
              <span className="text-green-400">✓</span> https://blog.site responded in 156ms
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}