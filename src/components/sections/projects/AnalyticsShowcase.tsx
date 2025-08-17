'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AnalyticsCase {
  id: string
  title: string
  description: string
  clientType: string
  features: string[]
  metrics: {
    dataPoints: number
    conversionIncrease: number
    costReduction: number
    insights: number
  }
  dashboardPreview: string
  liveDemo?: string
}

const analyticsCases: AnalyticsCase[] = [
  {
    id: 'ecommerce-analytics',
    title: 'E-commerce Performance Dashboard',
    description: 'Comprehensive analytics solution for online retailers with real-time sales tracking, customer behavior analysis, and conversion optimization.',
    clientType: 'E-commerce',
    features: [
      'Real-time sales tracking',
      'Customer journey mapping',
      'Conversion funnel analysis',
      'Product performance metrics',
      'Abandoned cart recovery insights',
      'Custom attribution modeling'
    ],
    metrics: {
      dataPoints: 2500000,
      conversionIncrease: 35,
      costReduction: 40,
      insights: 150
    },
    dashboardPreview: '/api/placeholder/800/500',
    liveDemo: 'https://ecommerce-analytics-demo.com'
  },
  {
    id: 'saas-analytics',
    title: 'SaaS Growth Analytics Platform',
    description: 'Advanced analytics for SaaS companies focusing on user acquisition, retention, churn prediction, and revenue optimization.',
    clientType: 'SaaS',
    features: [
      'User acquisition tracking',
      'Churn prediction models',
      'Cohort analysis',
      'Feature usage analytics',
      'Revenue forecasting',
      'Customer health scoring'
    ],
    metrics: {
      dataPoints: 1800000,
      conversionIncrease: 45,
      costReduction: 30,
      insights: 120
    },
    dashboardPreview: '/api/placeholder/800/500'
  },
  {
    id: 'healthcare-analytics',
    title: 'Healthcare Operations Dashboard',
    description: 'HIPAA-compliant analytics platform for healthcare providers with patient flow analysis, resource optimization, and outcome tracking.',
    clientType: 'Healthcare',
    features: [
      'Patient flow optimization',
      'Resource utilization tracking',
      'Outcome prediction models',
      'Cost per patient analysis',
      'Staff efficiency metrics',
      'Compliance reporting'
    ],
    metrics: {
      dataPoints: 950000,
      conversionIncrease: 25,
      costReduction: 50,
      insights: 80
    },
    dashboardPreview: '/api/placeholder/800/500'
  },
  {
    id: 'marketing-analytics',
    title: 'Multi-Channel Marketing Attribution',
    description: 'Advanced marketing analytics with cross-channel attribution, campaign optimization, and ROI tracking across all marketing channels.',
    clientType: 'Marketing Agency',
    features: [
      'Cross-channel attribution',
      'Campaign performance tracking',
      'Customer lifetime value',
      'Marketing mix modeling',
      'Real-time ROI calculation',
      'Automated reporting'
    ],
    metrics: {
      dataPoints: 3200000,
      conversionIncrease: 55,
      costReduction: 35,
      insights: 200
    },
    dashboardPreview: '/api/placeholder/800/500'
  }
]

interface LiveMetric {
  label: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
}

interface AnalyticsShowcaseProps {
  className?: string
}

