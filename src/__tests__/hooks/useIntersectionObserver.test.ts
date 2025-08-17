import { renderHook } from '@testing-library/react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { RefObject } from 'react'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
const mockDisconnect = jest.fn()

mockIntersectionObserver.mockReturnValue({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
})

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
})

describe('useIntersectionObserver Hook', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear()
    mockObserve.mockClear()
    mockUnobserve.mockClear()
    mockDisconnect.mockClear()
  })

  it('creates IntersectionObserver with correct options', () => {
    const mockRef = { current: document.createElement('div') } as RefObject<HTMLDivElement>
    const options = { threshold: 0.5, rootMargin: '10px' }
    
    renderHook(() => useIntersectionObserver(mockRef, options))
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      options
    )
  })

  it('observes element when ref is available', () => {
    const mockElement = document.createElement('div')
    const mockRef = { current: mockElement } as RefObject<HTMLDivElement>
    
    renderHook(() => useIntersectionObserver(mockRef))
    
    expect(mockObserve).toHaveBeenCalledWith(mockElement)
  })

  it('does not observe when ref is null', () => {
    const mockRef = { current: null } as RefObject<HTMLDivElement>
    
    renderHook(() => useIntersectionObserver(mockRef))
    
    expect(mockObserve).not.toHaveBeenCalled()
  })

  it('returns initial intersection state', () => {
    const mockRef = { current: document.createElement('div') } as RefObject<HTMLDivElement>
    const { result } = renderHook(() => useIntersectionObserver(mockRef))
    
    expect(result.current).toEqual({
      isIntersecting: false,
      intersectionRatio: 0,
      boundingClientRect: null,
      intersectionRect: null,
      rootBounds: null,
      time: 0,
    })
  })

  it('disconnects observer on unmount', () => {
    const mockRef = { current: document.createElement('div') } as RefObject<HTMLDivElement>
    const { unmount } = renderHook(() => useIntersectionObserver(mockRef))
    
    unmount()
    
    expect(mockDisconnect).toHaveBeenCalled()
  })
})