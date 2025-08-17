'use client'

import React, { Component, ReactNode } from 'react'
import { ErrorBoundaryState } from '@/types'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  isolate?: boolean
  level?: 'page' | 'section' | 'component'
}

interface ErrorFallbackProps {
  error: Error
  retry: () => void
  level?: 'page' | 'section' | 'component'
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, retry, level = 'component' }) => {
  const getErrorMessage = () => {
    switch (level) {
      case 'page':
        return 'Something went wrong with this page. Please try refreshing.'
      case 'section':
        return 'This section encountered an error. Other parts of the site should still work.'
      case 'component':
        return 'This component failed to load. You can try again or continue browsing.'
      default:
        return 'An error occurred.'
    }
  }

  const getErrorTitle = () => {
    switch (level) {
      case 'page':
        return 'Page Error'
      case 'section':
        return 'Section Unavailable'
      case 'component':
        return 'Component Error'
      default:
        return 'Error'
    }
  }

  return (
    <div className={`
      flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed
      ${level === 'page' ? 'min-h-screen bg-gray-50' : 'min-h-[200px] bg-gray-50/50'}
      ${level === 'section' ? 'border-orange-300 text-orange-800' : 'border-gray-300 text-gray-600'}
    `}>
      <div className="text-center max-w-md">
        <div className={`
          w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
          ${level === 'section' ? 'bg-orange-100' : 'bg-gray-100'}
        `}>
          <svg 
            className={`w-8 h-8 ${level === 'section' ? 'text-orange-500' : 'text-gray-400'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{getErrorTitle()}</h3>
        <p className="text-sm mb-4">{getErrorMessage()}</p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="text-xs text-left mb-4 p-2 bg-gray-100 rounded">
            <summary className="cursor-pointer font-medium">Error Details</summary>
            <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
          </details>
        )}
        
        <button
          onClick={retry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error to monitoring service
    this.logError(error, errorInfo)

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  private logError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In production, send to error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      console.error('Error Boundary caught an error:', error, errorInfo)
    } else {
      console.error('Error Boundary caught an error:', error, errorInfo)
    }
  }

  private retry = () => {
    // Clear any existing timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }

    // Reset error state after a brief delay to prevent immediate re-error
    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined
      })
    }, 100)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      
      return (
        <FallbackComponent 
          error={this.state.error} 
          retry={this.retry}
          level={this.props.level}
        />
      )
    }

    return this.props.children
  }
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Hook for handling errors in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const handleError = React.useCallback((error: Error) => {
    setError(error)
    console.error('Error caught by useErrorHandler:', error)
  }, [])

  // Throw error to be caught by error boundary
  if (error) {
    throw error
  }

  return { handleError, resetError }
}