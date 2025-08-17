'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'

interface MetricConfig {
  id: string
  name: string
  value: number | string
  type: 'number' | 'percentage' | 'text'
  category: 'business' | 'technical' | 'engagement'
  description: string
}

export function MetricsManager() {
  const [metrics, setMetrics] = useState<MetricConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingMetric, setEditingMetric] = useState<MetricConfig | null>(null)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/metrics')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveMetric = async (metric: MetricConfig) => {
    try {
      const url = editingMetric ? `/api/admin/metrics/${metric.id}` : '/api/admin/metrics'
      const method = editingMetric ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      })

      if (response.ok) {
        await fetchMetrics()
        setEditingMetric(null)
      }
    } catch (error) {
      console.error('Failed to save metric:', error)
    }
  }

  const handleDeleteMetric = async (metricId: string) => {
    if (!confirm('Are you sure you want to delete this metric?')) return

    try {
      const response = await fetch(`/api/admin/metrics/${metricId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchMetrics()
      }
    } catch (error) {
      console.error('Failed to delete metric:', error)
    }
  }

  const refreshLiveMetrics = async () => {
    try {
      const response = await fetch('/api/admin/metrics/refresh', {
        method: 'POST',
      })

      if (response.ok) {
        await fetchMetrics()
        alert('Live metrics refreshed successfully!')
      }
    } catch (error) {
      console.error('Failed to refresh metrics:', error)
      alert('Failed to refresh metrics')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const categorizedMetrics = {
    business: metrics.filter(m => m.category === 'business'),
    technical: metrics.filter(m => m.category === 'technical'),
    engagement: metrics.filter(m => m.category === 'engagement')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Metrics Management</h2>
        <div className="flex space-x-4">
          <Button onClick={refreshLiveMetrics} variant="outline">
            Refresh Live Data
          </Button>
          <Button onClick={() => setEditingMetric({
            id: '',
            name: '',
            value: 0,
            type: 'number',
            category: 'business',
            description: ''
          })}>
            Add New Metric
          </Button>
        </div>
      </div>

      {Object.entries(categorizedMetrics).map(([category, categoryMetrics]) => (
        <div key={category} className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 capitalize">{category} Metrics</h3>
          
          {categoryMetrics.length === 0 ? (
            <p className="text-gray-500">No {category} metrics configured</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryMetrics.map((metric) => (
                <div key={metric.id} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{metric.name}</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingMetric(metric)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMetric(metric.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {metric.type === 'percentage' ? `${metric.value}%` : metric.value}
                  </div>
                  
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {editingMetric && (
        <MetricForm
          metric={editingMetric}
          onSave={handleSaveMetric}
          onCancel={() => setEditingMetric(null)}
        />
      )}
    </div>
  )
}

interface MetricFormProps {
  metric: MetricConfig
  onSave: (metric: MetricConfig) => void
  onCancel: () => void
}

function MetricForm({ metric, onSave, onCancel }: MetricFormProps) {
  const [formData, setFormData] = useState(metric)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: formData.id || `metric-${Date.now()}`
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {metric.id ? 'Edit Metric' : 'Add New Metric'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Metric Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              type={formData.type === 'text' ? 'text' : 'number'}
              required
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                value: formData.type === 'text' ? e.target.value : parseFloat(e.target.value) || 0
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as MetricConfig['type'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="number">Number</option>
              <option value="percentage">Percentage</option>
              <option value="text">Text</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as MetricConfig['category'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="business">Business</option>
              <option value="technical">Technical</option>
              <option value="engagement">Engagement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {metric.id ? 'Update Metric' : 'Create Metric'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}