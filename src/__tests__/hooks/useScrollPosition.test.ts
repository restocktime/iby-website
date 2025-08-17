import { renderHook, act } from '@testing-library/react'
import { useScrollPosition } from '@/hooks/useScrollPosition'

// Mock window.scrollY
Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
})

describe('useScrollPosition Hook', () => {
  beforeEach(() => {
    window.scrollY = 0
  })

  it('returns initial scroll position', () => {
    const { result } = renderHook(() => useScrollPosition())
    expect(result.current).toBe(0)
  })

  it('updates scroll position on scroll event', () => {
    const { result } = renderHook(() => useScrollPosition())
    
    act(() => {
      window.scrollY = 100
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(100)
  })

  it('throttles scroll events', () => {
    jest.useFakeTimers()
    const { result } = renderHook(() => useScrollPosition())
    
    act(() => {
      window.scrollY = 50
      window.dispatchEvent(new Event('scroll'))
      window.scrollY = 100
      window.dispatchEvent(new Event('scroll'))
      window.scrollY = 150
      window.dispatchEvent(new Event('scroll'))
    })

    // Should not update immediately due to throttling
    expect(result.current).toBe(0)

    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Should update to the latest value after throttle delay
    expect(result.current).toBe(150)

    jest.useRealTimers()
  })

  it('cleans up event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useScrollPosition())
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })
})