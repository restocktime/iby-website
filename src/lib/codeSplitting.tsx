/**
 * Code Splitting Utilities
 * Provides optimized dynamic imports and lazy loading strategies
 */

import dynamic from 'next/dynamic';
import { ComponentType, ReactElement, Suspense } from 'react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Loading components for different scenarios
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

const LoadingCard = () => (
  <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full"></div>
);

const Loading3D = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-lg">
    <div className="animate-pulse bg-gray-700 rounded-lg h-32 w-32 mb-4"></div>
    <p className="text-gray-400">Loading 3D scene...</p>
  </div>
);

const LoadingChart = () => (
  <div className="animate-pulse bg-gray-100 rounded-lg h-80 w-full flex items-center justify-center">
    <div className="text-gray-400">Loading visualization...</div>
  </div>
);

// Dynamic import configurations for different component types
export const dynamicImportConfigs = {
  // Heavy 3D components - no SSR, custom loading
  threejs: {
    loading: Loading3D,
    ssr: false,
  },
  
  // Charts and visualizations - no SSR, chart loading
  chart: {
    loading: LoadingChart,
    ssr: false,
  },
  
  // Admin components - no SSR, spinner loading
  admin: {
    loading: LoadingSpinner,
    ssr: false,
  },
  
  // Regular components - with SSR, card loading
  component: {
    loading: LoadingCard,
    ssr: true,
  },
  
  // Modal components - no loading (instant)
  modal: {
    ssr: false,
  },
};

// Enhanced dynamic import wrapper with error boundaries
export function createDynamicComponent<T = Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  config: keyof typeof dynamicImportConfigs = 'component',
  errorFallback?: ReactElement
) {
  const DynamicComponent = dynamic(importFn, dynamicImportConfigs[config]);
  
  return function WrappedDynamicComponent(props: T) {
    return (
      <ErrorBoundary fallback={errorFallback}>
        <Suspense fallback={dynamicImportConfigs[config].loading?.() || <LoadingSpinner />}>
          <DynamicComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

// Pre-configured dynamic components for common use cases
export const DynamicComponents = {
  // 3D and WebGL components
  ParticleSystem: createDynamicComponent(
    () => import('@/components/sections/hero/ParticleSystem'),
    'threejs'
  ),
  
  FloatingCards: createDynamicComponent(
    () => import('@/components/sections/hero/FloatingCards'),
    'threejs'
  ),
  
  // Charts and visualizations
  SkillsRadarChart: createDynamicComponent(
    () => import('@/components/sections/skills/SkillsRadarChart'),
    'chart'
  ),
  
  TechnologyNetwork: createDynamicComponent(
    () => import('@/components/sections/skills/TechnologyNetwork'),
    'chart'
  ),
  
  LiveMetrics: createDynamicComponent(
    () => import('@/components/sections/projects/LiveMetrics'),
    'chart'
  ),
  
  // Admin components
  AnalyticsDashboard: createDynamicComponent(
    () => import('@/components/admin/AnalyticsDashboard'),
    'admin'
  ),
  
  ProjectManager: createDynamicComponent(
    () => import('@/components/admin/ProjectManager'),
    'admin'
  ),
  
  RealTimeAnalyticsDashboard: createDynamicComponent(
    () => import('@/components/admin/RealTimeAnalyticsDashboard'),
    'admin'
  ),
  
  // Modal components
  ProjectDetailModal: createDynamicComponent(
    () => import('@/components/sections/projects/ProjectDetailModal'),
    'modal'
  ),
  
  // Heavy interactive components
  ContactForm: createDynamicComponent(
    () => import('@/components/sections/contact/SmartContactForm'),
    'component'
  ),
  
  ScraperDashboard: createDynamicComponent(
    () => import('@/components/sections/projects/ScraperDashboard'),
    'component'
  ),
};

// Lazy loading hook for intersection-based loading
export function useLazyLoad<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    threshold?: number;
    rootMargin?: string;
    config?: keyof typeof dynamicImportConfigs;
  } = {}
) {
  const { threshold = 0.1, rootMargin = '50px', config = 'component' } = options;
  
  // This would typically use intersection observer
  // For now, return the dynamic component directly
  return createDynamicComponent(importFn, config);
}

// Preload utilities for critical components
export const preloadComponents = {
  // Preload critical above-the-fold components
  preloadCritical: () => {
    // Preload hero section components
    import('@/components/sections/HeroSection');
    import('@/components/sections/hero/TypewriterText');
    import('@/components/sections/hero/ScrollIndicator');
  },
  
  // Preload components likely to be needed soon
  preloadLikely: () => {
    // Preload project showcase components
    import('@/components/sections/ProjectShowcase');
    import('@/components/sections/projects/ProjectGrid');
    import('@/components/sections/projects/ProjectCard');
  },
  
  // Preload admin components when user shows admin intent
  preloadAdmin: () => {
    import('@/components/admin/AnalyticsDashboard');
    import('@/components/admin/ProjectManager');
    import('@/components/admin/MetricsManager');
  },
  
  // Preload 3D components when user shows interaction intent
  preload3D: () => {
    import('@/components/sections/hero/ParticleSystem');
    import('@/components/sections/hero/FloatingCards');
  },
};

// Bundle splitting strategies
export const bundleStrategies = {
  // Split by feature
  byFeature: {
    hero: () => import('@/components/sections/HeroSection'),
    projects: () => import('@/components/sections/ProjectShowcase'),
    skills: () => import('@/components/sections/SkillsVisualization'),
    contact: () => import('@/components/sections/ContactSection'),
  },
  
  // Split by technology
  byTechnology: {
    threejs: () => import('@/lib/three-components'),
    charts: () => import('@/lib/chart-components'),
    forms: () => import('@/lib/form-components'),
    admin: () => import('@/lib/admin-components'),
  },
  
  // Split by user journey
  byJourney: {
    landing: () => import('@/lib/landing-components'),
    exploration: () => import('@/lib/exploration-components'),
    engagement: () => import('@/lib/engagement-components'),
    conversion: () => import('@/lib/conversion-components'),
  },
};

// Performance monitoring for dynamic imports
export function trackDynamicImport(componentName: string) {
  const startTime = performance.now();
  
  return {
    onLoad: () => {
      const loadTime = performance.now() - startTime;
      
      // Track loading performance
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'dynamic_import_load', {
          component_name: componentName,
          load_time: Math.round(loadTime),
        });
      }
      
      console.log(`Dynamic import loaded: ${componentName} (${Math.round(loadTime)}ms)`);
    },
    
    onError: (error: Error) => {
      // Track loading errors
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'dynamic_import_error', {
          component_name: componentName,
          error_message: error.message,
        });
      }
      
      console.error(`Dynamic import failed: ${componentName}`, error);
    },
  };
}

// Utility to create optimized dynamic imports with tracking
export function createTrackedDynamicComponent<T = Record<string, unknown>>(
  componentName: string,
  importFn: () => Promise<{ default: ComponentType<T> }>,
  config: keyof typeof dynamicImportConfigs = 'component'
) {
  const tracker = trackDynamicImport(componentName);
  
  const enhancedImportFn = async () => {
    try {
      const moduleResult = await importFn();
      tracker.onLoad();
      return moduleResult;
    } catch (error) {
      tracker.onError(error as Error);
      throw error;
    }
  };
  
  return createDynamicComponent(enhancedImportFn, config);
}