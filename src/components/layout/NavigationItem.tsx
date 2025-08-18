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
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative px-6 py-3 text-sm font-medium transition-all duration-300 group focus:outline-none',
        className
      )}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      role="menuitem"
      aria-current={isActive ? 'page' : undefined}
      aria-label={`Navigate to ${label} section`}
    >
      {/* Background with glassmorphism */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-2xl transition-all duration-300',
          isActive 
            ? 'bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl' 
            : 'bg-transparent border border-transparent group-hover:bg-white/10 group-hover:backdrop-blur-md group-hover:border-white/20'
        )}
        initial={false}
        animate={{
          scale: isActive ? 1 : 0.98,
          boxShadow: isActive 
            ? '0 8px 32px rgba(255, 255, 255, 0.1)' 
            : '0 0px 0px rgba(255, 255, 255, 0)'
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      
      {/* Content */}
      <span className={cn(
        'relative z-10 transition-all duration-300',
        isActive 
          ? 'text-white font-semibold' 
          : isScrolled 
            ? 'text-slate-700 group-hover:text-white' 
            : 'text-white/80 group-hover:text-white'
      )}>
        {label}
      </span>
      
      {/* Active indicator - flowing underline */}
      <motion.div
        className="absolute bottom-1 left-1/2 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
        initial={false}
        animate={{
          width: isActive ? '80%' : '0%',
          x: '-50%',
          opacity: isActive ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
        }}
      />
      
      {/* Subtle particle effect on hover */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100"
        initial={false}
        whileHover={{
          boxShadow: [
            '0 0 0 rgba(59, 130, 246, 0)',
            '0 0 20px rgba(59, 130, 246, 0.2)',
            '0 0 0 rgba(59, 130, 246, 0)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  )
}