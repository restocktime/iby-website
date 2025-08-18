import { Metadata } from 'next'
import Layout from '@/components/layout/Layout'
import HeroSection from '@/components/sections/HeroSection'
import { ContactSection } from '@/components/sections/ContactSection'
import GlobalParticles from '@/components/ui/GlobalParticles'
import { ClientWrapper } from '@/components/ClientWrapper'
import { ClientOnly } from '@/components/ClientOnly'
import { SEOEnhancements } from '@/components/seo/SEOEnhancements'

// Page metadata for SEO
export const metadata: Metadata = {
  title: "Contact Isaac Benyakar - Hire a Full Stack Developer",
  description: "Get in touch with Isaac Benyakar for web development, automation, and custom business solutions. Available for freelance projects and consultations.",
  keywords: ["Contact Isaac Benyakar", "Hire Developer", "Freelance", "Web Development", "Consultation", "Custom Solutions"],
  openGraph: {
    title: "Contact Isaac Benyakar - Hire a Full Stack Developer",
    description: "Ready to start your next project? Get in touch for web development, automation, and custom business solutions.",
    url: "https://isaacbenyakar.com/contact",
    images: [
      {
        url: '/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Isaac Benyakar - Full Stack Developer',
      },
    ],
  },
}

export default function ContactPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://isaacbenyakar.com" },
    { name: "Contact", url: "https://isaacbenyakar.com/contact" }
  ]

  return (
    <>
      <SEOEnhancements 
        breadcrumbs={breadcrumbs}
        title="Contact Isaac Benyakar - Hire a Full Stack Developer"
        description="Get in touch with Isaac Benyakar for web development, automation, and custom business solutions. Available for freelance projects and consultations."
      />
      
      <ClientWrapper>
        <Layout>
          {/* Persistent Hero Section */}
          <ClientOnly>
            <HeroSection />
          </ClientOnly>

          <main id="main-content" role="main" tabIndex={-1}>
            {/* Contact Section - Now the main content */}
            <div className="relative w-full overflow-hidden">
              <GlobalParticles 
                density="heavy" 
                color="#ec4899" 
                opacity={0.5} 
                variant="colorful" 
              />
              <div className="relative z-10">
                <ClientOnly>
                  <ContactSection />
                </ClientOnly>
              </div>
            </div>
          </main>
        </Layout>
      </ClientWrapper>
    </>
  )
}