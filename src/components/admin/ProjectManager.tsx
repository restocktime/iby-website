'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { ProjectForm } from './ProjectForm'
import { Project } from '@/types'

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProject = async (projectData: Partial<Project>) => {
    try {
      const url = selectedProject 
        ? `/api/admin/projects/${selectedProject.id}`
        : '/api/admin/projects'
      
      const method = selectedProject ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        await fetchProjects()
        setIsFormOpen(false)
        setSelectedProject(null)
      }
    } catch (error) {
      console.error('Failed to save project:', error)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchProjects()
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const openEditForm = (project: Project) => {
    setSelectedProject(project)
    setIsFormOpen(true)
  }

  const openCreateForm = () => {
    setSelectedProject(null)
    setIsFormOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
        <Button onClick={openCreateForm}>
          Add New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="bg-gray-50 rounded-lg p-6 border">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                project.status === 'active' ? 'bg-green-100 text-green-800' :
                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {project.status}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {project.technologies.slice(0, 3).map((tech) => (
                <span key={tech.name} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                  {tech.name}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{project.technologies.length - 3} more
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openEditForm(project)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeleteProject(project.id)}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No projects found</p>
          <Button onClick={openCreateForm}>
            Create Your First Project
          </Button>
        </div>
      )}

      {isFormOpen && (
        <ProjectForm
          project={selectedProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setIsFormOpen(false)
            setSelectedProject(null)
          }}
        />
      )}
    </div>
  )
}