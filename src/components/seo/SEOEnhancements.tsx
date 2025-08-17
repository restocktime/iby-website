interface SEOEnhancementsProps {
  pageTitle?: string
  pageDescription?: string
  canonicalUrl?: string
  structuredData?: object
  breadcrumbs?: Array<{ name: string; url: string }>
}

export function SEOEnhancements({
  pageTitle,
  pageDescription,
  canonicalUrl,
  structuredData,
  breadcrumbs
}: SEOEnhancementsProps) {
  
  // Generate breadcrumb structured data
  const breadcrumbStructuredData = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  } : null

  return (
    <>
      {breadcrumbStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData)
          }}
        />
      )}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </>
  )
}

// Component for project-specific structured data
export function ProjectStructuredData({ project }: { project: any }) {
  const projectStructuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "creator": {
      "@type": "Person",
      "name": "Isaac Benyakar",
      "@id": "https://isaacbenyakar.com/#person"
    },
    "dateCreated": project.dateCreated,
    "dateModified": project.dateModified,
    "url": project.liveUrl,
    "image": project.screenshots?.[0],
    "keywords": project.technologies?.join(', '),
    "genre": "Web Application",
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "maintainer": {
      "@type": "Person",
      "name": "Isaac Benyakar"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(projectStructuredData)
      }}
    />
  )
}

// Component for service-specific structured data
export function ServiceStructuredData() {
  const servicesStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Isaac Benyakar Development Services",
    "description": "Professional web development and automation services",
    "itemListElement": [
      {
        "@type": "Service",
        "position": 1,
        "name": "Web Development",
        "description": "Custom web applications using React, Next.js, and modern technologies",
        "provider": {
          "@type": "Person",
          "name": "Isaac Benyakar"
        },
        "serviceType": "Web Development",
        "areaServed": "Worldwide"
      },
      {
        "@type": "Service",
        "position": 2,
        "name": "Custom CRM Development",
        "description": "Tailored customer relationship management systems for businesses",
        "provider": {
          "@type": "Person",
          "name": "Isaac Benyakar"
        },
        "serviceType": "CRM Development",
        "areaServed": "Worldwide"
      },
      {
        "@type": "Service",
        "position": 3,
        "name": "Web Scraping Services",
        "description": "Automated data extraction and web scraping solutions",
        "provider": {
          "@type": "Person",
          "name": "Isaac Benyakar"
        },
        "serviceType": "Web Scraping",
        "areaServed": "Worldwide"
      },
      {
        "@type": "Service",
        "position": 4,
        "name": "Automation Solutions",
        "description": "Business process automation and workflow optimization",
        "provider": {
          "@type": "Person",
          "name": "Isaac Benyakar"
        },
        "serviceType": "Automation",
        "areaServed": "Worldwide"
      },
      {
        "@type": "Service",
        "position": 5,
        "name": "Google Analytics Implementation",
        "description": "Custom analytics setup and dashboard creation",
        "provider": {
          "@type": "Person",
          "name": "Isaac Benyakar"
        },
        "serviceType": "Analytics",
        "areaServed": "Worldwide"
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(servicesStructuredData)
      }}
    />
  )
}

// Component for FAQ structured data
export function FAQStructuredData() {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What services does Isaac Benyakar offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Isaac offers full-stack web development, custom CRM development, web scraping services, automation solutions, Google Analytics implementation, Discord bot development, and website monitoring services."
        }
      },
      {
        "@type": "Question",
        "name": "What technologies does Isaac specialize in?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Isaac specializes in React, Next.js, TypeScript, JavaScript, Node.js, Python, and various automation tools. He has expertise in both frontend and backend development."
        }
      },
      {
        "@type": "Question",
        "name": "How can I contact Isaac for a project?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can contact Isaac through email at isaac@isaacbenyakar.com, WhatsApp, Discord, or by using the contact form on his website. He typically responds within 1-4 hours depending on the urgency."
        }
      },
      {
        "@type": "Question",
        "name": "Does Isaac work with clients worldwide?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Isaac works with clients worldwide as a remote developer. He has experience working across different time zones and can accommodate various project requirements."
        }
      },
      {
        "@type": "Question",
        "name": "What makes Isaac's development approach unique?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Isaac combines technical expertise with business intelligence, offering not just development services but also automation solutions that improve business efficiency. His portfolio includes live demos and real-time metrics from actual projects."
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqStructuredData)
      }}
    />
  )
}