'use client'

import { motion } from 'framer-motion'
import { ClockIcon, StarIcon } from '@heroicons/react/24/outline'

interface ContactMethod {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  action: string
  responseTime: string
  availability: string
  priority: string
}

interface ContactMethodCardProps {
  method: ContactMethod
  onSelect: () => void
  isSelected: boolean
  isPriority: boolean
}

export function ContactMethodCard({ 
  method, 
  onSelect, 
  isSelected, 
  isPriority 
}: ContactMethodCardProps) {
  const Icon = method.icon

  const handleDirectContact = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    switch (method.id) {
      case 'email':
        const subject = encodeURIComponent('Project Inquiry - Portfolio Contact')
        const body = encodeURIComponent(`Hi Isaac,\n\nI'm interested in discussing a project with you.\n\nBest regards`)
        window.location.href = `mailto:${method.action}?subject=${subject}&body=${body}`
        break
      case 'whatsapp':
        const phoneNumber = method.action.replace(/[^0-9]/g, '')
        const message = encodeURIComponent('Hi Isaac! I found your portfolio and would like to discuss a project with you.')
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
        break
      case 'discord':
        // Try to open Discord app first, fallback to web
        const discordAppUrl = `discord://users/${method.action.replace('#', '')}`
        const discordWebUrl = `https://discord.com/users/${method.action.replace('#', '')}`
        
        // Try app first
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = discordAppUrl
        document.body.appendChild(iframe)
        
        // Fallback to web after short delay
        setTimeout(() => {
          document.body.removeChild(iframe)
          // Copy username and show instructions
          navigator.clipboard.writeText(method.action).then(() => {
            alert(`Discord username "${method.action}" copied to clipboard!\n\nYou can also try opening Discord web: ${discordWebUrl}`)
          }).catch(() => {
            alert(`Discord username: ${method.action}\n\nManually add me on Discord or visit: ${discordWebUrl}`)
          })
        }, 1000)
        break
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative p-6 rounded-xl border cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'bg-purple-600/20 border-purple-400/50 shadow-lg shadow-purple-500/20' 
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
        }
      `}
      onClick={onSelect}
    >
      {isPriority && method.priority === 'high' && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
            <StarIcon className="h-3 w-3" />
            <span>Priority</span>
          </div>
        </div>
      )}

      <div className="flex items-start space-x-4">
        <div className={`
          p-3 rounded-lg
          ${isSelected 
            ? 'bg-purple-500/30 text-purple-300' 
            : 'bg-white/10 text-white'
          }
        `}>
          <Icon className="h-6 w-6" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xl font-semibold text-white">{method.name}</h4>
            <div className="flex items-center space-x-2 text-base text-gray-400">
              <ClockIcon className="h-4 w-4" />
              <span>{method.responseTime}</span>
            </div>
          </div>

          <p className="text-gray-300 text-base mb-3 leading-relaxed">{method.description}</p>

          <div className="flex items-center justify-between">
            <div className="text-base">
              <span className="text-gray-400">Contact: </span>
              <span className="text-white font-mono">{method.action}</span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleDirectContact}
                className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                Direct Contact
              </button>
              <button
                onClick={onSelect}
                className={`
                  px-3 py-1 text-xs rounded-full transition-colors
                  ${isSelected
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300'
                  }
                `}
              >
                Use Form
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Availability indicator */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className={`
              w-2 h-2 rounded-full
              ${method.availability === 'always' ? 'bg-green-400' :
                method.availability === 'business-hours' ? 'bg-yellow-400' :
                'bg-gray-400'
              }
            `} />
            <span className="text-gray-400 capitalize">
              {method.availability.replace('-', ' ')}
            </span>
          </div>
          
          {isPriority && (
            <span className="text-yellow-400 font-medium">
              Priority Response
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}