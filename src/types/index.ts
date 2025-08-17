export interface Project {
  id: string
  title: string
  description: string
  technologies: Technology[]
  liveUrl?: string
  githubUrl?: string
  demoCredentials?: DemoCredentials
  metrics: ProjectMetrics
  screenshots: MediaAsset[]
  caseStudy: CaseStudyData
  status: 'active' | 'completed' | 'ongoing'
  featured: boolean
  category: ProjectCategory
}

export interface Technology {
  name: string
  category: 'frontend' | 'backend' | 'database' | 'tool' | 'cloud'
  proficiency: number // 1-10 scale
  yearsOfExperience: number
}

export interface DemoCredentials {
  username: string
  password: string
  instructions?: string
}

export interface ProjectMetrics {
  performanceScore: number
  userEngagement: EngagementMetrics
  businessImpact: BusinessMetrics
  technicalComplexity: number
}

export interface EngagementMetrics {
  averageSessionDuration: number
  bounceRate: number
  conversionRate: number
  monthlyActiveUsers: number
}

export interface BusinessMetrics {
  revenueImpact: number
  costSavings: number
  efficiencyGain: number
  userSatisfactionScore: number
}

export interface MediaAsset {
  id: string
  url: string
  alt: string
  type: 'image' | 'video' | 'gif'
  caption?: string
}

export interface CaseStudyData {
  challenge: string
  solution: string
  results: string[]
  testimonial?: Testimonial
}

export interface Testimonial {
  content: string
  author: string
  role: string
  company: string
  avatar?: string
}

export type ProjectCategory = 
  | 'web-development'
  | 'automation'
  | 'crm'
  | 'analytics'
  | 'e-commerce'
  | 'scraping'
  | 'monitoring'

export interface UserSession {
  sessionId: string
  visitDuration: number
  sectionsVisited: string[]
  interactionEvents: InteractionEvent[]
  deviceInfo: DeviceCapabilities
  engagementScore: number
}

export interface InteractionEvent {
  timestamp: Date
  eventType: 'scroll' | 'click' | 'hover' | 'gesture'
  element: string
  duration: number
  coordinates?: Point2D
}

export interface Point2D {
  x: number
  y: number
}

export interface DeviceCapabilities {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  supportsWebGL: boolean
  supportsTouch: boolean
  screenWidth: number
  screenHeight: number
  pixelRatio: number
}

export type PerformanceLevel = 'low' | 'medium' | 'high'

export interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  loadTime: number
  renderTime: number
}

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  fallbackComponent?: React.ComponentType<any>
}

export interface RetryConfig {
  maxAttempts: number
  delay: number
  backoffMultiplier: number
  shouldRetry?: (error: Error) => boolean
}

export interface ContactForm {
  name: string
  email: string
  company?: string
  projectType: ProjectCategory
  budget: string
  timeline: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface ContactMethod {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  action: string
  responseTime: string
  availability: 'always' | 'business-hours' | 'evenings'
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface AvailabilityStatus {
  status: 'available' | 'busy' | 'away'
  message: string
  nextAvailable?: string
  responseTime: string
}

export interface SkillCategory {
  name: string
  skills: Skill[]
  proficiencyLevel: number
  yearsOfExperience: number
}

export interface Skill {
  name: string
  proficiency: number
  category: string
  projects: string[] // Project IDs where this skill was used
}