import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono, Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { PerformanceMonitor } from "@/components/ui/PerformanceWrapper";
import { AccessibilityProvider, AccessibilityPanel } from "@/components/ui/AccessibilityProvider";
import { AccessibilityValidator } from "@/components/ui/AccessibilityValidator";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { PWAInstaller } from "@/components/pwa/PWAInstaller";
import { OfflineManager } from "@/components/pwa/OfflineManager";
import { MobileNavigation } from "@/components/mobile/MobileNavigation";
import { OrientationHandler } from "@/components/mobile/OrientationHandler";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-luxury",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-modern",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Isaac Benyakar - Full Stack Developer & Automation Expert",
    template: "%s | Isaac Benyakar"
  },
  description: "Interactive portfolio showcasing web development, automation, custom CRM solutions, web scraping, and business intelligence by Isaac Benyakar. Specializing in React, Next.js, and custom business solutions.",
  keywords: [
    "Isaac Benyakar",
    "Full Stack Developer",
    "Web Development",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "JavaScript Developer",
    "Node.js Developer",
    "Python Developer",
    "Automation Expert",
    "Web Scraping Services",
    "Custom CRM Development",
    "Business Intelligence",
    "Google Analytics Implementation",
    "Discord Bot Development",
    "Website Monitoring",
    "E-commerce Solutions",
    "Freelance Developer",
    "Remote Developer",
    "API Development",
    "Database Design",
    "UI/UX Development",
    "Responsive Design",
    "Performance Optimization",
    "SEO Optimization",
    "Portfolio Website"
  ],
  authors: [{ name: "Isaac Benyakar", url: "https://isaacbenyakar.com" }],
  creator: "Isaac Benyakar",
  publisher: "Isaac Benyakar",
  category: "Technology",
  classification: "Business",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://isaacbenyakar.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://isaacbenyakar.com',
    title: 'Isaac Benyakar - Full Stack Developer & Automation Expert',
    description: 'Interactive portfolio showcasing web development, automation, custom CRM solutions, web scraping, and business intelligence by Isaac Benyakar.',
    siteName: 'Isaac Benyakar Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Isaac Benyakar - Full Stack Developer Portfolio showcasing interactive projects and automation solutions',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'Isaac Benyakar - Full Stack Developer',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@isaacbenyakar',
    creator: '@isaacbenyakar',
    title: 'Isaac Benyakar - Full Stack Developer & Automation Expert',
    description: 'Interactive portfolio showcasing web development, automation, and custom business solutions.',
    images: {
      url: '/twitter-image.jpg',
      alt: 'Isaac Benyakar - Full Stack Developer Portfolio',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#0ea5e9' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
  other: {
    'theme-color': '#0ea5e9',
    'color-scheme': 'dark light',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Isaac Benyakar',
    'application-name': 'Isaac Benyakar Portfolio',
    'msapplication-TileColor': '#0ea5e9',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://isaacbenyakar.com/#person",
        "name": "Isaac Benyakar",
        "givenName": "Isaac",
        "familyName": "Benyakar",
        "jobTitle": "Full Stack Developer & Automation Expert",
        "description": "Full Stack Developer specializing in web development, automation, custom CRM solutions, web scraping, and business intelligence",
        "url": "https://isaacbenyakar.com",
        "image": "https://isaacbenyakar.com/profile-image.jpg",
        "email": "isaac@isaacbenyakar.com",
        "telephone": "+1-555-0123",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US",
          "addressRegion": "Remote"
        },
        "sameAs": [
          "https://github.com/isaacbenyakar",
          "https://linkedin.com/in/isaacbenyakar",
          "https://twitter.com/isaacbenyakar",
          "https://discord.com/users/isaac#1234"
        ],
        "knowsAbout": [
          "Web Development",
          "React",
          "Next.js",
          "TypeScript",
          "JavaScript",
          "Node.js",
          "Python",
          "Automation",
          "Web Scraping",
          "Custom CRM Development",
          "Google Analytics",
          "Business Intelligence",
          "E-commerce Solutions",
          "Discord Bot Development",
          "Website Monitoring",
          "Data Analysis"
        ],
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Full Stack Developer",
          "description": "Develops web applications, automation tools, and custom business solutions",
          "skills": [
            "React Development",
            "Next.js Applications",
            "TypeScript Programming",
            "Web Scraping",
            "Automation Systems",
            "Custom CRM Development",
            "Google Analytics Implementation",
            "Discord Bot Creation",
            "Website Monitoring",
            "E-commerce Solutions"
          ]
        },
        "worksFor": {
          "@type": "Organization",
          "name": "Freelance Developer",
          "description": "Independent full stack developer and automation specialist"
        },
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "Self-Taught Developer"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://isaacbenyakar.com/#website",
        "url": "https://isaacbenyakar.com",
        "name": "Isaac Benyakar - Full Stack Developer Portfolio",
        "description": "Interactive portfolio showcasing web development, automation, custom CRM solutions, web scraping, and business intelligence by Isaac Benyakar",
        "publisher": {
          "@id": "https://isaacbenyakar.com/#person"
        },
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://isaacbenyakar.com/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://isaacbenyakar.com/#service",
        "name": "Isaac Benyakar Development Services",
        "description": "Professional web development, automation, and custom business solution services",
        "provider": {
          "@id": "https://isaacbenyakar.com/#person"
        },
        "areaServed": "Worldwide",
        "serviceType": [
          "Web Development",
          "Custom CRM Development",
          "Web Scraping Services",
          "Automation Solutions",
          "Google Analytics Implementation",
          "Discord Bot Development",
          "Website Monitoring",
          "E-commerce Development"
        ],
        "url": "https://isaacbenyakar.com",
        "telephone": "+1-555-0123",
        "email": "isaac@isaacbenyakar.com"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} ${montserrat.variable} font-sans antialiased`}
      >
        {/* Skip Links */}
        <div className="sr-only focus-within:not-sr-only">
          <a 
            href="#main-content" 
            className="skip-link absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
          >
            Skip to main content
          </a>
          <a 
            href="#navigation" 
            className="skip-link absolute top-4 left-40 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
          >
            Skip to navigation
          </a>
          <a 
            href="#contact" 
            className="skip-link absolute top-4 left-72 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
          >
            Skip to contact
          </a>
        </div>
        <Providers>
          <AccessibilityProvider>
            <ErrorBoundary level="page">
              <PerformanceMonitor>
                <ServiceWorkerRegistration />
                <OfflineManager>
                  <OrientationHandler preferredOrientation="portrait">
                    {children}
                    <MobileNavigation />
                    <PWAInstaller />
                  </OrientationHandler>
                </OfflineManager>
              </PerformanceMonitor>
            </ErrorBoundary>
            <AccessibilityPanel />
            <AccessibilityValidator />
          </AccessibilityProvider>
        </Providers>
      </body>
    </html>
  );
}
