'use client'

import { motion } from 'framer-motion'
import { 
  StarIcon, 
  BoltIcon, 
  ClockIcon,
  TrophyIcon,
  FireIcon
} from '@heroicons/react/24/outline'

interface ContactRecommendationsProps {
  engagementScore: number
  sectionsVisited: number
  timeSpent: number
}

export function ContactRecommendations({ 
  engagementScore, 
  sectionsVisited, 
  timeSpent 
}: ContactRecommendationsProps) {
  const getRecommendation = () => {
    if (engagementScore >= 80) {
      return {
        level: 'VIP',
        icon: TrophyIcon,
        color: 'from-yellow-400 to-orange-400',
        textColor: 'text-yellow-300',
        bgColor: 'bg-yellow-400/10 border-yellow-400/30',
        title: 'VIP Contact Access',
        description: 'Your exceptional engagement qualifies you for priority response and direct access.',
        benefits: [
          'Priority response within 15 minutes',
          'Direct WhatsApp access',
          'Dedicated project consultation',
          'Expedited project timeline'
        ],
        cta: 'Get Priority Contact'
      }
    } else if (engagementScore >= 60) {
      return {
        level: 'Priority',
        icon: StarIcon,
        color: 'from-purple-400 to-pink-400',
        textColor: 'text-purple-300',
        bgColor: 'bg-purple-400/10 border-purple-400/30',
        title: 'Priority Contact Status',
        description: 'Your high engagement earns you faster response times and premium support.',
        benefits: [
          'Response within 30 minutes',
          'Multiple contact channels',
          'Detailed project discussion',
          'Custom solution recommendations'
        ],
        cta: 'Contact Now'
      }
    } else if (engagementScore >= 40) {
      return {
        level: 'Standard Plus',
        icon: BoltIcon,
        color: 'from-blue-400 to-cyan-400',
        textColor: 'text-blue-300',
        bgColor: 'bg-blue-400/10 border-blue-400/30',
        title: 'Enhanced Contact Access',
        description: 'Your engagement shows serious interest. Get enhanced response times.',
        benefits: [
          'Response within 2 hours',
          'Preferred contact method',
          'Project scope discussion',
          'Timeline planning'
        ],
        cta: 'Start Conversation'
      }
    } else {
      return {
        level: 'Standard',
        icon: ClockIcon,
        color: 'from-gray-400 to-slate-400',
        textColor: 'text-gray-300',
        bgColor: 'bg-gray-400/10 border-gray-400/30',
        title: 'Standard Contact',
        description: 'Explore more of the portfolio to unlock faster response times.',
        benefits: [
          'Response within 4-6 hours',
          'Email contact available',
          'Project inquiry form',
          'Initial consultation'
        ],
        cta: 'Send Inquiry'
      }
    }
  }

  const recommendation = getRecommendation()
  const Icon = recommendation.icon

  const getEngagementTips = () => {
    if (engagementScore < 40) {
      return [
        'View live project demos',
        'Explore the skills section',
        'Check out automation tools',
        'Read case studies'
      ]
    }
    return []
  }

  const tips = getEngagementTips()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-6 ${recommendation.bgColor}`}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${recommendation.color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-white">{recommendation.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${recommendation.color} text-white`}>
              {recommendation.level}
            </span>
          </div>
          
          <p className={`text-sm mb-4 ${recommendation.textColor}`}>
            {recommendation.description}
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-white font-medium text-sm mb-2">Your Benefits:</h4>
              <ul className="space-y-1">
                {recommendation.benefits.map((benefit, index) => (
                  <li key={index} className={`text-xs ${recommendation.textColor} flex items-center space-x-2`}>
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${recommendation.color}`} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium text-sm mb-2">Your Stats:</h4>
              <div className="space-y-1 text-xs text-gray-300">
                <div>Engagement Score: <span className="text-white font-medium">{engagementScore}/100</span></div>
                <div>Sections Visited: <span className="text-white font-medium">{sectionsVisited}/6</span></div>
                <div>Time Spent: <span className="text-white font-medium">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</span></div>
              </div>
            </div>
          </div>
          
          {tips.length > 0 && (
            <div className="mb-4 p-3 bg-white/5 rounded-lg">
              <h4 className="text-white font-medium text-sm mb-2 flex items-center space-x-2">
                <FireIcon className="h-4 w-4 text-orange-400" />
                <span>Unlock Higher Priority:</span>
              </h4>
              <ul className="space-y-1">
                {tips.map((tip, index) => (
                  <li key={index} className="text-xs text-gray-300 flex items-center space-x-2">
                    <span>•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}