'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Globe, 
  Database, 
  CheckCircle, 
  Code,
  Search,
  Activity
} from 'lucide-react'
import { JSX } from 'react/jsx-runtime'

interface ScrapingStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'error'
  duration?: number
}

interface ScrapedProduct {
  id: string
  name: string
  price: string
  originalPrice?: string
  availability: string
  rating: number
  reviews: number
  image: string
  url: string
  change?: string
  timestamp: string
}

// No props interface needed - component takes no props

export function LiveScraperDemo(): JSX.Element {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [scrapedData, setScrapedData] = useState<ScrapedProduct[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [totalScraped, setTotalScraped] = useState(0)
  const [successRate, setSuccessRate] = useState(0)

  const scrapingSteps: ScrapingStep[] = [
    {
      id: 'init',
      title: 'Initialize Scraper',
      description: 'Setting up browser instance and loading configurations...',
      status: 'pending',
      duration: 1000
    },
    {
      id: 'navigate',
      title: 'Navigate to Target',
      description: 'Loading target e-commerce website...',
      status: 'pending',
      duration: 1500
    },
    {
      id: 'analyze',
      title: 'Analyze Page Structure',
      description: 'Identifying product containers and data selectors...',
      status: 'pending',
      duration: 2000
    },
    {
      id: 'extract',
      title: 'Extract Product Data',
      description: 'Scraping product information, prices, and availability...',
      status: 'pending',
      duration: 3000
    },
    {
      id: 'validate',
      title: 'Validate & Clean Data',
      description: 'Validating extracted data and cleaning inconsistencies...',
      status: 'pending',
      duration: 1500
    },
    {
      id: 'store',
      title: 'Store Results',
      description: 'Saving data to database and updating indexes...',
      status: 'pending',
      duration: 1000
    }
  ]

  const mockProducts: ScrapedProduct[] = [
    {
      id: '1',
      name: 'MacBook Pro 16" M3 Max',
      price: '$3,499.00',
      originalPrice: '$3,999.00',
      availability: 'In Stock',
      rating: 4.8,
      reviews: 1247,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop',
      url: 'https://example-store.com/macbook-pro-16',
      change: '-$500',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      name: 'iPhone 15 Pro Max 256GB',
      price: '$1,199.00',
      availability: 'Limited Stock',
      rating: 4.9,
      reviews: 2156,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop',
      url: 'https://example-store.com/iphone-15-pro-max',
      change: '+$50',
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      name: 'iPad Air 11" M2 Chip',
      price: '$599.00',
      availability: 'In Stock',
      rating: 4.7,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop',
      url: 'https://example-store.com/ipad-air-11',
      timestamp: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Apple Watch Ultra 2',
      price: '$799.00',
      availability: 'In Stock',
      rating: 4.6,
      reviews: 634,
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=100&h=100&fit=crop',
      url: 'https://example-store.com/apple-watch-ultra-2',
      change: '+$25',
      timestamp: new Date().toISOString()
    },
    {
      id: '5',
      name: 'AirPods Pro (3rd Gen)',
      price: '$249.00',
      originalPrice: '$279.00',
      availability: 'In Stock',
      rating: 4.8,
      reviews: 1543,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&h=100&fit=crop',
      url: 'https://example-store.com/airpods-pro-3',
      change: '-$30',
      timestamp: new Date().toISOString()
    },
    {
      id: '6',
      name: 'Mac Studio M2 Ultra',
      price: '$3,999.00',
      availability: 'Pre-order',
      rating: 4.9,
      reviews: 287,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop',
      url: 'https://example-store.com/mac-studio-m2-ultra',
      timestamp: new Date().toISOString()
    }
  ]

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    const prefix = type === 'success' ? '✓' : type === 'error' ? '✗' : '→'
    setLogs(prev => [...prev.slice(-8), `[${timestamp}] ${prefix} ${message}`])
  }

  const runDemo = async () => {
    if (isRunning) return
    
    setIsRunning(true)
    setCurrentStep(0)
    setScrapedData([])
    setLogs([])
    setTotalScraped(0)
    setSuccessRate(0)
    
    addLog('Starting Website Monitor Pro scraper demo...', 'info')
    
    for (let i = 0; i < scrapingSteps.length; i++) {
      setCurrentStep(i)
      addLog(scrapingSteps[i].description, 'info')
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, scrapingSteps[i].duration || 1500))
      
      // Special handling for extract step
      if (i === 3) { // Extract step
        addLog('Found 6 products on page, starting extraction...', 'info')
        
        for (let j = 0; j < mockProducts.length; j++) {
          await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300))
          
          const product = {
            ...mockProducts[j],
            timestamp: new Date().toISOString()
          }
          
          setScrapedData(prev => [...prev, product])
          setTotalScraped(prev => prev + 1)
          addLog(`Extracted: ${product.name} - ${product.price}`, 'success')
          
          // Update success rate
          setSuccessRate(((j + 1) / mockProducts.length) * 100)
        }
        
        addLog(`Successfully extracted ${mockProducts.length} products`, 'success')
      }
      
      addLog(`${scrapingSteps[i].title} completed`, 'success')
    }
    
    addLog('Scraping session completed successfully!', 'success')
    addLog(`Total products scraped: ${mockProducts.length}`, 'info')
    addLog('Data saved to database and cache updated', 'success')
    setIsRunning(false)
  }

  const resetDemo = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setScrapedData([])
    setLogs([])
    setTotalScraped(0)
    setSuccessRate(0)
  }

  const getStepIcon = (step: ScrapingStep, index: number) => {
    if (index < currentStep || (!isRunning && currentStep >= scrapingSteps.length)) {
      return <CheckCircle className="w-5 h-5 text-green-400" />
    } else if (index === currentStep && isRunning) {
      return (
        <motion.div
          className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )
    } else {
      return <div className="w-5 h-5 border-2 border-gray-600 rounded-full" />
    }
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Globe className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Website Monitor Pro - Live Scraper</h3>
            <p className="text-gray-400 text-sm">Real-time web scraping demonstration</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">Live Demo</span>
          </div>
          <button
            onClick={runDemo}
            disabled={isRunning}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 px-4 py-2 rounded-md transition-colors"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Running...' : 'Start Scraper'}</span>
          </button>
          <button
            onClick={resetDemo}
            disabled={isRunning}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 px-4 py-2 rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{totalScraped}</div>
          <div className="text-xs text-gray-400">Products Scraped</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{successRate.toFixed(0)}%</div>
          <div className="text-xs text-gray-400">Success Rate</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {scrapedData.filter(p => p.availability === 'In Stock').length}
          </div>
          <div className="text-xs text-gray-400">In Stock</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {scrapedData.filter(p => p.change).length}
          </div>
          <div className="text-xs text-gray-400">Price Changes</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scraping Progress */}
        <div className="lg:col-span-1 space-y-4">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-400" />
            Scraping Progress
          </h4>
          
          {scrapingSteps.map((step, index) => {
            const isActive = index === currentStep && isRunning
            const isCompleted = index < currentStep || (!isRunning && currentStep >= scrapingSteps.length)
            
            return (
              <motion.div
                key={step.id}
                className={`p-3 rounded-md border-l-4 transition-all ${
                  isActive ? 'border-blue-400 bg-blue-900/20' :
                  isCompleted ? 'border-green-400 bg-green-900/20' :
                  'border-gray-600 bg-gray-800/50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  {getStepIcon(step, index)}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs text-gray-400 mt-1">{step.description}</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Scraped Data */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-green-400" />
            Extracted Products ({scrapedData.length})
          </h4>
          
          <div className="bg-gray-800 rounded-md p-4 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {scrapedData.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No data extracted yet.</p>
                  <p className="text-sm">Click &quot;Start Scraper&quot; to begin extraction.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scrapedData.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700 p-4 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm truncate">{product.name}</h5>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-lg font-bold text-green-400">{product.price}</span>
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                                )}
                                {product.change && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    product.change.startsWith('+') ? 'bg-red-900/50 text-red-400' :
                                    product.change.startsWith('-') ? 'bg-green-900/50 text-green-400' :
                                    'bg-gray-900/50 text-gray-400'
                                  }`}>
                                    {product.change}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                                <span className="flex items-center">
                                  <span className="text-yellow-400 mr-1">★</span>
                                  {product.rating} ({product.reviews})
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  product.availability === 'In Stock' ? 'bg-green-900/50 text-green-400' :
                                  product.availability === 'Limited Stock' ? 'bg-yellow-900/50 text-yellow-400' :
                                  'bg-blue-900/50 text-blue-400'
                                }`}>
                                  {product.availability}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <Code className="w-5 h-5 mr-2 text-purple-400" />
          Activity Log
        </h4>
        <div className="bg-black rounded-md p-4 font-mono text-sm max-h-40 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500">Waiting for scraper to start...</div>
          ) : (
            <AnimatePresence>
              {logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`mb-1 ${
                    log.includes('✓') ? 'text-green-400' :
                    log.includes('✗') ? 'text-red-400' :
                    'text-blue-400'
                  }`}
                >
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {isRunning && (
            <motion.div
              className="text-yellow-400 flex items-center"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <span className="mr-2">▶</span>
              Processing...
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}