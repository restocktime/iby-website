// Service Worker for PWA functionality
const CACHE_NAME = 'isaac-portfolio-v1'
const STATIC_CACHE_NAME = 'isaac-portfolio-static-v1'
const DYNAMIC_CACHE_NAME = 'isaac-portfolio-dynamic-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/pages/_app.js',
  '/offline.html'
]

// API endpoints to cache with network-first strategy
const API_ENDPOINTS = [
  '/api/live-metrics',
  '/api/scraper-status',
  '/api/analytics'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request))
    return
  }

  // Handle static assets with cache-first strategy
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/static/') ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)
  ) {
    event.respondWith(cacheFirstStrategy(request))
    return
  }

  // Handle navigation requests with network-first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(navigationStrategy(request))
    return
  }

  // Default to network-first for everything else
  event.respondWith(networkFirstStrategy(request))
})

// Network-first strategy (good for API calls and dynamic content)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache', error)
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html')
    }
    
    throw error
  }
}

// Cache-first strategy (good for static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('Service Worker: Failed to fetch and cache', request.url, error)
    throw error
  }
}

// Navigation strategy (for page requests)
async function navigationStrategy(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Navigation failed, trying cache', error)
    
    // Try to get from cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Try to get the main page from cache
    const mainPageResponse = await caches.match('/')
    if (mainPageResponse) {
      return mainPageResponse
    }
    
    // Fallback to offline page
    return caches.match('/offline.html')
  }
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm())
  }
})

async function syncContactForm() {
  try {
    // Get pending form submissions from IndexedDB
    const pendingForms = await getPendingFormSubmissions()
    
    for (const form of pendingForms) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form.data)
        })
        
        if (response.ok) {
          await removePendingFormSubmission(form.id)
          console.log('Service Worker: Form submission synced successfully')
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync form submission', error)
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error)
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: data.data,
    actions: data.actions || []
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action) {
    // Handle action buttons
    handleNotificationAction(event.action, event.notification.data)
  } else {
    // Handle notification click
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    )
  }
})

function handleNotificationAction(action, data) {
  switch (action) {
    case 'view':
      clients.openWindow(data?.url || '/')
      break
    case 'dismiss':
      // Just close the notification
      break
    default:
      clients.openWindow('/')
  }
}

// Helper functions for IndexedDB operations
async function getPendingFormSubmissions() {
  // This would typically use IndexedDB to store offline form submissions
  // For now, return empty array
  return []
}

async function removePendingFormSubmission(id) {
  // This would remove the form submission from IndexedDB
  console.log('Removing pending form submission:', id)
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})