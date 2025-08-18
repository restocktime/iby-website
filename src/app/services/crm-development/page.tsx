import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon, CheckCircleIcon, UserGroupIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Custom CRM Development Services - Tailored Business Solutions',
  description: 'Custom CRM development services to manage customer relationships, sales pipelines, and business processes with tailored solutions.',
  openGraph: {
    title: 'Custom CRM Development Services - Tailored Business Solutions | Isaac Benyakar',
    description: 'Custom CRM development services to manage customer relationships, sales pipelines, and business processes with tailored solutions.',
    images: ['/services/crm-development-og.jpg'],
  }
}

const services = [
  {
    title: "Customer Relationship Management",
    description: "Comprehensive CRM systems to manage all customer interactions and data",
    features: [
      "Contact & lead management",
      "Interaction tracking",
      "Customer segmentation",
      "Communication history",
      "Customer lifecycle management",
      "360° customer view"
    ],
    icon: UserGroupIcon
  },
  {
    title: "Sales Pipeline Management", 
    description: "Streamline your sales process with automated pipeline management",
    features: [
      "Deal tracking & stages",
      "Sales forecasting",
      "Opportunity management",
      "Quote generation",
      "Commission tracking",
      "Performance analytics"
    ],
    icon: ChartBarIcon
  },
  {
    title: "Business Process Automation",
    description: "Automate repetitive tasks and business workflows within your CRM",
    features: [
      "Workflow automation",
      "Email marketing integration",
      "Task automation",
      "Follow-up reminders",
      "Document management",
      "Reporting automation"
    ],
    icon: CogIcon
  }
]

const features = [
  {
    category: "Core CRM Features",
    items: [
      "Contact & Company Management",
      "Lead Capture & Qualification",
      "Sales Pipeline Tracking",
      "Activity & Task Management",
      "Email Integration",
      "Document Management",
      "Calendar & Scheduling",
      "Mobile Access"
    ]
  },
  {
    category: "Advanced Features",
    items: [
      "Custom Field Creation",
      "Advanced Reporting & Analytics",
      "API Integrations",
      "Email Marketing Automation",
      "Territory Management",
      "Forecasting & Projections",
      "Custom Dashboards",
      "Role-Based Permissions"
    ]
  },
  {
    category: "Industry Specific",
    items: [
      "Real Estate CRM",
      "Healthcare CRM",
      "E-commerce CRM",
      "Manufacturing CRM",
      "Service-Based CRM",
      "B2B Sales CRM",
      "Nonprofit CRM",
      "Agency CRM"
    ]
  }
]

const technologies = [
  "React", "Next.js", "Node.js", "PostgreSQL", "MongoDB", "TypeScript",
  "GraphQL", "REST APIs", "WebSockets", "Redis", "AWS", "Docker"
]

const pricing = [
  {
    name: "Starter CRM",
    price: "$8,000 - $15,000",
    description: "Essential CRM features for small businesses",
    features: [
      "Contact management",
      "Basic sales pipeline",
      "Email integration", 
      "Activity tracking",
      "Basic reporting",
      "Mobile responsive"
    ]
  },
  {
    name: "Professional CRM",
    price: "$15,000 - $35,000", 
    description: "Advanced CRM with automation and integrations",
    features: [
      "Advanced pipeline management",
      "Workflow automation",
      "Custom fields & stages",
      "Advanced reporting",
      "API integrations",
      "Team collaboration tools"
    ],
    popular: true
  },
  {
    name: "Enterprise CRM",
    price: "$35,000+",
    description: "Full-featured CRM platform for large organizations",
    features: [
      "Custom CRM platform",
      "Multi-tenant architecture",
      "Advanced integrations",
      "Custom modules",
      "Enterprise security",
      "Dedicated support"
    ]
  }
]

const integrations = [
  "Salesforce", "HubSpot", "Mailchimp", "Gmail", "Outlook", "Zapier",
  "Stripe", "PayPal", "QuickBooks", "Slack", "Microsoft Teams", "Zoom"
]

export default function CRMDevelopmentPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/#services"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Services
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Custom CRM Development
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Build powerful, tailored CRM solutions that fit your unique business processes. 
            Manage customers, streamline sales, and grow your business with custom-built CRM systems.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Build Your CRM
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div key={index} className="bg-slate-900 rounded-xl p-8 border border-slate-800">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-slate-300 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Comprehensive CRM Features</h2>
            <p className="text-slate-300">Everything you need to manage customer relationships and grow your business</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((category, index) => (
              <div key={index} className="bg-slate-900 rounded-xl p-8 border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-6">{category.category}</h3>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0 mt-2" />
                      <span className="text-slate-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Modern CRM Technologies</h2>
            <p className="text-slate-300">Built with cutting-edge technologies for performance and scalability</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Popular Integrations</h2>
            <p className="text-slate-300">Seamlessly connect with tools you already use</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {integrations.map((integration, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300"
              >
                {integration}
              </span>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-8 border border-slate-800">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Custom CRM?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">50%</div>
                <div className="text-slate-300">Sales Increase</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">30%</div>
                <div className="text-slate-300">Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">25%</div>
                <div className="text-slate-300">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">90%</div>
                <div className="text-slate-300">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">CRM Development Packages</h2>
            <p className="text-slate-300">Choose the CRM solution that fits your business needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-slate-900 rounded-xl p-8 border ${
                  plan.popular ? 'border-green-500 relative' : 'border-slate-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-300 text-sm mb-4">{plan.description}</p>
                  <div className="text-3xl font-bold text-green-400">{plan.price}</div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/#contact"
                  className={`w-full block text-center py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'border border-slate-600 hover:border-slate-500 text-white hover:bg-slate-800'
                  }`}
                >
                  Get Quote
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-slate-900 rounded-xl p-8 md:p-12 border border-slate-800 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your CRM needs and create a solution that perfectly fits your business processes. 
            Get a free consultation to explore how a custom CRM can accelerate your growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Start Your CRM Project
            </Link>
            <Link
              href="/#projects"
              className="border border-slate-600 hover:border-slate-500 text-white px-8 py-3 rounded-lg font-medium transition-colors hover:bg-slate-800"
            >
              View CRM Examples
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}