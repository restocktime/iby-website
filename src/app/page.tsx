import HeroSection from '@/components/sections/HeroSection'
import HomeNavigation from '@/components/navigation/HomeNavigation'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

// Force dynamic rendering to avoid SSG issues during development
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section - Full Screen */}
      <ErrorBoundary level="section">
        <HeroSection />
      </ErrorBoundary>

      {/* Navigation Menu - Below Hero */}
      <ErrorBoundary level="section">
        <HomeNavigation />
      </ErrorBoundary>
    </div>
  )
}
