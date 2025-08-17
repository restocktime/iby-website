export interface AdvancedAnalyticsEvent {
  id: string
  sessionId: string
  userId?: string
  event: string
  properties: Record<string, unknown>
  timestamp: Date
  page: string
  userAgent: string
  ip?: string
  coordinates?: Point2D
  elementPath?: string
  viewport: {
    width: number
    height: number
  }
  scroll: {
    x: number
    y: number
    depth: number
  }
}

export interface HeatmapData {
  element: string
  selector: string
  interactions: number
  heatLevel: number
  coordinates: Point2D[]
  avgTimeSpent: number
  conversionRate: number
}

export interface ConversionFunnel {
  step: string
  visitors: number
  conversions: number
  conversionRate: number
  dropoffRate: number
  avgTimeToConvert: number
}

export interface ABTestVariant {
  id: string
  name: string
  description: string
  traffic: number // percentage 0-100
  conversions: number
  conversionRate: number
  isControl: boolean
  isActive: boolean
}

export interface ABTest {
  id: string
  name: string
  description: string
  component: string
  startDate: Date
  endDate?: Date
  status: 'draft' | 'running' | 'completed' | 'paused'
  variants: ABTestVariant[]
  targetMetric: string
  significance: number
  winner?: string
}

export interface UserBehaviorPattern {
  pattern: string
  frequency: number
  avgEngagement: number
  conversionRate: number
  commonPaths: string[]
  timeSpent: number
}

export interface RealTimeVisitor {
  sessionId: string
  currentPage: string
  timeOnPage: number
  engagementScore: number
  deviceType: string
  location?: {
    country: string
    city: string
  }
  referrer?: string
  isReturning: boolean
}

export interface ConversionEvent {
  id: string
  sessionId: string
  type: 'contact_form' | 'email_click' | 'whatsapp_click' | 'discord_click' | 'project_inquiry'
  value: number
  timestamp: Date
  formData?: Record<string, unknown>
  source: string
  campaign?: string
}

export interface AnalyticsInsight {
  id: string
  type: 'opportunity' | 'warning' | 'success' | 'info'
  title: string
  description: string
  metric: string
  value: number
  change: number
  recommendation: string
  priority: 'low' | 'medium' | 'high'
  timestamp: Date
}

export interface Point2D {
  x: number
  y: number
}