const AnalyticsShowcase: React.FC<AnalyticsShowcaseProps> = ({ className = '' }) => {
  const [selectedCase, setSelectedCase] = useState<AnalyticsCase>(analyticsCases[0])
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([])
  const [isLive, setIsLive] = useState(true)

  // Simulate live metrics updates
  useEffect(() => {
    let counter = 0
    
    const generateLiveMetrics = (): LiveMetric[] => {
      counter++
      return [
        {
          label: 'Active Users',
          value: 750 + (counter * 13) % 500,
          change: ((counter * 7) % 20) - 10,
          trend: counter % 2 === 0 ? 'up' : 'down'
        },
        {
          label: 'Conversion Rate',
          value: 3.2 + ((counter * 3) % 50) / 10,
          change: ((counter * 5) % 20) / 10 - 1,
          trend: counter % 3 === 0 ? 'up' : 'down'
        },
        {
          label: 'Revenue',
          value: 25000 + (counter * 234) % 40000,
          change: ((counter * 11) % 2000) - 1000,
          trend: counter % 4 === 0 ? 'up' : 'down'
        },
        {
          label: 'Page Views',
          value: 7500 + (counter * 89) % 8000,
          change: ((counter * 17) % 1000) - 500,
          trend: counter % 5 === 0 ? 'up' : 'down'
        }
      ]
    }

    setLiveMetrics(generateLiveMetrics())

    const interval = setInterval(() => {
      if (isLive) {
        setLiveMetrics(generateLiveMetrics())
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Google Analytics Implementation</h3>
        <p className="text-gray-400">Custom analytics dashboards and implementation examples</p>
      </div>

      {/* Live Demo Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-400">
              {isLive ? 'Live Demo' : 'Demo Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded text-sm hover:bg-gray-600/50 transition-colors"
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
        
        <div className="flex space-x-2">
          {analyticsCases.map((analyticsCase) => (
            <button
              key={analyticsCase.id}
              onClick={() => setSelectedCase(analyticsCase)}
              className={`px-3 py-1 rounded text-sm transition-all ${
                selectedCase.id === analyticsCase.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              {analyticsCase.clientType}
            </button>
          ))}
        </div>
      </div>

      {/* Live Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {liveMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ scale: 1 }}
            animate={{ scale: isLive ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">{metric.label}</span>
              <div className={`text-xs px-2 py-1 rounded ${
                metric.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                metric.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
              </div>
            </div>
            <div className="text-lg font-bold text-white">
              {metric.label === 'Revenue' ? formatCurrency(metric.value) : 
               metric.label === 'Conversion Rate' ? `${metric.value.toFixed(1)}%` :
               formatNumber(metric.value)}
            </div>
            <div className={`text-xs ${
              metric.change > 0 ? 'text-green-400' : 
              metric.change < 0 ? 'text-red-400' : 'text-gray-400'
            }`}>
              {metric.change > 0 ? '+' : ''}{metric.change}
              {metric.label === 'Conversion Rate' ? 'pp' : ''}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCase.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 overflow-hidden"
        >
          {/* Dashboard Preview */}
          <div className="relative">
            <img
              src={selectedCase.dashboardPreview}
              alt={`${selectedCase.title} Dashboard`}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <h4 className="text-xl font-bold text-white mb-2">{selectedCase.title}</h4>
              <p className="text-gray-300 text-sm">{selectedCase.description}</p>
            </div>
            {selectedCase.liveDemo && (
              <div className="absolute top-4 right-4">
                <a
                  href={selectedCase.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600/80 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  View Live Demo
                </a>
              </div>
            )}
          </div>

          <div className="p-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {formatNumber(selectedCase.metrics.dataPoints)}
                </div>
                <div className="text-sm text-gray-400">Data Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  +{selectedCase.metrics.conversionIncrease}%
                </div>
                <div className="text-sm text-gray-400">Conversion Increase</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  -{selectedCase.metrics.costReduction}%
                </div>
                <div className="text-sm text-gray-400">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {selectedCase.metrics.insights}
                </div>
                <div className="text-sm text-gray-400">Actionable Insights</div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h5 className="text-lg font-semibold text-white mb-4">Implementation Features</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCase.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Implementation Details */}
            <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
              <h6 className="text-white font-medium mb-2">Implementation Highlights</h6>
              <div className="text-sm text-gray-400">
                Custom Google Analytics 4 implementation with{' '}
                <span className="text-blue-400 font-medium">
                  {formatNumber(selectedCase.metrics.dataPoints)}
                </span> tracked data points, resulting in{' '}
                <span className="text-green-400 font-medium">
                  {selectedCase.metrics.conversionIncrease}%
                </span> conversion improvement and{' '}
                <span className="text-purple-400 font-medium">
                  {selectedCase.metrics.costReduction}%
                </span> cost reduction through data-driven optimization.
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default AnalyticsShowcase