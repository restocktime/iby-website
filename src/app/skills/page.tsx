import { Metadata } from 'next'
import Layout from '@/components/layout/Layout'
import HeroSection from '@/components/sections/HeroSection'
import SkillsVisualizationEnhanced from '@/components/sections/SkillsVisualizationEnhanced'
import { SectionTransition } from '@/components/ui/SectionTransition'
import GlobalParticles from '@/components/ui/GlobalParticles'
import { ClientWrapper } from '@/components/ClientWrapper'
import { ClientOnly } from '@/components/ClientOnly'
import { SEOEnhancements } from '@/components/seo/SEOEnhancements'

// Page metadata for SEO
export const metadata: Metadata = {
  title: "Skills & Expertise - Isaac Benyakar | Full Stack Developer",
  description: "Explore Isaac Benyakar's technical skills including React, Next.js, TypeScript, Python, Node.js, and automation tools. Interactive visualizations of experience and capabilities.",
  keywords: ["Isaac Benyakar", "Skills", "React", "Next.js", "TypeScript", "Python", "Node.js", "Full Stack", "Technical Skills"],
  openGraph: {
    title: "Skills & Expertise - Isaac Benyakar",
    description: "Interactive visualizations of technical skills and experience in web development, automation, and custom business solutions.",
    url: "https://isaacbenyakar.com/skills",
    images: [
      {
        url: '/og-skills.jpg',
        width: 1200,
        height: 630,
        alt: 'Isaac Benyakar Skills & Expertise',
      },
    ],
  },
}

export default function SkillsPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://isaacbenyakar.com" },
    { name: "Skills", url: "https://isaacbenyakar.com/skills" }
  ]

  return (
    <>
      <SEOEnhancements 
        breadcrumbs={breadcrumbs}
        pageTitle="Skills & Expertise - Isaac Benyakar | Full Stack Developer"
        pageDescription="Explore Isaac Benyakar's technical skills including React, Next.js, TypeScript, Python, Node.js, and automation tools. Interactive visualizations of experience and capabilities."
      />
      
      <ClientWrapper>
        <Layout>
          {/* Persistent Hero Section */}
          <ClientOnly>
            <HeroSection />
          </ClientOnly>

          <main id="main-content" role="main" tabIndex={-1}>
            {/* Skills Section - Now the main content */}
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
                <ClientOnly>
                  <SkillsVisualizationEnhanced />
                </ClientOnly>
              </div>
            </SectionTransition>

            {/* Additional Skills Information Section */}
            <SectionTransition 
              className="relative w-full py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"
              role="region"
              aria-labelledby="detailed-skills-heading"
            >
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 id="detailed-skills-heading" className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-slate-900 mb-6">
                    Technical Expertise
                  </h2>
                  <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
                    A comprehensive overview of my technical skills and experience across different domains
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Frontend Development */}
                  <div className="bg-white/95 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-8">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
                      🎨
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-4 text-slate-900 text-center">
                      Frontend Development
                    </h3>
                    <ul className="space-y-3 text-slate-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        React.js & Next.js
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        TypeScript & JavaScript (ES6+)
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Tailwind CSS & Styled Components
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Three.js & WebGL
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Framer Motion & CSS Animations
                      </li>
                    </ul>
                  </div>

                  {/* Backend Development */}
                  <div className="bg-white/95 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-8">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-2xl">
                      ⚙️
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-4 text-slate-900 text-center">
                      Backend Development
                    </h3>
                    <ul className="space-y-3 text-slate-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                        Node.js & Express.js
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                        Python & Django/FastAPI
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                        PostgreSQL & MongoDB
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                        REST APIs & GraphQL
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                        AWS & Docker
                      </li>
                    </ul>
                  </div>

                  {/* Automation & Tools */}
                  <div className="bg-white/95 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-8">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                      🤖
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-4 text-slate-900 text-center">
                      Automation & Tools
                    </h3>
                    <ul className="space-y-3 text-slate-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        Selenium & Puppeteer
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        Beautiful Soup & Scrapy
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        Git & CI/CD
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        Jest & Cypress Testing
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        Discord Bot Development
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Experience Timeline Section */}
                <div className="mt-20">
                  <h3 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 mb-12 text-center">
                    Professional Journey
                  </h3>
                  <div className="max-w-4xl mx-auto">
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-8 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
                      
                      {/* Timeline items */}
                      {[
                        {
                          year: "2024",
                          title: "Advanced Full Stack Development",
                          description: "Specializing in Next.js 15, advanced React patterns, and WebGPU animations. Building enterprise-level applications with cutting-edge technologies.",
                          side: "left"
                        },
                        {
                          year: "2023",
                          title: "Automation & Business Solutions",
                          description: "Expanded into custom CRM development, business intelligence, and advanced web scraping solutions for enterprise clients.",
                          side: "right"
                        },
                        {
                          year: "2022",
                          title: "Full Stack Expertise",
                          description: "Mastered modern JavaScript ecosystem, React/Next.js, and backend development with Node.js and Python.",
                          side: "left"
                        },
                        {
                          year: "2021",
                          title: "Web Development Journey",
                          description: "Started professional web development journey, focusing on responsive design and user experience optimization.",
                          side: "right"
                        }
                      ].map((item, index) => (
                        <div key={index} className={`relative flex items-center mb-12 ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
                          {/* Timeline dot */}
                          <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                          
                          {/* Content */}
                          <div className={`ml-20 md:ml-0 md:w-5/12 ${item.side === 'right' ? 'md:mr-12' : 'md:ml-12'}`}>
                            <div className="bg-white/95 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-6">
                              <div className="text-sm font-bold text-blue-600 mb-2">{item.year}</div>
                              <h4 className="text-lg font-heading font-bold text-slate-900 mb-3">{item.title}</h4>
                              <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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