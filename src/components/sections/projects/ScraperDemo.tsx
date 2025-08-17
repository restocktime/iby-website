'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Monitor, 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  Clock,
  Zap,
  TrendingUp,
  Server,
  Wifi
} from 'lucide-react'

interface ScraperDemoProps {
  title: string
}

interface MonitoringTarget {
  id: string
  url: string
  status: 'checking' | 'online' | 'offline' | 'warning'
  responseTime: number
  lastCheck: string
}

export function ScraperDemo({ title }: ScraperDemoProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [targets, setTargets] = useState<MonitoringTarget[]>([
    { id: '1', url: 'https://example.com', status: 'checking', responseTime: 0, lastCheck: 'Checking...' },
    { id: '2', url: 'https://api.service.com', status: 'checking', responseTime: 0, lastCheck: 'Checking...' },
    { id: '3', url: 'https://dashboard.app.com', status: 'checking', responseTime: 0, lastCheck: 'Checking...' },
    { id: '4', url: 'https://cdn.assets.com', status: 'checking', responseTime: 0, lastCheck: 'Checking...' },
  ])
  const [logs, setLogs] = useState<string[]>([])

  const steps = [
    'Initializing monitoring system...',
    'Connecting to target websites...',
    'Performing health checks...',
    'Analyzing response times...',
    'Generating alerts...',
    'Monitoring complete!'
  ]

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1)
        
        // Add log entry
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${steps[currentStep]}`])
        
        // Update targets based on step
        if (currentStep >= 2) {
          setTargets(prev => prev.map((target, index) => {
            if (index <= currentStep - 2) {
              const statuses: MonitoringTarget['status'][] = ['online', 'online', 'warning', 'online']
              const responseTimes = [145, 89, 2340, 67]
              return {
                ...target,
                status: statuses[index],
                responseTime: responseTimes[index],
                lastCheck: new Date().toLocaleTimeString()
              }
            }
            return target
          }))
        }
      } else {
        setIsRunning(false)
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [isRunning, currentStep])

  const startDemo = () => {
    setIsRunning(true)
    setCurrentStep(0)
    setLogs([])
    setTargets(prev => prev.map(target => ({
      ...target,
      status: 'checking' as const,
      responseTime: 0,
      lastCheck: 'Checking...'
    })))
  }

  const getStatusIcon = (status: MonitoringTarget['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'offline':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'checking':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
    }
  }

  const getStatusColor = (status: MonitoringTarget['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'checking':
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  return (
    <div className="w-full h-full bg-slate-900 text-white p-6 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Monitor className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold">Website Monitor Pro</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">Live</span>
          </div>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="mb-6">
        <motion.button
          onClick={startDemo}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 rounded-lg transition-colors"
          whileHover={{ scale: isRunning ? 1 : 1.05 }}
          whileTap={{ scale: isRunning ? 1 : 0.95 }}
        >
          <Zap className="w-4 h-4" />
          {isRunning ? 'Monitoring in Progress...' : 'Start Monitoring Demo'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        {/* Monitoring Targets */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Monitoring Targets
          </h4>
          <div className="space-y-3">
            {targets.map((target, index) => (
              <motion.div
                key={target.id}
                className="bg-slate-700 rounded-lg p-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(target.status)}
                    <span className="text-sm font-medium">{target.url}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(target.status)}`}>
                    {target.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {target.responseTime > 0 ? `${target.responseTime}ms` : '--'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Server className="w-3 h-3" />
                      {target.lastCheck}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Activity Log
          </h4>
          <div className="bg-black rounded-lg p-3 h-[300px] overflow-y-auto font-mono text-xs">
            <AnimatePresence>
              {logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 mb-1"
                >
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
            {isRunning && (
              <motion.div
                className="text-blue-400 flex items-center gap-2"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <span>▶</span>
                {steps[currentStep]}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">
            {targets.filter(t => t.status === 'online').length}
          </div>
          <div className="text-xs text-slate-400">Online</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {targets.filter(t => t.status === 'warning').length}
          </div>
          <div className="text-xs text-slate-400">Warnings</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(targets.reduce((acc, t) => acc + t.responseTime, 0) / targets.length) || 0}ms
          </div>
          <div className="text-xs text-slate-400">Avg Response</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">99.9%</div>
          <div className="text-xs text-slate-400">Uptime</div>
        </div>
      </div>
    </div>
  )
}