'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'

const TypewriterText = () => {
  const roles = useMemo(() => [
    'Full-Stack Developer',
    'Automation Specialist',
    'Web Scraping Expert',
    'Custom CRM Builder',
    'Business Solutions Architect',
    'Analytics Implementation Expert'
  ], [])

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const currentRole = roles[currentRoleIndex]
    
    const timeout = setTimeout(() => {
      if (isPaused) {
        setIsPaused(false)
        setIsDeleting(true)
        return
      }

      if (isDeleting) {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length)
        }
      } else {
        if (currentText.length < currentRole.length) {
          setCurrentText(currentRole.slice(0, currentText.length + 1))
        } else {
          setIsPaused(true)
        }
      }
    }, isDeleting ? 50 : isPaused ? 2000 : 100)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, isPaused, currentRoleIndex, roles])

  return (
    <div className="relative">
      <motion.span
        key={currentRoleIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="inline-block"
      >
        {currentText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-1 h-8 bg-white ml-1"
        />
      </motion.span>
    </div>
  )
}

export default TypewriterText