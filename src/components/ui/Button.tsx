'use client'

import { ReactNode, forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'size'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  className?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group'

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
    md: 'px-4 py-2 text-sm rounded-lg gap-2',
    lg: 'px-6 py-3 text-base rounded-lg gap-2',
    xl: 'px-8 py-4 text-lg rounded-xl gap-3'
  }

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500 border border-blue-600',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 shadow-md hover:shadow-lg focus:ring-neutral-500 border border-neutral-200',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm hover:shadow-md focus:ring-blue-500',
    ghost: 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-neutral-500',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500 border-0',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-lg hover:shadow-xl focus:ring-white/50'
  }

  return (
    <motion.button
      ref={ref}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 2, opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.4 }}
      />

      {/* Shimmer effect for gradient variant */}
      {variant === 'gradient' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-inherit">
        {isLoading ? (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          leftIcon
        )}
        {children}
        {rightIcon}
      </span>
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button