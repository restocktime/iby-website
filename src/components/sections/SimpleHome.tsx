'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon, CodeBracketIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import HeroSection from './HeroSection'
import { ContactSection } from './ContactSection'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

export default function SimpleHome() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <ErrorBoundary level="section">
        <HeroSection />
      </ErrorBoundary>

      {/* Main content with proper centering */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
        {/* Simple Featured Projects Section */}
        <section className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Featured Projects
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Explore live, interactive projects with real-world applications
              </p>
            </div>

            {/* Simple Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  title: 'RestockTime',
                  description: 'Advanced inventory management system with real-time tracking',
                  link: '/projects/restocktime'
                },
                {
                  title: 'Sunday Edge Pro',
                  description: 'Professional web scraping platform with anti-detection',
                  link: '/projects/sunday-edge-pro'
                },
                {
                  title: 'Shuk Online',
                  description: 'Modern e-commerce marketplace platform',
                  link: '/projects/shuk-online'
                }
              ].map((project, index) => (
                <motion.div
                  key={project.title}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <CodeBracketIcon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-slate-300 text-sm mb-4">{project.description}</p>
                  
                  <Link href={project.link}>
                    <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium">
                      <span>View Project</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>

            <Link href="/projects">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 shadow-xl">
                View All Projects
              </button>
            </Link>
          </motion.div>
        </section>

        {/* Simple Skills Preview */}
        <section className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">Core Technologies</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { name: 'React/Next.js', level: 95 },
                { name: 'TypeScript', level: 90 },
                { name: 'Python', level: 88 },
                { name: 'Node.js', level: 90 }
              ].map((skill, index) => (
                <div key={skill.name} className="bg-slate-800/30 rounded-xl p-4">
                  <div className="text-white font-medium mb-2">{skill.name}</div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 1 }}
                    />
                  </div>
                  <div className="text-slate-400 text-sm mt-1">{skill.level}%</div>
                </div>
              ))}
            </div>

            <Link href="/skills">
              <button className="text-blue-400 hover:text-blue-300 font-medium">
                View All Skills →
              </button>
            </Link>
          </motion.div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-12 border border-slate-700/30">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss your project and create a custom solution
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-medium">
                  Start a Project
                </button>
              </Link>
              <Link href="/projects">
                <button className="border-2 border-slate-600 hover:border-slate-500 text-white hover:bg-slate-800/50 px-8 py-4 rounded-2xl font-medium">
                  View Portfolio
                </button>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Contact Section */}
      <ErrorBoundary level="section">
        <ContactSection />
      </ErrorBoundary>
    </div>
  )
}