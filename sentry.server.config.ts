import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Environment configuration
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  
  // Server-specific configuration
  debug: process.env.NODE_ENV === 'development',
  
  // Error filtering for server-side
  beforeSend(event, hint) {
    // Filter out known non-critical server errors
    if (event.exception) {
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        const message = error.message as string;
        
        // Filter out expected API timeout errors
        if (message.includes('timeout') || message.includes('ECONNRESET')) {
          return null;
        }
      }
    }
    
    return event;
  },
  
  // Tags for better organization
  initialScope: {
    tags: {
      component: 'portfolio-website-server',
    },
  },
});