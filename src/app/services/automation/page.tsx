import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon, CheckCircleIcon, CogIcon, BoltIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Business Automation Services - Streamline Your Operations',
  description: 'Professional business automation services including workflow automation, web scraping, data processing, and custom business solutions.',
  openGraph: {
    title: 'Business Automation Services - Streamline Your Operations | Isaac Benyakar',
    description: 'Professional business automation services including workflow automation, web scraping, data processing, and custom business solutions.',
    images: ['/services/automation-og.jpg'],
  }
}

const services = [
  {
    title: "Workflow Automation",
    description: "Streamline repetitive tasks and business processes with intelligent automation",
    features: [
      "Process analysis & optimization",
      "Custom automation scripts",
      "Email & notification automation",
      "Data entry automation",
      "Report generation",
      "Integration with existing tools"
    ],
    icon: CogIcon
  },
  {
    title: "Web Scraping & Data Extraction", 
    description: "Extract valuable data from websites and transform it into actionable insights",
    features: [
      "Large-scale web scraping",
      "Anti-detection mechanisms",
      "Data cleaning & validation",
      "Real-time monitoring",
      "API development",
      "Scheduled data collection"
    ],
    icon: BoltIcon
  },
  {
    title: "Business Intelligence",
    description: "Transform raw data into meaningful insights and automated reports",
    features: [
      "Custom dashboards",
      "Automated reporting",
      "Data visualization",
      "KPI tracking",
      "Predictive analytics",
      "Real-time monitoring"
    ],
    icon: ChartBarIcon
  }
]

const solutions = [
  {
    title: "E-commerce Automation",
    description: "Automate inventory management, pricing, and product updates",
    features: [
      "Inventory synchronization",
      "Price monitoring & updates",
      "Product data management",
      "Order processing automation",
      "Competitor analysis",
      "Review monitoring"
    ]
  },
  {
    title: "Marketing Automation",
    description: "Automate lead generation, email campaigns, and social media",
    features: [
      "Lead scoring & routing",
      "Email campaign automation",
      "Social media posting",
      "Analytics reporting",
      "CRM integration",
      "A/B testing automation"
    ]
  },
  {
    title: "Financial Automation",
    description: "Streamline accounting, invoicing, and financial reporting",
    features: [
      "Invoice generation",
      "Payment processing",
      "Expense tracking",
      "Financial reporting",
      "Tax preparation",
      "Budget monitoring"
    ]
  }
]

const technologies = [
  "Python", "JavaScript", "Node.js", "Selenium", "Scrapy", "BeautifulSoup",
  "Pandas", "NumPy", "Apache Airflow", "Zapier", "AWS Lambda", "Docker"
]

const pricing = [
  {
    name: "Basic Automation",
    price: "$1,500 - $5,000",
    description: "Simple workflow automation for small tasks",
    features: [
      "Process analysis",
      "Single workflow automation",
      "Basic error handling",
      "Documentation",
      "Email notifications",
      "30-day support"
    ]
  },
  {
    name: "Advanced Automation",
    price: "$5,000 - $15,000", 
    description: "Complex multi-step automation solutions",
    features: [
      "Multiple workflow automation",
      "API integrations",
      "Custom dashboard",
      "Advanced error handling",
      "Monitoring & alerts",
      "90-day support"
    ],
    popular: true
  },
  {
    name: "Enterprise Solution",
    price: "$15,000+",
    description: "Full-scale automation platform",
    features: [
      "Custom automation platform",
      "Scalable architecture",
      "Real-time monitoring",
      "Advanced analytics",
      "Full integration suite",
      "Ongoing maintenance"
    ]
  }
]

export default function AutomationPage() {
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
            Business Automation Services
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Streamline your business operations with custom automation solutions. 
            Save time, reduce errors, and scale your operations with intelligent automation.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Automate Your Business
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div key={index} className="bg-slate-900 rounded-xl p-8 border border-slate-800">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-purple-400" />
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

        {/* Industry Solutions */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Industry Solutions</h2>
            <p className="text-slate-300">Specialized automation solutions for different business needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <div key={index} className="bg-slate-900 rounded-xl p-8 border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-4">{solution.title}</h3>
                <p className="text-slate-300 mb-6">{solution.description}</p>
                <ul className="space-y-2">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0 mt-2" />
                      <span className="text-slate-300 text-sm">{feature}</span>
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
            <h2 className="text-3xl font-bold text-white mb-4">Automation Technologies</h2>
            <p className="text-slate-300">Powerful tools and technologies for building robust automation solutions</p>
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

        {/* Benefits Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-8 border border-slate-800">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose Automation?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">80%</div>
                <div className="text-slate-300">Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">95%</div>
                <div className="text-slate-300">Error Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-slate-300">Operation</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">3-6x</div>
                <div className="text-slate-300">ROI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Automation Packages</h2>
            <p className="text-slate-300">Flexible pricing options to fit your automation needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-slate-900 rounded-xl p-8 border ${
                  plan.popular ? 'border-purple-500 relative' : 'border-slate-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-300 text-sm mb-4">{plan.description}</p>
                  <div className="text-3xl font-bold text-purple-400">{plan.price}</div>
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
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Automate Your Business?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s analyze your current processes and identify automation opportunities. 
            Get a free consultation to see how automation can transform your operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Start Automation
            </Link>
            <Link
              href="/#projects"
              className="border border-slate-600 hover:border-slate-500 text-white px-8 py-3 rounded-lg font-medium transition-colors hover:bg-slate-800"
            >
              View Examples
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}