'use client'

import { useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  WifiIcon, 
  ExclamationTriangleIcon, 
  ArrowPathIcon,
  CloudIcon,
  SignalIcon
} from '@heroicons/react/24/outline'

interface OfflineManagerProps {
  children: ReactNode
  fallbackContent?: ReactNode
  showConnectionStatus?: boolean
}

interface ConnectionInfo {
  isOnline: boolean
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

export function OfflineManager({
  children,
  fallbackContent,
  showConnectionStatus = true
}: OfflineManagerProps) {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    isOnline: true
  })
  const [showOfflineNotice, setShowOfflineNotice] = useState(false)
  const [pendingActions, setPendingActions] = useState<any[]>([])

  useEffect(() => {
    const updateConnectionInfo = () => {
      if (typeof navigator === 'undefined') return
      
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection

      setConnectionInfo({
        isOnline: navigator.onLine,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
        saveData: connection?.saveData
      })
    }

    const handleOnline = () => {
      updateConnectionInfo()
      setShowOfflineNotice(false)
      
      // Process pending actions when back online
      processPendingActions()
    }

    const handleOffline = () => {
      updateConnectionInfo()
      setShowOfflineNotice(true)
    }

    // Initial setup
    updateConnectionInfo()

    // Event listeners (only on client side)
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    }

    // Connection change listener
    const connection = typeof navigator !== 'undefined' ? (navigator as any).connection : null
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo)
      }
    }
  }, [])

  const processPendingActions = async () => {
    if (pendingActions.length === 0) return

    for (const action of pendingActions) {
      try {
        await action.execute()
        setPendingActions(prev => prev.filter(a => a.id !== action.id))
      } catch (error) {
        console.error('Failed to process pending action:', error)
      }
    }
  }

  const addPendingAction = (action: any) => {
    setPendingActions(prev => [...prev, { ...action, id: Date.now() }])
  }

  const getConnectionQuality = () => {
    if (!connectionInfo.isOnline) return 'offline'
    
    const { effectiveType, downlink } = connectionInfo
    
    if (effectiveType === '4g' && (downlink || 0) > 1.5) return 'excellent'
    if (effectiveType === '4g' || (downlink || 0) > 1) return 'good'
    if (effectiveType === '3g' || (downlink || 0) > 0.5) return 'fair'
    return 'poor'
  }

  const getConnectionIcon = () => {
    const quality = getConnectionQuality()
    
    switch (quality) {
      case 'offline':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
      case 'poor':
        return <SignalIcon className="w-4 h-4 text-orange-400" />
      case 'fair':
        return <SignalIcon className="w-4 h-4 text-yellow-400" />
      case 'good':
        return <SignalIcon className="w-4 h-4 text-green-400" />
      case 'excellent':
        return <WifiIcon className="w-4 h-4 text-green-500" />
      default:
        return <WifiIcon className="w-4 h-4 text-slate-400" />
    }
  }

  const retryConnection = () => {
    if (typeof window === 'undefined') return
    
    // Force a network request to check connectivity
    fetch('/api/health-check', { 
      method: 'HEAD',
      cache: 'no-cache'
    })
    .then(() => {
      setConnectionInfo(prev => ({ ...prev, isOnline: true }))
      setShowOfflineNotice(false)
    })
    .catch(() => {
      setConnectionInfo(prev => ({ ...prev, isOnline: false }))
    })
  }

  return (
    <div className="relative">
      {/* Connection Status Indicator */}
      {showConnectionStatus && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-4 z-40 flex items-center gap-2 px-3 py-2 bg-slate-900/80 backdrop-blur-lg border border-slate-700 rounded-full text-sm"
        >
          {getConnectionIcon()}
          <span className="text-slate-300">
            {connectionInfo.isOnline ? (
              <>
                {connectionInfo.effectiveType?.toUpperCase() || 'Online'}
                {connectionInfo.saveData && (
                  <span className="ml-1 text-orange-400">💾</span>
                )}
              </>
            ) : (
              'Offline'
            )}
          </span>
          
          {pendingActions.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
              {pendingActions.length}
            </span>
          )}
        </motion.div>
      )}

      {/* Offline Notice */}
      <AnimatePresence>
        {showOfflineNotice && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="w-5 h-5" />
                <div>
                  <p className="font-semibold">You&apos;re offline</p>
                  <p className="text-sm opacity-90">
                    Some features may be limited. Content will sync when reconnected.
                  </p>
                </div>
              </div>
              
              <button
                onClick={retryConnection}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Retry
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {connectionInfo.isOnline || !fallbackContent ? (
        children
      ) : (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <CloudIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Offline Mode
            </h2>
            <p className="text-slate-300 mb-6">
              You&apos;re currently offline. Some content may not be available.
            </p>
            {fallbackContent}
          </div>
        </div>
      )}

      {/* Pending Actions Indicator */}
      <AnimatePresence>
        {pendingActions.length > 0 && connectionInfo.isOnline && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-20 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg"
          >
            <div className="flex items-center gap-2">
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
              <span className="text-sm">Syncing {pendingActions.length} items...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing offline actions
export function useOfflineActions() {
  const [pendingActions, setPendingActions] = useState<any[]>([])
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const addOfflineAction = (action: {
    type: string
    data: any
    execute: () => Promise<void>
  }) => {
    if (isOnline) {
      // Execute immediately if online
      action.execute().catch(console.error)
    } else {
      // Queue for later if offline
      setPendingActions(prev => [...prev, { ...action, id: Date.now() }])
    }
  }

  const processPendingActions = async () => {
    if (!isOnline || pendingActions.length === 0) return

    for (const action of pendingActions) {
      try {
        await action.execute()
        setPendingActions(prev => prev.filter(a => a.id !== action.id))
      } catch (error) {
        console.error('Failed to process pending action:', error)
      }
    }
  }

  // Auto-process when coming back online
  useEffect(() => {
    if (isOnline) {
      processPendingActions()
    }
  }, [isOnline])

  return {
    isOnline,
    pendingActions,
    addOfflineAction,
    processPendingActions
  }
}