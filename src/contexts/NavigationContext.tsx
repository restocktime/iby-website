'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

export interface NavigationSection {
  id: string
  label: string
  href: string
  isActive?: boolean
}

export interface NavigationContextType {
  sections: NavigationSection[]
  activeSection: string | null
  navigationMode: 'minimal' | 'expanded' | 'contextual'
  scrollProgress: number
  isScrolling: boolean
  navigateToSection: (sectionId: string) => void
  setNavigationMode: (mode: 'minimal' | 'expanded' | 'contextual') => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

const defaultSections: NavigationSection[] = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

interface NavigationProviderProps {
  children: ReactNode
  sections?: NavigationSection[]
}

export function NavigationProvider({ 
  children, 
  sections = defaultSections 
}: NavigationProviderProps) {
  const [navigationMode, setNavigationMode] = useState<'minimal' | 'expanded' | 'contextual'>('expanded')
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollProgress = useScrollProgress()
  const { scrollToSection } = useSmoothScroll()

  // Update navigation mode based on scroll behavior
  useEffect(() => {
    if (scrollProgress.isAtTop) {
      setNavigationMode('expanded')
    } else if (scrollProgress.direction === 'up' || scrollProgress.progress < 0.1) {
      setNavigationMode('contextual')
    } else if (scrollProgress.direction === 'down' && scrollProgress.progress > 0.1) {
      setNavigationMode('minimal')
    }
  }, [scrollProgress])

  // Track scrolling state
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  const navigateToSection = (sectionId: string) => {
    // Use different scroll behavior for mobile vs desktop
    const isMobile = window.innerWidth < 768
    scrollToSection(sectionId, { 
      duration: isMobile ? 0 : 800, // No smooth scroll on mobile
      offset: 80 
    })
  }

  // Update sections with active state
  const sectionsWithActiveState = sections.map(section => ({
    ...section,
    isActive: section.id === scrollProgress.currentSection
  }))

  const contextValue: NavigationContextType = {
    sections: sectionsWithActiveState,
    activeSection: scrollProgress.currentSection,
    navigationMode,
    scrollProgress: scrollProgress.progress,
    isScrolling,
    navigateToSection,
    setNavigationMode
  }

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}