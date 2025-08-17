'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { ProjectManager } from '@/components/admin/ProjectManager'
import { MetricsManager } from '@/components/admin/MetricsManager'
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard'
import { BackupRestore } from '@/components/admin/BackupRestore'

type TabType = 'projects' | 'metrics' | 'analytics' | 'backup'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('projects')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/admin/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const tabs = [
    { id: 'projects' as TabType, label: 'Projects', icon: '📁' },
    { id: 'metrics' as TabType, label: 'Metrics', icon: '📊' },
    { id: 'analytics' as TabType, label: 'Analytics', icon: '📈' },
    { id: 'backup' as TabType, label: 'Backup', icon: '💾' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session.user.name}</p>
            </div>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
            >
              View Site
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'projects' && <ProjectManager />}
            {activeTab === 'metrics' && <MetricsManager />}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'backup' && <BackupRestore />}
          </div>
        </div>
      </div>
    </div>
  )
}