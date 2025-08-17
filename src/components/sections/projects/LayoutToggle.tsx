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
    <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl p-1 shadow-lg border border-slate-200 dark:border-slate-700">
      {layouts.map(({ id, icon: Icon, label }) => (
        <motion.button
          key={id}
          onClick={() => onLayoutChange(id)}
          className={`
            relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
            ${currentLayout === id
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {currentLayout === id && (
            <motion.div
              layoutId="activeLayout"
              className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
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