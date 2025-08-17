'use client'

import { motion } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const ScrollIndicator = () => {
  const handleScrollToNext = () => {
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 1 }}
      onClick={handleScrollToNext}
    >
      <motion.div
        className="flex flex-col items-center text-white/80 hover:text-white transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut'
          }}
          className="mb-2"
        >
          <ChevronDownIcon className="w-6 h-6" />
        </motion.div>
        
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 3, duration: 1 }}
        />
        
        <motion.span
          className="text-sm font-medium mt-2 tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
        >
          SCROLL
        </motion.span>
      </motion.div>
    </motion.div>
  )
}

export default ScrollIndicator