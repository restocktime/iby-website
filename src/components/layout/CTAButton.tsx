'use client'

import { motion } from 'framer-motion'

interface CTAButtonProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
}

export default function CTAButton({ onClick, children, className = '' }: CTAButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-6 py-3 font-semibold text-white rounded-2xl transition-all duration-300 group focus:outline-none overflow-hidden ${className}`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Get in touch - Navigate to contact section"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          backgroundSize: '200% 100%'
        }}
      />
      
      {/* Glassmorphism overlay */}
      <motion.div
        className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
        whileHover={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)'
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
        initial={false}
        whileHover={{
          background: [
            'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
            'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)'
          ],
          x: ['-100%', '100%']
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-2xl pointer-events-none"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 2, opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.5 }}
      />
      
      <span className="relative z-10 font-medium">{children}</span>
    </motion.button>
  )
}