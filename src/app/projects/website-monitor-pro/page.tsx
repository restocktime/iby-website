import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { DemoRenderer } from '@/components/sections/projects/DemoRenderer'

export const metadata: Metadata = {
  title: 'Website Monitor Pro - Advanced Website Monitoring System',
  description: 'Comprehensive website monitoring solution with real-time alerts, performance tracking, and automated incident response.',
  openGraph: {
    title: 'Website Monitor Pro - Advanced Website Monitoring System | Isaac Benyakar',
    description: 'Comprehensive website monitoring solution with real-time alerts, performance tracking, and automated incident response.',
    images: ['/projects/website-monitor-pro-og.jpg'],
  }
}

export default function WebsiteMonitorProPage() {
  const project = {
    title: "Website Monitor Pro",
    description: "Advanced website monitoring system with real-time alerts, performance tracking, and automated incident response.",
    longDescription: "Website Monitor Pro is a comprehensive monitoring solution that provides 24/7 surveillance of website uptime, performance, and security. The platform offers real-time alerting through multiple channels (Discord, email, SMS), detailed performance analytics, and automated incident response capabilities. Features include synthetic transaction monitoring, SSL certificate tracking, DNS monitoring, and integration with popular communication platforms. The system provides detailed SLA reporting, historical performance data, and customizable dashboards for technical teams and stakeholders.",
    technologies: [
      "Node.js", "React", "TypeScript", "WebSocket", "Puppeteer", "Discord API",
      "MongoDB", "Redis", "Docker", "AWS", "Prometheus", "Grafana",
      "Express.js", "Chart.js", "Tailwind CSS"
    ],
    features: [
      "24/7 website uptime monitoring with global checks",
      "Real-time alerts via Discord, email, and SMS",
      "Performance monitoring with detailed metrics",
      "SSL certificate expiration tracking",
      "DNS monitoring and resolution testing",
      "Synthetic transaction monitoring",
      "Custom dashboards with real-time data visualization",
      "SLA reporting and historical performance data",
      "Multi-location monitoring from global servers",
      "Incident management and automated escalation",
      "Integration with popular communication platforms",
      "Custom webhook notifications for incidents"
    ],
    images: [
      "/projects/website-monitor-dashboard.jpg",
      "/projects/website-monitor-alerts.jpg",
      "/projects/website-monitor-analytics.jpg"
    ],
    demoUrl: "https://websitemonitorpro.com",
    status: "Active & Monitoring",
    startDate: "2023-01-01", 
    completionDate: "2023-06-30",
    clientType: "Enterprise & SMB",
    projectType: "Monitoring Platform",
    metrics: {
      uptime: "99.9%",
      sitesMonitored: "500+",
      alertsSent: "10K+",
      responseTime: "< 30s"
    },
    demoCredentials: {
      username: "demo@monitor.com",
      password: "monitor123",
      instructions: "Explore the monitoring dashboard and set up test alerts."
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
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <GlobeAltIcon className="w-4 h-4" />
                    Live Platform
                  </a>
                )}
              </div>

              {/* Demo Credentials */}
              {project.demoCredentials && (
                <div className="mt-6 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-sm font-medium text-white mb-2">Demo Access</h3>
                  <div className="text-sm text-slate-300 space-y-1">
                    <div><span className="text-slate-400">Username:</span> {project.demoCredentials.username}</div>
                    <div><span className="text-slate-400">Password:</span> {project.demoCredentials.password}</div>
                    <div className="text-xs text-slate-400 mt-2">{project.demoCredentials.instructions}</div>
                  </div>
                </div>
              )}
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
                    <dd className="text-white font-medium">January 2023</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Launched</dt>
                    <dd className="text-white font-medium">June 2023</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Team Size</dt>
                    <dd className="text-white font-medium">Solo Developer</dd>
                  </div>
                </dl>
              </div>

              {/* Performance Metrics */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Platform Metrics</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-slate-400">Platform Uptime</dt>
                    <dd className="text-white font-medium">{project.metrics.uptime}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Sites Monitored</dt>
                    <dd className="text-white font-medium">{project.metrics.sitesMonitored}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Alerts Sent</dt>
                    <dd className="text-white font-medium">{project.metrics.alertsSent}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Avg Response</dt>
                    <dd className="text-white font-medium">{project.metrics.responseTime}</dd>
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
                  component: 'WebsiteMonitorDemo',
                  description: 'Interactive demo of Website Monitor Pro monitoring system'
                }}
                projectTitle={project.title}
                projectId="website-monitor-pro"
              />
            </div>
          </div>
        </div>

        {/* Monitoring Features */}
        <div className="mb-12">
          <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">Monitoring Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-3">Uptime Monitoring</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• HTTP/HTTPS status checks</li>
                  <li>• Global monitoring locations</li>
                  <li>• Custom check intervals</li>
                  <li>• Timeout configuration</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-3">Performance Tracking</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Response time monitoring</li>
                  <li>• Page load speed analysis</li>
                  <li>• Resource optimization alerts</li>
                  <li>• Performance benchmarking</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-3">Security Monitoring</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• SSL certificate tracking</li>
                  <li>• HTTPS enforcement checks</li>
                  <li>• DNS monitoring</li>
                  <li>• Security header validation</li>
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
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-slate-300">Platform Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-slate-300">Sites Monitored</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">75%</div>
              <div className="text-slate-300">Faster Response</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">$25K+</div>
              <div className="text-slate-300">Cost Savings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}