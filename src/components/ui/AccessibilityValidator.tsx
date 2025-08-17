'use client'

import { useEffect, useState } from 'react'

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  element?: string
  fix?: string
}

export function AccessibilityValidator() {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only run in development and on client side
    if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') return

    const validateAccessibility = () => {
      const foundIssues: AccessibilityIssue[] = []

      // Check for missing alt text on images
      const images = document.querySelectorAll('img')
      images.forEach((img, index) => {
        if (!img.alt && !img.getAttribute('aria-hidden')) {
          foundIssues.push({
            type: 'error',
            message: `Image missing alt text`,
            element: `img[${index}]`,
            fix: 'Add descriptive alt text or aria-hidden="true" for decorative images'
          })
        }
      })

      // Check for missing form labels
      const inputs = document.querySelectorAll('input, textarea, select')
      inputs.forEach((input, index) => {
        const hasLabel = input.getAttribute('aria-label') || 
                         input.getAttribute('aria-labelledby') ||
                         document.querySelector(`label[for="${input.id}"]`)
        
        if (!hasLabel) {
          foundIssues.push({
            type: 'error',
            message: `Form control missing label`,
            element: `${input.tagName.toLowerCase()}[${index}]`,
            fix: 'Add aria-label, aria-labelledby, or associate with a label element'
          })
        }
      })

      // Check for missing heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let lastLevel = 0
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1))
        if (level > lastLevel + 1) {
          foundIssues.push({
            type: 'warning',
            message: `Heading hierarchy skip detected`,
            element: `${heading.tagName.toLowerCase()}[${index}]`,
            fix: 'Ensure heading levels increase by only one level at a time'
          })
        }
        lastLevel = level
      })

      // Check for missing focus indicators
      const focusableElements = document.querySelectorAll(
        'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
      focusableElements.forEach((element, index) => {
        const styles = window.getComputedStyle(element, ':focus')
        if (styles.outline === 'none' && !styles.boxShadow.includes('rgb')) {
          foundIssues.push({
            type: 'warning',
            message: `Element may lack visible focus indicator`,
            element: `${element.tagName.toLowerCase()}[${index}]`,
            fix: 'Ensure focus indicators are visible and meet contrast requirements'
          })
        }
      })

      // Check for missing ARIA landmarks
      const main = document.querySelector('main')
      const nav = document.querySelector('nav, [role="navigation"]')
      const header = document.querySelector('header, [role="banner"]')
      const footer = document.querySelector('footer, [role="contentinfo"]')

      if (!main) {
        foundIssues.push({
          type: 'error',
          message: 'Missing main landmark',
          fix: 'Add a <main> element or role="main" to identify the primary content'
        })
      }

      if (!nav) {
        foundIssues.push({
          type: 'warning',
          message: 'Missing navigation landmark',
          fix: 'Add a <nav> element or role="navigation" for site navigation'
        })
      }

      // Check for color contrast (basic check)
      const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button')
      textElements.forEach((element, index) => {
        const styles = window.getComputedStyle(element)
        const color = styles.color
        const backgroundColor = styles.backgroundColor
        
        // This is a simplified check - in production, you'd use a proper contrast ratio calculator
        if (color === 'rgb(128, 128, 128)' || color.includes('gray')) {
          foundIssues.push({
            type: 'info',
            message: `Potential low contrast text detected`,
            element: `${element.tagName.toLowerCase()}[${index}]`,
            fix: 'Verify color contrast meets WCAG AA standards (4.5:1 for normal text)'
          })
        }
      })

      // Check for missing skip links
      const skipLinks = document.querySelectorAll('a[href^="#"]')
      const hasSkipToMain = Array.from(skipLinks).some(link => 
        link.getAttribute('href') === '#main-content' || 
        link.textContent?.toLowerCase().includes('skip to main')
      )

      if (!hasSkipToMain) {
        foundIssues.push({
          type: 'warning',
          message: 'Missing skip to main content link',
          fix: 'Add a skip link to allow keyboard users to bypass navigation'
        })
      }

      // Check for interactive elements without proper roles
      const clickableElements = document.querySelectorAll('[onclick], .cursor-pointer')
      clickableElements.forEach((element, index) => {
        if (element.tagName !== 'BUTTON' && element.tagName !== 'A' && !element.getAttribute('role')) {
          foundIssues.push({
            type: 'warning',
            message: `Interactive element without proper semantics`,
            element: `${element.tagName.toLowerCase()}[${index}]`,
            fix: 'Use button or link elements, or add appropriate ARIA role'
          })
        }
      })

      setIssues(foundIssues)
    }

    // Run validation after a short delay to allow DOM to settle
    const timer = setTimeout(validateAccessibility, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || issues.length === 0) {
    return null
  }

  return (
    <>
      <button
        onClick={() => setIsVisible(prev => !prev)}
        className={`fixed bottom-32 right-4 p-3 rounded-full shadow-lg z-40 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          issues.some(issue => issue.type === 'error') 
            ? 'bg-red-600 text-white focus:ring-red-500' 
            : 'bg-yellow-600 text-white focus:ring-yellow-500'
        }`}
        aria-label={`Accessibility issues found: ${issues.length} (Click to view details)`}
        title="Accessibility Validator"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
          {issues.length}
        </span>
      </button>

      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Accessibility Issues ({issues.length})
                </h2>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label="Close accessibility issues dialog"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {issues.map((issue, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      issue.type === 'error' 
                        ? 'bg-red-50 border-red-400' 
                        : issue.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-blue-50 border-blue-400'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 mr-3 ${
                        issue.type === 'error' 
                          ? 'text-red-400' 
                          : issue.type === 'warning'
                          ? 'text-yellow-400'
                          : 'text-blue-400'
                      }`}>
                        {issue.type === 'error' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        {issue.type === 'warning' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                        {issue.type === 'info' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${
                          issue.type === 'error' 
                            ? 'text-red-800' 
                            : issue.type === 'warning'
                            ? 'text-yellow-800'
                            : 'text-blue-800'
                        }`}>
                          {issue.message}
                        </h3>
                        {issue.element && (
                          <p className="text-xs text-gray-600 mt-1">
                            Element: {issue.element}
                          </p>
                        )}
                        {issue.fix && (
                          <p className="text-sm text-gray-700 mt-2">
                            <strong>Fix:</strong> {issue.fix}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  This validator only runs in development mode and performs basic accessibility checks.
                  For comprehensive testing, use tools like axe-core or WAVE.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}