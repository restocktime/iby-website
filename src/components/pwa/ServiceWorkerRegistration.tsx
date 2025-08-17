'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope)
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, show update notification
                  showUpdateNotification(registration)
                }
              })
            }
          })
          
          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'CACHE_UPDATED') {
              console.log('Cache updated:', event.data.payload)
            }
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })

      // Handle service worker updates
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true
          window.location.reload()
        }
      })
    }
  }, [])

  return null
}

function showUpdateNotification(registration: ServiceWorkerRegistration) {
  // Create a simple update notification
  const updateBanner = document.createElement('div')
  updateBanner.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #0ea5e9, #3b82f6);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    ">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-weight: 600;">New version available!</div>
        <button 
          onclick="updateServiceWorker()" 
          style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          "
          onmouseover="this.style.background='rgba(255,255,255,0.3)'"
          onmouseout="this.style.background='rgba(255,255,255,0.2)'"
        >
          Update
        </button>
        <button 
          onclick="this.parentElement.parentElement.remove()" 
          style="
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          ×
        </button>
      </div>
    </div>
    <style>
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    </style>
  `

  document.body.appendChild(updateBanner)

  // Add global update function
  ;(window as any).updateServiceWorker = () => {
    const newWorker = registration.waiting
    if (newWorker) {
      newWorker.postMessage({ type: 'SKIP_WAITING' })
    }
    updateBanner.remove()
  }

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (updateBanner.parentNode) {
      updateBanner.remove()
    }
  }, 10000)
}