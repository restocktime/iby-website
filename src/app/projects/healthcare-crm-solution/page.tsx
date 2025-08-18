import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { DemoRenderer } from '@/components/sections/projects/DemoRenderer'

export const metadata: Metadata = {
  title: 'Healthcare CRM Solution - HIPAA-Compliant Patient Management',
  description: 'HIPAA-compliant CRM system for healthcare providers with patient management, appointment scheduling, and billing integration.',
  openGraph: {
    title: 'Healthcare CRM Solution - HIPAA-Compliant Patient Management | Isaac Benyakar',
    description: 'HIPAA-compliant CRM system for healthcare providers with patient management, appointment scheduling, and billing integration.',
    images: ['/projects/healthcare-crm-og.jpg'],
  }
}

export default function HealthcareCRMSolutionPage() {
  const project = {
    title: "Healthcare CRM Solution",
    description: "HIPAA-compliant CRM system for healthcare providers with patient management, appointment scheduling, and billing integration.",
    longDescription: "Healthcare CRM Solution is a specialized customer relationship management system designed specifically for healthcare providers. The platform ensures full HIPAA compliance while providing comprehensive patient management, appointment scheduling, and integrated billing capabilities. Features include secure patient portals, automated appointment reminders, insurance verification, treatment planning tools, and detailed reporting for practice management. The system includes role-based access controls, audit trails, and encrypted data storage to meet strict healthcare privacy requirements while improving operational efficiency.",
    technologies: [
      "React", "Node.js", "PostgreSQL", "HIPAA Compliance", "Stripe", 
      "TypeScript", "Express.js", "JWT Authentication", "Socket.io",
      "PDF Generation", "Email Automation", "Encryption", "Audit Logging"
    ],
    features: [
      "HIPAA-compliant patient data management and storage",
      "Secure patient portal with encrypted communications",
      "Advanced appointment scheduling and calendar management", 
      "Integrated billing system with insurance claim processing",
      "Automated appointment reminders via SMS and email",
      "Treatment planning and care coordination tools",
      "Insurance verification and eligibility checking",
      "Comprehensive audit trails for compliance reporting",
      "Role-based access controls for different user types",
      "Electronic health record (EHR) integration capabilities",
      "Patient communication tracking and history",
      "Financial reporting and practice analytics dashboard"
    ],
    images: [
      "/projects/healthcare-crm-dashboard.jpg",
      "/projects/healthcare-crm-patient-portal.jpg",
      "/projects/healthcare-crm-scheduling.jpg"
    ],
    status: "Completed & Deployed",
    startDate: "2022-09-01", 
    completionDate: "2023-03-15",
    clientType: "Healthcare Providers",
    projectType: "Healthcare CRM",
    metrics: {
      providers: "300+",
      patients: "15K+",
      uptime: "99.9%",
      satisfaction: "9.3/10"
    },
    compliance: [
      "HIPAA Privacy Rule",
      "HIPAA Security Rule", 
      "HITECH Act",
      "SOC 2 Type II",
      "End-to-End Encryption"
    ]
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
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm flex items-center gap-1">
                  <ShieldCheckIcon className="w-3 h-3" />
                  HIPAA Compliant
                </span>
              </div>

              {/* Compliance Badge */}
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-green-500/30 mb-6">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="text-white font-semibold">HIPAA & Privacy Compliant</h3>
                    <p className="text-green-200 text-sm">Full compliance with healthcare privacy regulations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="lg:w-80">
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-slate-400">Duration</dt>
                    <dd className="text-white font-medium">6.5 months</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Started</dt>
                    <dd className="text-white font-medium">September 2022</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Completed</dt>
                    <dd className="text-white font-medium">March 2023</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Team Size</dt>
                    <dd className="text-white font-medium">Solo Developer</dd>
                  </div>
                </dl>
              </div>

              {/* Platform Metrics */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Platform Metrics</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-slate-400">Healthcare Providers</dt>
                    <dd className="text-white font-medium">{project.metrics.providers}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Patients Managed</dt>
                    <dd className="text-white font-medium">{project.metrics.patients}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">System Uptime</dt>
                    <dd className="text-white font-medium">{project.metrics.uptime}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">User Satisfaction</dt>
                    <dd className="text-white font-medium">{project.metrics.satisfaction}</dd>
                  </div>
                </dl>
              </div>

              {/* Compliance Standards */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Compliance Standards</h3>
                <div className="space-y-2">
                  {project.compliance.map((standard, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                      <span className="text-slate-300 text-sm">{standard}</span>
                    </div>
                  ))}
                </div>
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
            <h2 className="text-2xl font-bold text-white mb-6">System Demo</h2>
            <div className="h-96 bg-slate-800 rounded-lg border border-slate-700">
              <DemoRenderer 
                liveDemo={{
                  type: 'interactive',
                  component: 'CRMShowcase',
                  description: 'Interactive demo of Healthcare CRM patient management system'
                }}
                projectTitle={project.title}
                projectId="healthcare-crm-solution"
              />
            </div>
          </div>
        </div>

        {/* HIPAA Compliance Features */}
        <div className="mb-12">
          <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">HIPAA Compliance & Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                  Data Protection
                </h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• End-to-end encryption</li>
                  <li>• Encrypted database storage</li>
                  <li>• Secure data transmission</li>
                  <li>• Regular security audits</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5 text-blue-400" />
                  Access Control
                </h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Role-based permissions</li>
                  <li>• Multi-factor authentication</li>
                  <li>• Session management</li>
                  <li>• Audit trail logging</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-3">Compliance Features</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• HIPAA risk assessments</li>
                  <li>• Business associate agreements</li>
                  <li>• Breach notification protocols</li>
                  <li>• Regular compliance reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Management Features */}
        <div className="mb-12">
          <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">Patient Management Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Patient Portal</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Secure patient login and dashboard</li>
                  <li>• Appointment scheduling and management</li>
                  <li>• Access to medical records and test results</li>
                  <li>• Direct messaging with healthcare providers</li>
                  <li>• Prescription refill requests</li>
                  <li>• Insurance information management</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Provider Tools</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Comprehensive patient record management</li>
                  <li>• Treatment planning and care coordination</li>
                  <li>• Insurance verification and claim processing</li>
                  <li>• Automated appointment reminders</li>
                  <li>• Financial reporting and analytics</li>
                  <li>• Integration with existing EHR systems</li>
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
              <div className="text-3xl font-bold text-blue-400 mb-2">300+</div>
              <div className="text-slate-300">Healthcare Providers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">15K+</div>
              <div className="text-slate-300">Patients Managed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">80%</div>
              <div className="text-slate-300">Efficiency Gain</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">$120K+</div>
              <div className="text-slate-300">Revenue Increase</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}