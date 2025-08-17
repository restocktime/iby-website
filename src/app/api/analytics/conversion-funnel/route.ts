import { NextRequest, NextResponse } from 'next/server'
import { ConversionFunnel } from '@/types/analytics'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const timeRange = searchParams.get('timeRange') || '7d'

  try {
    // Generate mock conversion funnel data
    const baseFunnelData: ConversionFunnel[] = [
      {
        step: 'Landing Page Visit',
        visitors: 1000,
        conversions: 1000,
        conversionRate: 100,
        dropoffRate: 0,
        avgTimeToConvert: 0
      },
      {
        step: 'Hero Section Engagement',
        visitors: 1000,
        conversions: 750,
        conversionRate: 75,
        dropoffRate: 25,
        avgTimeToConvert: 15
      },
      {
        step: 'Project Portfolio View',
        visitors: 750,
        conversions: 520,
        conversionRate: 69.3,
        dropoffRate: 30.7,
        avgTimeToConvert: 45
      },
      {
        step: 'Skills Section Interaction',
        visitors: 520,
        conversions: 380,
        conversionRate: 73.1,
        dropoffRate: 26.9,
        avgTimeToConvert: 75
      },
      {
        step: 'Contact Section Reached',
        visitors: 380,
        conversions: 280,
        conversionRate: 73.7,
        dropoffRate: 26.3,
        avgTimeToConvert: 120
      },
      {
        step: 'Contact Method Clicked',
        visitors: 280,
        conversions: 150,
        conversionRate: 53.6,
        dropoffRate: 46.4,
        avgTimeToConvert: 180
      },
      {
        step: 'Contact Form Started',
        visitors: 150,
        conversions: 95,
        conversionRate: 63.3,
        dropoffRate: 36.7,
        avgTimeToConvert: 240
      },
      {
        step: 'Contact Form Completed',
        visitors: 95,
        conversions: 78,
        conversionRate: 82.1,
        dropoffRate: 17.9,
        avgTimeToConvert: 300
      }
    ]

    // Apply time range multipliers for realism
    const timeMultipliers: Record<string, number> = {
      '1d': 0.1,
      '7d': 1,
      '30d': 4.2,
      '90d': 12.8
    }

    const multiplier = timeMultipliers[timeRange] || 1
    const adjustedFunnelData = baseFunnelData.map(step => ({
      ...step,
      visitors: Math.round(step.visitors * multiplier),
      conversions: Math.round(step.conversions * multiplier),
      avgTimeToConvert: step.avgTimeToConvert + (Math.random() * 30 - 15) // Add some variance
    }))

    // Calculate additional metrics
    const totalVisitors = adjustedFunnelData[0].visitors
    const totalConversions = adjustedFunnelData[adjustedFunnelData.length - 1].conversions
    const overallConversionRate = (totalConversions / totalVisitors) * 100

    const insights = generateFunnelInsights(adjustedFunnelData)

    return NextResponse.json({
      timeRange,
      funnel: adjustedFunnelData,
      summary: {
        totalVisitors,
        totalConversions,
        overallConversionRate: Math.round(overallConversionRate * 100) / 100,
        avgTimeToConvert: adjustedFunnelData[adjustedFunnelData.length - 1].avgTimeToConvert
      },
      insights,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Conversion funnel fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateFunnelInsights(funnelData: ConversionFunnel[]) {
  const insights = []

  // Find the biggest drop-off point
  let maxDropoff = 0
  let maxDropoffStep = ''
  
  for (let i = 1; i < funnelData.length; i++) {
    const dropoff = funnelData[i].dropoffRate
    if (dropoff > maxDropoff) {
      maxDropoff = dropoff
      maxDropoffStep = funnelData[i].step
    }
  }

  insights.push({
    type: 'warning',
    title: 'Highest Drop-off Point',
    description: `${maxDropoffStep} has the highest drop-off rate at ${maxDropoff.toFixed(1)}%`,
    recommendation: 'Consider optimizing this step to reduce friction and improve conversion rates.'
  })

  // Find steps with good conversion rates
  const goodSteps = funnelData.filter(step => step.conversionRate > 70 && step.step !== 'Landing Page Visit')
  if (goodSteps.length > 0) {
    insights.push({
      type: 'success',
      title: 'High-Performing Steps',
      description: `${goodSteps.length} steps have conversion rates above 70%`,
      recommendation: 'Analyze what makes these steps successful and apply similar principles to other steps.'
    })
  }

  // Check for slow conversion times
  const slowSteps = funnelData.filter(step => step.avgTimeToConvert > 200)
  if (slowSteps.length > 0) {
    insights.push({
      type: 'info',
      title: 'Extended Conversion Times',
      description: `${slowSteps.length} steps take over 3 minutes on average to convert`,
      recommendation: 'Consider streamlining these steps or providing better guidance to users.'
    })
  }

  return insights
}