import Layout from '@/components/layout/Layout'
import MainContent from '@/components/sections/MainContent'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { ClientWrapper } from '@/components/ClientWrapper'
import { ClientOnly } from '@/components/ClientOnly'
import { SEOEnhancements, ServiceStructuredData, FAQStructuredData } from '@/components/seo/SEOEnhancements'

// Force dynamic rendering to avoid SSG issues during development
export const dynamic = 'force-dynamic'

export default function Home() {
  const breadcrumbs = [
    { name: "Home", url: "https://isaacbenyakar.com" }
  ]

  return (
    <>
      <SEOEnhancements 
        breadcrumbs={breadcrumbs}
      />
      <ServiceStructuredData />
      <FAQStructuredData />
      
      <NavigationProvider>
        <ClientWrapper>
          <Layout>
            <main id="main-content" role="main" tabIndex={-1}>
              <ClientOnly>
                <MainContent />
              </ClientOnly>
            </main>
          </Layout>
        </ClientWrapper>
      </NavigationProvider>
    </>
  )
}
