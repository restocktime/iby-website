import { NextRequest, NextResponse } from 'next/server'
import { ABTest, ABTestVariant } from '@/types/analytics'

// In-memory storage for demo purposes
const abTests = new Map<string, ABTest>()
const testParticipants = new Map<string, Map<string, string>>() // testId -> sessionId -> variantId

// Initialize with some sample tests
initializeSampleTests()

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const component = searchParams.get('component')

  try {
    let tests = Array.from(abTests.values())

    // Apply filters
    if (status) {
      tests = tests.filter(test => test.status === status)
    }

    if (component) {
      tests = tests.filter(test => test.component === component)
    }

    // Sort by start date (newest first)
    tests.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())

    return NextResponse.json({
      tests,
      total: tests.length,
      summary: {
        running: tests.filter(t => t.status === 'running').length,
        completed: tests.filter(t => t.status === 'completed').length,
        draft: tests.filter(t => t.status === 'draft').length,
        paused: tests.filter(t => t.status === 'paused').length
      }
    })

  } catch (error) {
    console.error('A/B tests fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const testData = await request.json()

    // Validate required fields
    if (!testData.name || !testData.component || !testData.variants) {
      return NextResponse.json(
        { error: 'Missing required fields: name, component, variants' },
        { status: 400 }
      )
    }

    // Validate variants
    if (!Array.isArray(testData.variants) || testData.variants.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 variants are required' },
        { status: 400 }
      )
    }

    // Validate traffic allocation
    const totalTraffic = testData.variants.reduce((sum: number, v: ABTestVariant) => sum + v.traffic, 0)
    if (Math.abs(totalTraffic - 100) > 0.01) {
      return NextResponse.json(
        { error: 'Variant traffic allocation must sum to 100%' },
        { status: 400 }
      )
    }

    const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newTest: ABTest = {
      id: testId,
      name: testData.name,
      description: testData.description || '',
      component: testData.component,
      startDate: new Date(testData.startDate || Date.now()),
      endDate: testData.endDate ? new Date(testData.endDate) : undefined,
      status: testData.status || 'draft',
      variants: testData.variants.map((v: any, index: number) => ({
        id: `variant_${index + 1}`,
        name: v.name,
        description: v.description || '',
        traffic: v.traffic,
        conversions: 0,
        conversionRate: 0,
        isControl: v.isControl || index === 0,
        isActive: true
      })),
      targetMetric: testData.targetMetric || 'conversion_rate',
      significance: 0,
      winner: undefined
    }

    abTests.set(testId, newTest)
    testParticipants.set(testId, new Map())

    return NextResponse.json({
      success: true,
      testId,
      test: newTest
    })

  } catch (error) {
    console.error('A/B test creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function initializeSampleTests() {
  const sampleTests: ABTest[] = [
    {
      id: 'test_hero_cta',
      name: 'Hero Section CTA Button',
      description: 'Testing different call-to-action button styles in the hero section',
      component: 'HeroSection',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      status: 'running',
      variants: [
        {
          id: 'variant_control',
          name: 'Original Button',
          description: 'Current blue gradient button',
          traffic: 50,
          conversions: 45,
          conversionRate: 4.5,
          isControl: true,
          isActive: true
        },
        {
          id: 'variant_orange',
          name: 'Orange Button',
          description: 'Orange solid color button',
          traffic: 50,
          conversions: 52,
          conversionRate: 5.2,
          isControl: false,
          isActive: true
        }
      ],
      targetMetric: 'click_through_rate',
      significance: 0.85
    },
    {
      id: 'test_contact_form',
      name: 'Contact Form Layout',
      description: 'Testing single column vs two column contact form layout',
      component: 'ContactForm',
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: 'completed',
      variants: [
        {
          id: 'variant_single',
          name: 'Single Column',
          description: 'Traditional single column form',
          traffic: 50,
          conversions: 78,
          conversionRate: 7.8,
          isControl: true,
          isActive: false
        },
        {
          id: 'variant_double',
          name: 'Two Column',
          description: 'Compact two column layout',
          traffic: 50,
          conversions: 89,
          conversionRate: 8.9,
          isControl: false,
          isActive: false
        }
      ],
      targetMetric: 'form_completion_rate',
      significance: 0.92,
      winner: 'variant_double'
    },
    {
      id: 'test_project_cards',
      name: 'Project Card Hover Effects',
      description: 'Testing different hover animations for project cards',
      component: 'ProjectCard',
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: 'running',
      variants: [
        {
          id: 'variant_scale',
          name: 'Scale Animation',
          description: 'Cards scale up on hover',
          traffic: 33.33,
          conversions: 23,
          conversionRate: 2.3,
          isControl: true,
          isActive: true
        },
        {
          id: 'variant_lift',
          name: 'Lift Animation',
          description: 'Cards lift with shadow on hover',
          traffic: 33.33,
          conversions: 28,
          conversionRate: 2.8,
          isControl: false,
          isActive: true
        },
        {
          id: 'variant_glow',
          name: 'Glow Effect',
          description: 'Cards get a glow border on hover',
          traffic: 33.34,
          conversions: 31,
          conversionRate: 3.1,
          isControl: false,
          isActive: true
        }
      ],
      targetMetric: 'project_click_rate',
      significance: 0.65
    }
  ]

  sampleTests.forEach(test => {
    abTests.set(test.id, test)
    testParticipants.set(test.id, new Map())
  })
}