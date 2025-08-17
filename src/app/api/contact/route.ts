import { NextRequest, NextResponse } from 'next/server'
import { ContactForm } from '@/types'

interface ContactSubmission extends ContactForm {
  selectedMethod: string | null
  isPriorityUser: boolean
  submittedAt: string
  estimatedResponseTime: string
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactSubmission = await request.json()
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Smart routing logic based on project type and priority
    const routingResult = await routeInquiry(data)
    
    // Store the inquiry (in a real app, this would go to a database)
    const inquiry = {
      id: generateInquiryId(),
      ...data,
      routing: routingResult,
      status: 'new',
      createdAt: new Date().toISOString()
    }

    // Log the inquiry (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('New Contact Inquiry:', inquiry)
    }

    // In a real implementation, you would:
    // 1. Save to database
    // 2. Send notification emails
    // 3. Route to appropriate team member
    // 4. Send confirmation email to user
    // 5. Add to CRM system

    // Simulate different response times based on routing
    await simulateProcessingTime(routingResult.priority)

    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
      routing: routingResult,
      message: 'Your inquiry has been received and routed appropriately.'
    })

  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function routeInquiry(data: ContactSubmission) {
  const { projectType, priority, isPriorityUser, selectedMethod, budget, timeline } = data
  
  // Advanced routing priority calculation
  let routingPriority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  let priorityScore = 0
  
  // Base priority scoring
  switch (priority) {
    case 'urgent': priorityScore += 40; break
    case 'high': priorityScore += 30; break
    case 'medium': priorityScore += 20; break
    case 'low': priorityScore += 10; break
  }
  
  // Project type scoring (some types are more urgent/valuable)
  const projectTypeScores = {
    'automation': 15,
    'crm': 15,
    'analytics': 12,
    'web-development': 10,
    'e-commerce': 12,
    'scraping': 8,
    'monitoring': 8
  }
  priorityScore += projectTypeScores[projectType] || 10
  
  // Budget scoring
  if (budget?.includes('50,000+')) priorityScore += 20
  else if (budget?.includes('15,000 - 50,000')) priorityScore += 15
  else if (budget?.includes('5,000 - 15,000')) priorityScore += 10
  else if (budget?.includes('1,000 - 5,000')) priorityScore += 5
  
  // Timeline urgency scoring
  if (timeline?.includes('ASAP')) priorityScore += 25
  else if (timeline?.includes('1-2 weeks')) priorityScore += 15
  else if (timeline?.includes('1 month')) priorityScore += 10
  
  // High engagement user bonus
  if (isPriorityUser) priorityScore += 15
  
  // Determine final priority
  if (priorityScore >= 70) routingPriority = 'urgent'
  else if (priorityScore >= 50) routingPriority = 'high'
  else if (priorityScore >= 30) routingPriority = 'medium'
  else routingPriority = 'low'

  // Smart notification channel selection
  const notificationChannels = []
  
  if (routingPriority === 'urgent') {
    // Urgent: All channels for immediate attention
    notificationChannels.push('whatsapp', 'discord', 'email', 'sms')
  } else if (routingPriority === 'high' || selectedMethod === 'whatsapp') {
    notificationChannels.push('whatsapp', 'email')
  } else if (selectedMethod === 'discord' || projectType === 'automation') {
    notificationChannels.push('discord', 'email')
  } else {
    notificationChannels.push('email')
  }

  // Specialized routing based on project type
  let assignedTo = 'isaac@isaacbenyakar.com'
  const specialistTags = []
  
  switch (projectType) {
    case 'scraping':
    case 'monitoring':
      assignedTo = 'isaac+automation@isaacbenyakar.com'
      specialistTags.push('automation-specialist')
      break
    case 'crm':
    case 'analytics':
      assignedTo = 'isaac+business@isaacbenyakar.com'
      specialistTags.push('business-solutions')
      break
    case 'e-commerce':
      assignedTo = 'isaac+ecommerce@isaacbenyakar.com'
      specialistTags.push('ecommerce-specialist')
      break
    case 'web-development':
      assignedTo = 'isaac+webdev@isaacbenyakar.com'
      specialistTags.push('web-development')
      break
  }

  // Calculate SLA response time
  const slaHours = calculateSLAResponseTime(routingPriority, selectedMethod, isPriorityUser)

  // Generate follow-up schedule
  const followUpSchedule = generateFollowUpSchedule(routingPriority, data)

  return {
    priority: routingPriority,
    priorityScore,
    assignedTo,
    notificationChannels,
    slaHours,
    tags: [...generateTags(data), ...specialistTags],
    autoResponder: shouldSendAutoResponder(data),
    followUpSchedule,
    escalationRules: generateEscalationRules(routingPriority)
  }
}

