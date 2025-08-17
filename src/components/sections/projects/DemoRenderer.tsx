'use client'

import { LiveDemo } from '@/types'
import { WebsiteMonitorDemo } from './WebsiteMonitorDemo'
import { LiveScraperDemo } from './LiveScraperDemo'
import { ScraperDemo } from './ScraperDemo'
import { LiveMetrics } from './LiveMetrics'
import { AnalyticsShowcase } from './AnalyticsShowcase'
import { CRMShowcase } from './CRMShowcase'
import { NotificationDemo } from './NotificationDemo'

interface DemoRendererProps {
  liveDemo: LiveDemo
  projectTitle: string
}

export function DemoRenderer({ liveDemo, projectTitle }: DemoRendererProps) {
  if (liveDemo.type === 'iframe' && liveDemo.url) {
    return (
      <div className="w-full h-full">
        <iframe
          src={liveDemo.url}
          title={`${projectTitle} Demo`}
          className="w-full h-full border-0 rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (liveDemo.type === 'video' && liveDemo.url) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <video
          src={liveDemo.url}
          controls
          className="max-w-full max-h-full rounded-lg"
          poster="/api/placeholder/800/450"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }

  if (liveDemo.type === 'interactive' && liveDemo.component) {
    switch (liveDemo.component) {
      case 'WebsiteMonitorDemo':
        return <WebsiteMonitorDemo />
      
      case 'LiveScraperDemo':
        return <LiveScraperDemo />
      
      case 'ScraperDemo':
        return <ScraperDemo title={projectTitle} />
      
      case 'LiveMetrics':
        return <LiveMetrics />
      
      case 'AnalyticsShowcase':
        return <AnalyticsShowcase />
      
      case 'CRMShowcase':
        return <CRMShowcase />
      
      case 'NotificationDemo':
        return <NotificationDemo />
      
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg text-white">
            <div className="text-center">
              <div className="text-gray-400 mb-4">Demo component not found</div>
              <div className="text-sm text-gray-500">Component: {liveDemo.component}</div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg text-white">
      <div className="text-center">
        <div className="text-gray-400 mb-4">Demo not available</div>
        <div className="text-sm text-gray-500">{liveDemo.description}</div>
      </div>
    </div>
  )
}