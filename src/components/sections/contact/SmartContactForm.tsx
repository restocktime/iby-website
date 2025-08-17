'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  PaperAirplaneIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { ContactForm, ProjectCategory } from '@/types'
import { useEngagementTracking } from '@/hooks/useEngagementTracking'
import { useABTest } from '@/hooks/useABTest'
import { useAnalytics } from '@/components/providers/AnalyticsProvider'

interface SmartContactFormProps {
  selectedMethod: string | null
  onClose: () => void
  isPriority: boolean
}

export function SmartContactForm({ selectedMethod, onClose, isPriority }: SmartContactFormProps) {
  const { trackInteraction } = useEngagementTracking()
  const { trackConversion } = useAnalytics()
  const { variant: formVariant, trackConversion: trackABConversion } = useABTest('test_contact_form')
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    projectType: 'web-development',
    budget: '',
    timeline: '',
    message: '',
    priority: 'medium'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [estimatedResponseTime, setEstimatedResponseTime] = useState('')

  useEffect(() => {
    // Calculate estimated response time based on form data and user priority
    const calculateResponseTime = () => {
      let baseTime = 4 // hours
      
      if (isPriority) baseTime = Math.ceil(baseTime / 2)
      if (formData.priority === 'urgent') baseTime = Math.ceil(baseTime / 2)
      if (selectedMethod === 'whatsapp') baseTime = Math.ceil(baseTime / 4)
      
      setEstimatedResponseTime(`${baseTime}-${baseTime * 2} hours`)
    }

    calculateResponseTime()
  }, [formData.priority, selectedMethod, isPriority])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    trackInteraction({
      eventType: 'click',
      element: `form-field-${name}`,
      timestamp: new Date(),
      duration: 0
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    trackInteraction({
      eventType: 'click',
      element: 'contact-form-submit',
      timestamp: new Date(),
      duration: 0
    })

    try {
      // Smart routing based on project type and priority
      const routingData = {
        ...formData,
        selectedMethod,
        isPriorityUser: isPriority,
        submittedAt: new Date().toISOString(),
        estimatedResponseTime
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routingData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        
        // Track conversion for analytics
        trackConversion('contact_form', 10, formData)
        
        // Track A/B test conversion
        trackABConversion(10)
        
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const projectTypes: { value: ProjectCategory; label: string }[] = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'automation', label: 'Automation & Bots' },
    { value: 'crm', label: 'Custom CRM' },
    { value: 'analytics', label: 'Analytics & Tracking' },
    { value: 'e-commerce', label: 'E-commerce' },
    { value: 'scraping', label: 'Web Scraping' },
    { value: 'monitoring', label: 'Website Monitoring' }
  ]

  const budgetRanges = [
    '$1,000 - $5,000',
    '$5,000 - $15,000',
    '$15,000 - $50,000',
    '$50,000+',
    'Let\'s discuss'
  ]

  const timelineOptions = [
    'ASAP (Rush job)',
    '1-2 weeks',
    '1 month',
    '2-3 months',
    '3+ months',
    'Flexible'
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Get In Touch</h3>
          <p className="text-gray-300 text-sm">
            {selectedMethod && `Via ${selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)}`}
            {isPriority && ' • Priority Response'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <XMarkIcon className="h-6 w-6 text-gray-400" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {submitStatus === 'success' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Message Sent!</h4>
            <p className="text-gray-300 mb-4">
              Thanks for reaching out. I&apos;ll get back to you within {estimatedResponseTime}.
            </p>
            <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-4">
              <p className="text-green-300 text-sm">
                Your inquiry has been routed to the appropriate channel based on your project type and priority level.
              </p>
            </div>
          </motion.div>
        ) : submitStatus === 'error' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <ExclamationTriangleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Something went wrong</h4>
            <p className="text-gray-300 mb-4">
              Please try again or contact me directly using one of the methods above.
            </p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company (Optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
                placeholder="Your company name"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Type *
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
                >
                  {projectTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-slate-800">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority Level
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
                >
                  <option value="low" className="bg-slate-800">Low - General inquiry</option>
                  <option value="medium" className="bg-slate-800">Medium - Standard project</option>
                  <option value="high" className="bg-slate-800">High - Important project</option>
                  <option value="urgent" className="bg-slate-800">Urgent - Need ASAP</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget Range
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
                >
                  <option value="" className="bg-slate-800">Select budget range</option>
                  {budgetRanges.map(range => (
                    <option key={range} value={range} className="bg-slate-800">
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timeline
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
                >
                  <option value="" className="bg-slate-800">Select timeline</option>
                  {timelineOptions.map(timeline => (
                    <option key={timeline} value={timeline} className="bg-slate-800">
                      {timeline}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Details *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all resize-none"
                placeholder="Tell me about your project, goals, and any specific requirements..."
              />
            </div>

            {/* Response Time Estimate */}
            <div className="bg-purple-600/10 border border-purple-400/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-purple-300">
                <ClockIcon className="h-5 w-5" />
                <span className="font-medium">Estimated Response Time: {estimatedResponseTime}</span>
              </div>
              <p className="text-purple-200 text-sm mt-1">
                Based on your priority level and selected contact method
              </p>
              {isPriority && (
                <div className="mt-2 p-2 bg-yellow-400/10 border border-yellow-400/20 rounded">
                  <p className="text-yellow-300 text-xs">
                    🚀 Priority user detected! You&apos;ll receive expedited response times and direct access to specialized channels.
                  </p>
                </div>
              )}
            </div>

            {/* Alternative Contact Methods */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Alternative Contact Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => window.location.href = `mailto:isaac@isaacbenyakar.com?subject=Urgent: ${formData.projectType} Project&body=Hi Isaac,%0A%0AI have an urgent ${formData.projectType} project inquiry.%0A%0AProject Details:%0A${encodeURIComponent(formData.message)}%0A%0ABest regards,%0A${formData.name}`}
                  className="flex items-center justify-center space-x-2 p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 rounded-lg text-blue-300 text-sm transition-colors"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>Direct Email</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    const message = encodeURIComponent(`Hi Isaac! I'm ${formData.name} and I'm interested in a ${formData.projectType} project. ${formData.message.substring(0, 100)}...`)
                    window.open(`https://wa.me/15550123?text=${message}`, '_blank')
                  }}
                  className="flex items-center justify-center space-x-2 p-3 bg-green-600/20 hover:bg-green-600/30 border border-green-400/30 rounded-lg text-green-300 text-sm transition-colors"
                >
                  <PhoneIcon className="h-4 w-4" />
                  <span>WhatsApp</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('isaac#1234').then(() => {
                      alert('Discord username copied! Add me: isaac#1234')
                    })
                  }}
                  className="flex items-center justify-center space-x-2 p-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30 rounded-lg text-purple-300 text-sm transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  <span>Discord</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-5 w-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}