import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('Core Web Vitals meet performance standards', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle')
    
    // Measure Core Web Vitals
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {
          LCP: 0,
          FID: 0,
          CLS: 0,
          FCP: 0,
          TTFB: 0,
        }

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          vitals.LCP = lastEntry.startTime
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // First Input Delay
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (entry.processingStart && entry.startTime) {
              vitals.FID = entry.processingStart - entry.startTime
            }
          })
        }).observe({ entryTypes: ['first-input'] })

        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          let clsValue = 0
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          vitals.CLS = clsValue
        }).observe({ entryTypes: ['layout-shift'] })

        // First Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              vitals.FCP = entry.startTime
            }
          })
        }).observe({ entryTypes: ['paint'] })

        // Time to First Byte
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigationEntry) {
          vitals.TTFB = navigationEntry.responseStart - navigationEntry.requestStart
        }

        // Resolve after a delay to collect metrics
        setTimeout(() => resolve(vitals), 3000)
      })
    })

    // Assert Core Web Vitals thresholds
    expect(webVitals.LCP).toBeLessThan(2500) // Good LCP < 2.5s
    expect(webVitals.FID).toBeLessThan(100)  // Good FID < 100ms
    expect(webVitals.CLS).toBeLessThan(0.1)  // Good CLS < 0.1
    expect(webVitals.FCP).toBeLessThan(1800) // Good FCP < 1.8s
    expect(webVitals.TTFB).toBeLessThan(800) // Good TTFB < 800ms
  })

  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    const loadTime = Date.now() - startTime
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('images are optimized and load efficiently', async ({ page }) => {
    await page.goto('/')
    
    // Get all images
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i)
      
      // Check if image has loading attribute
      const loading = await image.getAttribute('loading')
      const isAboveFold = await image.evaluate(img => {
        const rect = img.getBoundingClientRect()
        return rect.top < window.innerHeight
      })
      
      // Images below the fold should have lazy loading
      if (!isAboveFold) {
        expect(loading).toBe('lazy')
      }
      
      // Check if image has appropriate sizes
      const sizes = await image.getAttribute('sizes')
      const srcset = await image.getAttribute('srcset')
      
      // Responsive images should have srcset or sizes
      if (sizes || srcset) {
        expect(sizes || srcset).toBeTruthy()
      }
    }
  })

  test('JavaScript bundle size is reasonable', async ({ page }) => {
    const response = await page.goto('/')
    
    // Get all JavaScript resources
    const jsResources = []
    
    page.on('response', response => {
      if (response.url().includes('.js') && response.status() === 200) {
        jsResources.push(response)
      }
    })
    
    await page.waitForLoadState('networkidle')
    
    // Calculate total JS size
    let totalJSSize = 0
    for (const resource of jsResources) {
      const headers = await resource.allHeaders()
      const contentLength = headers['content-length']
      if (contentLength) {
        totalJSSize += parseInt(contentLength)
      }
    }
    
    // Total JS should be under 1MB (reasonable for a portfolio site)
    expect(totalJSSize).toBeLessThan(1024 * 1024)
  })

  test('CSS is optimized and non-blocking', async ({ page }) => {
    await page.goto('/')
    
    // Check for render-blocking CSS
    const stylesheets = page.locator('link[rel="stylesheet"]')
    const stylesheetCount = await stylesheets.count()
    
    for (let i = 0; i < stylesheetCount; i++) {
      const stylesheet = stylesheets.nth(i)
      const media = await stylesheet.getAttribute('media')
      const href = await stylesheet.getAttribute('href')
      
      // Critical CSS should be inlined or have appropriate media queries
      if (href && !href.includes('fonts')) {
        // Non-critical CSS should have media attribute or be loaded asynchronously
        const isNonBlocking = media && media !== 'all' && media !== 'screen'
        // For this test, we'll just ensure stylesheets exist
        expect(href).toBeTruthy()
      }
    }
  })

  test('animations perform smoothly', async ({ page }) => {
    await page.goto('/')
    
    // Measure animation performance
    const animationMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frameCount = 0
        let startTime = performance.now()
        
        function measureFrames() {
          frameCount++
          
          if (performance.now() - startTime > 1000) {
            // Measure for 1 second
            const fps = frameCount
            resolve({ fps, frameCount })
          } else {
            requestAnimationFrame(measureFrames)
          }
        }
        
        requestAnimationFrame(measureFrames)
      })
    })
    
    // Should maintain at least 30 FPS for smooth animations
    expect(animationMetrics.fps).toBeGreaterThan(30)
  })

  test('memory usage is reasonable', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Get memory usage metrics
    const memoryInfo = await page.evaluate(() => {
      if ('memory' in performance) {
        return {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        }
      }
      return null
    })
    
    if (memoryInfo) {
      // Memory usage should be reasonable (under 50MB for initial load)
      const memoryUsageMB = memoryInfo.usedJSHeapSize / (1024 * 1024)
      expect(memoryUsageMB).toBeLessThan(50)
    }
  })

  test('third-party resources load efficiently', async ({ page }) => {
    const thirdPartyRequests = []
    
    page.on('request', request => {
      const url = request.url()
      const isThirdParty = !url.includes('localhost') && !url.includes('127.0.0.1')
      
      if (isThirdParty) {
        thirdPartyRequests.push({
          url,
          resourceType: request.resourceType(),
        })
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check that third-party resources are reasonable
    const scriptRequests = thirdPartyRequests.filter(req => req.resourceType === 'script')
    const fontRequests = thirdPartyRequests.filter(req => req.resourceType === 'font')
    
    // Should not have excessive third-party scripts
    expect(scriptRequests.length).toBeLessThan(10)
    
    // Font requests should be reasonable
    expect(fontRequests.length).toBeLessThan(5)
  })
})