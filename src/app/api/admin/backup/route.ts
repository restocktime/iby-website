import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all data to backup
    const [projectsRes, metricsRes, analyticsRes] = await Promise.all([
      fetch(`${process.env.NEXTAUTH_URL}/api/admin/projects`, {
        headers: { 'Cookie': request.headers.get('cookie') || '' }
      }),
      fetch(`${process.env.NEXTAUTH_URL}/api/admin/metrics`, {
        headers: { 'Cookie': request.headers.get('cookie') || '' }
      }),
      fetch(`${process.env.NEXTAUTH_URL}/api/admin/analytics?range=30d`, {
        headers: { 'Cookie': request.headers.get('cookie') || '' }
      })
    ])

    const projects = projectsRes.ok ? await projectsRes.json() : []
    const metrics = metricsRes.ok ? await metricsRes.json() : []
    const analytics = analyticsRes.ok ? await analyticsRes.json() : null

    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      projects,
      metrics,
      analytics,
      metadata: {
        totalProjects: projects.length,
        totalMetrics: metrics.length,
        backupSize: JSON.stringify({ projects, metrics, analytics }).length
      }
    }

    return NextResponse.json(backup)
  } catch (error) {
    console.error('Failed to create backup:', error)
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 })
  }
}