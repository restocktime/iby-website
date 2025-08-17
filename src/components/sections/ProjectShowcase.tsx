'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Project, ProjectCategory } from '@/types'
import { ProjectGrid } from './projects/ProjectGrid'
import { ProjectTimeline } from './projects/ProjectTimeline'
import { ProjectNetwork } from './projects/ProjectNetwork'
import { ProjectFilters } from './projects/ProjectFilters'
import { ProjectDetailModal } from './projects/ProjectDetailModal'
import { LayoutToggle } from './projects/LayoutToggle'

export type LayoutMode = 'grid' | 'timeline' | 'network'

interface ProjectShowcaseProps {
  projects: Project[]
}

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid')
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all')
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter projects based on selected criteria
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Category filter
      if (selectedCategory !== 'all' && project.category !== selectedCategory) {
        return false
      }

      // Technology filter
      if (selectedTechnologies.length > 0) {
        const projectTechNames = project.technologies.map(tech => tech.name.toLowerCase())
        const hasSelectedTech = selectedTechnologies.some(tech => 
          projectTechNames.includes(tech.toLowerCase())
        )
        if (!hasSelectedTech) return false
      }

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = project.title.toLowerCase().includes(query)
        const matchesDescription = project.description.toLowerCase().includes(query)
        const matchesTech = project.technologies.some(tech => 
          tech.name.toLowerCase().includes(query)
        )
        if (!matchesTitle && !matchesDescription && !matchesTech) {
          return false
        }
      }

      return true
    })
  }, [projects, selectedCategory, selectedTechnologies, searchQuery])

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
  }

  const handleCloseModal = () => {
    setSelectedProject(null)
  }

  const renderProjectLayout = () => {
    const commonProps = {
      projects: filteredProjects,
      onProjectClick: handleProjectClick
    }

    switch (layoutMode) {
      case 'grid':
        return <ProjectGrid {...commonProps} />
      case 'timeline':
        return <ProjectTimeline {...commonProps} />
      case 'network':
        return <ProjectNetwork {...commonProps} />
      default:
        return <ProjectGrid {...commonProps} />
    }
  }

  return (
    <section 
      id="projects"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800"
      role="region"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 id="projects-heading" className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Live Project Showcase
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Explore real, working projects with live demos, interactive previews, and detailed technical insights
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 space-y-6"
          role="toolbar"
          aria-label="Project showcase controls"
        >
          {/* Layout Toggle */}
          <div className="flex justify-center">
            <LayoutToggle
              currentLayout={layoutMode}
              onLayoutChange={setLayoutMode}
            />
          </div>

          {/* Filters */}
          <ProjectFilters
            projects={projects}
            selectedCategory={selectedCategory}
            selectedTechnologies={selectedTechnologies}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onTechnologiesChange={setSelectedTechnologies}
            onSearchChange={setSearchQuery}
          />
        </motion.div>

        {/* Project Layout */}
        <motion.div
          key={layoutMode}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-[600px]"
          role="main"
          aria-live="polite"
          aria-label={`Projects displayed in ${layoutMode} layout. Showing ${filteredProjects.length} of ${projects.length} projects.`}
        >
          {filteredProjects.length > 0 ? (
            renderProjectLayout()
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
              role="status"
              aria-live="polite"
            >
              <div className="text-6xl mb-4" role="img" aria-label="Search icon">🔍</div>
              <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No projects found
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Try adjusting your filters or search query
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectDetailModal
              project={selectedProject}
              onClose={handleCloseModal}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}