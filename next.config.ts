import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: [
      'framer-motion', 
      'recharts',
      'react-hook-form',
      'zod',
      'date-fns',
      'lodash-es'
    ],
    optimizeCss: true,
  },

  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Server external packages (moved from experimental)
  serverExternalPackages: ['three', '@react-three/fiber'],

  // Advanced webpack optimizations
  webpack: (config: any, { dev, isServer }) => {
    // Bundle analyzer (only when ANALYZE=true)
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }

    // Optimize for production
    if (!dev && !isServer) {
      // Tree shaking optimizations
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        // Advanced code splitting
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Vendor chunks
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Three.js specific chunk
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: 'three',
              chunks: 'all',
              priority: 20,
            },
            // Animation libraries
            animations: {
              test: /[\\/]node_modules[\\/](framer-motion|react-spring)[\\/]/,
              name: 'animations',
              chunks: 'all',
              priority: 15,
            },
            // UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](recharts|react-hook-form|zod)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 12,
            },
            // Common chunks
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Module concatenation for better minification
      config.optimization.concatenateModules = true;
      
      // Minimize CSS
      config.optimization.minimizer = config.optimization.minimizer || [];
    }

    // Resolve optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
      // Use ES modules where possible
      'lodash': 'lodash-es',
    };

    return config;
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['api.sundayedgepro.com', 'api.restocktime.com', 'api.shukonline.com'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  generateEtags: true,



  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://api.sundayedgepro.com https://api.restocktime.com https://api.shukonline.com https://api.websitemonitorpro.com wss: https://www.google-analytics.com",
              "frame-src 'self' https:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "manifest-src 'self'",
            ].join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      // Service Worker headers
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      // Manifest headers
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/projects',
        destination: '/#projects',
        permanent: true,
      },
      {
        source: '/skills',
        destination: '/#skills',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/#about',
        permanent: true,
      },
    ];
  },

  // Rewrites for API optimization
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health-check',
      },
    ];
  },
};

export default nextConfig;
