import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Environment configuration
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  
  // Error filtering
  beforeSend(event, hint) {
    // Filter out known non-critical errors
    if (event.exception) {
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        const message = error.message as string;
        
        // Filter out common browser extension errors
        if (message.includes('Non-Error promise rejection captured')) {
          return null;
        }
        
        // Filter out network errors that are expected
        if (message.includes('NetworkError') || message.includes('fetch')) {
          return null;
        }
      }
    }
    
    return event;
  },
  
  // Additional configuration
  integrations: [
    // Replay integration commented out due to compatibility issues
    // new Sentry.Replay({
    //   maskAllText: true,
    //   blockAllMedia: true,
    // }),
  ],
  
  // Tags for better organization
  initialScope: {
    tags: {
      component: 'portfolio-website',
    },
  },
});