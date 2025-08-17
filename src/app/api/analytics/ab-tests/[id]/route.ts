import { NextRequest, NextResponse } from 'next/server'
import { ABTest } from '@/types/analytics'

// This would typically connect to your database
// For demo purposes, we'll use the same in-memory storage
const abTests = new Map<string, ABTest>()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id
    const test = abTests.get(testId)

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }

    // Calculate additional metrics
    const totalParticipants = test.variants.reduce((sum, variant) => {
      return sum + Math.floor((variant.traffic / 100) * 1000) // Mock participant count
    }, 0)

    const enhancedTest = {
      ...test,
      totalParticipants,
      variants: test.variants.map(variant => {
        const participants = Math.floor((variant.traffic / 100) * 1000)
        return {
          ...variant,
          participants,
          conversionRate: participants > 0 ? (variant.conversions / participants) * 100 : 0
        }
      })
    }

    return NextResponse.json(enhancedTest)

  } catch (error) {
    console.error('A/B test fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id
    const updates = await request.json()
    
    const existingTest = abTests.get(testId)
    if (!existingTest) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }

    // Validate status transitions
    if (updates.status && !isValidStatusTransition(existingTest.status, updates.status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${existingTest.status} to ${updates.status}` },
        { status: 400 }
      )
    }

    const updatedTest: ABTest = {
      ...existingTest,
      ...updates,
      // Prevent changing certain fields after test is running
      id: existingTest.id,
      startDate: existingTest.startDate,
      variants: existingTest.status === 'running' ? existingTest.variants : (updates.variants || existingTest.variants)
    }

    abTests.set(testId, updatedTest)

    return NextResponse.json({
      success: true,
      test: updatedTest
    })

  } catch (error) {
    console.error('A/B test update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id
    const test = abTests.get(testId)

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }

    // Only allow deletion of draft or completed tests
    if (test.status === 'running') {
      return NextResponse.json(
        { error: 'Cannot delete running test. Pause or complete it first.' },
        { status: 400 }
      )
    }

    abTests.delete(testId)

    return NextResponse.json({
      success: true,
      message: 'Test deleted successfully'
    })

  } catch (error) {
    console.error('A/B test deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
  const validTransitions: Record<string, string[]> = {
    'draft': ['running', 'paused'],
    'running': ['paused', 'completed'],
    'paused': ['running', 'completed'],
    'completed': [] // No transitions from completed
  }

  return validTransitions[currentStatus]?.includes(newStatus) || false
}