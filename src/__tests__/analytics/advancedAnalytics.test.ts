import { AdvancedAnalyticsService } from '@/lib/advancedAnalytics'

// Mock fetch
global.fetch = jest.fn()

// Mock window and document
const mockLocation = {
  pathname: '/test',
  search: '?utm_campaign=test'
}

const mockNavigator = {
  userAgent: 'test-agent',
  onLine: true
}

// Mock DOM methods
Object.defineProperty(document, 'referrer', {
  value: 'https://google.com',
  configurable: true
})

Object.defineProperty(document, 'title', {
  value: 'Test Page',
  configurable: true
})

// Mock window properties
delete (window as any).location
;(window as any).location = mockLocation

delete (window as any).navigator
;(window as any).navigator = mockNavigator

;(window as any).innerWidth = 1920
;(window as any).innerHeight = 1080
;(window as any).scrollX = 0
;(window as any).scrollY = 100

Object.defineProperty(document.documentElement, 'scrollHeight', {
  value: 2000,
  configurable: true
})

;(window as any).performance = {
  now: () => 1000
}

describe('AdvancedAnalyticsService', () => {
  let analytics: AdvancedAnalyticsService

  beforeEach(() => {
    jest.clearAllMocks()
    analytics = new AdvancedAnalyticsService()
  })

  afterEach(() => {
    analytics.destroy()
  })

  describe('Event Tracking', () => {
    it('should track basic events', () => {
      analytics.trackEvent('test_event', { key: 'value' })
      
      // Event should be queued
      expect(analytics['eventQueue']).toHaveLength(1)
      
      const event = analytics['eventQueue'][0]
      expect(event.event).toBe('test_event')
      expect(event.properties.key).toBe('value')
      expect(event.page).toBe('/test')
      expect(event.userAgent).toBe('test-agent')
    })

    it('should track events with coordinates', () => {
      const coordinates = { x: 100, y: 200 }
      analytics.trackEvent('click_event', { button: 'primary' }, coordinates)
      
      const event = analytics['eventQueue'][0]
      expect(event.coordinates).toEqual(coordinates)
    })

    it('should include viewport and scroll information', () => {
      analytics.trackEvent('scroll_event')
      
      const event = analytics['eventQueue'][0]
      expect(event.viewport).toEqual({ width: 1920, height: 1080 })
      expect(event.scroll.x).toBe(0)
      expect(event.scroll.y).toBe(100)
      expect(event.scroll.depth).toBeGreaterThan(0)
    })
  })

  describe('Conversion Tracking', () => {
    it('should track conversions', () => {
      analytics.trackConversion('contact_form', 10, { name: 'John Doe' })
      
      const event = analytics['eventQueue'][0]
      expect(event.event).toBe('conversion')
      expect(event.properties.conversionType).toBe('contact_form')
      expect(event.properties.value).toBe(10)
      expect(event.properties.formData).toEqual({ name: 'John Doe' })
    })

    it('should extract campaign from URL', () => {
      analytics.trackConversion('email_click')
      
      const event = analytics['eventQueue'][0]
      expect(event.properties.campaign).toBe('test')
    })
  })

  describe('Heatmap Tracking', () => {
    it('should track heatmap interactions', () => {
      const mockElement = document.createElement('button')
      mockElement.textContent = 'Click me'
      mockElement.id = 'test-button'
      
      // Mock getBoundingClientRect
      mockElement.getBoundingClientRect = jest.fn(() => ({
        left: 100,
        top: 200,
        width: 80,
        height: 40,
        right: 180,
        bottom: 240,
        x: 100,
        y: 200,
        toJSON: jest.fn()
      }))

      analytics.trackHeatmapInteraction(mockElement, 'click')
      
      const event = analytics['eventQueue'][0]
      expect(event.event).toBe('heatmap_interaction')
      expect(event.properties.eventType).toBe('click')
      expect(event.properties.element).toBe('button')
      expect(event.properties.selector).toBe('#test-button')
      expect(event.properties.elementText).toBe('Click me')
    })
  })

  describe('Page View Tracking', () => {
    it('should track page views', () => {
      analytics.trackPageView('/custom-page')
      
      const event = analytics['eventQueue'][0]
      expect(event.event).toBe('page_view')
      expect(event.properties.page).toBe('/custom-page')
      expect(event.properties.referrer).toBe('https://google.com')
      expect(event.properties.title).toBe('Test Page')
    })

    it('should use current page if no page specified', () => {
      analytics.trackPageView()
      
      const event = analytics['eventQueue'][0]
      expect(event.properties.page).toBe('/test')
    })
  })

  describe('User Behavior Tracking', () => {
    it('should track user behavior patterns', () => {
      analytics.trackUserBehavior('scroll_pattern', { direction: 'down' })
      
      const event = analytics['eventQueue'][0]
      expect(event.event).toBe('user_behavior')
      expect(event.properties.pattern).toBe('scroll_pattern')
      expect(event.properties.context).toEqual({ direction: 'down' })
    })
  })

  describe('User Identification', () => {
    it('should set user ID and track identification', () => {
      analytics.setUserId('user123')
      
      expect(analytics['userId']).toBe('user123')
      
      const event = analytics['eventQueue'][0]
      expect(event.event).toBe('user_identified')
      expect(event.properties.userId).toBe('user123')
    })
  })

  describe('API Integration', () => {
    it('should fetch heatmap data', async () => {
      const mockHeatmapData = [
        {
          element: 'button',
          selector: '.btn',
          interactions: 100,
          heatLevel: 0.8,
          coordinates: [{ x: 100, y: 200 }],
          avgTimeSpent: 5.5,
          conversionRate: 0.15
        }
      ]

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockHeatmapData
      })

      const result = await analytics.getHeatmapData('/test-page')
      
      expect(fetch).toHaveBeenCalledWith('/api/analytics/heatmap?page=/test-page')
      expect(result).toEqual(mockHeatmapData)
    })

    it('should fetch conversion funnel data', async () => {
      const mockFunnelData = [
        {
          step: 'Landing',
          visitors: 1000,
          conversions: 800,
          conversionRate: 80,
          dropoffRate: 20,
          avgTimeToConvert: 30
        }
      ]

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFunnelData
      })

      const result = await analytics.getConversionFunnel()
      
      expect(fetch).toHaveBeenCalledWith('/api/analytics/conversion-funnel')
      expect(result).toEqual(mockFunnelData)
    })

    it('should handle API errors gracefully', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const result = await analytics.getHeatmapData()
      
      expect(result).toEqual([])
    })
  })

  describe('Event Queue Management', () => {
    it('should flush events to API', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      analytics.trackEvent('test_event')
      
      // Manually trigger flush
      await analytics['flushEventQueue']()
      
      expect(fetch).toHaveBeenCalledWith('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('test_event'),
        keepalive: false
      })
      
      expect(analytics['eventQueue']).toHaveLength(0)
    })

    it('should re-queue events on API failure', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'))

      analytics.trackEvent('test_event')
      const originalQueueLength = analytics['eventQueue'].length
      
      await analytics['flushEventQueue']()
      
      // Events should be re-queued
      expect(analytics['eventQueue']).toHaveLength(originalQueueLength)
    })
  })

  describe('Scroll Depth Calculation', () => {
    it('should calculate scroll depth correctly', () => {
      const scrollDepth = analytics['calculateScrollDepth']()
      
      // (100 + 1080) / 2000 * 100 = 59%
      expect(scrollDepth).toBe(59)
    })
  })

  describe('Critical Events', () => {
    it('should identify critical events', () => {
      expect(analytics['isCriticalEvent']('conversion')).toBe(true)
      expect(analytics['isCriticalEvent']('error')).toBe(true)
      expect(analytics['isCriticalEvent']('user_identified')).toBe(true)
      expect(analytics['isCriticalEvent']('page_view')).toBe(false)
    })
  })
})