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
      { name: 'React', category: 'frontend', proficiency: 9, yearsOfExperience: 3 },
      { name: 'Next.js', category: 'frontend', proficiency: 9, yearsOfExperience: 2 },
      { name: 'TypeScript', category: 'frontend', proficiency: 8, yearsOfExperience: 3 },
      { name: 'Node.js', category: 'backend', proficiency: 8, yearsOfExperience: 3 },
      { name: 'PostgreSQL', category: 'database', proficiency: 7, yearsOfExperience: 2 }
    ],
    screenshots: [
      { id: 'restocktime-1', url: '/projects/restocktime-dashboard.jpg', alt: 'RestockTime Dashboard', type: 'image' }
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
        averageSessionDuration: 450,
        bounceRate: 0.25,
        conversionRate: 0.08
      },
      businessImpact: {
        revenueImpact: 150000,
        costSavings: 75000,
        efficiencyGain: 0.35,
        userSatisfactionScore: 4.8
      },
      technicalComplexity: 8
    },
    liveDemo: {
      type: 'interactive',
      component: 'WebsiteMonitorDemo',
      description: 'Interactive demo of RestockTime monitoring system'
    },
    caseStudy: {
      challenge: 'E-commerce businesses struggled with inventory management, leading to stockouts and overstocking issues.',
      solution: 'Built a comprehensive inventory management system with real-time tracking, automated alerts, and predictive analytics.',
      results: ['Reduced stockouts by 60%', 'Improved inventory turnover by 35%', 'Saved $75k annually in carrying costs'],
      testimonial: {
        content: 'RestockTime transformed our inventory management completely. We went from constant stockouts to perfect availability.',
        author: 'Sarah Johnson',
        role: 'Operations Manager',
        company: 'TechStore Inc.'
      }
    }
  },
  {
    id: '2',
    title: 'Sunday Edge Pro - Web Scraping',
    description: 'Professional web scraping platform with advanced anti-detection, proxy rotation, and real-time data extraction capabilities.',
    longDescription: 'Sunday Edge Pro is a sophisticated web scraping platform designed for enterprise-level data extraction with advanced anti-detection mechanisms.',
    category: 'automation',
    technologies: [
      { name: 'Python', category: 'backend', proficiency: 9, yearsOfExperience: 4 },
      { name: 'Scrapy', category: 'backend', proficiency: 8, yearsOfExperience: 2 },
      { name: 'React', category: 'frontend', proficiency: 9, yearsOfExperience: 3 },
      { name: 'PostgreSQL', category: 'database', proficiency: 7, yearsOfExperience: 2 }
    ],
    screenshots: [
      { id: 'sunday-edge-1', url: '/projects/sunday-edge-dashboard.jpg', alt: 'Sunday Edge Dashboard', type: 'image' }
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
        averageSessionDuration: 320,
        bounceRate: 0.18,
        conversionRate: 0.12
      },
      businessImpact: {
        revenueImpact: 200000,
        costSavings: 120000,
        efficiencyGain: 0.45,
        userSatisfactionScore: 4.9
      },
      technicalComplexity: 9
    },
    liveDemo: {
      type: 'interactive',
      component: 'LiveScraperDemo',
      description: 'Interactive demo of Sunday Edge Pro scraper'
    },
    caseStudy: {
      challenge: 'Enterprise needed large-scale web scraping with anti-detection capabilities for competitive intelligence.',
      solution: 'Developed sophisticated web scraping platform with advanced stealth mechanisms and distributed architecture.',
      results: ['Scraped 10M+ pages daily', 'Zero detection incidents', 'Reduced data acquisition costs by 80%'],
      testimonial: {
        content: 'Sunday Edge Pro exceeded our expectations. The anti-detection features are unmatched in the industry.',
        author: 'Michael Chen',
        role: 'Head of Data Intelligence',
        company: 'DataCorp Analytics'
      }
    }
  },
  {
    id: '3',
    title: 'Shuk Online - E-commerce Platform',
    description: 'Modern e-commerce marketplace platform with vendor management, advanced search, and integrated payment processing.',
    longDescription: 'Shuk Online is a comprehensive multi-vendor e-commerce marketplace connecting buyers with sellers in a seamless digital environment.',
    category: 'e-commerce',
    technologies: [
      { name: 'React', category: 'frontend', proficiency: 9, yearsOfExperience: 3 },
      { name: 'Next.js', category: 'frontend', proficiency: 9, yearsOfExperience: 2 },
      { name: 'Node.js', category: 'backend', proficiency: 8, yearsOfExperience: 3 },
      { name: 'Stripe', category: 'backend', proficiency: 7, yearsOfExperience: 1 },
      { name: 'PostgreSQL', category: 'database', proficiency: 7, yearsOfExperience: 2 }
    ],
    screenshots: [
      { id: 'shuk-online-1', url: '/projects/shuk-online-homepage.jpg', alt: 'Shuk Online Homepage', type: 'image' }
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
        averageSessionDuration: 380,
        bounceRate: 0.22,
        conversionRate: 0.06
      },
      businessImpact: {
        revenueImpact: 300000,
        costSavings: 50000,
        efficiencyGain: 0.25,
        userSatisfactionScore: 4.5
      },
      technicalComplexity: 7
    },
    liveDemo: {
      type: 'interactive',
      component: 'CRMShowcase',
      description: 'Interactive demo of Shuk Online CRM system'
    },
    caseStudy: {
      challenge: 'Startup needed a multi-vendor marketplace to connect local sellers with customers in a competitive market.',
      solution: 'Created full-featured e-commerce platform with vendor management, payment processing, and mobile optimization.',
      results: ['Launched with 200+ vendors', 'Processed $300k in first quarter', 'Achieved 4.5/5 user satisfaction'],
      testimonial: {
        content: 'Shuk Online gave us the platform we needed to compete with major marketplaces. The vendor tools are exceptional.',
        author: 'David Rodriguez',
        role: 'Founder & CEO',
        company: 'Local Market Solutions'
      }
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