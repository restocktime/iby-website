import * as Sentry from '@sentry/nextjs';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track custom metrics
  trackMetric(name: string, value: number, tags?: Record<string, string>) {
    this.metrics.set(name, value);
    
    // Send to Sentry
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `${name}: ${value}`,
      level: 'info',
      data: tags,
    });

    // Send to analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'custom_metric', {
        metric_name: name,
        metric_value: value,
        ...tags,
      });
    }
  }

  // Track page load performance
  trackPageLoad(pageName: string) {
    if (typeof window === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const metrics = {
        dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp_connection: navigation.connectEnd - navigation.connectStart,
        tls_handshake: navigation.secureConnectionStart > 0 
          ? navigation.connectEnd - navigation.secureConnectionStart 
          : 0,
        request_response: navigation.responseEnd - navigation.requestStart,
        dom_processing: navigation.domContentLoadedEventEnd - navigation.responseEnd,
        load_complete: navigation.loadEventEnd - navigation.loadEventStart,
        total_load_time: navigation.loadEventEnd - navigation.fetchStart,
      };

      Object.entries(metrics).forEach(([key, value]) => {
        this.trackMetric(`page_load_${key}`, value, { page: pageName });
      });
    }

    // Track Core Web Vitals
    this.trackCoreWebVitals(pageName);
  }

  // Track Core Web Vitals
  private trackCoreWebVitals(pageName: string) {
    if (typeof window === 'undefined') return;

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.trackMetric('core_web_vitals_lcp', lastEntry.startTime, { page: pageName });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.trackMetric('core_web_vitals_fid', entry.processingStart - entry.startTime, { page: pageName });
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.trackMetric('core_web_vitals_cls', clsValue, { page: pageName });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Track API performance
  trackAPICall(endpoint: string, duration: number, status: number, error?: string) {
    this.trackMetric('api_call_duration', duration, {
      endpoint,
      status: status.toString(),
      success: status < 400 ? 'true' : 'false',
    });

    if (error) {
      Sentry.captureException(new Error(`API Error: ${endpoint} - ${error}`), {
        tags: {
          endpoint,
          status: status.toString(),
        },
      });
    }
  }

  // Track user interactions
  trackInteraction(action: string, element: string, duration?: number) {
    this.trackMetric('user_interaction', duration || 1, {
      action,
      element,
    });

    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: 'engagement',
        event_label: element,
        value: duration,
      });
    }
  }

  // Track errors
  trackError(error: Error, context?: Record<string, any>) {
    Sentry.captureException(error, {
      tags: context,
      extra: {
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      },
    });
  }

  // Get current metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Clear metrics
  clearMetrics() {
    this.metrics.clear();
  }
}

// Analytics integration
export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, properties);
    }
  },

  page: (path: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
        page_path: path,
        page_title: title,
      });
    }
  },

  identify: (userId: string, traits?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
        user_id: userId,
        custom_map: traits,
      });
    }
  },
};

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    performanceMonitor.trackError(new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    performanceMonitor.trackError(new Error(event.reason), {
      type: 'unhandled_promise_rejection',
    });
  });
}

// TypeScript declarations for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}