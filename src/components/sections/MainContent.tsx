'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Project } from '@/types'
import HeroSection from './HeroSection'
import { ProjectShowcase } from './ProjectShowcase'
import FeaturedWorkSection from './FeaturedWorkSection'
import SkillsVisualizationEnhanced from './SkillsVisualizationEnhanced'
import { ContactSection } from './ContactSection'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

// Mock data for projects - replace with real data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'RestockTime - Inventory Management',
    description: 'Advanced inventory management system with real-time tracking, automated alerts, and comprehensive analytics for e-commerce businesses.',
    longDescription: 'RestockTime is a comprehensive inventory management solution designed for modern e-commerce businesses. The system provides real-time inventory tracking, automated restock alerts, supplier management, and detailed analytics.',
    category: 'web-development',
    technologies: [
      { name: 'React', category: 'frontend' },
      { name: 'Next.js', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Node.js', category: 'backend' },
      { name: 'PostgreSQL', category: 'database' }
    ],
    screenshots: [
      { url: '/projects/restocktime-dashboard.jpg', alt: 'RestockTime Dashboard' }
    ],
    liveUrl: 'https://demo.restocktime.com',
    githubUrl: 'https://github.com/isaacbenyakar/restocktime',
    status: 'active',
    featured: true,
    startDate: '2023-06-01',
    endDate: '2024-01-15',
    metrics: {
      performanceScore: 9,
      userEngagement: {
        monthlyActiveUsers: 5420,
        averageSessionTime: 450,
        bounceRate: 0.25
      },
      technicalComplexity: 8,
      codeQuality: 9
    },
    liveDemo: {
      type: 'interactive',
      component: 'WebsiteMonitorDemo'
    }
  },
  {
    id: '2',
    title: 'Sunday Edge Pro - Web Scraping',
    description: 'Professional web scraping platform with advanced anti-detection, proxy rotation, and real-time data extraction capabilities.',
    longDescription: 'Sunday Edge Pro is a sophisticated web scraping platform designed for enterprise-level data extraction with advanced anti-detection mechanisms.',
    category: 'automation',
    technologies: [
      { name: 'Python', category: 'backend' },
      { name: 'Scrapy', category: 'backend' },
      { name: 'React', category: 'frontend' },
      { name: 'PostgreSQL', category: 'database' }
    ],
    screenshots: [
      { url: '/projects/sunday-edge-dashboard.jpg', alt: 'Sunday Edge Dashboard' }
    ],
    liveUrl: 'https://demo.sundayedgepro.com',
    githubUrl: 'https://github.com/isaacbenyakar/sunday-edge-pro',
    status: 'active',
    featured: true,
    startDate: '2023-03-01',
    endDate: '2023-08-30',
    metrics: {
      performanceScore: 10,
      userEngagement: {
        monthlyActiveUsers: 2150,
        averageSessionTime: 320,
        bounceRate: 0.18
      },
      technicalComplexity: 9,
      codeQuality: 9
    },
    liveDemo: {
      type: 'interactive',
      component: 'LiveScraperDemo'
    }
  },
  {
    id: '3',
    title: 'Shuk Online - E-commerce Platform',
    description: 'Modern e-commerce marketplace platform with vendor management, advanced search, and integrated payment processing.',
    longDescription: 'Shuk Online is a comprehensive multi-vendor e-commerce marketplace connecting buyers with sellers in a seamless digital environment.',
    category: 'e-commerce',
    technologies: [
      { name: 'React', category: 'frontend' },
      { name: 'Next.js', category: 'frontend' },
      { name: 'Node.js', category: 'backend' },
      { name: 'Stripe', category: 'payment' },
      { name: 'PostgreSQL', category: 'database' }
    ],
    screenshots: [
      { url: '/projects/shuk-online-homepage.jpg', alt: 'Shuk Online Homepage' }
    ],
    liveUrl: 'https://demo.shukonline.com',
    githubUrl: 'https://github.com/isaacbenyakar/shuk-online',
    status: 'completed',
    featured: false,
    startDate: '2023-09-01',
    endDate: '2024-03-15',
    metrics: {
      performanceScore: 8,
      userEngagement: {
        monthlyActiveUsers: 8750,
        averageSessionTime: 380,
        bounceRate: 0.22
      },
      technicalComplexity: 7,
      codeQuality: 8
    },
    liveDemo: {
      type: 'interactive',
      component: 'CRMShowcase'
    }
  }
]

// About section component
const AboutSection = () => (
  <section id="about" className="py-24 bg-slate-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold text-white mb-6">About Me</h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          I&apos;m a passionate full-stack developer with over 5 years of experience building 
          scalable web applications, automation tools, and custom business solutions. 
          I specialize in modern web technologies and love solving complex problems.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: 'Full-Stack Development',
            description: 'Building end-to-end solutions with React, Next.js, Node.js, and modern databases.',
            icon: '🚀'
          },
          {
            title: 'Business Automation',
            description: 'Creating custom automation tools and workflows to streamline business operations.',
            icon: '⚡'
          },
          {
            title: 'Custom Solutions',
            description: 'Developing tailored CRM systems, web scrapers, and data processing pipelines.',
            icon: '🛠️'
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
            <p className="text-slate-300">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

export default function MainContent() {
  return (
    <>
      {/* Hero Section */}
      <ErrorBoundary level="section">
        <HeroSection />
      </ErrorBoundary>

      {/* About Section */}
      <ErrorBoundary level="section">
        <AboutSection />
      </ErrorBoundary>

      {/* Featured Work Section */}
      <ErrorBoundary level="section">
        <FeaturedWorkSection />
      </ErrorBoundary>

      {/* Projects Section */}
      <ErrorBoundary level="section">
        <section id="projects" className="py-24 bg-gradient-to-br from-slate-950 to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div className="text-white text-center">Loading projects...</div>}>
              <ProjectShowcase projects={mockProjects} />
            </Suspense>
          </div>
        </section>
      </ErrorBoundary>

      {/* Skills Section */}
      <ErrorBoundary level="section">
        <section id="skills" className="py-24 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div className="text-white text-center">Loading skills...</div>}>
              <SkillsVisualizationEnhanced />
            </Suspense>
          </div>
        </section>
      </ErrorBoundary>

      {/* Contact Section */}
      <ErrorBoundary level="section">
        <ContactSection />
      </ErrorBoundary>
    </>
  )
}