import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch analytics data for different time ranges
    const ranges = ['1d', '7d', '30d', '90d']
    const analyticsData: Record<string, any> = {}

    for (const range of ranges) {
      try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/analytics?range=${range}`, {
          headers: { 'Cookie': request.headers.get('cookie') || '' }
        })
        if (response.ok) {
          analyticsData[range] = await response.json()
        }
      } catch (error) {
        console.error(`Failed to fetch analytics for range ${range}:`, error)
      }
    }

    const exportData = {
      exportTimestamp: new Date().toISOString(),
      exportType: 'analytics',
      data: analyticsData,
      metadata: {
        ranges: ranges,
        totalRanges: Object.keys(analyticsData).length
      }
    }

    return NextResponse.json(exportData)
  } catch (error) {
    console.error('Failed to export analytics:', error)
    return NextResponse.json({ error: 'Failed to export analytics' }, { status: 500 })
  }
}