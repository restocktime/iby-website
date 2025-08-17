'use client'

import { motion } from 'framer-motion'
import { Project } from '@/types'
import { ProjectCard } from './ProjectCard'

interface ProjectGridProps {
  projects: Project[]
  onProjectClick: (project: Project) => void
}

export function ProjectGrid({ projects, onProjectClick }: ProjectGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
    >
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          variants={itemVariants}
          layout
          layoutId={`project-${project.id}`}
          className="h-full"
        >
          <ProjectCard
            project={project}
            onClick={() => onProjectClick(project)}
            index={index}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}