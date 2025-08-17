'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, AlertCircle, Loader2, Key } from 'lucide-react'
import { DemoCredentials } from '@/types'

interface LivePreviewProps {
  url: string
  title: string
  credentials?: DemoCredentials
}

export function LivePreview({ url, title, credentials }: LivePreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
  }, [url])

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const openInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const copyCredentials = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="relative w-full h-full bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-800 z-10">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400">Loading preview...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-800 z-10">
          <div className="text-center p-4">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Preview unavailable
            </p>
            <motion.button
              onClick={openInNewTab}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4" />
              Open Site
            </motion.button>
          </div>
        </div>
      )}

      {/* Iframe */}
      {!hasError && (
        <iframe
          src={url}
          title={`Live preview of ${title}`}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy"
        />
      )}

      {/* Controls Overlay */}
      <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
        {credentials && (
          <motion.button
            onClick={() => setShowCredentials(!showCredentials)}
            className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Show demo credentials"
          >
            <Key className="w-4 h-4" />
          </motion.button>
        )}
        
        <motion.button
          onClick={openInNewTab}
          className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Open in new tab"
        >
          <ExternalLink className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Demo Credentials Popup */}
      {showCredentials && credentials && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          className="absolute top-12 right-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-xl z-30 min-w-[200px]"
        >
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            Demo Credentials
          </h4>
          
          <div className="space-y-2">
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400">Username:</label>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded flex-1">
                  {credentials.username}
                </code>
                <button
                  onClick={() => copyCredentials(credentials.username)}
                  className="text-blue-600 hover:text-blue-700 text-xs"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400">Password:</label>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded flex-1">
                  {credentials.password}
                </code>
                <button
                  onClick={() => copyCredentials(credentials.password)}
                  className="text-blue-600 hover:text-blue-700 text-xs"
                >
                  Copy
                </button>
              </div>
            </div>
            
            {credentials.instructions && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {credentials.instructions}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}