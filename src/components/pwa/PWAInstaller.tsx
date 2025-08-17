'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ArrowDownTrayIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInWebAppiOS = (window.navigator as any).standalone === true
    setIsInstalled(isStandalone || isInWebAppiOS)

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show install prompt after a delay if not already installed
      if (!isInstalled) {
        setTimeout(() => setShowInstallPrompt(true), 5000)
      }
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      
      // Track installation
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'PWA Installation'
        })
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isInstalled, isClient])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowIOSInstructions(true)
      }
      return
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
      }
      
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    } catch (error) {
      console.error('Error installing PWA:', error)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    
    // Don't show again for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    }
  }

  // Don't render on server side or if already installed or dismissed
  if (!isClient || isInstalled || (typeof window !== 'undefined' && sessionStorage.getItem('pwa-prompt-dismissed'))) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
          >
            <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-700 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <DevicePhoneMobileIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white mb-1">
                    Install Portfolio App
                  </h3>
                  <p className="text-xs text-slate-300 mb-3">
                    Get the full experience with offline access and faster loading
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleInstallClick}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-medium rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200"
                    >
                      <ArrowDownTrayIcon className="w-3 h-3" />
                      Install
                    </button>
                    
                    <button
                      onClick={handleDismiss}
                      className="px-3 py-1.5 text-slate-400 text-xs font-medium rounded-lg hover:text-white hover:bg-slate-800 transition-all duration-200"
                    >
                      Later
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Installation Instructions Modal */}
      <AnimatePresence>
        {showIOSInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowIOSInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <DevicePhoneMobileIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Install on iOS
                </h3>
              </div>
              
              <div className="space-y-3 text-sm text-slate-300 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    1
                  </div>
                  <span>Tap the Share button in Safari</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    2
                  </div>
                  <span>Scroll down and tap &quot;Add to Home Screen&quot;</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    3
                  </div>
                  <span>Tap &quot;Add&quot; to install the app</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="w-full py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}