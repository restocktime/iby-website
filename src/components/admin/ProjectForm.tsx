'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { Project, Technology } from '@/types'
import { ImageUpload } from './ImageUpload'

interface ProjectFormProps {
  project: Project | null
  onSave: (project: Partial<Project>) => void
  onCancel: () => void
}

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    liveUrl: '',
    technologies: [] as Technology[],
    status: 'active' as Project['status'],
    screenshots: [] as string[],
    metrics: {
      performanceScore: 0,
      userEngagement: {
        averageSessionDuration: 0,
        bounceRate: 0,
        conversionRate: 0,
        monthlyActiveUsers: 0
      },
      businessImpact: {
        revenueImpact: 0,
        costSavings: 0,
        efficiencyGain: 0,
        userSatisfactionScore: 0
      },
      technicalComplexity: 0
    }
  })

  const [newTechnology, setNewTechnology] = useState({ name: '', category: 'frontend' as Technology['category'], proficiency: 0, yearsOfExperience: 0 })

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        liveUrl: project.liveUrl || '',
        technologies: project.technologies,
        status: project.status,
        screenshots: project.screenshots?.map(s => s.url) || [],
        metrics: project.metrics
      })
    }
  }, [project])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const projectData: Partial<Project> = {
      ...formData,
      screenshots: formData.screenshots.map((url, index) => ({
        id: `screenshot-${index}`,
        url,
        alt: `${formData.title} screenshot ${index + 1}`,
        type: 'image' as const
      }))
    }

    onSave(projectData)
  }

  const addTechnology = () => {
    if (newTechnology.name && newTechnology.category) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, { ...newTechnology }]
      }))
      setNewTechnology({ name: '', category: 'frontend' as Technology['category'], proficiency: 0, yearsOfExperience: 0 })
    }
  }

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-6">
          {project ? 'Edit Project' : 'Create New Project'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Live URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Project['status'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technologies
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Technology name"
                  value={newTechnology.name}
                  onChange={(e) => setNewTechnology(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={newTechnology.category}
                  onChange={(e) => setNewTechnology(prev => ({ ...prev, category: e.target.value as Technology['category'] }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="tool">Tool</option>
                  <option value="cloud">Cloud</option>
                </select>
                <input
                  type="number"
                  placeholder="Proficiency (0-100)"
                  min="0"
                  max="100"
                  value={newTechnology.proficiency}
                  onChange={(e) => setNewTechnology(prev => ({ ...prev, proficiency: parseInt(e.target.value) || 0 }))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Years"
                  min="0"
                  max="20"
                  value={newTechnology.yearsOfExperience}
                  onChange={(e) => setNewTechnology(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Button type="button" onClick={addTechnology}>
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                  >
                    {tech.name} ({tech.category})
                    <button
                      type="button"
                      onClick={() => removeTechnology(index)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Screenshots
            </label>
            <ImageUpload
              images={formData.screenshots}
              onImagesChange={(images) => setFormData(prev => ({ ...prev, screenshots: images }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Performance Score (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.metrics.performanceScore}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metrics: { ...prev.metrics, performanceScore: parseInt(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technical Complexity (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.metrics.technicalComplexity}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metrics: { ...prev.metrics, technicalComplexity: parseInt(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {project ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}