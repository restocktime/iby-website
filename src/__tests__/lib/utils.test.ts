import { cn, formatDate, debounce, throttle, clamp } from '@/lib/utils'

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('combines class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('handles conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
    })

    it('handles undefined and null values', () => {
      expect(cn('base', undefined, null, 'end')).toBe('base end')
    })

    it('handles arrays of classes', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
    })
  })

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-12-25T12:00:00Z')
      const formatted = formatDate(date)
      expect(formatted).toContain('December')
      expect(formatted).toContain('2023')
    })

    it('handles different date formats', () => {
      const date = new Date('2023-01-01T12:00:00Z')
      const formatted = formatDate(date, { month: 'short', day: 'numeric' })
      expect(formatted).toContain('Jan')
      expect(formatted).toContain('1')
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()

    it('delays function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('cancels previous calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    afterAll(() => {
      jest.useRealTimers()
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('limits function execution frequency', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(100)
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('clamp', () => {
    it('clamps value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(15, 0, 10)).toBe(10)
    })

    it('handles edge cases', () => {
      expect(clamp(0, 0, 0)).toBe(0)
      expect(clamp(5, 5, 5)).toBe(5)
    })
  })
})