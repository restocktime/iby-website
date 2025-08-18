'use client'

import { 
  AdvancedAnalyticsEvent, 
  HeatmapData, 
  ConversionFunnel, 
  ABTest, 
  UserBehaviorPattern,
  RealTimeVisitor,
  ConversionEvent,
  AnalyticsInsight,
  Point2D
} from '@/types/analytics'

class AdvancedAnalyticsService {
  private sessionId: string
  private userId?: string
  private eventQueue: AdvancedAnalyticsEvent[] = []
  private isOnline = true
  private flushInterval: NodeJS.Timeout | null = null

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeService()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  }

  private initializeService() {
    // Check online status (only on client side)
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      this.isOnline = navigator.onLine
      window.addEventListener('online', () => {
        this.isOnline = true
        this.flushEventQueue()
      })
      window.addEventListener('offline', () => {
        this.isOnline = false
      })

      // Auto-flush events every 5 seconds
      this.flushInterval = setInterval(() => {
        this.flushEventQueue()
      }, 5000)

      // Flush on page unload
      window.addEventListener('beforeunload', () => {
        this.flushEventQueue(true)
      })
    }
  }

  public trackEvent(
    event: string,
    properties: Record<string, unknown> = {},
    coordinates?: Point2D
  ): void {
    if (typeof window === 'undefined') return

    const analyticsEvent: AdvancedAnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      sessionId: this.sessionId,
      userId: this.userId,
      event,
      properties,
      timestamp: new Date(),
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      coordinates,
      elementPath: this.getElementPath(coordinates),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      scroll: {
        x: window.scrollX,
        y: window.scrollY,
        depth: this.calculateScrollDepth()
      }
    }

    this.eventQueue.push(analyticsEvent)

    // Immediate flush for critical events
    if (this.isCriticalEvent(event)) {
      this.flushEventQueue()
    }
  }

  public trackConversion(
    type: ConversionEvent['type'],
    value: number = 1,
    formData?: Record<string, unknown>
  ): void {
    this.trackEvent('conversion', {
      conversionType: type,
      value,
      formData,
      source: document.referrer || 'direct',
      campaign: this.getCampaignFromUrl()
    })
  }

  public trackHeatmapInteraction(element: HTMLElement, eventType: string): void {
    const rect = element.getBoundingClientRect()
    const coordinates: Point2D = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }

    this.trackEvent('heatmap_interaction', {
      eventType,
      element: element.tagName.toLowerCase(),
      selector: this.getElementSelector(element),
      coordinates,
      elementText: element.textContent?.slice(0, 100) || '',
      elementAttributes: this.getElementAttributes(element)
    }, coordinates)
  }

  public trackPageView(page?: string): void {
    this.trackEvent('page_view', {
      page: page || window.location.pathname,
      referrer: document.referrer,
      title: document.title,
      loadTime: performance.now()
    })
  }

  public trackUserBehavior(pattern: string, context: Record<string, unknown> = {}): void {
    this.trackEvent('user_behavior', {
      pattern,
      context,
      timeOnPage: this.getTimeOnPage(),
      scrollDepth: this.calculateScrollDepth()
    })
  }

  public setUserId(userId: string): void {
    this.userId = userId
    this.trackEvent('user_identified', { userId })
  }

  public async getHeatmapData(page?: string): Promise<HeatmapData[]> {
    try {
      const response = await fetch(`/api/analytics/heatmap?page=${page || window.location.pathname}`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error)
    }
    return []
  }

  public async getConversionFunnel(): Promise<ConversionFunnel[]> {
    try {
      const response = await fetch('/api/analytics/conversion-funnel')
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Failed to fetch conversion funnel:', error)
    }
    return []
  }

  public async getUserBehaviorPatterns(): Promise<UserBehaviorPattern[]> {
    try {
      const response = await fetch('/api/analytics/behavior-patterns')
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Failed to fetch behavior patterns:', error)
    }
    return []
  }

  public async getRealTimeVisitors(): Promise<RealTimeVisitor[]> {
    try {
      const response = await fetch('/api/analytics/real-time')
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Failed to fetch real-time visitors:', error)
    }
    return []
  }

  public async getAnalyticsInsights(): Promise<AnalyticsInsight[]> {
    try {
      const response = await fetch('/api/analytics/insights')
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Failed to fetch analytics insights:', error)
    }
    return []
  }

  private async flushEventQueue(immediate = false): Promise<void> {
    if (this.eventQueue.length === 0 || (!this.isOnline && !immediate)) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    try {
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
        keepalive: immediate
      })

      if (!response.ok) {
        // Re-queue events if failed
        this.eventQueue.unshift(...events)
      }
    } catch (error) {
      console.error('Failed to send analytics events:', error)
      // Re-queue events if failed
      this.eventQueue.unshift(...events)
      
      // Store in localStorage as backup
      this.storeEventsLocally(events)
    }
  }

  private storeEventsLocally(events: AdvancedAnalyticsEvent[]): void {
    try {
      const existingEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]')
      const allEvents = [...existingEvents, ...events]
      
      // Keep only last 1000 events
      if (allEvents.length > 1000) {
        allEvents.splice(0, allEvents.length - 1000)
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(allEvents))
    } catch (error) {
      console.warn('Failed to store events locally:', error)
    }
  }

  private isCriticalEvent(event: string): boolean {
    return ['conversion', 'error', 'user_identified'].includes(event)
  }

  private calculateScrollDepth(): number {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.scrollY
    
    return Math.round(((scrollTop + windowHeight) / documentHeight) * 100)
  }

  private getTimeOnPage(): number {
    return performance.now()
  }

  private getElementPath(coordinates?: Point2D): string | undefined {
    if (!coordinates) return undefined
    
    const element = document.elementFromPoint(coordinates.x, coordinates.y)
    if (!element) return undefined
    
    return this.getElementSelector(element)
  }

  private getElementSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`
    }
    
    // Handle className safely - it might be an SVGAnimatedString or other object
    const className = element.className
    if (className && typeof className === 'string') {
      const classes = className.split(' ').filter(c => c.trim())
      if (classes.length > 0) {
        return `${element.tagName.toLowerCase()}.${classes.join('.')}`
      }
    } else if (className && typeof className === 'object' && 'baseVal' in className) {
      // Handle SVGAnimatedString
      const classes = (className as any).baseVal.split(' ').filter((c: string) => c.trim())
      if (classes.length > 0) {
        return `${element.tagName.toLowerCase()}.${classes.join('.')}`
      }
    }
    
    return element.tagName.toLowerCase()
  }

  private getElementAttributes(element: Element): Record<string, string> {
    const attributes: Record<string, string> = {}
    
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i]
      if (['id', 'class', 'data-testid', 'aria-label'].includes(attr.name)) {
        attributes[attr.name] = attr.value
      }
    }
    
    return attributes
  }

  private getCampaignFromUrl(): string | undefined {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('utm_campaign') || urlParams.get('campaign') || undefined
  }

  public destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flushEventQueue(true)
  }
}

// Singleton instance
let analyticsInstance: AdvancedAnalyticsService | null = null

export function getAnalytics(): AdvancedAnalyticsService {
  if (!analyticsInstance) {
    analyticsInstance = new AdvancedAnalyticsService()
  }
  return analyticsInstance
}

export { AdvancedAnalyticsService }