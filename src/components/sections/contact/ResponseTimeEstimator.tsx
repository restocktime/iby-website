'use client'

import { motion } from 'framer-motion'
import { ClockIcon, BoltIcon, StarIcon } from '@heroicons/react/24/outline'

interface ResponseTimeEstimatorProps {
  selectedMethod: string | null
  engagementScore: number
}

export function ResponseTimeEstimator({ selectedMethod, engagementScore }: ResponseTimeEstimatorProps) {
  const getResponseTimeData = () => {
    const isPriorityUser = engagementScore > 70
    
    const baseResponseTimes = {
      email: { min: 2, max: 4, unit: 'hours' },
      whatsapp: { min: 15, max: 30, unit: 'minutes' },
      discord: { min: 1, max: 2, unit: 'hours' },
      default: { min: 2, max: 6, unit: 'hours' }
    }

    const method = selectedMethod || 'default'
    const baseTime = baseResponseTimes[method as keyof typeof baseResponseTimes] || baseResponseTimes.default

    // Adjust for priority users
    if (isPriorityUser) {
      return {
        ...baseTime,
        min: Math.ceil(baseTime.min / 2),
        max: Math.ceil(baseTime.max / 2),
        isPriority: true
      }
    }

    return { ...baseTime, isPriority: false }
  }

  const responseData = getResponseTimeData()
  const isHighEngagement = engagementScore > 70
  const isMediumEngagement = engagementScore > 40

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
        <ClockIcon className="h-5 w-5" />
        <span>Response Time Estimate</span>
      </h4>

      <div className="grid gap-4">
        {/* Current Estimate */}
        <div className={`
          p-4 rounded-lg border
          ${responseData.isPriority 
            ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-400/30' 
            : 'bg-white/5 border-white/10'
          }
        `}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {responseData.isPriority && <StarIcon className="h-4 w-4 text-yellow-400" />}
              <span className="text-white font-medium">
                {selectedMethod ? selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1) : 'Standard'}
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                {responseData.min}-{responseData.max} {responseData.unit}
              </div>
              {responseData.isPriority && (
                <div className="text-xs text-yellow-400">Priority Response</div>
              )}
            </div>
          </div>
          
          {responseData.isPriority && (
            <div className="text-sm text-purple-200">
              Faster response due to your high engagement level
            </div>
          )}
        </div>

        {/* Engagement Score Impact */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300 text-sm">Your Engagement Score</span>
            <div className="flex items-center space-x-2">
              <div className="text-white font-semibold">{engagementScore}/100</div>
              {isHighEngagement && <BoltIcon className="h-4 w-4 text-yellow-400" />}
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${engagementScore}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-2 rounded-full ${
                isHighEngagement 
                  ? 'bg-gradient-to-r from-green-400 to-yellow-400'
                  : isMediumEngagement
                  ? 'bg-gradient-to-r from-blue-400 to-green-400'
                  : 'bg-gradient-to-r from-gray-400 to-blue-400'
              }`}
            />
          </div>
          
          <div className="text-xs text-gray-400">
            {isHighEngagement 
              ? 'High engagement - Priority response times'
              : isMediumEngagement
              ? 'Good engagement - Standard response times'
              : 'Building engagement - Standard response times'
            }
          </div>
        </div>

        {/* Response Time Breakdown */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-green-400 font-semibold">Email</div>
            <div className="text-gray-300">
              {engagementScore > 70 ? '1-2h' : '2-4h'}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-blue-400 font-semibold">WhatsApp</div>
            <div className="text-gray-300">
              {engagementScore > 70 ? '5-15m' : '15-30m'}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-purple-400 font-semibold">Discord</div>
            <div className="text-gray-300">
              {engagementScore > 70 ? '30m-1h' : '1-2h'}
            </div>
          </div>
        </div>

        {/* Tips for faster response */}
        {!isHighEngagement && (
          <div className="bg-blue-600/10 border border-blue-400/20 rounded-lg p-3">
            <div className="text-blue-300 text-sm font-medium mb-1">
              💡 Get faster responses by:
            </div>
            <ul className="text-blue-200 text-xs space-y-1">
              <li>• Exploring more sections of the portfolio</li>
              <li>• Interacting with project demos</li>
              <li>• Providing detailed project requirements</li>
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  )
}