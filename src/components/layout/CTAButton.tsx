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
      className={`ml-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Get in touch - Navigate to contact section"
    >
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-xl pointer-events-none"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 2, opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.5 }}
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}