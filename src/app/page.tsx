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
                className="relative w-full min-h-screen flex items-center justify-center py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 overflow-hidden"
                role="region"
                aria-labelledby="about-heading"
              >
                <GlobalParticles 
                  density="heavy" 
                  color="#3b82f6" 
                  opacity={0.6} 
                  variant="colorful" 
                />
                
                {/* Main Content Container */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="text-center">
                    
                    {/* Header Section */}
                    <SectionTransition delay={0.2}>
                      <header className="mb-12 lg:mb-16 text-center">
                        <h2 id="about-heading" className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-slate-900 mb-6 tracking-tight leading-[0.9] text-center">
                          About Isaac
                        </h2>
                        <div className="relative">
                          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full animate-flash"></div>
                          {/* Small particles around the divider */}
                          <div className="absolute inset-0 -m-8 pointer-events-none">
                            <div className="absolute top-2 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-float opacity-60"></div>
                            <div className="absolute -top-1 right-1/3 w-0.5 h-0.5 bg-purple-400 rounded-full animate-pulse opacity-50"></div>
                            <div className="absolute top-3 right-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce opacity-40"></div>
                            <div className="absolute -top-2 left-1/3 w-0.5 h-0.5 bg-purple-300 rounded-full animate-ping opacity-30"></div>
                            <div className="absolute top-1 left-1/2 w-1 h-1 bg-indigo-400 rounded-full animate-pulse opacity-50"></div>
                          </div>
                        </div>
                      </header>
                    </SectionTransition>
                    
                    {/* Description Section */}
                    <SectionTransition delay={0.4}>
                      <div className="mb-16 lg:mb-20 text-center">
                        <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 leading-relaxed font-body max-w-4xl mx-auto font-medium text-center">
                          Passionate full-stack developer with expertise in modern web technologies, 
                          automation, and custom business solutions. I specialize in creating 
                          innovative applications that solve real-world problems and drive business growth.
                        </p>
                      </div>
                    </SectionTransition>
                    
                    {/* Services Grid */}
                    <StaggeredList 
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12" 
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
                          className="w-full h-full text-center p-8 sm:p-10 lg:p-12 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/95 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl lg:rounded-3xl group"
                          role="listitem"
                          aria-labelledby={`service-${index}-title`}
                        >
                          <div className={`w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 mx-auto mb-6 lg:mb-8 rounded-xl lg:rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center text-2xl sm:text-3xl shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                            <span role="img" aria-label={`${item.title} icon`}>
                              {item.icon}
                            </span>
                          </div>
                          <h3 id={`service-${index}-title`} className="text-xl sm:text-2xl font-heading font-bold mb-4 lg:mb-6 text-slate-900 group-hover:text-blue-600 transition-colors duration-300 text-center">
                            {item.title}
                          </h3>
                          <p className="text-slate-600 leading-relaxed font-body text-base sm:text-lg text-center">{item.description}</p>
                        </Card>
                      ))}
                    </StaggeredList>
                  </div>
                </div>
              </SectionTransition>

              {/* Projects Section */}
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
                  <ProjectShowcase projects={sampleProjects} />
                </div>
              </section>

              {/* Skills Section */}
              <SectionTransition 
                id="skills" 
                className="relative w-full min-h-screen flex items-center justify-center py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden"
                role="region"
                aria-labelledby="skills-heading"
              >
                <GlobalParticles 
                  density="medium" 
                  color="#ffffff" 
                  opacity={0.5} 
                  variant="colorful" 
                />
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <SkillsVisualization />
                </div>
              </SectionTransition>

              {/* Contact Section */}
              <div className="relative w-full overflow-hidden">
                <GlobalParticles 
                  density="heavy" 
                  color="#ec4899" 
                  opacity={0.5} 
                  variant="colorful" 
                />
                <div className="relative z-10">
                  <ContactSection />
                </div>
              </div>
            </main>
          </Layout>
        </ClientWrapper>
      </NavigationProvider>
    </>
  )
}
