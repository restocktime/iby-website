import { useState, useEffect, useCallback, useRef } from 'react'
import { ProjectMetrics } from '@/types'

interface LiveMetricsData {
  projectId: string
  metrics: ProjectMetrics & {
    predictionAccuracy?: number
    totalPredictions?: number
    activeBettors?: number
    averageROI?: number
  }
  lastUpdated: string
  status: 'success' | 'error' | 'partial' | 'loading'
  error?: string
}

interface UseLiveMetricsOptions {
  projectId?: string
  refreshInterval?: number
  enableRealTime?: boolean
  fallbackToStatic?: boolean
}

interface UseLiveMetricsReturn {
  data: LiveMetricsData | LiveMetricsData[] | null
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  lastUpdated: Date | null
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error'
}

export function useLiveMetrics(options: UseLiveMetricsOptions = {}): UseLiveMetricsReturn {
  const {
    projectId,
    refreshInterval = 30000, // 30 seconds default
    enableRealTime = false,
    fallbackToStatic = true
  } = options

  const [data, setData] = useState<LiveMetricsData | LiveMetricsData[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'error'>('disconnected')
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const retryCountRef = useRef(0)
  const maxRetries = 3

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const url = projectId 
        ? `/api/live-metrics?projectId=${projectId}`
        : '/api/live-metrics'
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      setData(result)
      setLastUpdated(new Date())
      setConnectionStatus('connected')
      retryCountRef.current = 0
      
    } catch (err) {
      console.error('Error fetching live metrics:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metrics'
      setError(errorMessage)
      setConnectionStatus('error')
      
      // If fallback is enabled and we haven't exceeded retry limit
      if (fallbackToStatic && retryCountRef.current < maxRetries) {
        retryCountRef.current++
        console.log(`Retrying... (${retryCountRef.current}/${maxRetries})`)
        
        // Exponential backoff
        setTimeout(() => {
          fetchMetrics()
        }, Math.pow(2, retryCountRef.current) * 1000)
      }
    } finally {
      setIsLoading(false)
    }
  }, [projectId, fallbackToStatic])

  const setupWebSocket = useCallback(() => {
    if (!enableRealTime) return

    try {
      setConnectionStatus('connecting')
      
      // In a real implementation, you would connect to your WebSocket server
      // For now, we'll simulate WebSocket behavior with polling
      console.log('WebSocket not implemented - falling back to polling')
      setConnectionStatus('connected')
      
      // Simulate WebSocket with more frequent polling
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      
      intervalRef.current = setInterval(fetchMetrics, Math.min(refreshInterval, 10000))
      
    } catch (err) {
      console.error('WebSocket connection failed:', err)
      setConnectionStatus('error')
      
      // Fallback to regular polling
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      intervalRef.current = setInterval(fetchMetrics, refreshInterval)
    }
  }, [enableRealTime, fetchMetrics, refreshInterval])

  const refresh = useCallback(async () => {
    await fetchMetrics()
  }, [fetchMetrics])

  // Initial fetch and setup
  useEffect(() => {
    fetchMetrics()
    
    if (enableRealTime) {
      setupWebSocket()
    } else {
      // Set up regular polling
      intervalRef.current = setInterval(fetchMetrics, refreshInterval)
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [fetchMetrics, setupWebSocket, enableRealTime, refreshInterval])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return {
    data,
    isLoading,
    error,
    refresh,
    lastUpdated,
    connectionStatus
  }
}

// Hook specifically for scraper and monitoring status
export function useScraperStatus(type: 'scrapers' | 'monitors' | 'all' = 'all') {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/scraper-status?type=${type}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      setData(result)
      setLastUpdated(new Date())
      
    } catch (err) {
      console.error('Error fetching scraper status:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch status')
    } finally {
      setIsLoading(false)
    }
  }, [type])

  const refresh = useCallback(async () => {
    await fetchStatus()
  }, [fetchStatus])

  useEffect(() => {
    fetchStatus()
    
    // Update every 15 seconds for scraper status
    intervalRef.current = setInterval(fetchStatus, 15000)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchStatus])

  return {
    data,
    isLoading,
    error,
    refresh,
    lastUpdated
  }
}