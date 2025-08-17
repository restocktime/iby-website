'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion'
import Card from '@/components/ui/Card'

interface ProjectCard {
  id: string
  title: string
  description: string
  color: string
  position: { x: number; y: number }
}

interface FloatingCardProps {
  card: ProjectCard
  index: number
  mouseXSpring: MotionValue<number>
  mouseYSpring: MotionValue<number>
  isVisible: boolean
}

const FloatingCard = ({ card, index, mouseXSpring, mouseYSpring, isVisible }: FloatingCardProps) => {
  // Create individual transforms for each card
  const cardX = useTransform(
    mouseXSpring,
    [-100, 100],
    [-20 + index * 5, 20 - index * 5]
  )
  const cardY = useTransform(
    mouseYSpring,
    [-100, 100],
    [-15 + index * 3, 15 - index * 3]
  )

  return (
    <motion.div
      key={card.id}
      className="absolute pointer-events-auto"
      style={{
        left: `${card.position.x}%`,
        top: `${card.position.y}%`,
        x: cardX,
        y: cardY,
      }}
      initial={{ opacity: 0, scale: 0, rotate: -10 }}
      animate={isVisible ? { 
        opacity: 0.9, 
        scale: 1, 
        rotate: 0 
      } : {}}
      transition={{ 
        delay: index * 0.2 + 1.5,
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.1, 
        rotate: 5,
        opacity: 1,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="w-48 h-32 p-4 backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
        <div className={`w-full h-3 rounded-full bg-gradient-to-r ${card.color} mb-3`} />
        <h3 className="text-white font-semibold text-sm mb-1">
          {card.title}
        </h3>
        <p className="text-white/80 text-xs">
          {card.description}
        </p>
      </Card>
    </motion.div>
  )
}

const FloatingCards = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Smooth mouse following
  const springConfig = { damping: 25, stiffness: 150 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)

  const [isVisible, setIsVisible] = useState(false)

  const projectCards: ProjectCard[] = [
    {
      id: 'sunday-edge',
      title: 'Sunday Edge Pro',
      description: '89.3% prediction accuracy',
      color: 'from-blue-500 to-purple-600',
      position: { x: 15, y: 20 }
    },
    {
      id: 'restocktime',
      title: 'Restocktime',
      description: 'E-commerce automation',
      color: 'from-green-500 to-teal-600',
      position: { x: 75, y: 15 }
    },
    {
      id: 'shuk-online',
      title: 'Shuk Online',
      description: 'Marketplace platform',
      color: 'from-orange-500 to-red-600',
      position: { x: 20, y: 70 }
    },
    {
      id: 'automation',
      title: 'Automation Suite',
      description: 'Custom scrapers & monitors',
      color: 'from-purple-500 to-pink-600',
      position: { x: 80, y: 75 }
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        mouseX.set((e.clientX - centerX) * 0.1)
        mouseY.set((e.clientY - centerY) * 0.1)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-15"
    >
      {projectCards.map((card, index) => (
        <FloatingCard
          key={card.id}
          card={card}
          index={index}
          mouseXSpring={mouseXSpring}
          mouseYSpring={mouseYSpring}
          isVisible={isVisible}
        />
      ))}
    </div>
  )
}

export default FloatingCards