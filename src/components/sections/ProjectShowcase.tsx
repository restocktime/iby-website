'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Project, ProjectCategory } from '@/types'
import { ProjectGrid } from './projects/ProjectGrid'
import { ProjectTimeline } from './projects/ProjectTimeline'
import { ProjectNetwork } from './projects/ProjectNetwork'
import { ProjectFilters } from './projects/ProjectFilters'
import ProjectDetailModalEnhanced from './projects/ProjectDetailModalEnhanced'
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

    try {
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
    } catch (error) {
      console.error('Error rendering project layout:', error)
      // Fallback to simple grid
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
              onClick={() => handleProjectClick(project)}
            >
              <h3 className="text-xl font-heading font-bold text-white mb-2">{project.title}</h3>
              <p className="text-white/80 text-sm mb-4 font-body">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech.name}
                    className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }
  }

  return (
    <div className="w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 id="projects-heading" className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 tracking-tight">
            Live Project Showcase
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-body">
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
            {typeof LayoutToggle !== 'undefined' ? (
              <LayoutToggle
                currentLayout={layoutMode}
                onLayoutChange={setLayoutMode}
              />
            ) : (
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 shadow-lg border border-white/20">
                {(['grid', 'timeline', 'network'] as LayoutMode[]).map((layout) => (
                  <button
                    key={layout}
                    onClick={() => setLayoutMode(layout)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      layoutMode === layout
                        ? 'text-blue-400 bg-blue-500/20'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {layout.charAt(0).toUpperCase() + layout.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filters */}
          {typeof ProjectFilters !== 'undefined' ? (
            <ProjectFilters
              projects={projects}
              selectedCategory={selectedCategory}
              selectedTechnologies={selectedTechnologies}
              searchQuery={searchQuery}
              onCategoryChange={setSelectedCategory}
              onTechnologiesChange={setSelectedTechnologies}
              onSearchChange={setSearchQuery}
            />
          ) : (
            <div className="flex justify-center">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}
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
              <h3 className="text-2xl font-heading font-semibold text-white mb-2">
                No projects found
              </h3>
              <p className="text-white/70">
                Try adjusting your filters or search query
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectDetailModalEnhanced
              project={selectedProject}
              onClose={handleCloseModal}
            />
          )}
        </AnimatePresence>
    </div>
  )
}