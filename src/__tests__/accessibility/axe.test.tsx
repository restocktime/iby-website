import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ContactSection } from '@/components/sections/ContactSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectShowcase } from '@/components/sections/ProjectShowcase'
import { SkillsVisualization } from '@/components/sections/SkillsVisualization'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

describe('Accessibility Tests with axe-core', () => {
  it('HeroSection should not have accessibility violations', async () => {
    const { container } = render(<HeroSection />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('ProjectShowcase should not have accessibility violations', async () => {
    const { container } = render(<ProjectShowcase />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('SkillsVisualization should not have accessibility violations', async () => {
    const { container } = render(<SkillsVisualization />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('ContactSection should not have accessibility violations', async () => {
    const { container } = render(<ContactSection />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should pass accessibility tests with specific rules', async () => {
    const { container } = render(<ContactSection />)
    
    const results = await axe(container, {
      rules: {
        // Test specific accessibility rules
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true },
        'aria-labels': { enabled: true },
        'semantic-markup': { enabled: true },
      },
    })
    
    expect(results).toHaveNoViolations()
  })

  it('should handle dynamic content accessibility', async () => {
    const { container, rerender } = render(<ProjectShowcase />)
    
    // Test initial state
    let results = await axe(container)
    expect(results).toHaveNoViolations()
    
    // Test after re-render (simulating dynamic content changes)
    rerender(<ProjectShowcase />)
    results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})