function calculateSLAResponseTime(
  priority: string, 
  method: string | null, 
  isPriorityUser: boolean
): number {
  let baseHours = 4

  // Adjust for priority
  switch (priority) {
    case 'urgent':
      baseHours = 1
      break
    case 'high':
      baseHours = 2
      break
    case 'low':
      baseHours = 8
      break
  }

  // Adjust for contact method
  if (method === 'whatsapp') {
    baseHours = Math.max(0.25, baseHours / 4) // Minimum 15 minutes
  } else if (method === 'discord') {
    baseHours = Math.max(0.5, baseHours / 2) // Minimum 30 minutes
  }

  // Adjust for priority users
  if (isPriorityUser) {
    baseHours = Math.max(0.25, baseHours / 2)
  }

  return baseHours
}

function generateTags(data: ContactSubmission): string[] {
  const tags: string[] = [data.projectType]
  
  if (data.company) tags.push('business')
  if (data.budget && data.budget.includes('50,000+')) tags.push('enterprise')
  if (data.timeline && data.timeline.includes('ASAP')) tags.push('rush')
  if (data.isPriorityUser) tags.push('high-engagement')
  
  return tags
}

function shouldSendAutoResponder(data: ContactSubmission): boolean {
  // Send auto-responder for most inquiries, but not for urgent ones
  // (urgent ones get personal immediate attention)
  return data.priority !== 'urgent'
}

function generateInquiryId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `INQ-${timestamp}-${random}`.toUpperCase()
}

function generateFollowUpSchedule(priority: string, data: ContactSubmission) {
  const followUps = []
  const baseTime = new Date()
  
  switch (priority) {
    case 'urgent':
      followUps.push({
        type: 'initial_response',
        scheduledFor: new Date(baseTime.getTime() + 15 * 60 * 1000), // 15 minutes
        channel: 'whatsapp'
      })
      followUps.push({
        type: 'detailed_proposal',
        scheduledFor: new Date(baseTime.getTime() + 2 * 60 * 60 * 1000), // 2 hours
        channel: 'email'
      })
      break
    case 'high':
      followUps.push({
        type: 'initial_response',
        scheduledFor: new Date(baseTime.getTime() + 60 * 60 * 1000), // 1 hour
        channel: data.selectedMethod || 'email'
      })
      followUps.push({
        type: 'detailed_proposal',
        scheduledFor: new Date(baseTime.getTime() + 24 * 60 * 60 * 1000), // 24 hours
        channel: 'email'
      })
      break
    default:
      followUps.push({
        type: 'initial_response',
        scheduledFor: new Date(baseTime.getTime() + 4 * 60 * 60 * 1000), // 4 hours
        channel: 'email'
      })
      followUps.push({
        type: 'follow_up',
        scheduledFor: new Date(baseTime.getTime() + 48 * 60 * 60 * 1000), // 48 hours
        channel: 'email'
      })
  }
  
  return followUps
}

function generateEscalationRules(priority: string) {
  const rules = []
  
  switch (priority) {
    case 'urgent':
      rules.push({
        condition: 'no_response_15_minutes',
        action: 'send_sms_notification',
        escalateTo: 'isaac+urgent@isaacbenyakar.com'
      })
      rules.push({
        condition: 'no_response_1_hour',
        action: 'call_backup_contact',
        escalateTo: 'backup@isaacbenyakar.com'
      })
      break
    case 'high':
      rules.push({
        condition: 'no_response_2_hours',
        action: 'send_reminder_notification',
        escalateTo: 'isaac+reminders@isaacbenyakar.com'
      })
      break
  }
  
  return rules
}

async function simulateProcessingTime(priority: string): Promise<void> {
  // Simulate processing time based on priority
  const delay = priority === 'urgent' ? 100 : priority === 'high' ? 200 : 500
  return new Promise(resolve => setTimeout(resolve, delay))
}

// GET endpoint for retrieving contact statistics (admin only)
export async function GET(request: NextRequest) {
  // In a real implementation, this would require authentication
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action')

  if (action === 'stats') {
    // Return mock statistics
    return NextResponse.json({
      totalInquiries: 127,
      averageResponseTime: '2.3 hours',
      priorityDistribution: {
        urgent: 8,
        high: 23,
        medium: 67,
        low: 29
      },
      methodPreferences: {
        email: 45,
        whatsapp: 32,
        discord: 23
      },
      conversionRate: 0.73
    })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}