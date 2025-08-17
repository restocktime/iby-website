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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Failed to fetch metrics:', error)
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const metricData = await request.json()
    
    const newMetric: MetricConfig = {
      id: `metric-${Date.now()}`,
      ...metricData
    }

    metrics.push(newMetric)

    return NextResponse.json(newMetric, { status: 201 })
  } catch (error) {
    console.error('Failed to create metric:', error)
    return NextResponse.json({ error: 'Failed to create metric' }, { status: 500 })
  }
}