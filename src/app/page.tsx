import Layout from '@/components/layout/Layout'

import Card from '@/components/ui/Card'
import HeroSection from '@/components/sections/HeroSection'
import { ProjectShowcase } from '@/components/sections/ProjectShowcase'
import SkillsVisualization from '@/components/sections/SkillsVisualization'
import { ContactSection } from '@/components/sections/ContactSection'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { SectionTransition, StaggeredList } from '@/components/ui/SectionTransition'
import GlobalParticles from '@/components/ui/GlobalParticles'
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
                className="relative min-h-screen flex items-center py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 overflow-hidden"
                role="region"
                aria-labelledby="about-heading"
              >
                <GlobalParticles density="light" color="#64748b" opacity={0.3} />
                <div className="container mx-auto px-6 relative z-10">
                  <div className="max-w-6xl mx-auto text-center">
                    <SectionTransition delay={0.2}>
                      <header>
                        <h2 id="about-heading" className="text-4xl md:text-6xl font-luxury font-bold text-slate-900 mb-8 tracking-wide">
                          About Isaac
                        </h2>
                      </header>
                    </SectionTransition>
                    
                    <SectionTransition delay={0.4}>
                      <p className="text-xl md:text-2xl text-slate-700 mb-16 leading-relaxed max-w-4xl mx-auto font-modern">
                        Passionate full-stack developer with expertise in modern web technologies, 
                        automation, and custom business solutions. I specialize in creating 
                        innovative applications that solve real-world problems.
                      </p>
                    </SectionTransition>
                    
                    <StaggeredList 
                      className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" 
                      staggerDelay={0.2}
                      role="list"
                      aria-label="Core services offered"
                    >
                      {[
                        {
                          title: "Web Development",
                          description: "Modern, responsive applications built with React, Next.js, and cutting-edge technologies",
                          icon: "🌐",
                          gradient: "from-blue-500 to-cyan-500"
                        },
                        {
                          title: "Automation & Scraping", 
                          description: "Custom automation tools, web scrapers, and monitoring systems for business efficiency",
                          icon: "🤖",
                          gradient: "from-purple-500 to-pink-500"
                        },
                        {
                          title: "Custom Solutions",
                          description: "Tailored CRM systems, analytics dashboards, and business process optimization",
                          icon: "⚙️",
                          gradient: "from-emerald-500 to-teal-500"
                        }
                      ].map((item, index) => (
                        <Card 
                          key={index} 
                          variant="elevated" 
                          className="text-center p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                          role="listitem"
                          aria-labelledby={`service-${index}-title`}
                        >
                          <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${item.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                            <span role="img" aria-label={`${item.title} icon`}>
                              {item.icon}
                            </span>
                          </div>
                          <h3 id={`service-${index}-title`} className="text-xl font-modern font-bold mb-4 text-slate-900">
                            {item.title}
                          </h3>
                          <p className="text-slate-600 leading-relaxed font-modern">{item.description}</p>
                        </Card>
                      ))}
                    </StaggeredList>
                  </div>
                </div>
              </SectionTransition>

              {/* Projects Section */}
              <section 
                id="projects"
                className="relative bg-white overflow-hidden"
                role="region" 
                aria-labelledby="projects-heading"
              >
                <GlobalParticles density="light" color="#64748b" opacity={0.2} />
                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                  <ProjectShowcase projects={sampleProjects} />
                </div>
              </section>

              {/* Skills Section */}
              <SectionTransition 
                id="skills" 
                className="relative min-h-screen py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden"
                role="region"
                aria-labelledby="skills-heading"
              >
                <GlobalParticles density="medium" color="#ffffff" opacity={0.4} />
                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                  <SkillsVisualization />
                </div>
              </SectionTransition>

              {/* Contact Section */}
              <section 
                id="contact"
                className="relative overflow-hidden"
                role="region" 
                aria-labelledby="contact-heading"
              >
                <GlobalParticles density="light" color="#64748b" opacity={0.3} />
                <div className="relative z-10">
                  <ContactSection />
                </div>
              </section>
            </main>
          </Layout>
        </ClientWrapper>
      </NavigationProvider>
    </>
  )
}
