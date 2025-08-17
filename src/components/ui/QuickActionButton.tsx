'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface QuickActionButtonProps {
  children: ReactNode
  onClick: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'accent' | 'glass'
  tooltip?: string
}

export default function QuickActionButton({
  children,
  onClick,
  className,
  size = 'md',
  variant = 'primary',
  tooltip
}: QuickActionButtonProps) {
  const sizeClasses = {
    sm: 'w-11 h-11 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-16 h-16 text-lg'
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl border border-blue-500/20',
    secondary: 'bg-white/90 hover:bg-white text-neutral-700 shadow-xl hover:shadow-2xl border border-neutral-200/50 backdrop-blur-md',
    accent: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl border border-purple-500/20',
    glass: 'bg-white/10 hover:bg-white/20 text-white shadow-xl hover:shadow-2xl border border-white/20 backdrop-blur-xl'
  }

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'fixed z-40 rounded-2xl flex items-center justify-center transition-all duration-300 group',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, type: 'spring', stiffness: 200 }}
      title={tooltip}
    >
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-2xl"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 2, opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.4 }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: variant === 'primary' 
            ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))'
            : variant === 'accent'
            ? 'linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3))'
            : 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(8px)'
        }}
      />
      
      <span className="relative z-10 group-hover:scale-110 transition-transform duration-200">
        {children}
      </span>
    </motion.button>
  )
}