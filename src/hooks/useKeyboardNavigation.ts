'use client'

import { useEffect, useCallback } from 'react'

interface KeyboardNavigationOptions {
  enableArrowKeys?: boolean
  enableTabNavigation?: boolean
  enableEscapeKey?: boolean
  onEscape?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onEnter?: () => void
  onSpace?: () => void
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    enableArrowKeys = false,
    enableTabNavigation = true,
    enableEscapeKey = false,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onSpace
  } = options

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Prevent default behavior for navigation keys when handlers are provided
    const shouldPreventDefault = 
      (event.key === 'Escape' && onEscape) ||
      (event.key === 'ArrowUp' && onArrowUp && enableArrowKeys) ||
      (event.key === 'ArrowDown' && onArrowDown && enableArrowKeys) ||
      (event.key === 'ArrowLeft' && onArrowLeft && enableArrowKeys) ||
      (event.key === 'ArrowRight' && onArrowRight && enableArrowKeys) ||
      (event.key === 'Enter' && onEnter) ||
      (event.key === ' ' && onSpace)

    if (shouldPreventDefault) {
      event.preventDefault()
    }

    switch (event.key) {
      case 'Escape':
        if (enableEscapeKey && onEscape) {
          onEscape()
        }
        break
      case 'ArrowUp':
        if (enableArrowKeys && onArrowUp) {
          onArrowUp()
        }
        break
      case 'ArrowDown':
        if (enableArrowKeys && onArrowDown) {
          onArrowDown()
        }
        break
      case 'ArrowLeft':
        if (enableArrowKeys && onArrowLeft) {
          onArrowLeft()
        }
        break
      case 'ArrowRight':
        if (enableArrowKeys && onArrowRight) {
          onArrowRight()
        }
        break
      case 'Enter':
        if (onEnter) {
          onEnter()
        }
        break
      case ' ':
        if (onSpace) {
          onSpace()
        }
        break
    }
  }, [
    enableArrowKeys,
    enableEscapeKey,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onSpace
  ])

  useEffect(() => {
    if (typeof window === 'undefined') return

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Helper function to focus next/previous focusable element
  const focusNextElement = useCallback((direction: 'next' | 'previous' = 'next') => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const focusableArray = Array.from(focusableElements) as HTMLElement[]
    const currentIndex = focusableArray.indexOf(document.activeElement as HTMLElement)
    
    if (currentIndex === -1) return

    const nextIndex = direction === 'next' 
      ? (currentIndex + 1) % focusableArray.length
      : (currentIndex - 1 + focusableArray.length) % focusableArray.length

    focusableArray[nextIndex]?.focus()
  }, [])

  // Helper function to focus first/last element in a container
  const focusElementInContainer = useCallback((
    container: HTMLElement | null, 
    position: 'first' | 'last' = 'first'
  ) => {
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const focusableArray = Array.from(focusableElements) as HTMLElement[]
    
    if (focusableArray.length === 0) return

    const targetElement = position === 'first' 
      ? focusableArray[0] 
      : focusableArray[focusableArray.length - 1]
    
    targetElement?.focus()
  }, [])

  return {
    focusNextElement,
    focusElementInContainer
  }
}

// Hook for managing focus trap (useful for modals)
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    // Focus first element when trap becomes active
    firstElement?.focus()

    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isActive, containerRef])
}