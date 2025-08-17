'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { useEngagementTracking } from '@/hooks/useEngagementTracking-simple'
import { AvailabilityIndicator } from './contact/AvailabilityIndicator'
import { ContactMethodCard } from './contact/ContactMethodCard'
import { SmartContactForm } from './contact/SmartContactForm'
import { ResponseTimeEstimator } from './contact/ResponseTimeEstimator'
import { ContactRecommendations } from './contact/ContactRecommendations'

export function ContactSection() {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const { trackInteraction, getEngagementScore, metrics } = useEngagementTracking()

  useEffect(() => {
    // Only track on client side to avoid hydration mismatch
    if (typeof window === 'undefined') return
    
    trackInteraction({
      eventType: 'scroll',
      element: 'contact-section',
      timestamp: new Date(),
      duration: 0
    })
  }, [trackInteraction])

  const engagementScore = getEngagementScore()
  const isPriorityUser = engagementScore > 70

  const contactMethods = [
    {
      id: 'email',
      name: 'Email',
      icon: EnvelopeIcon,
      description: 'Professional inquiries and detailed project discussions',
      action: 'iby@isaacbenyakar.com',
      responseTime: isPriorityUser ? '1-2 hours' : '2-4 hours',
      availability: 'always',
      priority: 'high'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: PhoneIcon,
      description: 'Quick questions and urgent project needs',
      action: '+1-305-393-3009',
      responseTime: isPriorityUser ? '5-15 minutes' : '15-30 minutes',
      availability: 'business-hours',
      priority: 'urgent'
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: ChatBubbleLeftRightIcon,
      description: 'Technical discussions and collaboration',
      action: 'restocktime',
      responseTime: isPriorityUser ? '30 minutes-1 hour' : '1-2 hours',
      availability: 'evenings',
      priority: 'medium'
    }
  ]

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    setIsFormVisible(true)
    trackInteraction({
      eventType: 'click',
      element: `contact-method-${methodId}`,
      timestamp: new Date(),
      duration: 0
    })
  }

  return (
    <section 
      id="contact"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-32 pb-20 px-4 sm:px-6 lg:px-8"
      role="region"
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 px-4"
        >
          <h2 id="contact-heading" className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white mb-8 leading-tight tracking-tight m-0">
            Let&apos;s Build Something
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 block sm:inline">
              {' '}Amazing
            </span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-body font-medium">
            Ready to transform your ideas into reality? Choose your preferred way to connect,
            and I&apos;ll get back to you with a personalized response.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start max-w-6xl mx-auto">
          {/* Contact Methods */}
          <div className="space-y-8 px-4 lg:px-0" role="region" aria-labelledby="contact-methods-heading">
            <div className="flex items-center justify-between mb-10">
              <h3 id="contact-methods-heading" className="text-2xl lg:text-3xl font-heading font-semibold text-white">Contact Methods</h3>
              <AvailabilityIndicator />
            </div>

            {/* Engagement-based Recommendations */}
            <ContactRecommendations
              engagementScore={engagementScore}
              sectionsVisited={metrics.sectionsVisited.size}
              timeSpent={metrics.sessionDuration}
            />

            <div className="space-y-4" role="list" aria-label="Available contact methods">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  role="listitem"
                >
                  <ContactMethodCard
                    method={method}
                    onSelect={() => handleMethodSelect(method.id)}
                    isSelected={selectedMethod === method.id}
                    isPriority={isPriorityUser}
                  />
                </motion.div>
              ))}
            </div>

            <ResponseTimeEstimator 
              selectedMethod={selectedMethod}
              engagementScore={engagementScore}
            />
          </div>

          {/* Contact Form */}
          <AnimatePresence>
            {isFormVisible && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.6 }}
              >
                <SmartContactForm
                  selectedMethod={selectedMethod}
                  onClose={() => setIsFormVisible(false)}
                  isPriority={isPriorityUser}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}