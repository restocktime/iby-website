'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface BackupData {
  timestamp: string
  projects: any[]
  metrics: any[]
  analytics: any
  version: string
}

export function BackupRestore() {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [backupHistory, setBackupHistory] = useState<BackupData[]>([])

  const createBackup = async () => {
    setIsCreatingBackup(true)
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
      })

      if (response.ok) {
        const backup = await response.json()
        
        // Download the backup file
        const blob = new Blob([JSON.stringify(backup, null, 2)], {
          type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        alert('Backup created and downloaded successfully!')
      }
    } catch (error) {
      console.error('Failed to create backup:', error)
      alert('Failed to create backup')
    } finally {
      setIsCreatingBackup(false)
    }
  }

  const handleFileRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsRestoring(true)
    try {
      const text = await file.text()
      const backupData = JSON.parse(text)

      // Validate backup structure
      if (!backupData.projects || !backupData.metrics || !backupData.timestamp) {
        throw new Error('Invalid backup file format')
      }

      const response = await fetch('/api/admin/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backupData),
      })

      if (response.ok) {
        alert('Data restored successfully! Please refresh the page.')
        window.location.reload()
      } else {
        throw new Error('Failed to restore data')
      }
    } catch (error) {
      console.error('Failed to restore backup:', error)
      alert('Failed to restore backup. Please check the file format.')
    } finally {
      setIsRestoring(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const exportAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/export/analytics')
      if (response.ok) {
        const data = await response.json()
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to export analytics:', error)
      alert('Failed to export analytics')
    }
  }

  const exportProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects')
      if (response.ok) {
        const projects = await response.json()
        
        const blob = new Blob([JSON.stringify(projects, null, 2)], {
          type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `projects-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to export projects:', error)
      alert('Failed to export projects')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Backup & Restore</h2>
        <p className="text-gray-600">
          Create backups of your content and restore from previous backups
        </p>
      </div>

      {/* Backup Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Create Backup</h3>
        <p className="text-gray-600 mb-4">
          Create a complete backup of all your projects, metrics, and configuration data.
        </p>
        
        <div className="flex space-x-4">
          <Button
            onClick={createBackup}
            disabled={isCreatingBackup}
            className="flex items-center space-x-2"
          >
            {isCreatingBackup ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating Backup...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Create Full Backup</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Restore Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Restore from Backup</h3>
        <p className="text-gray-600 mb-4">
          Upload a backup file to restore your data. This will overwrite all current data.
        </p>
        
        <div className="flex items-center space-x-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleFileRestore}
              disabled={isRestoring}
              className="hidden"
            />
            <span className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none min-h-[44px] min-w-[44px] relative border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 active:bg-blue-100 h-10 px-4 py-2 text-sm cursor-pointer"
            >
              {isRestoring ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  <span>Restoring...</span>
                </>
              ) : (
                <>
                  <span>📁</span>
                  <span>Choose Backup File</span>
                </>
              )}
            </span>
          </label>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Warning
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Restoring from a backup will overwrite all current data including projects, 
                  metrics, and configuration. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Individual Data */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Export Individual Data</h3>
        <p className="text-gray-600 mb-4">
          Export specific data types for analysis or partial backups.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={exportProjects}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <span>📁</span>
            <span>Export Projects</span>
          </Button>
          
          <Button
            onClick={exportAnalytics}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <span>📊</span>
            <span>Export Analytics</span>
          </Button>
          
          <Button
            onClick={() => {
              fetch('/api/admin/metrics')
                .then(res => res.json())
                .then(data => {
                  const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: 'application/json',
                  })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `metrics-export-${new Date().toISOString().split('T')[0]}.json`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                })
            }}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <span>📈</span>
            <span>Export Metrics</span>
          </Button>
        </div>
      </div>

      {/* Backup Best Practices */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Backup Best Practices</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Create regular backups before making significant changes</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Store backup files in a secure location outside of this system</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Test restore functionality periodically to ensure backups are valid</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Keep multiple backup versions for different time periods</span>
          </li>
        </ul>
      </div>
    </div>
  )
}