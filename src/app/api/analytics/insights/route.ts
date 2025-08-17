import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsInsight } from '@/types/analytics'

export async function GET(request: NextRequest) {
  try {
    // Generate mock analytics insights
    const insights: AnalyticsInsight[] = [
      {
        id: 'insight_1',
        type: 'opportunity',
        title: 'High Mobile Traffic',
        description: 'Mobile users account for 65% of your traffic but have a lower conversion rate',
        metric: 'mobile_conversion_rate',
        value: 3.2,
        change: -15,
        recommendation: 'Optimize mobile contact forms and improve mobile user experience',
        priority: 'high',
        timestamp: new Date()
      },
      {
        id: 'insight_2',
        type: 'success',
        title: 'Strong Project Engagement',
        description: 'Project showcase section has 85% engagement rate',
        metric: 'project_engagement',
        value: 85,
        change: 12,
        recommendation: 'Consider adding more interactive project demos to capitalize on this success',
        priority: 'medium',
        timestamp: new Date()
      },
      {
        id: 'insight_3',
        type: 'warning',
        title: 'Contact Form Drop-off',
        description: '40% of users start the contact form but don\'t complete it',
        metric: 'form_completion_rate',
        value: 60,
        change: -8,
        recommendation: 'Simplify the contact form or add progress indicators',
        priority: 'high',
        timestamp: new Date()
      },
      {
        id: 'insight_4',
        type: 'info',
        title: 'Peak Traffic Hours',
        description: 'Most visitors arrive between 2-4 PM EST',
        metric: 'peak_traffic_time',
        value: 14,
        change: 0,
        recommendation: 'Schedule important updates or announcements during peak hours',
        priority: 'low',
        timestamp: new Date()
      },
      {
        id: 'insight_5',
        type: 'opportunity',
        title: 'Skills Section Underperforming',
        description: 'Skills visualization has low interaction rates compared to other sections',
        metric: 'skills_interaction_rate',
        value: 25,
        change: -5,
        recommendation: 'Make the skills section more interactive or add hover effects',
        priority: 'medium',
        timestamp: new Date()
      },
      {
        id: 'insight_6',
        type: 'success',
        title: 'Fast Page Load Times',
        description: 'Average page load time is 1.2 seconds, well below the 3-second benchmark',
        metric: 'page_load_time',
        value: 1.2,
        change: -0.3,
        recommendation: 'Maintain current performance optimization practices',
        priority: 'low',
        timestamp: new Date()
      },
      {
        id: 'insight_7',
        type: 'warning',
        title: 'High Bounce Rate on About Page',
        description: 'About page has a 70% bounce rate, higher than site average',
        metric: 'about_bounce_rate',
        value: 70,
        change: 15,
        recommendation: 'Add more engaging content or clear call-to-actions on the about page',
        priority: 'medium',
        timestamp: new Date()
      },
      {
        id: 'insight_8',
        type: 'opportunity',
        title: 'Social Media Referrals Growing',
        description: 'Social media traffic increased by 45% this month',
        metric: 'social_traffic',
        value: 145,
        change: 45,
        recommendation: 'Increase social media presence and consider social-specific landing pages',
        priority: 'medium',
        timestamp: new Date()
      }
    ]

    // Add some randomization to make insights feel more dynamic
    const dynamicInsights = insights.map(insight => ({
      ...insight,
      value: insight.value + (Math.random() * 10 - 5), // Add some variance
      change: insight.change + (Math.random() * 6 - 3), // Add some variance
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) // Random time in last 24h
    }))

    // Sort by priority and timestamp
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    dynamicInsights.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.timestamp.getTime() - a.timestamp.getTime()
    })

    return NextResponse.json({
      insights: dynamicInsights,
      summary: {
        total: dynamicInsights.length,
        highPriority: dynamicInsights.filter(i => i.priority === 'high').length,
        opportunities: dynamicInsights.filter(i => i.type === 'opportunity').length,
        warnings: dynamicInsights.filter(i => i.type === 'warning').length,
        successes: dynamicInsights.filter(i => i.type === 'success').length
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Analytics insights fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}