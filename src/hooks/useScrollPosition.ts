'use client'

import { useState, useEffect } from 'react'
import { throttle } from '@/lib/utils'

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')

  useEffect(() => {
    let lastScrollY = window.scrollY

    const updateScrollPosition = throttle(() => {
      const currentScrollY = window.scrollY
      setScrollPosition(currentScrollY)
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up')
      lastScrollY = currentScrollY
    }, 16) // ~60fps

    window.addEventListener('scroll', updateScrollPosition)
    return () => window.removeEventListener('scroll', updateScrollPosition)
  }, [])

  return { scrollPosition, scrollDirection }
}