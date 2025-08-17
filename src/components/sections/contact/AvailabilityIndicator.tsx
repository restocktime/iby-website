'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface AvailabilityStatus {
  status: 'available' | 'busy' | 'away'
  message: string
  nextAvailable?: string
  responseTime: string
}

export function AvailabilityIndicator() {
  const [availability, setAvailability] = useState<AvailabilityStatus>({
    status: 'available',
    message: 'Available for new projects',
    responseTime: '2-4 hours'
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Simulate real-time availability updates with more sophisticated logic
    const updateAvailability = () => {
      const now = new Date()
      const minute = now.getMinutes()

      // Convert to EST (UTC-5) - in production, use proper timezone handling
      const estOffset = -5
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
      const est = new Date(utc + (estOffset * 3600000))
      const estHour = est.getHours()
      const estDay = est.getDay()

      // Business hours: Monday-Friday 9 AM - 6 PM EST
      const isBusinessHours = estDay >= 1 && estDay <= 5 && estHour >= 9 && estHour <= 18
      const isEveningHours = estHour >= 19 && estHour <= 23
      const isWeekend = estDay === 0 || estDay === 6

      // Check for lunch break (12-1 PM EST on weekdays)
      const isLunchTime = isBusinessHours && estHour === 12

      // Simulate being in meetings (random chance during business hours)
      const isInMeeting = isBusinessHours && Math.random() < 0.1 // 10% chance

      if (isBusinessHours && !isLunchTime && !isInMeeting) {
        setAvailability({
          status: 'available',
          message: 'Available for immediate response',
          responseTime: '15-30 minutes'
        })
      } else if (isLunchTime) {
        setAvailability({
          status: 'busy',
          message: 'On lunch break',
          nextAvailable: 'Back at 1:00 PM EST',
          responseTime: '1-2 hours'
        })
      } else if (isInMeeting) {
        setAvailability({
          status: 'busy',
          message: 'In a meeting',
          nextAvailable: `Available in ${60 - minute} minutes`,
          responseTime: '1-2 hours'
        })
      } else if (isEveningHours && !isWeekend) {
        setAvailability({
          status: 'busy',
          message: 'Working on projects - limited availability',
          responseTime: '2-4 hours'
        })
      } else if (isWeekend && estHour >= 10 && estHour <= 16) {
        setAvailability({
          status: 'busy',
          message: 'Weekend - limited availability',
          responseTime: '4-8 hours'
        })
      } else {
        const nextBusinessDay = getNextBusinessDay()
        setAvailability({
          status: 'away',
          message: 'Currently offline',
          nextAvailable: nextBusinessDay,
          responseTime: '4-12 hours'
        })
      }
    }

    updateAvailability()
    const interval = setInterval(updateAvailability, 30000) // Update every 30 seconds for more real-time feel

    return () => clearInterval(interval)
  }, [isClient])

  if (!isClient) {
    return (
      <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full border bg-gray-400/10 border-gray-400/20">
        <ClockIcon className="h-5 w-5 text-gray-400" />
        <div className="text-sm">
          <div className="font-medium text-gray-400">Loading availability...</div>
        </div>
      </div>
    )
  }

  const getStatusIcon = () => {
    switch (availability.status) {
      case 'available':
        return CheckCircleIcon
      case 'busy':
        return ExclamationTriangleIcon
      case 'away':
        return ClockIcon
      default:
        return ClockIcon
    }
  }

  const getStatusColor = () => {
    switch (availability.status) {
      case 'available':
        return 'text-green-400'
      case 'busy':
        return 'text-yellow-400'
      case 'away':
        return 'text-gray-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusBgColor = () => {
    switch (availability.status) {
      case 'available':
        return 'bg-green-400/10 border-green-400/20'
      case 'busy':
        return 'bg-yellow-400/10 border-yellow-400/20'
      case 'away':
        return 'bg-gray-400/10 border-gray-400/20'
      default:
        return 'bg-gray-400/10 border-gray-400/20'
    }
  }

  const StatusIcon = getStatusIcon()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center space-x-3 px-4 py-2 rounded-full border ${getStatusBgColor()}`}
    >
      <div className="relative">
        <StatusIcon className={`h-5 w-5 ${getStatusColor()}`} />
        {availability.status === 'available' && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
          />
        )}
      </div>
      
      <div className="text-sm">
        <div className={`font-medium ${getStatusColor()}`}>
          {availability.message}
        </div>
        <div className="text-gray-400 text-xs">
          Response time: {availability.responseTime}
        </div>
        {availability.nextAvailable && (
          <div className="text-gray-400 text-xs">
            Next available: {availability.nextAvailable}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function getNextBusinessDay(): string {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  
  // If tomorrow is Saturday (6) or Sunday (0), move to Monday
  while (tomorrow.getDay() === 0 || tomorrow.getDay() === 6) {
    tomorrow.setDate(tomorrow.getDate() + 1)
  }
  
  return tomorrow.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }) + ' at 9:00 AM EST'
}