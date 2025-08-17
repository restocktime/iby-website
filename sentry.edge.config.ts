import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Performance monitoring for edge runtime
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 1.0,
  
  // Environment configuration
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  
  // Edge-specific configuration
  debug: false, // Keep debug off for edge runtime
  
  // Tags for better organization
  initialScope: {
    tags: {
      component: 'portfolio-website-edge',
    },
  },
});