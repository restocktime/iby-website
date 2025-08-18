'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  ArrowRightIcon,
  CodeBracketIcon,
  CogIcon,
  GlobeAltIcon,
  ChartBarIcon,
  PlayIcon,
  RocketLaunchIcon,
  StarIcon,
  BoltIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import HeroSection from './HeroSection'
import { ContactSection } from './ContactSection'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

// Mini project showcase component
const ProjectPreview = ({ title, description, tech, demoType, link }: {
  title: string
  description: string
  tech: string[]
  demoType: 'interactive' | 'visual' | 'data'
  link: string
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const getDemoIcon = () => {
    switch (demoType) {
      case 'interactive': return PlayIcon
      case 'visual': return EyeIcon
      case 'data': return ChartBarIcon
      default: return PlayIcon
    }
  }

  const DemoIcon = getDemoIcon()

  return (
    <motion.div
      className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 overflow-hidden"
      whileHover={{ scale: 1.02, y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5"
        animate={{ 
          background: isHovered 
            ? "linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(6, 182, 212, 0.1) 100%)"
            : "linear-gradient(45deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 50%, rgba(6, 182, 212, 0.05) 100%)"
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Demo icon */}
      <motion.div
        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <DemoIcon className="w-6 h-6 text-white" />
      </motion.div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
        {title}
      </h3>
      <p className="text-slate-300 text-sm mb-4 line-clamp-2">
        {description}
      </p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tech.slice(0, 3).map((item) => (
          <span
            key={item}
            className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
          >
            {item}
          </span>
        ))}
        {tech.length > 3 && (
          <span className="text-slate-400 text-xs px-2 py-1">
            +{tech.length - 3} more
          </span>
        )}
      </div>

      {/* Action button */}
      <Link href={link}>
        <motion.button
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium group-hover:gap-3 transition-all"
          whileHover={{ x: 5 }}
        >
          <span>View Project</span>
          <ArrowRightIcon className="w-4 h-4" />
        </motion.button>
      </Link>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
        initial={{ x: '-200%' }}
        animate={{ x: isHovered ? '200%' : '-200%' }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

// Skills teaser component
const SkillsTeaser = () => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  const skills = [
    { name: 'React/Next.js', level: 95, color: 'from-blue-400 to-cyan-400' },
    { name: 'TypeScript', level: 90, color: 'from-blue-600 to-blue-700' },
    { name: 'Python', level: 88, color: 'from-yellow-400 to-yellow-600' },
    { name: 'Node.js', level: 90, color: 'from-green-500 to-green-600' },
  ]

  return (
    <motion.div
      ref={ref}
      className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <BoltIcon className="w-6 h-6 text-blue-400" />
        <h3 className="text-2xl font-bold text-white">Core Technologies</h3>
      </div>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={skill.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">{skill.name}</span>
              <span className="text-slate-400 text-sm">{skill.level}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: isInView ? `${skill.level}%` : 0 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>

      <Link href="/skills">
        <motion.button
          className="mt-6 flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium group transition-colors"
          whileHover={{ x: 5 }}
        >
          <span>View All Skills</span>
          <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </Link>
    </motion.div>
  )
}

// Services teaser component
const ServicesTeaser = () => {
  const services = [
    {
      title: 'Web Development',
      description: 'Modern, responsive applications',
      icon: CodeBracketIcon,
      color: 'from-blue-500 to-cyan-500',
      link: '/services/web-development'
    },
    {
      title: 'Automation',
      description: 'Custom workflow solutions',
      icon: CogIcon,
      color: 'from-purple-500 to-violet-500',
      link: '/services/automation'
    },
    {
      title: 'CRM Solutions',
      description: 'Tailored business systems',
      icon: GlobeAltIcon,
      color: 'from-emerald-500 to-teal-500',
      link: '/services/crm-development'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {services.map((service, index) => {
        const Icon = service.icon
        return (
          <motion.div
            key={service.title}
            className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <motion.div
              className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
            
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
              {service.title}
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              {service.description}
            </p>
            
            <Link href={service.link}>
              <motion.button
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium group-hover:gap-3 transition-all"
                whileHover={{ x: 5 }}
              >
                <span>Learn More</span>
                <ArrowRightIcon className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function HomeContent() {
  const featuredProjects = [
    {
      title: 'RestockTime - Inventory Management',
      description: 'Advanced inventory management system with real-time tracking and automated alerts for e-commerce businesses.',
      tech: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
      demoType: 'interactive' as const,
      link: '/projects/restocktime'
    },
    {
      title: 'Sunday Edge Pro - Web Scraping',
      description: 'Professional web scraping platform with advanced anti-detection and proxy rotation capabilities.',
      tech: ['Python', 'Scrapy', 'React', 'PostgreSQL'],
      demoType: 'data' as const,
      link: '/projects/sunday-edge-pro'
    },
    {
      title: 'Shuk Online - E-commerce Platform',
      description: 'Modern multi-vendor marketplace with advanced search and integrated payment processing.',
      tech: ['React', 'Next.js', 'Node.js', 'Stripe', 'MongoDB'],
      demoType: 'visual' as const,
      link: '/projects/shuk-online'
    }
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <ErrorBoundary level="section">
        <HeroSection />
      </ErrorBoundary>

      {/* Main content container with proper centering */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-24">
        
        {/* Featured Projects Preview */}
        <ErrorBoundary level="section">
          <motion.section
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-16">
              <motion.div
                className="inline-flex items-center gap-3 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <RocketLaunchIcon className="w-8 h-8 text-blue-400" />
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Featured Projects
                </h2>
                <StarIcon className="w-8 h-8 text-yellow-400" />
              </motion.div>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Explore live, interactive projects with real-world applications and cutting-edge technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <ProjectPreview {...project} />
                </motion.div>
              ))}
            </div>

            <Link href="/projects">
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3 mx-auto"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>View All Projects</span>
                <ArrowRightIcon className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.section>
        </ErrorBoundary>

        {/* Skills & Services Grid */}
        <ErrorBoundary level="section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Skills Preview */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <SkillsTeaser />
            </motion.div>

            {/* Services Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="text-center lg:text-left">
                <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center lg:justify-start gap-3">
                  <GlobeAltIcon className="w-7 h-7 text-purple-400" />
                  Services
                </h3>
                <p className="text-slate-300 mb-8">
                  Professional development services tailored to your business needs
                </p>
              </div>
              <ServicesTeaser />
            </motion.div>
          </div>
        </ErrorBoundary>

        {/* Call to Action */}
        <ErrorBoundary level="section">
          <motion.section
            className="text-center bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-12 border border-slate-700/30"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Let's discuss your project and create a custom solution that drives results
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 shadow-xl hover:shadow-2xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start a Project
                </motion.button>
              </Link>
              <Link href="/projects">
                <motion.button
                  className="border-2 border-slate-600 hover:border-slate-500 text-white hover:bg-slate-800/50 px-8 py-4 rounded-2xl font-medium transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Portfolio
                </motion.button>
              </Link>
            </div>
          </motion.section>
        </ErrorBoundary>
      </div>

      {/* Contact Section */}
      <ErrorBoundary level="section">
        <ContactSection />
      </ErrorBoundary>
    </div>
  )
}