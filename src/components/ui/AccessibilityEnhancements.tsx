'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useAccessibility } from './AccessibilityProvider'

interface AccessibilityEnhancementsProps {
  children: React.ReactNode
}

export function AccessibilityEnhancements({ children }: AccessibilityEnhancementsProps) {
  const { announceToScreenReader } = useAccessibility()
  const [isKeyboardUser, setIsKeyboardUser] = useState(false)
  const lastFocusedElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    // Detect keyboard usage
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsKeyboardUser(true)
        document.body.classList.add('keyboard-navigation')
      }
    }

    const handleMouseDown = () => {
      setIsKeyboardUser(false)
      document.body.classList.remove('keyboard-navigation')
    }

    // Add keyboard shortcuts for common actions
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Skip to main content (Alt + M)
      if (event.altKey && event.key === 'm') {
        event.preventDefault()
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
          mainContent.focus()
          announceToScreenReader('Skipped to main content')
        }
      }

      // Skip to navigation (Alt + N)
      if (event.altKey && event.key === 'n') {
        event.preventDefault()
        const navigation = document.querySelector('nav') || document.querySelector('[role="navigation"]')
        if (navigation) {
          const firstLink = navigation.querySelector('a, button')
          if (firstLink) {
            (firstLink as HTMLElement).focus()
            announceToScreenReader('Skipped to navigation')
          }
        }
      }

      // Skip to footer (Alt + F)
      if (event.altKey && event.key === 'f') {
        event.preventDefault()
        const footer = document.querySelector('footer') || document.querySelector('[role="contentinfo"]')
        if (footer) {
          const firstLink = footer.querySelector('a, button')
          if (firstLink) {
            (firstLink as HTMLElement).focus()
            announceToScreenReader('Skipped to footer')
          }
        }
      }

      // Go to contact section (Alt + C)
      if (event.altKey && event.key === 'c') {
        event.preventDefault()
        const contactSection = document.getElementById('contact')
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' })
          const firstFocusable = contactSection.querySelector('button, a, input, textarea, select')
          if (firstFocusable) {
            setTimeout(() => (firstFocusable as HTMLElement).focus(), 500)
          }
          announceToScreenReader('Navigated to contact section')
        }
      }

      // Go to projects section (Alt + P)
      if (event.altKey && event.key === 'p') {
        event.preventDefault()
        const projectsSection = document.getElementById('projects')
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: 'smooth' })
          announceToScreenReader('Navigated to projects section')
        }
      }

      // Go to skills section (Alt + S)
      if (event.altKey && event.key === 's') {
        event.preventDefault()
        const skillsSection = document.getElementById('skills')
        if (skillsSection) {
          skillsSection.scrollIntoView({ behavior: 'smooth' })
          announceToScreenReader('Navigated to skills section')
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleGlobalKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [announceToScreenReader])

  // Focus management for route changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleRouteChange = () => {
      // Focus the main content area after route change
      const mainContent = document.getElementById('main-content')
      if (mainContent) {
        mainContent.focus()
        announceToScreenReader('Page content updated')
      }
    }

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [announceToScreenReader])

  return (
    <>
      {children}
      
      {/* Keyboard shortcuts help */}
      <KeyboardShortcutsHelp isVisible={isKeyboardUser} />
      
      {/* Focus indicator for better visibility */}
      <style jsx global>{`
        .keyboard-navigation *:focus {
          outline: 3px solid #0ea5e9 !important;
          outline-offset: 2px !important;
          border-radius: 4px;
        }
        
        .keyboard-navigation button:focus,
        .keyboard-navigation a:focus {
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.3) !important;
        }
      `}</style>
    </>
  )
}

interface KeyboardShortcutsHelpProps {
  isVisible: boolean
}

function KeyboardShortcutsHelp({ isVisible }: KeyboardShortcutsHelpProps) {
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle help with Alt + ?
      if (event.altKey && event.key === '?') {
        event.preventDefault()
        setShowHelp(prev => !prev)
      }
      
      // Close help with Escape
      if (event.key === 'Escape' && showHelp) {
        setShowHelp(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showHelp])

  if (!isVisible && !showHelp) return null

  return (
    <>
      {/* Help toggle button */}
      <button
        onClick={() => setShowHelp(prev => !prev)}
        className="fixed bottom-20 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-40"
        aria-label="Toggle keyboard shortcuts help (Alt + ?)"
        title="Keyboard Shortcuts Help"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Help modal */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="shortcuts-title"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 id="shortcuts-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label="Close keyboard shortcuts help"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-gray-700 dark:text-gray-300">Alt + M</div>
                <div className="text-gray-600 dark:text-gray-400">Skip to main content</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-gray-700 dark:text-gray-300">Alt + N</div>
                <div className="text-gray-600 dark:text-gray-400">Skip to navigation</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-gray-700 dark:text-gray-300">Alt + C</div>
                <div className="text-gray-600 dark:text-gray-400">Go to contact</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-gray-700 dark:text-gray-300">Alt + P</div>
                <div className="text-gray-600 dark:text-gray-400">Go to projects</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-gray-700 dark:text-gray-300">Alt + S</div>
                <div className="text-gray-600 dark:text-gray-400">Go to skills</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-gray-700 dark:text-gray-300">Alt + A</div>
                <div className="text-gray-600 dark:text-gray-400">Accessibility settings</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-gray-700 dark:text-gray-300">Alt + ?</div>
                <div className="text-gray-600 dark:text-gray-400">Toggle this help</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-gray-700 dark:text-gray-300">Tab</div>
                <div className="text-gray-600 dark:text-gray-400">Navigate forward</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-gray-700 dark:text-gray-300">Shift + Tab</div>
                <div className="text-gray-600 dark:text-gray-400">Navigate backward</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-gray-700 dark:text-gray-300">Enter/Space</div>
                <div className="text-gray-600 dark:text-gray-400">Activate button/link</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-gray-700 dark:text-gray-300">Escape</div>
                <div className="text-gray-600 dark:text-gray-400">Close modal/menu</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Press Escape to close this help dialog
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}