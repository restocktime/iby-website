import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface MetricConfig {
  id: string
  name: string
  value: number | string
  type: 'number' | 'percentage' | 'text'
  category: 'business' | 'technical' | 'engagement'
  description: string
}

// Mock metrics data - in production this would be stored in a database
const metrics: MetricConfig[] = [
  {
    id: 'sunday-edge-accuracy',
    name: 'Sunday Edge Pro Accuracy',
    value: 89.3,
    type: 'percentage',
    category: 'business',
    description: 'Prediction accuracy for Sunday Edge Pro sports betting platform'
  },
  {
    id: 'total-predictions',
    name: 'Total Predictions Made',
    value: 847,
    type: 'number',
    category: 'business',
    description: 'Total number of predictions made across all platforms'
  },
  {
    id: 'active-scrapers',
    name: 'Active Scrapers',
    value: 12,
    type: 'number',
    category: 'technical',
    description: 'Number of currently active web scrapers and monitors'
  },
  {
    id: 'client-satisfaction',
    name: 'Client Satisfaction',
    value: 98.5,
    type: 'percentage',
    category: 'engagement',
    description: 'Average client satisfaction rating across all projects'
  },
  {
    id: 'project-completion-rate',
    name: 'Project Completion Rate',
    value: 100,
    type: 'percentage',
    category: 'business',
    description: 'Percentage of projects completed on time and within budget'
  }
]

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const metricData = await request.json()
    const { id } = await params
    const metricIndex = metrics.findIndex(m => m.id === id)

    if (metricIndex === -1) {
      return NextResponse.json({ error: 'Metric not found' }, { status: 404 })
    }

    metrics[metricIndex] = {
      ...metrics[metricIndex],
      ...metricData,
    }

    return NextResponse.json(metrics[metricIndex])
  } catch (error) {
    console.error('Failed to update metric:', error)
    return NextResponse.json({ error: 'Failed to update metric' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const metricIndex = metrics.findIndex(m => m.id === id)

    if (metricIndex === -1) {
      return NextResponse.json({ error: 'Metric not found' }, { status: 404 })
    }

    metrics.splice(metricIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete metric:', error)
    return NextResponse.json({ error: 'Failed to delete metric' }, { status: 500 })
  }
}