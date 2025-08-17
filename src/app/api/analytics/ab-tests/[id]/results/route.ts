import { NextRequest, NextResponse } from 'next/server'
import { ABTest } from '@/types/analytics'

// Mock data storage
const abTests = new Map<string, ABTest>()

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const test = abTests.get(id)

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }

    // Calculate detailed results
    const results = calculateTestResults(test)

    return NextResponse.json({
      testId: id,
      testName: test.name,
      status: test.status,
      startDate: test.startDate,
      endDate: test.endDate,
      duration: test.endDate ? 
        Math.floor((test.endDate.getTime() - test.startDate.getTime()) / (1000 * 60 * 60 * 24)) : 
        Math.floor((Date.now() - test.startDate.getTime()) / (1000 * 60 * 60 * 24)),
      results,
      recommendations: generateRecommendations(test, results),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('A/B test results fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateTestResults(test: ABTest) {
  const controlVariant = test.variants.find(v => v.isControl)
  const testVariants = test.variants.filter(v => !v.isControl)

  if (!controlVariant) {
    throw new Error('No control variant found')
  }

  // Mock participant counts based on traffic allocation
  const totalParticipants = 1000 // Mock total
  const controlParticipants = Math.floor((controlVariant.traffic / 100) * totalParticipants)
  const controlConversions = controlVariant.conversions

  const variantResults = testVariants.map(variant => {
    const participants = Math.floor((variant.traffic / 100) * totalParticipants)
    const conversions = variant.conversions
    const conversionRate = participants > 0 ? (conversions / participants) * 100 : 0
    const controlConversionRate = controlParticipants > 0 ? (controlConversions / controlParticipants) * 100 : 0
    
    // Calculate lift
    const lift = controlConversionRate > 0 ? 
      ((conversionRate - controlConversionRate) / controlConversionRate) * 100 : 0

    // Calculate statistical significance (simplified)
    const significance = calculateStatisticalSignificance(
      controlConversions,
      controlParticipants,
      conversions,
      participants
    )

    return {
      variantId: variant.id,
      variantName: variant.name,
      participants,
      conversions,
      conversionRate: Math.round(conversionRate * 100) / 100,
      lift: Math.round(lift * 100) / 100,
      significance: Math.round(significance * 100) / 100,
      isWinner: significance > 0.95 && lift > 0,
      confidenceInterval: {
        lower: Math.max(0, conversionRate - 1.96 * Math.sqrt(conversionRate * (100 - conversionRate) / participants)),
        upper: Math.min(100, conversionRate + 1.96 * Math.sqrt(conversionRate * (100 - conversionRate) / participants))
      }
    }
  })

  const controlResult = {
    variantId: controlVariant.id,
    variantName: controlVariant.name,
    participants: controlParticipants,
    conversions: controlConversions,
    conversionRate: controlParticipants > 0 ? Math.round((controlConversions / controlParticipants) * 10000) / 100 : 0,
    lift: 0, // Control is baseline
    significance: 100, // Control is always significant
    isWinner: false,
    confidenceInterval: {
      lower: 0,
      upper: 0
    }
  }

  // Determine overall winner
  const winner = variantResults.find(v => v.isWinner && v.significance > 95)
  const hasStatisticalSignificance = variantResults.some(v => v.significance > 95)

  return {
    control: controlResult,
    variants: variantResults,
    winner: winner ? {
      variantId: winner.variantId,
      variantName: winner.variantName,
      lift: winner.lift,
      significance: winner.significance
    } : null,
    hasStatisticalSignificance,
    overallSignificance: Math.max(...variantResults.map(v => v.significance)),
    recommendedAction: determineRecommendedAction(controlResult, variantResults, hasStatisticalSignificance)
  }
}

function calculateStatisticalSignificance(
  controlConversions: number,
  controlParticipants: number,
  variantConversions: number,
  variantParticipants: number
): number {
  if (controlParticipants === 0 || variantParticipants === 0) return 0

  const p1 = controlConversions / controlParticipants
  const p2 = variantConversions / variantParticipants
  const p = (controlConversions + variantConversions) / (controlParticipants + variantParticipants)
  
  const se = Math.sqrt(p * (1 - p) * (1 / controlParticipants + 1 / variantParticipants))
  
  if (se === 0) return 0
  
  const z = Math.abs(p1 - p2) / se
  
  // Convert z-score to confidence level (simplified)
  const confidence = 1 - 2 * (1 - normalCDF(Math.abs(z)))
  
  return Math.max(0, Math.min(1, confidence))
}

function normalCDF(x: number): number {
  // Approximation of the cumulative distribution function for standard normal distribution
  return 0.5 * (1 + erf(x / Math.sqrt(2)))
}

function erf(x: number): number {
  // Approximation of the error function
  const a1 =  0.254829592
  const a2 = -0.284496736
  const a3 =  1.421413741
  const a4 = -1.453152027
  const a5 =  1.061405429
  const p  =  0.3275911

  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)

  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return sign * y
}

function determineRecommendedAction(
  control: any,
  variants: any[],
  hasSignificance: boolean
): string {
  if (!hasSignificance) {
    return 'continue' // Not enough data yet
  }

  const bestVariant = variants.reduce((best, current) => 
    current.conversionRate > best.conversionRate ? current : best
  )

  if (bestVariant.conversionRate > control.conversionRate && bestVariant.significance > 95) {
    return 'implement' // Implement the winning variant
  }

  if (bestVariant.conversionRate <= control.conversionRate) {
    return 'keep_control' // Control is better
  }

  return 'continue' // Need more data
}

function generateRecommendations(test: ABTest, results: any): string[] {
  const recommendations: string[] = []

  if (!results.hasStatisticalSignificance) {
    recommendations.push('Continue running the test to gather more data for statistical significance.')
    recommendations.push('Consider increasing traffic allocation if the test is running slowly.')
  }

  if (results.winner) {
    recommendations.push(`Implement ${results.winner.variantName} as it shows a ${results.winner.lift.toFixed(1)}% improvement.`)
    recommendations.push('Monitor the implementation closely to ensure the improvement is sustained.')
  } else if (results.hasStatisticalSignificance) {
    const bestVariant = results.variants.reduce((best: any, current: any) => 
      current.conversionRate > best.conversionRate ? current : best
    )
    
    if (bestVariant.conversionRate <= results.control.conversionRate) {
      recommendations.push('The control version performs better. Consider keeping the original design.')
      recommendations.push('Analyze why the test variants underperformed and iterate on the hypothesis.')
    }
  }

  // Add general recommendations based on test performance
  const avgConversionRate = (results.control.conversionRate + 
    results.variants.reduce((sum: number, v: any) => sum + v.conversionRate, 0)) / 
    (results.variants.length + 1)

  if (avgConversionRate < 5) {
    recommendations.push('Overall conversion rates are low. Consider testing more dramatic changes.')
  }

  if (results.variants.some((v: any) => Math.abs(v.lift) < 5)) {
    recommendations.push('Small differences detected. Consider testing more contrasting variants in future tests.')
  }

  return recommendations
}