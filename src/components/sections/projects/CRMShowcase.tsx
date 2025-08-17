'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CRMCase {
  id: string
  industry: string
  title: string
  description: string
  features: string[]
  metrics: {
    clientsManaged: number
    efficiencyGain: number
    revenueIncrease: number
    userSatisfaction: number
  }
  technologies: string[]
  screenshot: string
  demoUrl?: string
}

const crmCases: CRMCase[] = [
  {
    id: 'healthcare-crm',
    industry: 'Healthcare',
    title: 'HIPAA-Compliant Patient Management System',
    description: 'Comprehensive CRM solution for healthcare providers with patient records, appointment scheduling, and billing integration.',
    features: [
      'HIPAA-compliant data encryption',
      'Patient portal with secure messaging',
      'Automated appointment reminders',
      'Insurance claim processing',
      'Prescription management',
      'Audit trail and compliance reporting'
    ],
    metrics: {
      clientsManaged: 15000,
      efficiencyGain: 80,
      revenueIncrease: 120000,
      userSatisfaction: 9.3
    },
    technologies: ['React', 'Node.js', 'PostgreSQL', 'HIPAA Compliance', 'Stripe'],
    screenshot: '/api/placeholder/600/400',
    demoUrl: 'https://healthcare-crm-demo.com'
  },
  {
    id: 'real-estate-crm',
    industry: 'Real Estate',
    title: 'Property Management & Lead Tracking System',
    description: 'Advanced CRM for real estate agencies with property listings, lead management, and automated follow-up sequences.',
    features: [
      'Property listing management',
      'Lead scoring and qualification',
      'Automated email sequences',
      'Virtual tour integration',
      'Commission tracking',
      'Market analysis tools'
    ],
    metrics: {
      clientsManaged: 8500,
      efficiencyGain: 65,
      revenueIncrease: 85000,
      userSatisfaction: 8.9
    },
    technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe', 'AWS S3'],
    screenshot: '/api/placeholder/600/400'
  },
  {
    id: 'ecommerce-crm',
    industry: 'E-commerce',
    title: 'Customer Lifecycle Management Platform',
    description: 'Integrated CRM for e-commerce businesses with customer segmentation, order tracking, and personalized marketing.',
    features: [
      'Customer segmentation',
      'Order lifecycle tracking',
      'Personalized product recommendations',
      'Abandoned cart recovery',
      'Loyalty program management',
      'Multi-channel support'
    ],
    metrics: {
      clientsManaged: 25000,
      efficiencyGain: 70,
      revenueIncrease: 200000,
      userSatisfaction: 9.1
    },
    technologies: ['React', 'Node.js', 'MongoDB', 'Redis', 'Shopify API'],
    screenshot: '/api/placeholder/600/400'
  },
  {
    id: 'manufacturing-crm',
    industry: 'Manufacturing',
    title: 'B2B Client & Inventory Management System',
    description: 'Specialized CRM for manufacturing companies with client management, inventory tracking, and production scheduling.',
    features: [
      'B2B client portal',
      'Inventory level monitoring',
      'Production schedule integration',
      'Quality control tracking',
      'Supplier management',
      'Custom reporting dashboard'
    ],
    metrics: {
      clientsManaged: 5000,
      efficiencyGain: 85,
      revenueIncrease: 150000,
      userSatisfaction: 9.0
    },
    technologies: ['Vue.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
    screenshot: '/api/placeholder/600/400'
  }
]

interface CRMShowcaseProps {
  className?: string
}

const CRMShowcase: React.FC<CRMShowcaseProps> = ({ className = '' }) => {
  const [selectedCase, setSelectedCase] = useState<CRMCase>(crmCases[0])
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'metrics'>('overview')

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Custom CRM Solutions</h3>
        <p className="text-gray-400">Industry-specific CRM systems tailored to unique business needs</p>
      </div>

      {/* Industry Selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {crmCases.map((crmCase) => (
          <button
            key={crmCase.id}
            onClick={() => setSelectedCase(crmCase)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCase.id === crmCase.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {crmCase.industry}
          </button>
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
          {/* Header */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-bold text-white mb-2">{selectedCase.title}</h4>
                <p className="text-gray-400 mb-4">{selectedCase.description}</p>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                    {selectedCase.industry}
                  </span>
                  {selectedCase.demoUrl && (
                    <a
                      href={selectedCase.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm hover:bg-green-600/30 transition-colors"
                    >
                      View Demo
                    </a>
                  )}
                </div>
              </div>
              <div className="w-32 h-20 bg-gray-700/50 rounded-lg overflow-hidden">
                <img
                  src={selectedCase.screenshot}
                  alt={selectedCase.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700/50">
            {(['overview', 'features', 'metrics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-3">Technologies Used</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-3">Key Metrics</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {formatNumber(selectedCase.metrics.clientsManaged)}
                        </div>
                        <div className="text-sm text-gray-400">Clients Managed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {selectedCase.metrics.efficiencyGain}%
                        </div>
                        <div className="text-sm text-gray-400">Efficiency Gain</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          ${formatNumber(selectedCase.metrics.revenueIncrease)}
                        </div>
                        <div className="text-sm text-gray-400">Revenue Increase</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          {selectedCase.metrics.userSatisfaction}
                        </div>
                        <div className="text-sm text-gray-400">User Rating</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'features' && (
                <motion.div
                  key="features"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h5 className="text-lg font-semibold text-white mb-4">Core Features</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCase.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'metrics' && (
                <motion.div
                  key="metrics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-4">Performance Metrics</h5>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Efficiency Improvement</span>
                          <span className="text-white">{selectedCase.metrics.efficiencyGain}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${selectedCase.metrics.efficiencyGain}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">User Satisfaction</span>
                          <span className="text-white">{selectedCase.metrics.userSatisfaction}/10</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${(selectedCase.metrics.userSatisfaction / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h6 className="text-white font-medium mb-2">Business Impact</h6>
                    <div className="text-sm text-gray-400">
                      Generated <span className="text-green-400 font-medium">
                        ${formatNumber(selectedCase.metrics.revenueIncrease)}
                      </span> in additional revenue while managing{' '}
                      <span className="text-blue-400 font-medium">
                        {formatNumber(selectedCase.metrics.clientsManaged)}
                      </span> clients with{' '}
                      <span className="text-purple-400 font-medium">
                        {selectedCase.metrics.efficiencyGain}%
                      </span> improved efficiency.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default CRMShowcase