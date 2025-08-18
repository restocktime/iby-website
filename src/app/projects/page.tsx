import { Metadata } from 'next'
import Layout from '@/components/layout/Layout'
import HeroSection from '@/components/sections/HeroSection'
import { ProjectShowcase } from '@/components/sections/ProjectShowcase'
import { SectionTransition } from '@/components/ui/SectionTransition'
import GlobalParticles from '@/components/ui/GlobalParticles'
import { ClientWrapper } from '@/components/ClientWrapper'
import { ClientOnly } from '@/components/ClientOnly'
import { SEOEnhancements } from '@/components/seo/SEOEnhancements'
import { sampleProjects } from '@/data/projects'

// Page metadata for SEO
export const metadata: Metadata = {
  title: "Projects - Isaac Benyakar | Full Stack Developer Portfolio",
  description: "Explore Isaac Benyakar's portfolio featuring web development projects, automation solutions, custom CRM systems, and innovative business applications.",
  keywords: ["Isaac Benyakar", "Projects", "Portfolio", "Web Development", "React", "Next.js", "Automation", "CRM", "Case Studies"],
  openGraph: {
    title: "Projects - Isaac Benyakar Portfolio",
    description: "Discover innovative web applications, automation tools, and custom business solutions built by Isaac Benyakar.",
    url: "https://isaacbenyakar.com/projects",
    images: [
      {
        url: '/og-projects.jpg',
        width: 1200,
        height: 630,
        alt: 'Isaac Benyakar Projects Portfolio',
      },
    ],
  },
}

export default function ProjectsPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://isaacbenyakar.com" },
    { name: "Projects", url: "https://isaacbenyakar.com/projects" }
  ]

  return (
    <>
      <SEOEnhancements 
        breadcrumbs={breadcrumbs}
        title="Projects - Isaac Benyakar | Full Stack Developer Portfolio"
        description="Explore Isaac Benyakar's portfolio featuring web development projects, automation solutions, custom CRM systems, and innovative business applications."
      />
      
      <ClientWrapper>
        <Layout>
          {/* Persistent Hero Section */}
          <ClientOnly>
            <HeroSection />
          </ClientOnly>

          <main id="main-content" role="main" tabIndex={-1}>
            {/* Projects Section - Now the main content */}
            <section 
              id="projects"
              className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 sm:py-24 lg:py-32"
              role="region" 
              aria-labelledby="projects-heading"
            >
              {/* Flowing Particle Background */}
              <div className="absolute inset-0 z-0">
                <GlobalParticles 
                  density="light" 
                  color="#ffffff" 
                  opacity={0.3} 
                  variant="default" 
                />
              </div>

              {/* Background Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-pink-900/20 z-10" />

              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                <ClientOnly>
                  <ProjectShowcase projects={sampleProjects} />
                </ClientOnly>
              </div>
            </section>

            {/* Additional Projects Info Section */}
            <SectionTransition 
              className="relative w-full py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"
              role="region"
              aria-labelledby="project-details-heading"
            >
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 id="project-details-heading" className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-slate-900 mb-6">
                    Featured Work
                  </h2>
                  <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
                    Each project represents a unique challenge and innovative solution. Click on any project 
                    to explore detailed case studies with live demos, code insights, and lessons learned.
                  </p>
                </div>

                {/* Project Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  <div className="bg-white/95 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
                      🌐
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-4 text-slate-900">
                      Web Applications
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Modern, responsive applications built with React, Next.js, and cutting-edge technologies.
                    </p>
                    <div className="text-sm text-blue-600 font-medium">
                      {sampleProjects.filter(p => p.category === 'web-app').length} Projects
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                      🤖
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-4 text-slate-900">
                      Automation Tools
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Custom automation solutions, web scrapers, and monitoring systems for business efficiency.
                    </p>
                    <div className="text-sm text-purple-600 font-medium">
                      {sampleProjects.filter(p => p.category === 'automation').length} Projects
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-2xl">
                      ⚙️
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-4 text-slate-900">
                      Custom Solutions
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Tailored CRM systems, analytics dashboards, and business process optimization.
                    </p>
                    <div className="text-sm text-emerald-600 font-medium">
                      {sampleProjects.filter(p => p.category === 'custom-solution').length} Projects
                    </div>
                  </div>
                </div>

                {/* Technologies Used */}
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mb-8">
                    Technologies & Tools
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                    {[
                      'React', 'Next.js', 'TypeScript', 'Python', 'Node.js', 'PostgreSQL', 
                      'MongoDB', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'AWS', 'Vercel',
                      'Selenium', 'Beautiful Soup', 'Discord.js', 'Puppeteer'
                    ].map((tech, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </SectionTransition>
          </main>
        </Layout>
      </ClientWrapper>
    </>
  )
}