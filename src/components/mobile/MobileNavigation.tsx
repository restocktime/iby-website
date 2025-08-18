'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bars3Icon, 
  XMarkIcon, 
  HomeIcon, 
  UserIcon, 
  BriefcaseIcon, 
  ChatBubbleLeftRightIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'
import { MobileGestureHandler, useHapticFeedback } from './MobileGestureHandler'

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: string
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: HomeIcon,
    href: '#hero',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'about',
    label: 'About',
    icon: UserIcon,
    href: '#about',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: BriefcaseIcon,
    href: '#projects',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: CogIcon,
    href: '#skills',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: ChatBubbleLeftRightIcon,
    href: '#contact',
    color: 'from-indigo-500 to-purple-500'
  }
]

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { isMobile } = useDeviceCapabilities()
  const { triggerHaptic } = useHapticFeedback()

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map(item => item.id)
      const scrollPosition = window.scrollY + 150 // Better offset for mobile

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop } = element
          if (scrollPosition >= offsetTop - 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    // Throttle scroll events for better performance
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', throttledHandleScroll)
  }, [])

  const handleNavClick = (href: string, id: string) => {
    triggerHaptic('light')
    setActiveSection(id)
    setIsOpen(false)
    
    // Smooth scroll to section with proper offset for mobile
    const element = document.querySelector(href)
    if (element) {
      const headerOffset = 80 // Account for mobile header height
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const toggleMenu = () => {
    triggerHaptic('medium')
    setIsOpen(!isOpen)
  }

  if (!isMobile) {
    return null
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-slate-900/80 backdrop-blur-lg border border-slate-700 rounded-full flex items-center justify-center shadow-lg"
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-white" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <MobileGestureHandler
            onSwipeUp={() => setIsOpen(false)}
            onSwipeRight={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-slate-900/95 backdrop-blur-xl border-l border-slate-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 pt-20">
                  {/* Profile Section */}
                  <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">IB</span>
                    </div>
                    <h3 className="text-white font-semibold">Isaac Benyakar</h3>
                    <p className="text-slate-400 text-sm">Full Stack Developer</p>
                  </div>

                  {/* Navigation Items */}
                  <nav className="space-y-2">
                    {navigationItems.map((item, index) => {
                      const Icon = item.icon
                      const isActive = activeSection === item.id
                      
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => handleNavClick(item.href, item.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                            isActive 
                              ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg' 
                              : 'text-slate-300 hover:text-white hover:bg-slate-800'
                          }`}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                          
                          {isActive && (
                            <motion.div
                              className="ml-auto w-2 h-2 bg-white rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 }}
                            />
                          )}
                        </motion.button>
                      )
                    })}
                  </nav>

                  {/* Quick Actions */}
                  <div className="mt-8 pt-6 border-t border-slate-700">
                    <p className="text-slate-400 text-sm mb-4">Quick Actions</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        onClick={() => {
                          triggerHaptic('light')
                          window.open('mailto:isaac@example.com', '_blank')
                        }}
                        className="p-3 bg-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm"
                        whileTap={{ scale: 0.95 }}
                      >
                        📧 Email
                      </motion.button>
                      
                      <motion.button
                        onClick={() => {
                          triggerHaptic('light')
                          window.open('https://wa.me/1234567890', '_blank')
                        }}
                        className="p-3 bg-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm"
                        whileTap={{ scale: 0.95 }}
                      >
                        💬 WhatsApp
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </MobileGestureHandler>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-around py-2">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.href, item.id)}
                className="flex flex-col items-center gap-1 p-2 min-w-0 flex-1"
                whileTap={{ scale: 0.9 }}
              >
                <div className={`p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r ' + item.color 
                    : 'text-slate-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}>
                  {item.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </>
  )
}