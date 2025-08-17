'use client'

import { useCallback, useEffect, useState } from 'react'
import { getAnalytics } from '@/lib/advancedAnalytics'
import { ConversionEvent, ConversionFunnel } from '@/types/analytics'

interface ConversionGoal {
  id: string
  name: string
  type: ConversionEvent['type']
  value: number
  description: string
}

interface ConversionTrackingOptions {
  autoTrackForms?: boolean
  autoTrackClicks?: boolean
  trackScrollMilestones?: boolean
  trackTimeOnPage?: boolean
}

export function useConversionTracking(options: ConversionTrackingOptions = {}) {
  const {
    autoTrackForms = true,
    autoTrackClicks = true,
    trackScrollMilestones = true,
    trackTimeOnPage = true
  } = options

  const analytics = getAnalytics()
  const [conversionGoals] = useState<ConversionGoal[]>([
    {
      id: 'contact_form',
      name: 'Contact Form Submission',
      type: 'contact_form',
      value: 10,
      description: 'User submitted the main contact form'
    },
    {
      id: 'email_click',
      name: 'Email Click',
      type: 'email_click',
      value: 5,
      description: 'User clicked on email contact method'
    },
    {
      id: 'whatsapp_click',
      name: 'WhatsApp Click',
      type: 'whatsapp_click',
      value: 7,
      description: 'User clicked on WhatsApp contact method'
    },
    {
      id: 'discord_click',
      name: 'Discord Click',
      type: 'discord_click',
      value: 6,
      description: 'User clicked on Discord contact method'
    },
    {
      id: 'project_inquiry',
      name: 'Project Inquiry',
      type: 'project_inquiry',
      value: 15,
      description: 'User showed interest in a specific project'
    }
  ])

  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel[]>([])
  const [scrollMilestones] = useState([25, 50, 75, 90, 100])
  const [trackedMilestones, setTrackedMilestones] = useState<Set<number>>(new Set())

  const trackConversion = useCallback((
    type: ConversionEvent['type'],
    value?: number,
    formData?: Record<string, unknown>,
    customProperties?: Record<string, unknown>
  ) => {
    const goal = conversionGoals.find(g => g.type === type)
    const conversionValue = value || goal?.value || 1

    analytics.trackConversion(type, conversionValue, formData)
    
    // Track additional conversion properties
    analytics.trackEvent('conversion_detailed', {
      conversionType: type,
      conversionValue,
      goalId: goal?.id,
      goalName: goal?.name,
      formData,
      ...customProperties,
      timestamp: Date.now(),
      page: window.location.pathname,
      referrer: document.referrer
    })

    console.log(`Conversion tracked: ${type} (value: ${conversionValue})`)
  }, [analytics, conversionGoals])

  const trackFormSubmission = useCallback((
    formElement: HTMLFormElement,
    formData: Record<string, unknown>
  ) => {
    const formId = formElement.id || formElement.className || 'unknown_form'
    
    trackConversion('contact_form', undefined, formData, {
      formId,
      formAction: formElement.action,
      formMethod: formElement.method
    })
  }, [trackConversion])

  const trackContactMethodClick = useCallback((method: string, element?: HTMLElement) => {
    const conversionType = method.toLowerCase() as ConversionEvent['type']
    
    trackConversion(conversionType, undefined, undefined, {
      contactMethod: method,
      elementText: element?.textContent?.slice(0, 50),
      elementId: element?.id,
      elementClass: element?.className
    })
  }, [trackConversion])

  const trackProjectInterest = useCallback((projectId: string, projectTitle: string, interactionType: string) => {
    trackConversion('project_inquiry', undefined, undefined, {
      projectId,
      projectTitle,
      interactionType,
      timestamp: Date.now()
    })
  }, [trackConversion])

  const trackScrollMilestone = useCallback((percentage: number) => {
    if (trackedMilestones.has(percentage)) return

    setTrackedMilestones(prev => new Set([...prev, percentage]))
    
    analytics.trackEvent('scroll_milestone', {
      percentage,
      timestamp: Date.now(),
      page: window.location.pathname
    })

    // Track as micro-conversion for high scroll depths
    if (percentage >= 75) {
      analytics.trackEvent('engagement_milestone', {
        type: 'deep_scroll',
        value: percentage,
        timestamp: Date.now()
      })
    }
  }, [analytics, trackedMilestones])

  const trackTimeOnPageMilestone = useCallback((seconds: number) => {
    analytics.trackEvent('time_milestone', {
      timeOnPage: seconds,
      timestamp: Date.now(),
      page: window.location.pathname
    })

    // Track as micro-conversion for extended engagement
    if (seconds >= 120) { // 2 minutes
      analytics.trackEvent('engagement_milestone', {
        type: 'extended_visit',
        value: seconds,
        timestamp: Date.now()
      })
    }
  }, [analytics])

  const getConversionFunnel = useCallback(async (): Promise<ConversionFunnel[]> => {
    try {
      const funnel = await analytics.getConversionFunnel()
      setConversionFunnel(funnel)
      return funnel
    } catch (error) {
      console.error('Failed to fetch conversion funnel:', error)
      return []
    }
  }, [analytics])

  const getConversionRate = useCallback((type?: ConversionEvent['type']): number => {
    // This would typically come from the analytics API
    // For now, return a mock calculation
    const totalVisitors = 1000 // Mock data
    const conversions = type ? 50 : 150 // Mock data
    return (conversions / totalVisitors) * 100
  }, [])

  // Auto-track form submissions
  useEffect(() => {
    if (!autoTrackForms || typeof window === 'undefined') return

    const handleFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement
      if (!form || form.tagName !== 'FORM') return

      const formData = new FormData(form)
      const data: Record<string, unknown> = {}
      
      formData.forEach((value, key) => {
        data[key] = value
      })

      trackFormSubmission(form, data)
    }

    document.addEventListener('submit', handleFormSubmit)
    return () => document.removeEventListener('submit', handleFormSubmit)
  }, [autoTrackForms, trackFormSubmission])

  // Auto-track contact method clicks
  useEffect(() => {
    if (!autoTrackClicks || typeof window === 'undefined') return

    const handleClick = (event: Event) => {
      const element = event.target as HTMLElement
      if (!element) return

      // Check for contact method indicators
      const href = element.getAttribute('href') || ''
      const className = element.className || ''
      const id = element.id || ''
      const text = element.textContent?.toLowerCase() || ''

      if (href.includes('mailto:') || text.includes('email') || className.includes('email')) {
        trackContactMethodClick('email', element)
      } else if (href.includes('whatsapp') || text.includes('whatsapp') || className.includes('whatsapp')) {
        trackContactMethodClick('whatsapp', element)
      } else if (href.includes('discord') || text.includes('discord') || className.includes('discord')) {
        trackContactMethodClick('discord', element)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [autoTrackClicks, trackContactMethodClick])

  // Track scroll milestones
  useEffect(() => {
    if (!trackScrollMilestones || typeof window === 'undefined') return

    const handleScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      )

      scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
          trackScrollMilestone(milestone)
        }
      })
    }

    const throttledScroll = throttle(handleScroll, 500)
    window.addEventListener('scroll', throttledScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [trackScrollMilestones, scrollMilestones, trackedMilestones, trackScrollMilestone])

  // Track time on page milestones
  useEffect(() => {
    if (!trackTimeOnPage || typeof window === 'undefined') return

    const milestones = [30, 60, 120, 300, 600] // seconds
    const trackedTimes = new Set<number>()

    const interval = setInterval(() => {
      const timeOnPage = Math.floor(performance.now() / 1000)
      
      milestones.forEach(milestone => {
        if (timeOnPage >= milestone && !trackedTimes.has(milestone)) {
          trackedTimes.add(milestone)
          trackTimeOnPageMilestone(milestone)
        }
      })
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [trackTimeOnPage, trackTimeOnPageMilestone])

  return {
    trackConversion,
    trackFormSubmission,
    trackContactMethodClick,
    trackProjectInterest,
    trackScrollMilestone,
    trackTimeOnPageMilestone,
    getConversionFunnel,
    getConversionRate,
    conversionGoals,
    conversionFunnel
  }
}

function throttle(func: (...args: any[]) => void, delay: number) {
  let timeoutId: NodeJS.Timeout
  let lastExecTime = 0
  
  return function (this: any, ...args: any[]) {
    const currentTime = Date.now()
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args)
      lastExecTime = currentTime
    } else {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func.apply(this, args)
        lastExecTime = Date.now()
      }, delay - (currentTime - lastExecTime))
    }
  }
}