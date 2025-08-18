import { Metadata } from 'next'
import Layout from '@/components/layout/Layout'
import HeroSection from '@/components/sections/HeroSection'
import { SectionTransition, StaggeredList } from '@/components/ui/SectionTransition'
import GlobalParticles from '@/components/ui/GlobalParticles'
import Card from '@/components/ui/Card'
import { ClientWrapper } from '@/components/ClientWrapper'
import { ClientOnly } from '@/components/ClientOnly'
import { SEOEnhancements } from '@/components/seo/SEOEnhancements'

// Page metadata for SEO
export const metadata: Metadata = {
  title: "About Isaac Benyakar - Full Stack Developer & Automation Expert",
  description: "Learn about Isaac Benyakar's background, skills, and passion for creating innovative web applications and automation solutions.",
  keywords: ["Isaac Benyakar", "About", "Full Stack Developer", "Web Development", "Automation", "Background"],
  openGraph: {
    title: "About Isaac Benyakar - Full Stack Developer",
    description: "Passionate full-stack developer with expertise in modern web technologies, automation, and custom business solutions.",
    url: "https://isaacbenyakar.com/about",
    images: [
      {
        url: '/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'About Isaac Benyakar - Full Stack Developer',
      },
    ],
  },
}

export default function AboutPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://isaacbenyakar.com" },
    { name: "About", url: "https://isaacbenyakar.com/about" }
  ]

  return (
    <>
      <SEOEnhancements 
        breadcrumbs={breadcrumbs}
        pageTitle="About Isaac Benyakar - Full Stack Developer & Automation Expert"
        pageDescription="Learn about Isaac Benyakar's background, skills, and passion for creating innovative web applications and automation solutions."
      />
      
      <ClientWrapper>
        <Layout>
          {/* Persistent Hero Section */}
          <ClientOnly>
            <HeroSection />
          </ClientOnly>

          <main id="main-content" role="main" tabIndex={-1}>
            {/* About Section - Now the main content */}
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
                      <h1 id="about-heading" className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-slate-900 mb-6 tracking-tight leading-[0.9] text-center">
                        About Isaac
                      </h1>
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
                  
                  {/* Extended Bio Section */}
                  <SectionTransition delay={0.4}>
                    <div className="mb-16 lg:mb-20 flex justify-center">
                      <div className="max-w-4xl text-left">
                        <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 leading-relaxed font-body mb-8 font-medium">
                          Passionate full-stack developer with expertise in modern web technologies, 
                          automation, and custom business solutions. I specialize in creating 
                          innovative applications that solve real-world problems and drive business growth.
                        </p>
                        
                        <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-body mb-8">
                          With years of experience in both front-end and back-end development, I&apos;ve had the 
                          privilege of working with clients ranging from startups to established businesses, 
                          helping them leverage technology to achieve their goals. My approach combines technical 
                          excellence with a deep understanding of business needs.
                        </p>
                        
                        <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-body mb-8">
                          When I&apos;m not coding, you&apos;ll find me exploring new technologies, contributing to 
                          open-source projects, or sharing knowledge with the developer community. I believe 
                          in continuous learning and staying at the forefront of technological innovation.
                        </p>
                      </div>
                    </div>
                  </SectionTransition>
                  
                  {/* Core Values Section */}
                  <SectionTransition delay={0.6}>
                    <div className="mb-16 lg:mb-20">
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-slate-900 mb-12 text-center">
                        Core Values
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                          {
                            title: "Quality First",
                            description: "Every line of code is crafted with precision and attention to detail",
                            icon: "💎"
                          },
                          {
                            title: "Innovation",
                            description: "Always seeking creative solutions and cutting-edge approaches",
                            icon: "🚀"
                          },
                          {
                            title: "Collaboration",
                            description: "Building strong partnerships and transparent communication",
                            icon: "🤝"
                          }
                        ].map((value, index) => (
                          <Card 
                            key={index}
                            variant="elevated"
                            className="text-center p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/95 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl group"
                          >
                            <div className="text-4xl mb-4">{value.icon}</div>
                            <h3 className="text-xl font-heading font-bold mb-4 text-slate-900">
                              {value.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                              {value.description}
                            </p>
                          </Card>
                        ))}
                      </div>
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
                        gradient: "from-blue-500 to-cyan-500",
                        features: ["React & Next.js", "TypeScript", "Responsive Design", "Performance Optimization"]
                      },
                      {
                        title: "Automation & Scraping", 
                        description: "Custom automation tools, web scrapers, and monitoring systems for business efficiency",
                        icon: "🤖",
                        gradient: "from-purple-500 to-pink-500",
                        features: ["Web Scraping", "Process Automation", "Data Mining", "Workflow Integration"]
                      },
                      {
                        title: "Custom Solutions",
                        description: "Tailored CRM systems, analytics dashboards, and business process optimization",
                        icon: "⚙️",
                        gradient: "from-emerald-500 to-teal-500",
                        features: ["Custom CRM", "Analytics Dashboards", "API Development", "Database Design"]
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
                        <p className="text-slate-600 leading-relaxed font-body text-base sm:text-lg text-center mb-6">{item.description}</p>
                        
                        {/* Feature List */}
                        <ul className="text-sm text-slate-500 space-y-2">
                          {item.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center justify-center">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    ))}
                  </StaggeredList>
                </div>
              </div>
            </SectionTransition>
          </main>
        </Layout>
      </ClientWrapper>
    </>
  )
}