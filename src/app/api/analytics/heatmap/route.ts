import { NextRequest, NextResponse } from 'next/server'
import { HeatmapData } from '@/types/analytics'

// Mock heatmap data storage
const heatmapInteractions = new Map<string, any[]>()

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = searchParams.get('page') || '/'
  const element = searchParams.get('element')

  try {
    // Generate mock heatmap data based on common interaction patterns
    const mockHeatmapData: HeatmapData[] = [
      {
        element: 'hero-section',
        selector: '.hero-section',
        interactions: 450,
        heatLevel: 0.9,
        coordinates: [
          { x: 640, y: 300 },
          { x: 680, y: 320 },
          { x: 620, y: 280 },
          { x: 700, y: 340 }
        ],
        avgTimeSpent: 15.5,
        conversionRate: 0.12
      },
      {
        element: 'contact-button',
        selector: '.contact-button',
        interactions: 320,
        heatLevel: 0.85,
        coordinates: [
          { x: 200, y: 50 },
          { x: 210, y: 55 },
          { x: 195, y: 48 }
        ],
        avgTimeSpent: 2.3,
        conversionRate: 0.45
      },
      {
        element: 'project-card',
        selector: '.project-card',
        interactions: 280,
        heatLevel: 0.7,
        coordinates: [
          { x: 400, y: 600 },
          { x: 420, y: 620 },
          { x: 380, y: 580 },
          { x: 440, y: 640 }
        ],
        avgTimeSpent: 8.7,
        conversionRate: 0.25
      },
      {
        element: 'skills-visualization',
        selector: '.skills-section',
        interactions: 180,
        heatLevel: 0.6,
        coordinates: [
          { x: 500, y: 800 },
          { x: 520, y: 820 },
          { x: 480, y: 780 }
        ],
        avgTimeSpent: 12.1,
        conversionRate: 0.08
      },
      {
        element: 'navigation-menu',
        selector: '.navigation',
        interactions: 150,
        heatLevel: 0.5,
        coordinates: [
          { x: 100, y: 30 },
          { x: 150, y: 30 },
          { x: 200, y: 30 },
          { x: 250, y: 30 }
        ],
        avgTimeSpent: 1.8,
        conversionRate: 0.15
      },
      {
        element: 'footer-links',
        selector: '.footer',
        interactions: 95,
        heatLevel: 0.3,
        coordinates: [
          { x: 300, y: 1200 },
          { x: 400, y: 1200 },
          { x: 500, y: 1200 }
        ],
        avgTimeSpent: 3.2,
        conversionRate: 0.18
      }
    ]

    // Filter by element if specified
    let filteredData = mockHeatmapData
    if (element) {
      filteredData = mockHeatmapData.filter(item => 
        item.element === element || item.selector.includes(element)
      )
    }

    // Add some randomization to make data more realistic
    const enhancedData = filteredData.map(item => ({
      ...item,
      interactions: item.interactions + Math.floor(Math.random() * 50) - 25,
      heatLevel: Math.min(1, Math.max(0, item.heatLevel + (Math.random() * 0.2 - 0.1))),
      avgTimeSpent: item.avgTimeSpent + (Math.random() * 4 - 2),
      conversionRate: Math.min(1, Math.max(0, item.conversionRate + (Math.random() * 0.1 - 0.05)))
    }))

    return NextResponse.json({
      page,
      heatmapData: enhancedData,
      totalInteractions: enhancedData.reduce((sum, item) => sum + item.interactions, 0),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Heatmap data fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { page, element, coordinates, eventType } = await request.json()

    if (!page || !element || !coordinates) {
      return NextResponse.json(
        { error: 'Missing required fields: page, element, coordinates' },
        { status: 400 }
      )
    }

    // Store heatmap interaction
    const key = `${page}:${element}`
    if (!heatmapInteractions.has(key)) {
      heatmapInteractions.set(key, [])
    }

    const interactions = heatmapInteractions.get(key)!
    interactions.push({
      coordinates,
      eventType: eventType || 'click',
      timestamp: new Date(),
      userAgent: request.headers.get('user-agent')
    })

    // Keep only last 1000 interactions per element
    if (interactions.length > 1000) {
      interactions.splice(0, interactions.length - 1000)
    }

    return NextResponse.json({
      success: true,
      totalInteractions: interactions.length
    })

  } catch (error) {
    console.error('Heatmap interaction storage error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}