import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon, CheckCircleIcon, CodeBracketIcon, DevicePhoneMobileIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Web Development Services - Full Stack Solutions',
  description: 'Professional web development services including React, Next.js, TypeScript, and modern full-stack solutions for businesses and startups.',
  openGraph: {
    title: 'Web Development Services - Full Stack Solutions | Isaac Benyakar',
    description: 'Professional web development services including React, Next.js, TypeScript, and modern full-stack solutions for businesses and startups.',
    images: ['/services/web-development-og.jpg'],
  }
}

const services = [
  {
    title: "Frontend Development",
    description: "Modern, responsive user interfaces built with React, Next.js, and TypeScript",
    features: [
      "React & Next.js applications",
      "TypeScript for type safety",
      "Responsive design for all devices",
      "Performance optimization",
      "SEO optimization",
      "Progressive Web Apps (PWA)"
    ],
    icon: CodeBracketIcon
  },
  {
    title: "Backend Development", 
    description: "Scalable server-side solutions with robust APIs and database design",
    features: [
      "RESTful API development",
      "Database design & optimization",
      "Authentication & authorization",
      "Real-time features with WebSockets",
      "Cloud deployment (AWS, Vercel)",
      "API documentation"
    ],
    icon: GlobeAltIcon
  },
  {
    title: "Mobile-First Design",
    description: "Responsive designs that work perfectly on mobile devices",
    features: [
      "Mobile-first approach",
      "Touch-friendly interfaces",
      "Optimized performance",
      "Cross-browser compatibility",
      "Accessibility compliance",
      "Progressive enhancement"
    ],
    icon: DevicePhoneMobileIcon
  }
]

const technologies = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Python",
  "PostgreSQL", "MongoDB", "Redis", "AWS", "Vercel", "Docker",
  "Tailwind CSS", "Styled Components", "GraphQL", "REST APIs"
]

const pricing = [
  {
    name: "Landing Page",
    price: "$2,500 - $5,000",
    description: "Perfect for showcasing your business",
    features: [
      "Responsive design",
      "SEO optimization", 
      "Contact forms",
      "Performance optimization",
      "Mobile-friendly",
      "Basic analytics"
    ]
  },
  {
    name: "Business Website",
    price: "$5,000 - $15,000", 
    description: "Complete web presence for your business",
    features: [
      "Multi-page website",
      "Content management",
      "E-commerce integration",
      "Advanced SEO",
      "Custom functionality",
      "Admin dashboard"
    ],
    popular: true
  },
  {
    name: "Web Application",
    price: "$15,000+",
    description: "Custom web applications tailored to your needs",
    features: [
      "Custom development",
      "Database integration",
      "User authentication",
      "Real-time features",
      "API integrations",
      "Ongoing support"
    ]
  }
]

export default function WebDevelopmentPage() {
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
            Web Development Services
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Professional full-stack web development services to bring your digital vision to life. 
            From simple landing pages to complex web applications, I deliver modern, scalable solutions.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div key={index} className="bg-slate-900 rounded-xl p-8 border border-slate-800">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-blue-400" />
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

        {/* Technologies */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Technologies & Tools</h2>
            <p className="text-slate-300">I work with modern technologies to deliver cutting-edge solutions</p>
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

        {/* Pricing */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Transparent Pricing</h2>
            <p className="text-slate-300">Choose the package that fits your needs and budget</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-slate-900 rounded-xl p-8 border ${
                  plan.popular ? 'border-blue-500 relative' : 'border-slate-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-300 text-sm mb-4">{plan.description}</p>
                  <div className="text-3xl font-bold text-blue-400">{plan.price}</div>
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
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Something Amazing?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your project and create a web solution that drives results for your business.
            I offer free consultations to understand your needs and provide the best approach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Start Your Project
            </Link>
            <Link
              href="/#projects"
              className="border border-slate-600 hover:border-slate-500 text-white px-8 py-3 rounded-lg font-medium transition-colors hover:bg-slate-800"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}