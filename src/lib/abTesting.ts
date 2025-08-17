'use client'

import { ABTest, ABTestVariant } from '@/types/analytics'
import { getAnalytics } from './advancedAnalytics'

class ABTestingService {
  private activeTests: Map<string, ABTest> = new Map()
  private userVariants: Map<string, string> = new Map()
  private analytics = getAnalytics()

  constructor() {
    this.loadActiveTests()
    this.loadUserVariants()
  }

  public async initializeTest(testId: string): Promise<string | null> {
    const test = this.activeTests.get(testId)
    if (!test || test.status !== 'running') {
      return null
    }

    // Check if user already has a variant assigned
    const existingVariant = this.userVariants.get(testId)
    if (existingVariant) {
      return existingVariant
    }

    // Assign variant based on traffic allocation
    const variant = this.assignVariant(test)
    if (variant) {
      this.userVariants.set(testId, variant.id)
      this.saveUserVariants()
      
      // Track test participation
      this.analytics.trackEvent('ab_test_participation', {
        testId,
        variantId: variant.id,
        testName: test.name,
        variantName: variant.name
      })
      
      return variant.id
    }

    return null
  }

  public trackConversion(testId: string, conversionValue: number = 1): void {
    const variantId = this.userVariants.get(testId)
    if (!variantId) return

    const test = this.activeTests.get(testId)
    if (!test) return

    // Track conversion
    this.analytics.trackEvent('ab_test_conversion', {
      testId,
      variantId,
      testName: test.name,
      conversionValue,
      targetMetric: test.targetMetric
    })

    // Update local variant data
    const variant = test.variants.find(v => v.id === variantId)
    if (variant) {
      variant.conversions += conversionValue
      variant.conversionRate = variant.conversions / (variant.traffic / 100 * this.getTotalParticipants(test))
    }
  }

  public getVariant(testId: string): string | null {
    return this.userVariants.get(testId) || null
  }

  public isInVariant(testId: string, variantId: string): boolean {
    return this.userVariants.get(testId) === variantId
  }

  public async createTest(test: Omit<ABTest, 'id'>): Promise<string> {
    const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newTest: ABTest = {
      ...test,
      id: testId
    }

    try {
      const response = await fetch('/api/analytics/ab-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTest)
      })

      if (response.ok) {
        this.activeTests.set(testId, newTest)
        return testId
      }
    } catch (error) {
      console.error('Failed to create A/B test:', error)
    }

    throw new Error('Failed to create A/B test')
  }

  public async updateTest(testId: string, updates: Partial<ABTest>): Promise<void> {
    const test = this.activeTests.get(testId)
    if (!test) return

    const updatedTest = { ...test, ...updates }

    try {
      const response = await fetch(`/api/analytics/ab-tests/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTest)
      })

      if (response.ok) {
        this.activeTests.set(testId, updatedTest)
      }
    } catch (error) {
      console.error('Failed to update A/B test:', error)
    }
  }

  public async getTestResults(testId: string): Promise<ABTest | null> {
    try {
      const response = await fetch(`/api/analytics/ab-tests/${testId}/results`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Failed to fetch test results:', error)
    }
    return null
  }

  public async getAllTests(): Promise<ABTest[]> {
    try {
      const response = await fetch('/api/analytics/ab-tests')
      if (response.ok) {
        const tests = await response.json()
        tests.forEach((test: ABTest) => {
          this.activeTests.set(test.id, test)
        })
        return tests
      }
    } catch (error) {
      console.error('Failed to fetch A/B tests:', error)
    }
    return []
  }

  public calculateStatisticalSignificance(
    controlConversions: number,
    controlParticipants: number,
    variantConversions: number,
    variantParticipants: number
  ): number {
    // Simplified z-test for proportions
    const p1 = controlConversions / controlParticipants
    const p2 = variantConversions / variantParticipants
    const p = (controlConversions + variantConversions) / (controlParticipants + variantParticipants)
    
    const se = Math.sqrt(p * (1 - p) * (1 / controlParticipants + 1 / variantParticipants))
    const z = Math.abs(p1 - p2) / se
    
    // Convert z-score to p-value (simplified)
    const pValue = 2 * (1 - this.normalCDF(Math.abs(z)))
    
    return 1 - pValue // Return confidence level
  }

  private assignVariant(test: ABTest): ABTestVariant | null {
    const random = Math.random() * 100
    let cumulativeTraffic = 0

    for (const variant of test.variants) {
      cumulativeTraffic += variant.traffic
      if (random <= cumulativeTraffic) {
        return variant
      }
    }

    return null
  }

  private getTotalParticipants(test: ABTest): number {
    // This would typically come from the database
    // For now, return a mock value
    return 1000
  }

  private normalCDF(x: number): number {
    // Approximation of the cumulative distribution function for standard normal distribution
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)))
  }

  private erf(x: number): number {
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

  private loadActiveTests(): void {
    try {
      const stored = localStorage.getItem('ab_tests')
      if (stored) {
        const tests: ABTest[] = JSON.parse(stored)
        tests.forEach(test => {
          this.activeTests.set(test.id, test)
        })
      }
    } catch (error) {
      console.warn('Failed to load A/B tests from localStorage:', error)
    }
  }

  private loadUserVariants(): void {
    try {
      const stored = localStorage.getItem('ab_user_variants')
      if (stored) {
        const variants: Record<string, string> = JSON.parse(stored)
        Object.entries(variants).forEach(([testId, variantId]) => {
          this.userVariants.set(testId, variantId)
        })
      }
    } catch (error) {
      console.warn('Failed to load user variants from localStorage:', error)
    }
  }

  private saveUserVariants(): void {
    try {
      const variants: Record<string, string> = {}
      this.userVariants.forEach((variantId, testId) => {
        variants[testId] = variantId
      })
      localStorage.setItem('ab_user_variants', JSON.stringify(variants))
    } catch (error) {
      console.warn('Failed to save user variants to localStorage:', error)
    }
  }
}

// Singleton instance
let abTestingInstance: ABTestingService | null = null

export function getABTesting(): ABTestingService {
  if (!abTestingInstance) {
    abTestingInstance = new ABTestingService()
  }
  return abTestingInstance
}

export { ABTestingService }