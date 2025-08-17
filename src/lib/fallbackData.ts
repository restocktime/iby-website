// Fallback data for when live APIs are unavailable

export const fallbackMetrics = {
  sundayEdgePro: {
    accuracy: 89.3,
    totalPredictions: 847,
    activeUsers: 156,
    uptime: 99.8,
    lastUpdated: new Date().toISOString(),
    status: 'operational' as const,
    responseTime: 245
  },
  
  restocktime: {
    productsMonitored: 1247,
    alertsSent: 3892,
    successRate: 94.2,
    averageResponseTime: 1.8,
    lastUpdated: new Date().toISOString(),
    status: 'operational' as const
  },
  
  shukOnline: {
    dailyOrders: 23,
    conversionRate: 3.4,
    averageOrderValue: 127.50,
    customerSatisfaction: 4.8,
    lastUpdated: new Date().toISOString(),
    status: 'operational' as const
  }
}

export const fallbackScraperStatus = {
  googleScrapers: [
    {
      id: 'google-shopping-scraper',
      name: 'Google Shopping Monitor',
      status: 'active' as const,
      lastRun: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      successRate: 98.5,
      itemsProcessed: 1247,
      errors: 2
    },
    {
      id: 'google-trends-scraper',
      name: 'Google Trends Analyzer',
      status: 'active' as const,
      lastRun: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      successRate: 96.8,
      itemsProcessed: 892,
      errors: 5
    },
    {
      id: 'google-serp-scraper',
      name: 'SERP Position Tracker',
      status: 'active' as const,
      lastRun: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      successRate: 99.2,
      itemsProcessed: 2156,
      errors: 1
    }
  ],
  
  websiteMonitors: [
    {
      id: 'ecommerce-monitor-1',
      name: 'E-commerce Site Monitor',
      url: 'https://example-store.com',
      status: 'active' as const,
      lastCheck: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
      responseTime: 342,
      uptime: 99.9,
      alerts: 0
    },
    {
      id: 'business-monitor-1',
      name: 'Business Website Monitor',
      url: 'https://example-business.com',
      status: 'active' as const,
      lastCheck: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 minutes ago
      responseTime: 189,
      uptime: 100,
      alerts: 0
    }
  ]
}

export const fallbackAnalytics = {
  portfolioSite: {
    visitors: {
      today: 47,
      thisWeek: 312,
      thisMonth: 1456,
      total: 8923
    },
    pageViews: {
      today: 89,
      thisWeek: 567,
      thisMonth: 2834,
      total: 15672
    },
    topPages: [
      { path: '/', views: 3421, title: 'Home' },
      { path: '/projects', views: 2156, title: 'Projects' },
      { path: '/contact', views: 1834, title: 'Contact' },
      { path: '/about', views: 1245, title: 'About' }
    ],
    referrers: [
      { source: 'Direct', visits: 2341, percentage: 45.2 },
      { source: 'Google', visits: 1567, percentage: 30.3 },
      { source: 'LinkedIn', visits: 892, percentage: 17.2 },
      { source: 'GitHub', visits: 378, percentage: 7.3 }
    ],
    devices: {
      desktop: 62.4,
      mobile: 31.8,
      tablet: 5.8
    },
    lastUpdated: new Date().toISOString()
  }
}

export const fallbackCRMData = {
  totalClients: 23,
  activeProjects: 8,
  completedProjects: 47,
  clientSatisfaction: 4.9,
  averageProjectValue: 8500,
  
  recentProjects: [
    {
      id: 'crm-project-1',
      name: 'Real Estate CRM System',
      client: 'Property Solutions Inc.',
      status: 'completed' as const,
      completedDate: '2024-01-15',
      value: 12000,
      satisfaction: 5.0
    },
    {
      id: 'crm-project-2',
      name: 'Healthcare Patient Management',
      client: 'MedCare Clinic',
      status: 'active' as const,
      startDate: '2024-02-01',
      value: 15000,
      progress: 75
    },
    {
      id: 'crm-project-3',
      name: 'E-commerce Customer Portal',
      client: 'Online Retail Co.',
      status: 'completed' as const,
      completedDate: '2024-01-28',
      value: 9500,
      satisfaction: 4.8
    }
  ],
  
  industries: [
    { name: 'Real Estate', projects: 8, percentage: 34.8 },
    { name: 'Healthcare', projects: 5, percentage: 21.7 },
    { name: 'E-commerce', projects: 4, percentage: 17.4 },
    { name: 'Professional Services', projects: 3, percentage: 13.0 },
    { name: 'Manufacturing', projects: 3, percentage: 13.0 }
  ]
}

export const fallbackNotifications = [
  {
    id: 'notif-1',
    type: 'success' as const,
    title: 'Scraper Alert',
    message: 'Google Shopping scraper found 3 new price drops',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: 'notif-2',
    type: 'info' as const,
    title: 'Website Monitor',
    message: 'All monitored websites are operational',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: 'notif-3',
    type: 'warning' as const,
    title: 'Performance Alert',
    message: 'Sunday Edge Pro response time increased to 450ms',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: true
  }
]

// Utility function to get fallback data with realistic variations
export function getFallbackData<T>(baseData: T, variationPercent = 5): T {
  if (typeof baseData !== 'object' || baseData === null) {
    return baseData
  }

  const varied = JSON.parse(JSON.stringify(baseData))
  
  // Add small random variations to numeric values
  function varyNumbers(obj: any): any {
    for (const key in obj) {
      if (typeof obj[key] === 'number' && key !== 'id') {
        const variation = 1 + (Math.random() - 0.5) * (variationPercent / 100) * 2
        obj[key] = Math.round(obj[key] * variation * 100) / 100
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        varyNumbers(obj[key])
      }
    }
    return obj
  }

  return varyNumbers(varied)
}

// Utility to simulate loading delay for fallback data
export function getFallbackDataWithDelay<T>(
  data: T, 
  delay = 500,
  variationPercent = 5
): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(getFallbackData(data, variationPercent))
    }, delay)
  })
}

// Cache for fallback data to maintain consistency during a session
const fallbackCache = new Map<string, { data: any; timestamp: number }>()

export function getCachedFallbackData<T>(
  key: string, 
  data: T, 
  cacheTime = 5 * 60 * 1000 // 5 minutes
): T {
  const cached = fallbackCache.get(key)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < cacheTime) {
    return cached.data
  }
  
  const fallbackData = getFallbackData(data)
  fallbackCache.set(key, { data: fallbackData, timestamp: now })
  
  return fallbackData
}

// Clear fallback cache
export function clearFallbackCache(): void {
  fallbackCache.clear()
}