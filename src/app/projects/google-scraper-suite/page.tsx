import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, CodeBracketIcon } from '@heroicons/react/24/outline'
import { DemoRenderer } from '@/components/sections/projects/DemoRenderer'

export const metadata: Metadata = {
  title: 'Google Scraper Suite - Comprehensive Web Scraping Toolkit',
  description: 'Professional web scraping toolkit for Google services with advanced anti-detection measures, proxy management, and distributed architecture.',
  openGraph: {
    title: 'Google Scraper Suite - Comprehensive Web Scraping Toolkit | Isaac Benyakar',
    description: 'Professional web scraping toolkit for Google services with advanced anti-detection measures, proxy management, and distributed architecture.',
    images: ['/projects/google-scraper-suite-og.jpg'],
  }
}

export default function GoogleScraperSuitePage() {
  const project = {
    title: "Google Scraper Suite",
    description: "Comprehensive web scraping toolkit for Google services including Search, Maps, Shopping, and Images with anti-detection measures.",
    longDescription: "Google Scraper Suite is a professional-grade web scraping toolkit designed for large-scale data extraction from Google services. The suite includes specialized scrapers for Google Search, Maps, Shopping, and Images, all equipped with sophisticated anti-detection mechanisms. Features include rotating proxy support, CAPTCHA solving integration, intelligent rate limiting, and distributed scraping architecture. The platform provides APIs for easy integration, real-time monitoring dashboards, and data export in multiple formats. Built for businesses requiring reliable, large-scale data collection while maintaining compliance with terms of service.",
    technologies: [
      "Python", "Selenium", "BeautifulSoup", "Scrapy", "Proxy Management", 
      "Redis", "PostgreSQL", "Docker", "FastAPI", "React", "TypeScript",
      "CAPTCHA Solving", "Anti-Detection", "Distributed Architecture"
    ],
    features: [
      "Multi-service Google scraping (Search, Maps, Shopping, Images)",
      "Advanced anti-detection and browser fingerprinting protection",
      "Intelligent proxy rotation and IP management system",
      "CAPTCHA solving integration with multiple providers",
      "Real-time monitoring dashboard with performance metrics",
      "Distributed scraping architecture for high-volume operations",
      "RESTful API for easy integration with existing systems",
      "Intelligent rate limiting to avoid detection",
      "Data export in multiple formats (JSON, CSV, XML, SQL)",
      "Scheduled scraping jobs with retry mechanisms",
      "Custom user-agent rotation and session management",
      "Built-in data validation and cleaning pipelines"
    ],
    images: [
      "/projects/google-scraper-dashboard.jpg",
      "/projects/google-scraper-monitoring.jpg",
      "/projects/google-scraper-results.jpg"
    ],
    githubUrl: "https://github.com/isaac-benyakar/google-scraper-suite",
    status: "Active & Maintained",
    startDate: "2022-08-01", 
    completionDate: "2023-02-15",
    clientType: "Enterprise",
    projectType: "Data Extraction Platform",
    metrics: {
      successRate: "90%",
      dailyRequests: "150K+",
      activeClients: "150+",
      uptime: "99.9%"
    }
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
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition-colors border border-slate-600"
                  >
                    <CodeBracketIcon className="w-4 h-4" />
                    View Source Code
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
                    <dd className="text-white font-medium">August 2022</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Completed</dt>
                    <dd className="text-white font-medium">February 2023</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Team Size</dt>
                    <dd className="text-white font-medium">Solo Developer</dd>
                  </div>
                </dl>
              </div>

              {/* Performance Metrics */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-slate-400">Success Rate</dt>
                    <dd className="text-white font-medium">{project.metrics.successRate}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Daily Requests</dt>
                    <dd className="text-white font-medium">{project.metrics.dailyRequests}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Active Clients</dt>
                    <dd className="text-white font-medium">{project.metrics.activeClients}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Uptime</dt>
                    <dd className="text-white font-medium">{project.metrics.uptime}</dd>
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

        {/* Interactive Demo Section */}
        <div className="mb-12">
          <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">Interactive Demo</h2>
            <div className="h-96 bg-slate-800 rounded-lg border border-slate-700">
              <DemoRenderer 
                liveDemo={{
                  type: 'interactive',
                  component: 'LiveScraperDemo',
                  description: 'Interactive demo showing real-time web scraping and data extraction in action'
                }}
                projectTitle={project.title}
                projectId="google-scraper-suite"
              />
            </div>
          </div>
        </div>

        {/* Architecture & Technical Details */}
        <div className="mb-12">
          <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">Technical Architecture</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Anti-Detection Features</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Browser fingerprinting protection</li>
                  <li>• Dynamic user-agent rotation</li>
                  <li>• Request timing randomization</li>
                  <li>• JavaScript execution simulation</li>
                  <li>• Cookie and session management</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Scalability Features</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Distributed worker architecture</li>
                  <li>• Horizontal scaling support</li>
                  <li>• Load balancing across proxies</li>
                  <li>• Queue-based job management</li>
                  <li>• Real-time monitoring & alerts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Results & Impact */}
        <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-6">Results & Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">90%</div>
              <div className="text-slate-300">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">150+</div>
              <div className="text-slate-300">Active Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">$40K+</div>
              <div className="text-slate-300">Cost Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">0</div>
              <div className="text-slate-300">Detection Incidents</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}