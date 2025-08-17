'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PaperAirplaneIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'
import { MobileGestureHandler, useHapticFeedback } from './MobileGestureHandler'
import { MobileAnimation, MobileTouchButton } from './MobileAnimations'
import { useOfflineActions } from '@/components/pwa/OfflineManager'

interface ContactMethod {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  color: string
  description: string
}

export function MobileContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    urgency: 'normal' as 'low' | 'normal' | 'high'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showQuickActions, setShowQuickActions] = useState(false)
  
  const { isMobile } = useDeviceCapabilities()
  const { triggerHaptic } = useHapticFeedback()
  const { addOfflineAction, isOnline } = useOfflineActions()

  const contactMethods: ContactMethod[] = [
    {
      id: 'email',
      name: 'Email',
      icon: EnvelopeIcon,
      action: () => window.open('mailto:isaac@isaacbenyakar.com', '_blank'),
      color: 'from-blue-500 to-cyan-500',
      description: 'Professional inquiries'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: ChatBubbleLeftRightIcon,
      action: () => window.open('https://wa.me/1234567890', '_blank'),
      color: 'from-green-500 to-emerald-500',
      description: 'Quick chat'
    },
    {
      id: 'phone',
      name: 'Call',
      icon: PhoneIcon,
      action: () => window.open('tel:+1234567890', '_blank'),
      color: 'from-purple-500 to-pink-500',
      description: 'Direct call'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    triggerHaptic('medium')

    const submitAction = {
      type: 'contact-form',
      data: formData,
      execute: async () => {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
        if (!response.ok) throw new Error('Failed to submit')
        return response.json()
      }
    }

    try {
      if (isOnline) {
        await submitAction.execute()
        setSubmitStatus('success')
        triggerHaptic('heavy')
        setFormData({ name: '', email: '', message: '', urgency: 'normal' })
      } else {
        addOfflineAction(submitAction)
        setSubmitStatus('success')
        triggerHaptic('heavy')
      }
    } catch (error) {
      setSubmitStatus('error')
      triggerHaptic('heavy')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus('idle'), 3000)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    triggerHaptic('light')
  }

  if (!isMobile) {
    return null // Use desktop version
  }

  return (
    <MobileGestureHandler
      onSwipeDown={() => setShowQuickActions(!showQuickActions)}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-slate-900/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-700">
        {/* Header */}
        <MobileAnimation type="fade" delay={0.1}>
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Let&apos;s Work Together
            </h3>
            <p className="text-slate-400 text-sm">
              {isOnline ? 'Send me a message' : 'Message will be sent when online'}
            </p>
          </div>
        </MobileAnimation>

        {/* Quick Contact Methods */}
        <AnimatePresence>
          {showQuickActions && (
            <MobileAnimation type="slide" direction="down">
              <div className="mb-6 p-4 bg-slate-800/50 rounded-xl">
                <p className="text-white text-sm mb-3 text-center">Quick Contact</p>
                <div className="grid grid-cols-3 gap-3">
                  {contactMethods.map((method) => {
                    const Icon = method.icon
                    return (
                      <MobileTouchButton
                        key={method.id}
                        onClick={() => {
                          method.action()
                          triggerHaptic('medium')
                        }}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg bg-gradient-to-br ${method.color} text-white`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{method.name}</span>
                      </MobileTouchButton>
                    )
                  })}
                </div>
              </div>
            </MobileAnimation>
          )}
        </AnimatePresence>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <MobileAnimation type="slide" direction="up" delay={0.2}>
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-4 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                required
              />
            </div>
          </MobileAnimation>

          <MobileAnimation type="slide" direction="up" delay={0.3}>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-4 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                required
              />
            </div>
          </MobileAnimation>

          <MobileAnimation type="slide" direction="up" delay={0.4}>
            <div>
              <select
                value={formData.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
                className="w-full p-4 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              >
                <option value="low">Low Priority</option>
                <option value="normal">Normal Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </MobileAnimation>

          <MobileAnimation type="slide" direction="up" delay={0.5}>
            <div>
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={4}
                className="w-full p-4 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                required
              />
            </div>
          </MobileAnimation>

          <MobileAnimation type="scale" delay={0.6}>
            <MobileTouchButton
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                submitStatus === 'success'
                  ? 'bg-green-500'
                  : submitStatus === 'error'
                  ? 'bg-red-500'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              } ${isSubmitting ? 'opacity-70' : ''}`}
            >
              <div className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    {isOnline ? 'Sent!' : 'Queued for sending'}
                  </>
                ) : submitStatus === 'error' ? (
                  <>
                    <ExclamationCircleIcon className="w-5 h-5" />
                    Try Again
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </div>
            </MobileTouchButton>
          </MobileAnimation>
        </form>

        {/* Interaction Hint */}
        <MobileAnimation type="fade" delay={0.8}>
          <div className="mt-4 text-center">
            <p className="text-slate-500 text-xs">
              Swipe down for quick contact options
            </p>
          </div>
        </MobileAnimation>
      </div>
    </MobileGestureHandler>
  )
}