import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { AnimationProvider } from '@/contexts/AnimationContext'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationProvider>
        <AnimationProvider>
          {children}
        </AnimationProvider>
      </NavigationProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock data generators
export const mockProject = {
  id: '1',
  title: 'Test Project',
  description: 'A test project description',
  technologies: ['React', 'TypeScript', 'Next.js'],
  liveUrl: 'https://example.com',
  githubUrl: 'https://github.com/test/repo',
  imageUrl: '/test-image.jpg',
  featured: true,
  category: 'web-development',
  metrics: {
    performanceScore: 95,
    userEngagement: 85,
    businessImpact: 90,
    technicalComplexity: 80,
  },
  status: 'completed' as const,
}

export const mockSkill = {
  name: 'React',
  level: 90,
  category: 'frontend',
  yearsOfExperience: 5,
  projects: ['project1', 'project2'],
}

export const mockContactData = {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'This is a test message',
  subject: 'Test Subject',
  urgency: 'medium' as const,
}

// Test helpers
export const waitForAnimation = (duration = 1000) => {
  return new Promise(resolve => setTimeout(resolve, duration))
}

export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
  window.IntersectionObserver = mockIntersectionObserver
  window.IntersectionObserverEntry = jest.fn()
}

export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn()
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
  window.ResizeObserver = mockResizeObserver
}

export const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

export const mockScrollTo = () => {
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: jest.fn(),
  })
}

export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  })
  return localStorageMock
}

export const mockSessionStorage = () => {
  const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  })
  return sessionStorageMock
}

// Performance testing helpers
export const mockPerformanceObserver = () => {
  const mockPerformanceObserver = jest.fn()
  mockPerformanceObserver.mockImplementation((callback) => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(() => []),
  }))
  window.PerformanceObserver = mockPerformanceObserver
  return mockPerformanceObserver
}

export const mockWebVitals = () => {
  const mockEntries = [
    {
      name: 'first-contentful-paint',
      startTime: 1000,
      entryType: 'paint',
    },
    {
      name: 'largest-contentful-paint',
      startTime: 1500,
      entryType: 'largest-contentful-paint',
    },
  ]

  Object.defineProperty(window, 'performance', {
    writable: true,
    value: {
      ...window.performance,
      getEntriesByType: jest.fn().mockReturnValue(mockEntries),
      getEntriesByName: jest.fn().mockReturnValue(mockEntries),
      mark: jest.fn(),
      measure: jest.fn(),
      now: jest.fn(() => Date.now()),
    },
  })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'

// Override render method
export { customRender as render }