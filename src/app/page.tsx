import Layout from '@/components/layout/Layout'

import Card from '@/components/ui/Card'
import HeroSection from '@/components/sections/HeroSection'
import { ProjectShowcase } from '@/components/sections/ProjectShowcase'
import SkillsVisualization from '@/components/sections/SkillsVisualization'
import { ContactSection } from '@/components/sections/ContactSection'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { SectionTransition, StaggeredList } from '@/components/ui/SectionTransition'
import { ClientWrapper } from '@/components/ClientWrapper'
import { SEOEnhancements, ServiceStructuredData, FAQStructuredData } from '@/components/seo/SEOEnhancements'
import { sampleProjects } from '@/data/projects'

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
              <HeroSection />

              {/* About Section */}
              <SectionTransition 
                id="about" 
                className="min-h-screen flex items-center py-20 bg-white"
                role="region"
                aria-labelledby="about-heading"
              >
                <div className="container mx-auto px-6">
                  <div className="max-w-4xl mx-auto text-center">
                    <SectionTransition delay={0.2}>
                      <header>
                        <h2 id="about-heading" className="text-4xl md:text-5xl font-bold text-neutral-900 mb-8">
                          About Isaac
                        </h2>
                      </header>
                    </SectionTransition>
                    
                    <SectionTransition delay={0.4}>
                      <p className="text-xl text-neutral-600 mb-12 leading-relaxed">
                        Passionate full-stack developer with expertise in modern web technologies, 
                        automation, and custom business solutions. I specialize in creating 
                        innovative applications that solve real-world problems.
                      </p>
                    </SectionTransition>
                    
                    <StaggeredList 
                      className="grid grid-cols-1 md:grid-cols-3 gap-8" 
                      staggerDelay={0.2}
                      role="list"
                      aria-label="Core services offered"
                    >
                      {[
                        {
                          title: "Web Development",
                          description: "Modern, responsive applications built with React, Next.js, and cutting-edge technologies",
                          icon: "🌐"
                        },
                        {
                          title: "Automation & Scraping", 
                          description: "Custom automation tools, web scrapers, and monitoring systems for business efficiency",
                          icon: "🤖"
                        },
                        {
                          title: "Custom Solutions",
                          description: "Tailored CRM systems, analytics dashboards, and business process optimization",
                          icon: "⚙️"
                        }
                      ].map((item, index) => (
                        <Card 
                          key={index} 
                          variant="elevated" 
                          className="text-center p-8 hover:shadow-xl transition-shadow duration-300"
                          role="listitem"
                          aria-labelledby={`service-${index}-title`}
                        >
                          <div 
                            className="text-4xl mb-4" 
                            role="img" 
                            aria-label={`${item.title} icon`}
                          >
                            {item.icon}
                          </div>
                          <h3 id={`service-${index}-title`} className="text-xl font-semibold mb-4">
                            {item.title}
                          </h3>
                          <p className="text-neutral-600">{item.description}</p>
                        </Card>
                      ))}
                    </StaggeredList>
                  </div>
                </div>
              </SectionTransition>

              {/* Projects Section */}
              <section 
                id="projects"
                role="region" 
                aria-labelledby="projects-heading"
              >
                <ProjectShowcase projects={sampleProjects} />
              </section>

              {/* Skills Section */}
              <SectionTransition 
                id="skills" 
                className="min-h-screen py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
                role="region"
                aria-labelledby="skills-heading"
              >
                <div className="container mx-auto px-6">
                  <SkillsVisualization />
                </div>
              </SectionTransition>

              {/* Contact Section */}
              <section 
                id="contact"
                role="region" 
                aria-labelledby="contact-heading"
              >
                <ContactSection />
              </section>
            </main>
          </Layout>
        </ClientWrapper>
      </NavigationProvider>
    </>
  )
}
