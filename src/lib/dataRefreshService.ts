interface RefreshConfig {
  endpoint: string
  interval: number
  retryAttempts: number
  retryDelay: number
  onSuccess?: (data: Record<string, unknown>) => void
  onError?: (error: Error) => void
  onRetry?: (attempt: number) => void
}

interface RefreshJob {
  id: string
  config: RefreshConfig
  intervalId?: NodeJS.Timeout
  isRunning: boolean
  lastRun?: Date
  lastSuccess?: Date
  errorCount: number
  consecutiveErrors: number
}

class DataRefreshService {
  private jobs: Map<string, RefreshJob> = new Map()
  private globalErrorHandler?: (jobId: string, error: Error) => void

  constructor() {
    // Cleanup on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.stopAll()
      })
    }
  }

  setGlobalErrorHandler(handler: (jobId: string, error: Error) => void) {
    this.globalErrorHandler = handler
  }

  addJob(id: string, config: RefreshConfig): void {
    // Stop existing job if it exists
    this.stopJob(id)

    const job: RefreshJob = {
      id,
      config,
      isRunning: false,
      errorCount: 0,
      consecutiveErrors: 0
    }

    this.jobs.set(id, job)
    this.startJob(id)
  }

  startJob(id: string): void {
    const job = this.jobs.get(id)
    if (!job || job.isRunning) return

    job.isRunning = true
    
    // Run immediately
    this.executeJob(job)

    // Set up interval
    job.intervalId = setInterval(() => {
      this.executeJob(job)
    }, job.config.interval)

    console.log(`Started data refresh job: ${id} (interval: ${job.config.interval}ms)`)
  }

  stopJob(id: string): void {
    const job = this.jobs.get(id)
    if (!job) return

    if (job.intervalId) {
      clearInterval(job.intervalId)
      job.intervalId = undefined
    }

    job.isRunning = false
    console.log(`Stopped data refresh job: ${id}`)
  }

  stopAll(): void {
    for (const [id] of this.jobs) {
      this.stopJob(id)
    }
  }

  removeJob(id: string): void {
    this.stopJob(id)
    this.jobs.delete(id)
  }

  getJobStatus(id: string): RefreshJob | undefined {
    return this.jobs.get(id)
  }

  getAllJobs(): RefreshJob[] {
    return Array.from(this.jobs.values())
  }

  private async executeJob(job: RefreshJob): Promise<void> {
    job.lastRun = new Date()

    try {
      const data = await this.fetchWithRetry(job.config.endpoint, job.config.retryAttempts, job.config.retryDelay, job.id)
      
      // Reset error counters on success
      job.consecutiveErrors = 0
      job.lastSuccess = new Date()

      // Call success handler
      if (job.config.onSuccess) {
        job.config.onSuccess(data)
      }

    } catch (error) {
      job.errorCount++
      job.consecutiveErrors++

      console.error(`Data refresh job ${job.id} failed:`, error)

      // Call error handlers
      if (job.config.onError) {
        job.config.onError(error as Error)
      }

      if (this.globalErrorHandler) {
        this.globalErrorHandler(job.id, error as Error)
      }

      // Stop job if too many consecutive errors
      if (job.consecutiveErrors >= 5) {
        console.warn(`Stopping job ${job.id} due to too many consecutive errors`)
        this.stopJob(job.id)
      }
    }
  }

  private async fetchWithRetry(
    endpoint: string, 
    maxAttempts: number, 
    delay: number, 
    jobId: string
  ): Promise<Record<string, unknown>> {
    const { fetchWithRetry } = await import('./retryUtils')
    
    try {
      const response = await fetchWithRetry(endpoint, {
        headers: {
          'Content-Type': 'application/json'
        }
      }, {
        maxAttempts,
        delay,
        backoffMultiplier: 2,
        onRetry: (attempt, error) => {
          console.log(`Job ${jobId} attempt ${attempt} failed, retrying...`, error.message)
          
          // Call retry handler
          const job = this.jobs.get(jobId)
          if (job?.config.onRetry) {
            job.config.onRetry(attempt)
          }
        },
        onSuccess: (result, attempts) => {
          if (attempts > 1) {
            console.log(`Job ${jobId} succeeded on attempt ${attempts}`)
          }
        }
      })

      return await response.json()
    } catch (error) {
      console.error(`Job ${jobId} failed after ${maxAttempts} attempts:`, error)
      throw error
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Utility method to create common refresh configurations
  static createConfig(
    endpoint: string,
    intervalMinutes: number = 5,
    options: Partial<RefreshConfig> = {}
  ): RefreshConfig {
    return {
      endpoint,
      interval: intervalMinutes * 60 * 1000, // Convert to milliseconds
      retryAttempts: 3,
      retryDelay: 1000,
      ...options
    }
  }
}

// Singleton instance
export const dataRefreshService = new DataRefreshService()

// Predefined configurations for common endpoints
export const REFRESH_CONFIGS = {
  liveMetrics: (projectId?: string) => DataRefreshService.createConfig(
    projectId ? `/api/live-metrics?projectId=${projectId}` : '/api/live-metrics',
    2, // 2 minutes
    {
      retryAttempts: 3,
      retryDelay: 2000
    }
  ),

  scraperStatus: () => DataRefreshService.createConfig(
    '/api/scraper-status?type=all',
    1, // 1 minute
    {
      retryAttempts: 2,
      retryDelay: 1000
    }
  ),

  sundayEdgePro: () => DataRefreshService.createConfig(
    '/api/live-metrics?projectId=sunday-edge-pro',
    1, // 1 minute for high-priority project
    {
      retryAttempts: 5,
      retryDelay: 1500
    }
  )
}

// React hook for using the refresh service
export function useDataRefresh() {
  const startRefresh = (id: string, config: RefreshConfig) => {
    dataRefreshService.addJob(id, config)
  }

  const stopRefresh = (id: string) => {
    dataRefreshService.stopJob(id)
  }

  const getStatus = (id: string) => {
    return dataRefreshService.getJobStatus(id)
  }

  return {
    startRefresh,
    stopRefresh,
    getStatus,
    service: dataRefreshService
  }
}