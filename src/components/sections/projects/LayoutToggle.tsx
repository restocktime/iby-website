'use client'

import { motion } from 'framer-motion'
import { Grid3X3, Clock, Network } from 'lucide-react'
import { LayoutMode } from '../ProjectShowcase'

interface LayoutToggleProps {
  currentLayout: LayoutMode
  onLayoutChange: (layout: LayoutMode) => void
}

export function LayoutToggle({ currentLayout, onLayoutChange }: LayoutToggleProps) {
  const layouts = [
    { id: 'grid' as LayoutMode, icon: Grid3X3, label: 'Grid View' },
    { id: 'timeline' as LayoutMode, icon: Clock, label: 'Timeline View' },
    { id: 'network' as LayoutMode, icon: Network, label: 'Network View' }
  ]

  return (
    <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 shadow-lg border border-white/20">
      {layouts.map(({ id, icon: Icon, label }) => (
        <motion.button
          key={id}
          onClick={() => onLayoutChange(id)}
          className={`
            relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
            ${currentLayout === id
              ? 'text-blue-400'
              : 'text-white/80 hover:text-white'
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {currentLayout === id && (
            <motion.div
              layoutId="activeLayout"
              className="absolute inset-0 bg-blue-500/20 rounded-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Icon className="w-4 h-4 relative z-10" />
          <span className="relative z-10 hidden sm:inline">{label}</span>
        </motion.button>
      ))}
    </div>
  )
}