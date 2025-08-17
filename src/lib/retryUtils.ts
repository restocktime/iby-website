import { RetryConfig } from '@/types'

interface RetryOptions extends Partial<RetryConfig> {
  onRetry?: (attempt: number, error: Error) => void
  onSuccess?: (result: any, attempts: number) => void
  onFailure?: (error: Error, attempts: number) => void
}

// Default retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delay: 1000,
  backoffMultiplier: 2,
  shouldRetry: (error: Error) => {
    // Retry on network errors, timeouts, and 5xx status codes
    return (
      error.name === 'NetworkError' ||
      error.name === 'TimeoutError' ||
      error.message.includes('fetch') ||
      error.message.includes('5')
    )
  }
}

// Generic retry function
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_CONFIG, ...options }
  let lastError: Error
  let attempt = 0

  while (attempt < config.maxAttempts) {
    try {
      const result = await fn()
      
      if (options.onSuccess) {
        options.onSuccess(result, attempt + 1)
      }
      
      return result
    } catch (error) {
      lastError = error as Error
      attempt++

      // Check if we should retry this error
      if (!config.shouldRetry || !config.shouldRetry(lastError)) {
        break
      }

      // Don't wait after the last attempt
      if (attempt < config.maxAttempts) {
        if (options.onRetry) {
          options.onRetry(attempt, lastError)
        }

        // Calculate delay with exponential backoff
        const delay = config.delay * Math.pow(config.backoffMultiplier, attempt - 1)
        await sleep(delay)
      }
    }
  }

  if (options.onFailure) {
    options.onFailure(lastError!, attempt)
  }

  throw lastError!
}

// Retry with circuit breaker pattern
class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: 'closed' | 'open' | 'half-open' = 'closed'

  constructor(
    private failureThreshold = 5,
    private recoveryTimeout = 60000 // 1 minute
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'half-open'
      } else {
        throw new Error('Circuit breaker is open')
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failures = 0
    this.state = 'closed'
  }

  private onFailure() {
    this.failures++
    this.lastFailureTime = Date.now()

    if (this.failures >= this.failureThreshold) {
      this.state = 'open'
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime
    }
  }
}

// Create circuit breakers for different services
export const circuitBreakers = {
  api: new CircuitBreaker(3, 30000),
  liveMetrics: new CircuitBreaker(5, 60000),
  analytics: new CircuitBreaker(3, 45000)
}

// Fetch with retry and circuit breaker
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const circuitBreaker = circuitBreakers.api

  return circuitBreaker.execute(async () => {
    return retry(async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return response
      } finally {
        clearTimeout(timeoutId)
      }
    }, {
      ...retryOptions,
      shouldRetry: (error) => {
        // Don't retry 4xx errors (client errors)
        if (error.message.includes('HTTP 4')) {
          return false
        }
        return DEFAULT_RETRY_CONFIG.shouldRetry!(error)
      }
    })
  })
}

// Utility for retrying API calls with fallback data
export async function fetchWithFallback<T>(
  url: string,
  fallbackData: T,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<{ data: T; fromCache: boolean }> {
  try {
    const response = await fetchWithRetry(url, options, retryOptions)
    const data = await response.json()
    return { data, fromCache: false }
  } catch (error) {
    console.warn(`Failed to fetch ${url}, using fallback data:`, error)
    return { data: fallbackData, fromCache: true }
  }
}

// Hook for using retry functionality in React components
export function useRetry() {
  const [isRetrying, setIsRetrying] = React.useState(false)
  const [retryCount, setRetryCount] = React.useState(0)
  const [lastError, setLastError] = React.useState<Error | null>(null)

  const executeWithRetry = React.useCallback(async <T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> => {
    setIsRetrying(true)
    setRetryCount(0)
    setLastError(null)

    try {
      const result = await retry(fn, {
        ...options,
        onRetry: (attempt, error) => {
          setRetryCount(attempt)
          setLastError(error)
          options.onRetry?.(attempt, error)
        }
      })
      
      return result
    } catch (error) {
      setLastError(error as Error)
      throw error
    } finally {
      setIsRetrying(false)
    }
  }, [])

  return {
    executeWithRetry,
    isRetrying,
    retryCount,
    lastError
  }
}

// Utility functions
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Export React import for the hook
import React from 'react'