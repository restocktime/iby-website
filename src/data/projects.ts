export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: 'e-commerce' | 'construction' | 'saas' | 'automation';
  technologies: string[];
  status: 'live' | 'development' | 'completed';
  url?: string;
  github?: string;
  image: string;
  images: string[];
  metrics?: {
    label: string;
    value: string;
  }[];
  features: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  caseStudy?: {
    problem: string;
    solution: string;
    results: string[];
    approach: string[];
  };
}

export const projects: Project[] = [
  {
    id: 'restocktime',
    title: 'Restocktime',
    description: 'Elite Discord community and automation platform for high-demand e-commerce products with real-time monitoring.',
    longDescription: 'Restocktime is a successful 7+ year e-commerce automation business providing real-time monitoring and scraping tools for sneakers and collectibles. Built and scaled to serve thousands of users with advanced Discord bot integration.',
    category: 'e-commerce',
    technologies: ['Python', 'Discord API', 'Web Scraping', 'Real-time Analytics', 'Database Management'],
    status: 'live',
    url: 'https://restocktime.com',
    image: '/projects/restocktime-hero.svg',
    images: ['/projects/restocktime-dashboard.jpg', '/projects/restocktime-discord.jpg'],
    metrics: [
      { label: 'Years in Operation', value: '7+' },
      { label: 'Twitter Followers', value: '8,971' },
      { label: 'Discord Channels', value: '30+' },
      { label: 'Daily Notifications', value: '1,000+' }
    ],
    features: [
      'Real-time product monitoring across multiple retailers',
      'Advanced web scraping with anti-detection measures',
      'Discord bot with instant notifications',
      'User management and subscription system',
      'Analytics dashboard for performance tracking'
    ],
    caseStudy: {
      problem: 'E-commerce enthusiasts needed real-time alerts for limited-edition product drops across multiple retailers, but manual monitoring was impossible at scale.',
      solution: 'Built a comprehensive automation platform with intelligent web scraping, real-time notifications, and community management features.',
      results: [
        'Successfully operated for 7+ years with consistent profitability',
        'Built community of 8,971 Twitter followers',
        'Processing 1,000+ daily product notifications',
        'Achieved 99.9% uptime for critical monitoring systems'
      ],
      approach: [
        'Developed robust scraping infrastructure with rotating proxies',
        'Implemented Discord bot with custom notification system',
        'Built scalable database architecture for product tracking',
        'Created user management and billing systems'
      ]
    }
  },
  {
    id: 'scarce-us',
    title: 'Scarce.us',
    description: 'High-performance Shopify store with custom automation and inventory management.',
    longDescription: 'Custom e-commerce solution built on Shopify with advanced automation features for inventory management and order processing.',
    category: 'e-commerce',
    technologies: ['Shopify', 'JavaScript', 'Python', 'API Integration', 'Automation'],
    status: 'live',
    url: 'https://scarce.us',
    image: '/projects/scarce-hero.svg',
    images: ['/projects/scarce-product.jpg', '/projects/scarce-automation.jpg'],
    features: [
      'Custom Shopify theme optimization',
      'Automated inventory management',
      'Real-time order processing',
      'Performance optimization for mobile'
    ]
  },
  {
    id: 'yossi-co',
    title: 'Yossi.co',
    description: 'Premium e-commerce platform with advanced product catalog and payment processing.',
    longDescription: 'Full-stack e-commerce solution with custom product management and seamless checkout experience.',
    category: 'e-commerce',
    technologies: ['React', 'Node.js', 'Stripe', 'MongoDB', 'AWS'],
    status: 'live',
    url: 'https://yossi.co',
    image: '/projects/yossi-hero.svg',
    images: ['/projects/yossi-catalog.jpg', '/projects/yossi-checkout.jpg'],
    features: [
      'Custom product catalog with advanced filtering',
      'Secure payment processing with Stripe',
      'Responsive design for all devices',
      'Admin dashboard for inventory management'
    ]
  },
  {
    id: 'the-citipros',
    title: 'The CitiPros',
    description: 'Construction project management platform with automated scheduling and client communication.',
    longDescription: 'Comprehensive project management solution for construction companies with automated workflows and client portal.',
    category: 'construction',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Twilio'],
    status: 'live',
    url: 'https://thecitipros.com',
    image: '/projects/citipros-hero.svg',
    images: ['/projects/citipros-dashboard.jpg', '/projects/citipros-mobile.jpg'],
    features: [
      'Project timeline management',
      'Automated client notifications',
      'Photo documentation system',
      'Billing and invoice generation'
    ]
  },
  {
    id: 'tri-boro-garage',
    title: 'Tri-Boro Garage Doors',
    description: 'Service scheduling platform with automated customer communication and inventory tracking.',
    longDescription: 'Digital transformation solution for garage door services including online booking and inventory management.',
    category: 'construction',
    technologies: ['WordPress', 'PHP', 'MySQL', 'JavaScript', 'API Integration'],
    status: 'live',
    url: 'https://triborogaragedoors.com',
    image: '/projects/tri-boro-hero.svg',
    images: ['/projects/tri-boro-booking.jpg', '/projects/tri-boro-inventory.jpg'],
    features: [
      'Online service booking system',
      'Automated email confirmations',
      'Inventory tracking for parts',
      'Customer portal for service history'
    ]
  },
  {
    id: 'im-workflow',
    title: 'IM-Workflow AutoBusiness',
    description: 'AI-powered business process automation platform with custom workflow builder.',
    longDescription: 'Advanced automation platform helping businesses streamline operations with intelligent workflow automation.',
    category: 'saas',
    technologies: ['React', 'Node.js', 'Python', 'AI/ML', 'PostgreSQL'],
    status: 'live',
    url: 'https://im-workflow.com',
    image: '/projects/im-workflow-hero.svg',
    images: ['/projects/im-workflow-builder.jpg', '/projects/im-workflow-analytics.jpg'],
    features: [
      'Visual workflow builder',
      'AI-powered process optimization',
      'Integration with popular business tools',
      'Real-time analytics dashboard'
    ]
  },
  {
    id: 'hsg-nationwide',
    title: 'HSG Nationwide',
    description: 'Enterprise analytics platform with custom reporting and data visualization.',
    longDescription: 'Comprehensive business intelligence solution with advanced analytics and custom reporting capabilities.',
    category: 'saas',
    technologies: ['React', 'Python', 'PostgreSQL', 'D3.js', 'AWS'],
    status: 'live',
    url: 'https://hsgnationwide.com',
    image: '/projects/hsg-hero.svg',
    images: ['/projects/hsg-analytics.jpg', '/projects/hsg-reports.jpg'],
    features: [
      'Custom report generation',
      'Interactive data visualizations',
      'Real-time data processing',
      'Multi-tenant architecture'
    ]
  }
];

export const getProjectsByCategory = (category: Project['category']) => {
  return projects.filter(project => project.category === category);
};

export const getFeaturedProjects = () => {
  return projects.slice(0, 4);
};