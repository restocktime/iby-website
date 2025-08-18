import { Project } from '@/types'

export const sampleProjects: Project[] = [
  {
    id: 'sunday-edge-pro',
    title: 'Sunday Edge Pro',
    description: 'Advanced sports betting analytics platform with 89.3% prediction accuracy and real-time odds tracking across multiple sportsbooks.',
    longDescription: 'Sunday Edge Pro is a comprehensive sports betting analytics platform that leverages machine learning algorithms and real-time data processing to provide users with highly accurate predictions. The platform aggregates odds from multiple sportsbooks, analyzes historical performance data, and applies advanced statistical models to deliver 89.3% prediction accuracy. Features include real-time odds comparison, automated betting strategies, risk management tools, and detailed performance analytics to help both casual and professional bettors make informed decisions.',
    technologies: [
      { name: 'Next.js', category: 'frontend', proficiency: 9, yearsOfExperience: 4 },
      { name: 'TypeScript', category: 'frontend', proficiency: 9, yearsOfExperience: 5 },
      { name: 'Python', category: 'backend', proficiency: 8, yearsOfExperience: 6 },
      { name: 'PostgreSQL', category: 'database', proficiency: 8, yearsOfExperience: 4 },
      { name: 'Redis', category: 'database', proficiency: 7, yearsOfExperience: 3 },
      { name: 'Docker', category: 'tool', proficiency: 8, yearsOfExperience: 3 },
      { name: 'AWS', category: 'cloud', proficiency: 7, yearsOfExperience: 3 }
    ],
    liveUrl: 'https://sundayedgepro.com',
    githubUrl: 'https://github.com/restocktime',
    demoCredentials: {
      username: 'demo@sundayedge.com',
      password: 'demo123',
      instructions: 'Use the demo account to explore the analytics dashboard and prediction models.'
    },
    metrics: {
      performanceScore: 9,
      userEngagement: {
        averageSessionDuration: 1800,
        bounceRate: 15,
        conversionRate: 12,
        monthlyActiveUsers: 2500
      },
      businessImpact: {
        revenueImpact: 150000,
        costSavings: 50000,
        efficiencyGain: 85,
        userSatisfactionScore: 9.2
      },
      technicalComplexity: 9
    },
    screenshots: [
      {
        id: 'se-1',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&crop=center&auto=format&q=80',
        alt: 'Sunday Edge Pro Dashboard - Sports Analytics Platform',
        type: 'image',
        caption: 'Advanced sports betting analytics dashboard with real-time predictions'
      },
      {
        id: 'se-2',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&crop=center&auto=format&q=80',
        alt: 'Sports Prediction Models Interface',
        type: 'image',
        caption: 'Machine learning prediction models for sports betting'
      }
    ],
    caseStudy: {
      challenge: 'Sports bettors needed accurate, real-time analytics to make informed decisions across multiple sportsbooks with varying odds and markets.',
      solution: 'Built a comprehensive platform using machine learning algorithms, real-time data processing, and advanced statistical models to provide 89.3% accurate predictions.',
      results: [
        '89.3% prediction accuracy achieved',
        '2,500+ active monthly users',
        '$150K+ revenue generated for users',
        '85% improvement in betting efficiency'
      ],
      testimonial: {
        content: 'Sunday Edge Pro transformed my betting strategy. The accuracy is incredible and the interface is intuitive.',
        author: 'Mike Johnson',
        role: 'Professional Sports Bettor',
        company: 'Independent',
        avatar: '/api/placeholder/100/100'
      }
    },
    status: 'active',
    featured: true,
    category: 'analytics'
  },
  {
    id: 'restocktime',
    title: 'Restocktime',
    description: 'E-commerce inventory management and restock prediction system helping retailers optimize their supply chain and reduce stockouts.',
    longDescription: 'Restocktime is an AI-powered inventory management solution designed specifically for e-commerce retailers. The platform uses predictive analytics to forecast demand patterns, optimize restock timing, and prevent both stockouts and overstock situations. Key features include automated supplier communications, multi-channel inventory sync, seasonal demand forecasting, and comprehensive reporting dashboards. The system integrates with popular e-commerce platforms and provides actionable insights to improve inventory turnover and reduce carrying costs.',
    technologies: [
      { name: 'React', category: 'frontend', proficiency: 9, yearsOfExperience: 5 },
      { name: 'Node.js', category: 'backend', proficiency: 8, yearsOfExperience: 4 },
      { name: 'MongoDB', category: 'database', proficiency: 7, yearsOfExperience: 3 },
      { name: 'Express.js', category: 'backend', proficiency: 8, yearsOfExperience: 4 },
      { name: 'Stripe', category: 'tool', proficiency: 7, yearsOfExperience: 2 }
    ],
    liveUrl: 'https://restock-time.info',
    metrics: {
      performanceScore: 8,
      userEngagement: {
        averageSessionDuration: 1200,
        bounceRate: 25,
        conversionRate: 8,
        monthlyActiveUsers: 1200
      },
      businessImpact: {
        revenueImpact: 75000,
        costSavings: 30000,
        efficiencyGain: 60,
        userSatisfactionScore: 8.5
      },
      technicalComplexity: 7
    },
    screenshots: [
      {
        id: 'rt-1',
        url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=800&fit=crop&crop=center&auto=format&q=80',
        alt: 'Restocktime Inventory Dashboard',
        type: 'image',
        caption: 'E-commerce inventory management and restock prediction dashboard'
      }
    ],
    caseStudy: {
      challenge: 'E-commerce retailers struggled with inventory management, leading to frequent stockouts and overstock situations.',
      solution: 'Developed an AI-powered platform that predicts optimal restock times based on sales patterns, seasonality, and market trends.',
      results: [
        '60% reduction in stockouts',
        '40% decrease in overstock situations',
        '$75K+ revenue increase for clients',
        '1,200+ active retailers using the platform'
      ]
    },
    status: 'active',
    featured: false,
    category: 'e-commerce'
  },
  {
    id: 'shuk-online',
    title: 'Shuk Online',
    description: 'Modern e-commerce platform for Middle Eastern grocery delivery with real-time inventory and multi-language support.',
    longDescription: 'Shuk Online is a specialized e-commerce marketplace tailored for Middle Eastern grocery delivery services. The platform features real-time inventory management for perishable goods, multi-language support (Arabic, Hebrew, English), and integrated delivery logistics. Built with cultural preferences in mind, it includes features like halal product filtering, bulk ordering options, and flexible payment methods including cash on delivery. The platform serves both individual consumers and restaurants, with specialized wholesale pricing and inventory management tools.',
    technologies: [
      { name: 'Next.js', category: 'frontend', proficiency: 9, yearsOfExperience: 4 },
      { name: 'Prisma', category: 'database', proficiency: 8, yearsOfExperience: 2 },
      { name: 'PostgreSQL', category: 'database', proficiency: 8, yearsOfExperience: 4 },
      { name: 'Stripe', category: 'tool', proficiency: 7, yearsOfExperience: 2 },
      { name: 'Vercel', category: 'cloud', proficiency: 8, yearsOfExperience: 3 }
    ],
    liveUrl: 'http://shukonline.com',
    metrics: {
      performanceScore: 8,
      userEngagement: {
        averageSessionDuration: 900,
        bounceRate: 30,
        conversionRate: 15,
        monthlyActiveUsers: 800
      },
      businessImpact: {
        revenueImpact: 45000,
        costSavings: 15000,
        efficiencyGain: 50,
        userSatisfactionScore: 8.8
      },
      technicalComplexity: 6
    },
    screenshots: [
      {
        id: 'so-1',
        url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&crop=center&auto=format&q=80',
        alt: 'Shuk Online E-commerce Platform',
        type: 'image',
        caption: 'Middle Eastern grocery delivery platform with modern storefront'
      }
    ],
    caseStudy: {
      challenge: 'Middle Eastern grocery stores needed an online presence with specialized inventory management for perishable goods.',
      solution: 'Built a full-stack e-commerce platform with real-time inventory, multi-language support, and specialized delivery logistics.',
      results: [
        '800+ monthly active customers',
        '15% conversion rate achieved',
        '50% increase in operational efficiency',
        'Multi-language support for diverse customer base'
      ]
    },
    status: 'active',
    featured: false,
    category: 'e-commerce'
  },
  {
    id: 'google-scraper-suite',
    title: 'Google Scraper Suite',
    description: 'Comprehensive web scraping toolkit for Google services including Search, Maps, Shopping, and Images with anti-detection measures.',
    longDescription: 'Google Scraper Suite is a professional-grade web scraping toolkit designed for large-scale data extraction from Google services. The suite includes specialized scrapers for Google Search, Maps, Shopping, and Images, all equipped with sophisticated anti-detection mechanisms. Features include rotating proxy support, CAPTCHA solving integration, intelligent rate limiting, and distributed scraping architecture. The platform provides APIs for easy integration, real-time monitoring dashboards, and data export in multiple formats. Built for businesses requiring reliable, large-scale data collection while maintaining compliance with terms of service.',
    technologies: [
      { name: 'Python', category: 'backend', proficiency: 9, yearsOfExperience: 6 },
      { name: 'Selenium', category: 'tool', proficiency: 8, yearsOfExperience: 4 },
      { name: 'BeautifulSoup', category: 'tool', proficiency: 9, yearsOfExperience: 5 },
      { name: 'Scrapy', category: 'tool', proficiency: 8, yearsOfExperience: 3 },
      { name: 'Proxy Management', category: 'tool', proficiency: 8, yearsOfExperience: 3 }
    ],
    githubUrl: 'https://github.com/isaac-benyakar/google-scraper-suite',
    metrics: {
      performanceScore: 9,
      userEngagement: {
        averageSessionDuration: 0,
        bounceRate: 0,
        conversionRate: 0,
        monthlyActiveUsers: 150
      },
      businessImpact: {
        revenueImpact: 25000,
        costSavings: 40000,
        efficiencyGain: 90,
        userSatisfactionScore: 9.5
      },
      technicalComplexity: 8
    },
    screenshots: [
      {
        id: 'gs-1',
        url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&h=800&fit=crop&crop=center&auto=format&q=80',
        alt: 'Google Scraper Suite Dashboard',
        type: 'image',
        caption: 'Comprehensive web scraping toolkit with monitoring dashboard'
      }
    ],
    caseStudy: {
      challenge: 'Businesses needed reliable, large-scale data extraction from Google services while avoiding detection and rate limiting.',
      solution: 'Developed a sophisticated scraping suite with rotating proxies, CAPTCHA solving, and intelligent rate limiting.',
      results: [
        '90% success rate in data extraction',
        '150+ businesses using the tools',
        '$40K+ cost savings for clients',
        'Zero detection incidents in 6 months'
      ]
    },
    status: 'active',
    featured: true,
    category: 'scraping'
  },
  {
    id: 'website-monitor-pro',
    title: 'Website Monitor Pro',
    description: 'Advanced website monitoring system with real-time alerts, performance tracking, and automated incident response.',
    longDescription: 'Website Monitor Pro is a comprehensive monitoring solution that provides 24/7 surveillance of website uptime, performance, and security. The platform offers real-time alerting through multiple channels (Discord, email, SMS), detailed performance analytics, and automated incident response capabilities. Features include synthetic transaction monitoring, SSL certificate tracking, DNS monitoring, and integration with popular communication platforms. The system provides detailed SLA reporting, historical performance data, and customizable dashboards for technical teams and stakeholders.',
    technologies: [
      { name: 'Node.js', category: 'backend', proficiency: 8, yearsOfExperience: 4 },
      { name: 'React', category: 'frontend', proficiency: 9, yearsOfExperience: 5 },
      { name: 'WebSocket', category: 'tool', proficiency: 7, yearsOfExperience: 2 },
      { name: 'Puppeteer', category: 'tool', proficiency: 8, yearsOfExperience: 3 },
      { name: 'Discord API', category: 'tool', proficiency: 8, yearsOfExperience: 2 }
    ],
    liveUrl: 'https://websitemonitorpro.com',
    demoCredentials: {
      username: 'demo@monitor.com',
      password: 'monitor123',
      instructions: 'Explore the monitoring dashboard and set up test alerts.'
    },
    metrics: {
      performanceScore: 8,
      userEngagement: {
        averageSessionDuration: 1500,
        bounceRate: 20,
        conversionRate: 10,
        monthlyActiveUsers: 500
      },
      businessImpact: {
        revenueImpact: 35000,
        costSavings: 25000,
        efficiencyGain: 75,
        userSatisfactionScore: 8.9
      },
      technicalComplexity: 7
    },
    screenshots: [
      {
        id: 'wm-1',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&crop=center&auto=format&q=80',
        alt: 'Website Monitor Pro Dashboard',
        type: 'image',
        caption: 'Real-time website monitoring dashboard'
      }
    ],
    liveDemo: {
      type: 'interactive',
      component: 'LiveScraperDemo',
      description: 'Interactive demo showing real-time web scraping and data extraction in action'
    },
    caseStudy: {
      challenge: 'Businesses needed proactive website monitoring with instant notifications and detailed performance analytics.',
      solution: 'Built a comprehensive monitoring platform with multi-channel alerts, performance tracking, and automated response systems.',
      results: [
        '99.9% uptime monitoring accuracy',
        '500+ websites under monitoring',
        '75% faster incident response time',
        'Multi-channel alert system (Discord, Email, SMS)'
      ]
    },
    status: 'active',
    featured: false,
    category: 'monitoring'
  },
  {
    id: 'custom-crm-healthcare',
    title: 'Healthcare CRM Solution',
    description: 'HIPAA-compliant CRM system for healthcare providers with patient management, appointment scheduling, and billing integration.',
    longDescription: 'Healthcare CRM Solution is a specialized customer relationship management system designed specifically for healthcare providers. The platform ensures full HIPAA compliance while providing comprehensive patient management, appointment scheduling, and integrated billing capabilities. Features include secure patient portals, automated appointment reminders, insurance verification, treatment planning tools, and detailed reporting for practice management. The system includes role-based access controls, audit trails, and encrypted data storage to meet strict healthcare privacy requirements while improving operational efficiency.',
    technologies: [
      { name: 'React', category: 'frontend', proficiency: 9, yearsOfExperience: 5 },
      { name: 'Node.js', category: 'backend', proficiency: 8, yearsOfExperience: 4 },
      { name: 'PostgreSQL', category: 'database', proficiency: 8, yearsOfExperience: 4 },
      { name: 'HIPAA Compliance', category: 'tool', proficiency: 7, yearsOfExperience: 2 },
      { name: 'Stripe', category: 'tool', proficiency: 7, yearsOfExperience: 2 }
    ],
    metrics: {
      performanceScore: 9,
      userEngagement: {
        averageSessionDuration: 2400,
        bounceRate: 10,
        conversionRate: 25,
        monthlyActiveUsers: 300
      },
      businessImpact: {
        revenueImpact: 120000,
        costSavings: 60000,
        efficiencyGain: 80,
        userSatisfactionScore: 9.3
      },
      technicalComplexity: 9
    },
    screenshots: [
      {
        id: 'hc-1',
        url: '/api/placeholder/800/600',
        alt: 'Healthcare CRM Dashboard',
        type: 'image',
        caption: 'Patient management dashboard'
      }
    ],
    caseStudy: {
      challenge: 'Healthcare providers needed a HIPAA-compliant CRM system that could handle patient data securely while streamlining operations.',
      solution: 'Developed a comprehensive CRM with end-to-end encryption, audit trails, and integrated billing and scheduling systems.',
      results: [
        'HIPAA compliance achieved',
        '300+ healthcare providers using system',
        '80% improvement in patient management efficiency',
        '$120K+ revenue increase for clients'
      ]
    },
    status: 'completed',
    featured: true,
    category: 'crm'
  }
]