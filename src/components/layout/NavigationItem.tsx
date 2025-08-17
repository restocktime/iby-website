'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NavigationItemProps {
  label: string
  href: string
  isActive: boolean
  isScrolled: boolean
  onClick: () => void
  className?: string
}

export default function NavigationItem({
  label,
  href,
  isActive,
  isScrolled,
  onClick,
  className
}: NavigationItemProps) {
  const baseClasses = 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
  
  const getItemClasses = () => {
    if (isActive) {
      return 'text-blue-600 bg-blue-50/80 backdrop-blur-sm'
    }
    
    if (isScrolled) {
      return 'text-neutral-700 hover:text-blue-600 hover:bg-blue-50/50'
    }
    
    return 'text-white/90 hover:text-white hover:bg-white/10'
  }

  return (
    <motion.button
      onClick={onClick}
      className={cn(baseClasses, getItemClasses(), className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      role="menuitem"
      aria-current={isActive ? 'page' : undefined}
      aria-label={`Navigate to ${label} section`}
    >
      {/* Content */}
      <span className="relative z-10">{label}</span>
      
      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-1/2 w-1 h-1 bg-blue-600 rounded-full"
          layoutId="activeIndicator"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ x: '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-blue-100 rounded-lg pointer-events-none"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 2, opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.4 }}
      />
    </motion.button>
  )
}