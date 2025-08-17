'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface QuickActionButtonProps {
  children: ReactNode
  onClick: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'accent'
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
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-14 h-14 text-lg'
  }

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white hover:bg-neutral-50 text-neutral-700 shadow-lg hover:shadow-xl border border-neutral-200',
    accent: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
  }

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'fixed z-40 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      title={tooltip}
    >
      {children}
    </motion.button>
  )
}