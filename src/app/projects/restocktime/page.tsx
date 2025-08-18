import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { DemoRenderer } from '@/components/sections/projects/DemoRenderer'

export const metadata: Metadata = {
  title: 'RestockTime - Inventory Management System',
  description: 'Advanced inventory management system with real-time tracking, automated alerts, and comprehensive analytics for e-commerce businesses.',
  openGraph: {
    title: 'RestockTime - Inventory Management System | Isaac Benyakar',
    description: 'Advanced inventory management system with real-time tracking, automated alerts, and comprehensive analytics for e-commerce businesses.',
    images: ['/projects/restocktime-og.jpg'],
  }
}

export default function RestockTimePage() {
  const project = {
    title: "RestockTime",
    description: "Advanced inventory management system with real-time tracking, automated alerts, and comprehensive analytics for e-commerce businesses.",
    longDescription: "RestockTime is a comprehensive inventory management solution designed for modern e-commerce businesses. The system provides real-time inventory tracking, automated restock alerts, supplier management, and detailed analytics to help businesses optimize their inventory operations and reduce stockouts.",
    technologies: [
      "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Redis", 
      "WebSocket", "Chart.js", "Tailwind CSS", "Docker", "AWS"
    ],
    features: [
      "Real-time inventory tracking across multiple warehouses",
      "Automated restock alerts and purchase order generation",
      "Supplier management and performance analytics",
      "Advanced reporting and forecasting algorithms",
      "Integration with popular e-commerce platforms",
      "Mobile-responsive dashboard with role-based access",
      "API for third-party integrations",
      "Automated backup and disaster recovery"
    ],
    images: [
      "/projects/restocktime-dashboard.jpg",
      "/projects/restocktime-alerts.jpg", 
      "/projects/restocktime-analytics.jpg"
    ],
    demoUrl: "https://demo.restocktime.com",
    githubUrl: "https://github.com/isaacbenyakar/restocktime",
    status: "In Production",
    startDate: "2023-06-01",
    completionDate: "2024-01-15",
    clientType: "E-commerce Business",
    projectType: "Full-Stack Application"
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
                    <dd className="text-white font-medium">7 months</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Started</dt>
                    <dd className="text-white font-medium">June 2023</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Completed</dt>
                    <dd className="text-white font-medium">January 2024</dd>
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
                  component: 'WebsiteMonitorDemo',
                  description: 'Interactive demo of RestockTime monitoring system'
                }}
                projectTitle={project.title}
                projectId="restocktime"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}