'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface IntersectionOptions {
  threshold?: number | number[]
  rootMargin?: string
  triggerOnce?: boolean
  skip?: boolean
}

export interface IntersectionResult {
  isIntersecting: boolean
  intersectionRatio: number
  entry: IntersectionObserverEntry | null
}

export function useIntersectionObserver(
  options: IntersectionOptions = {}
): [React.RefObject<HTMLElement | null>, IntersectionResult] {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = false,
    skip = false
  } = options

  const elementRef = useRef<HTMLElement>(null)
  const [result, setResult] = useState<IntersectionResult>({
    isIntersecting: false,
    intersectionRatio: 0,
    entry: null
  })

  const observerRef = useRef<IntersectionObserver | null>(null)
  const hasTriggeredRef = useRef(false)

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0]
    
    if (triggerOnce && hasTriggeredRef.current && !entry.isIntersecting) {
      return
    }

    if (entry.isIntersecting && triggerOnce) {
      hasTriggeredRef.current = true
    }

    setResult({
      isIntersecting: entry.isIntersecting,
      intersectionRatio: entry.intersectionRatio,
      entry
    })
  }, [triggerOnce])

  useEffect(() => {
    if (skip || typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    const element = elementRef.current
    if (!element) return

    // Create observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    })

    // Start observing
    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersection, threshold, rootMargin, skip])

  return [elementRef, result]
}

// Hook for multiple elements
export function useMultipleIntersectionObserver(
  options: IntersectionOptions = {}
): {
  observe: (element: HTMLElement, id: string) => void
  unobserve: (element: HTMLElement) => void
  results: Record<string, IntersectionResult>
} {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = false,
    skip = false
  } = options

  const [results, setResults] = useState<Record<string, IntersectionResult>>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementsRef = useRef<Map<HTMLElement, string>>(new Map())
  const triggeredRef = useRef<Set<string>>(new Set())

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const newResults: Record<string, IntersectionResult> = {}

    entries.forEach(entry => {
      const id = elementsRef.current.get(entry.target as HTMLElement)
      if (!id) return

      if (triggerOnce && triggeredRef.current.has(id) && !entry.isIntersecting) {
        return
      }

      if (entry.isIntersecting && triggerOnce) {
        triggeredRef.current.add(id)
      }

      newResults[id] = {
        isIntersecting: entry.isIntersecting,
        intersectionRatio: entry.intersectionRatio,
        entry
      }
    })

    if (Object.keys(newResults).length > 0) {
      setResults(prev => ({ ...prev, ...newResults }))
    }
  }, [triggerOnce])

  const observe = useCallback((element: HTMLElement, id: string) => {
    if (skip || typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        threshold,
        rootMargin
      })
    }

    elementsRef.current.set(element, id)
    observerRef.current.observe(element)
  }, [handleIntersection, threshold, rootMargin, skip])

  const unobserve = useCallback((element: HTMLElement) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element)
      elementsRef.current.delete(element)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return { observe, unobserve, results }
}

// Hook for section-based animations
export function useSectionIntersection(sectionIds: string[]) {
  const { observe, results } = useMultipleIntersectionObserver({
    threshold: [0.1, 0.5, 0.9],
    rootMargin: '-10% 0px -10% 0px',
    triggerOnce: false
  })

  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    if (typeof document === 'undefined') return
    
    sectionIds.forEach(id => {
      const element = document.getElementById(id)
      if (element) {
        observe(element, id)
      }
    })
  }, [sectionIds, observe])

  useEffect(() => {
    // Find the section with highest intersection ratio
    let maxRatio = 0
    let maxSection: string | null = null

    Object.entries(results).forEach(([id, result]) => {
      if (result.isIntersecting && result.intersectionRatio > maxRatio) {
        maxRatio = result.intersectionRatio
        maxSection = id
      }
    })

    setActiveSection(maxSection)
  }, [results])

  return {
    activeSection,
    sectionResults: results,
    isIntersecting: (sectionId: string) => results[sectionId]?.isIntersecting || false,
    intersectionRatio: (sectionId: string) => results[sectionId]?.intersectionRatio || 0
  }
}