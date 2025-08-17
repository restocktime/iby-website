import { 
  measureWebVitals, 
  optimizeImages, 
  lazyLoadComponents,
  monitorMemoryUsage,
  trackUserInteractions 
} from '@/lib/performanceOptimizer'
import { mockWebVitals, mockPerformanceObserver } from '../utils/test-utils'

describe('Performance Optimizer', () => {
  beforeEach(() => {
    mockWebVitals()
    mockPerformanceObserver()
  })

  describe('measureWebVitals', () => {
    it('measures Core Web Vitals correctly', async () => {
      const mockCallback = jest.fn()
      
      measureWebVitals(mockCallback)
      
      // Simulate performance entries
      const mockEntry = {
        name: 'first-contentful-paint',
        startTime: 1000,
        entryType: 'paint',
      }
      
      // Trigger performance observer callback
      const PerformanceObserver = window.PerformanceObserver as jest.Mock
      const observerCallback = PerformanceObserver.mock.calls[0][0]
      observerCallback({ getEntries: () => [mockEntry] })
      
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'FCP',
          value: 1000,
        })
      )
    })

    it('handles LCP measurements', async () => {
      const mockCallback = jest.fn()
      
      measureWebVitals(mockCallback)
      
      const mockLCPEntry = {
        name: 'largest-contentful-paint',
        startTime: 1500,
        entryType: 'largest-contentful-paint',
      }
      
      const PerformanceObserver = window.PerformanceObserver as jest.Mock
      const observerCallback = PerformanceObserver.mock.calls[0][0]
      observerCallback({ getEntries: () => [mockLCPEntry] })
      
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'LCP',
          value: 1500,
        })
      )
    })

    it('measures CLS correctly', async () => {
      const mockCallback = jest.fn()
      
      measureWebVitals(mockCallback)
      
      const mockCLSEntry = {
        value: 0.05,
        hadRecentInput: false,
        entryType: 'layout-shift',
      }
      
      const PerformanceObserver = window.PerformanceObserver as jest.Mock
      const observerCallback = PerformanceObserver.mock.calls[0][0]
      observerCallback({ getEntries: () => [mockCLSEntry] })
      
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'CLS',
          value: 0.05,
        })
      )
    })
  })

  describe('optimizeImages', () => {
    it('adds lazy loading to images', () => {
      document.body.innerHTML = `
        <img src="test1.jpg" alt="Test 1" />
        <img src="test2.jpg" alt="Test 2" />
      `
      
      optimizeImages()
      
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        expect(img.getAttribute('loading')).toBe('lazy')
      })
    })

    it('preserves existing loading attributes', () => {
      document.body.innerHTML = `
        <img src="test1.jpg" alt="Test 1" loading="eager" />
        <img src="test2.jpg" alt="Test 2" />
      `
      
      optimizeImages()
      
      const images = document.querySelectorAll('img')
      expect(images[0].getAttribute('loading')).toBe('eager')
      expect(images[1].getAttribute('loading')).toBe('lazy')
    })

    it('adds decoding attribute for better performance', () => {
      document.body.innerHTML = `
        <img src="test.jpg" alt="Test" />
      `
      
      optimizeImages()
      
      const img = document.querySelector('img')
      expect(img?.getAttribute('decoding')).toBe('async')
    })
  })

  describe('lazyLoadComponents', () => {
    it('creates intersection observer for lazy loading', () => {
      const mockElements = [
        document.createElement('div'),
        document.createElement('div'),
      ]
      
      mockElements.forEach(el => {
        el.setAttribute('data-lazy', 'true')
        document.body.appendChild(el)
      })
      
      lazyLoadComponents()
      
      expect(window.IntersectionObserver).toHaveBeenCalled()
    })

    it('loads components when they enter viewport', () => {
      const mockElement = document.createElement('div')
      mockElement.setAttribute('data-lazy', 'true')
      mockElement.setAttribute('data-component', 'TestComponent')
      document.body.appendChild(mockElement)
      
      const mockIntersectionObserver = window.IntersectionObserver as jest.Mock
      const mockObserve = jest.fn()
      mockIntersectionObserver.mockReturnValue({
        observe: mockObserve,
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      })
      
      lazyLoadComponents()
      
      expect(mockObserve).toHaveBeenCalledWith(mockElement)
    })
  })

  describe('monitorMemoryUsage', () => {
    it('tracks memory usage when available', () => {
      const mockMemory = {
        usedJSHeapSize: 10000000,
        totalJSHeapSize: 20000000,
        jsHeapSizeLimit: 100000000,
      }
      
      Object.defineProperty(performance, 'memory', {
        value: mockMemory,
        configurable: true,
      })
      
      const mockCallback = jest.fn()
      monitorMemoryUsage(mockCallback)
      
      // Simulate memory check interval
      jest.advanceTimersByTime(5000)
      
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          usedJSHeapSize: 10000000,
          totalJSHeapSize: 20000000,
          jsHeapSizeLimit: 100000000,
        })
      )
    })

    it('handles missing memory API gracefully', () => {
      Object.defineProperty(performance, 'memory', {
        value: undefined,
        configurable: true,
      })
      
      const mockCallback = jest.fn()
      
      expect(() => {
        monitorMemoryUsage(mockCallback)
      }).not.toThrow()
    })
  })

  describe('trackUserInteractions', () => {
    it('tracks click interactions', () => {
      const mockCallback = jest.fn()
      trackUserInteractions(mockCallback)
      
      const button = document.createElement('button')
      document.body.appendChild(button)
      
      button.click()
      
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'click',
          target: 'BUTTON',
          timestamp: expect.any(Number),
        })
      )
    })

    it('tracks scroll interactions', () => {
      const mockCallback = jest.fn()
      trackUserInteractions(mockCallback)
      
      window.dispatchEvent(new Event('scroll'))
      
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'scroll',
          scrollY: expect.any(Number),
          timestamp: expect.any(Number),
        })
      )
    })

    it('tracks keyboard interactions', () => {
      const mockCallback = jest.fn()
      trackUserInteractions(mockCallback)
      
      const keyEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      document.dispatchEvent(keyEvent)
      
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'keydown',
          key: 'Enter',
          timestamp: expect.any(Number),
        })
      )
    })
  })
})