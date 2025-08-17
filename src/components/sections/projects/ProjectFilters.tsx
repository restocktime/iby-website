'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { Project, ProjectCategory } from '@/types'

interface ProjectFiltersProps {
  projects: Project[]
  selectedCategory: ProjectCategory | 'all'
  selectedTechnologies: string[]
  searchQuery: string
  onCategoryChange: (category: ProjectCategory | 'all') => void
  onTechnologiesChange: (technologies: string[]) => void
  onSearchChange: (query: string) => void
}

const categoryLabels: Record<ProjectCategory | 'all', string> = {
  'all': 'All Projects',
  'web-development': 'Web Development',
  'automation': 'Automation',
  'crm': 'CRM Solutions',
  'analytics': 'Analytics',
  'e-commerce': 'E-commerce',
  'scraping': 'Web Scraping',
  'monitoring': 'Monitoring'
}

export function ProjectFilters({
  projects,
  selectedCategory,
  selectedTechnologies,
  searchQuery,
  onCategoryChange,
  onTechnologiesChange,
  onSearchChange
}: ProjectFiltersProps) {
  const [showTechFilter, setShowTechFilter] = useState(false)

  // Get all unique technologies from projects
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>()
    projects.forEach(project => {
      project.technologies.forEach(tech => {
        techSet.add(tech.name)
      })
    })
    return Array.from(techSet).sort()
  }, [projects])

  // Get categories that have projects
  const availableCategories = useMemo(() => {
    const categories = new Set<ProjectCategory>()
    projects.forEach(project => {
      categories.add(project.category)
    })
    return Array.from(categories).sort()
  }, [projects])

  const handleTechnologyToggle = (tech: string) => {
    if (selectedTechnologies.includes(tech)) {
      onTechnologiesChange(selectedTechnologies.filter(t => t !== tech))
    } else {
      onTechnologiesChange([...selectedTechnologies, tech])
    }
  }

  const clearAllFilters = () => {
    onCategoryChange('all')
    onTechnologiesChange([])
    onSearchChange('')
  }

  const hasActiveFilters = selectedCategory !== 'all' || selectedTechnologies.length > 0 || searchQuery

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/20 transition-all"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <motion.button
            onClick={() => onCategoryChange('all')}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/20 border border-white/20'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            All Projects
          </motion.button>
          
          {availableCategories.map(category => (
            <motion.button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/20 border border-white/20'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {categoryLabels[category]}
            </motion.button>
          ))}
        </div>

        {/* Technology Filter Toggle */}
        <motion.button
          onClick={() => setShowTechFilter(!showTechFilter)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Filter className="w-4 h-4" />
          <span>Technologies</span>
          {selectedTechnologies.length > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {selectedTechnologies.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${showTechFilter ? 'rotate-180' : ''}`} />
        </motion.button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <motion.button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </motion.button>
        )}
      </div>

      {/* Technology Filter Dropdown */}
      <AnimatePresence>
        {showTechFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 max-w-4xl mx-auto">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Filter by Technologies:
              </h4>
              <div className="flex flex-wrap gap-2">
                {allTechnologies.map(tech => (
                  <motion.button
                    key={tech}
                    onClick={() => handleTechnologyToggle(tech)}
                    className={`
                      px-3 py-1 rounded-lg text-sm font-medium transition-all
                      ${selectedTechnologies.includes(tech)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tech}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}