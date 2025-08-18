import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { DemoRenderer } from '@/components/sections/projects/DemoRenderer'

export const metadata: Metadata = {
  title: 'Sunday Edge Pro - Advanced Web Scraping Platform',
  description: 'Professional web scraping platform with advanced anti-detection, proxy rotation, and real-time data extraction capabilities.',
  openGraph: {
    title: 'Sunday Edge Pro - Advanced Web Scraping Platform | Isaac Benyakar',
    description: 'Professional web scraping platform with advanced anti-detection, proxy rotation, and real-time data extraction capabilities.',
    images: ['/projects/sunday-edge-pro-og.jpg'],
  }
}

export default function SundayEdgeProPage() {
  const project = {
    title: "Sunday Edge Pro",
    description: "Professional web scraping platform with advanced anti-detection, proxy rotation, and real-time data extraction capabilities.",
    longDescription: "Sunday Edge Pro is a sophisticated web scraping platform designed for enterprise-level data extraction. The system features advanced anti-detection mechanisms, intelligent proxy rotation, scheduled scraping jobs, and comprehensive data processing pipelines. Built to handle large-scale operations while maintaining stealth and reliability.",
    technologies: [
      "Python", "Scrapy", "Selenium", "BeautifulSoup", "Redis", "PostgreSQL", 
      "Docker", "Kubernetes", "AWS", "Prometheus", "React", "FastAPI"
    ],
    features: [
      "Advanced anti-detection and browser fingerprinting protection",
      "Intelligent proxy rotation and IP management",
      "Scheduled scraping jobs with retry mechanisms",
      "Real-time data processing and validation",
      "Comprehensive monitoring and alerting system", 
      "RESTful API for data access and job management",
      "Web dashboard for configuration and monitoring",
      "Built-in data export to multiple formats (JSON, CSV, XML)",
      "Distributed scraping across multiple servers",
      "Custom JavaScript execution and dynamic content handling"
    ],
    images: [
      "/projects/sunday-edge-dashboard.jpg",
      "/projects/sunday-edge-scraper.jpg",
      "/projects/sunday-edge-analytics.jpg"
    ],
    demoUrl: "https://demo.sundayedgepro.com",
    githubUrl: "https://github.com/isaacbenyakar/sunday-edge-pro",
    status: "In Production",
    startDate: "2023-03-01", 
    completionDate: "2023-08-30",
    clientType: "Enterprise",
    projectType: "Data Platform"
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/#projects"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Projects
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Project Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
              <p className="text-xl text-slate-300 mb-6">{project.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  {project.status}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  {project.projectType}
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                  {project.clientType}
                </span>
              </div>

              <div className="flex gap-4">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <GlobeAltIcon className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-slate-600 hover:border-slate-500 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    View Code
                  </a>
                )}
              </div>
            </div>

            {/* Project Info */}
            <div className="lg:w-80">
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-slate-400">Duration</dt>
                    <dd className="text-white font-medium">6 months</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Started</dt>
                    <dd className="text-white font-medium">March 2023</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Completed</dt>
                    <dd className="text-white font-medium">August 2023</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Team Size</dt>
                    <dd className="text-white font-medium">Solo Developer</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-6">Project Overview</h2>
              <p className="text-slate-300 leading-relaxed mb-6">{project.longDescription}</p>
              
              <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
              <ul className="space-y-3">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Demo Section */}
        <div className="mb-12">
          <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">Interactive Demo</h2>
            <div className="h-96 bg-slate-800 rounded-lg border border-slate-700">
              <DemoRenderer 
                liveDemo={{
                  type: 'interactive',
                  component: 'LiveScraperDemo',
                  description: 'Interactive demo of Sunday Edge Pro scraper'
                }}
                projectTitle={project.title}
                projectId="sunday-edge-pro"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}