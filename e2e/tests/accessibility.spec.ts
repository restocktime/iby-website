import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('homepage should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('contact section should not have accessibility issues', async ({ page }) => {
    await page.goto('/')
    await page.click('nav a[href="#contact"]')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#contact')
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('keyboard navigation works correctly', async ({ page }) => {
    await page.goto('/')
    
    // Test tab navigation through interactive elements
    await page.keyboard.press('Tab')
    let focusedElement = await page.locator(':focus').first()
    await expect(focusedElement).toBeVisible()

    // Continue tabbing through navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Test Enter key on navigation link
    await page.keyboard.press('Enter')
    
    // Should navigate to the linked section
    await page.waitForTimeout(1000)
    const currentUrl = page.url()
    expect(currentUrl).toContain('#')
  })

  test('skip link is present and functional', async ({ page }) => {
    await page.goto('/')
    
    // Press Tab to focus skip link
    await page.keyboard.press('Tab')
    
    const skipLink = page.locator('[data-testid="skip-link"]')
    await expect(skipLink).toBeFocused()
    
    // Activate skip link
    await page.keyboard.press('Enter')
    
    // Should focus main content
    const mainContent = page.locator('main')
    await expect(mainContent).toBeFocused()
  })

  test('images have appropriate alt text', async ({ page }) => {
    await page.goto('/')
    
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i)
      const alt = await image.getAttribute('alt')
      const role = await image.getAttribute('role')
      
      // Images should have alt text or be marked as decorative
      expect(alt !== null || role === 'presentation').toBeTruthy()
    }
  })

  test('headings follow proper hierarchy', async ({ page }) => {
    await page.goto('/')
    
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    const headingTexts = await headings.allTextContents()
    const headingTags = await headings.evaluateAll(elements => 
      elements.map(el => el.tagName.toLowerCase())
    )
    
    // Should have exactly one h1
    const h1Count = headingTags.filter(tag => tag === 'h1').length
    expect(h1Count).toBe(1)
    
    // Check heading hierarchy (simplified check)
    let previousLevel = 0
    for (const tag of headingTags) {
      const currentLevel = parseInt(tag.charAt(1))
      if (previousLevel > 0) {
        // Heading levels shouldn't skip more than one level
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1)
      }
      previousLevel = currentLevel
    }
  })

  test('form labels are properly associated', async ({ page }) => {
    await page.goto('/')
    await page.click('nav a[href="#contact"]')
    
    // Check form inputs have labels
    const inputs = page.locator('input, textarea, select')
    const inputCount = await inputs.count()
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i)
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')
      
      if (id) {
        // Check if there's a label with matching for attribute
        const label = page.locator(`label[for="${id}"]`)
        const labelExists = await label.count() > 0
        
        // Input should have a label, aria-label, or aria-labelledby
        expect(labelExists || ariaLabel || ariaLabelledBy).toBeTruthy()
      }
    }
  })

  test('color contrast meets WCAG standards', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    
    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    )
    
    expect(contrastViolations).toEqual([])
  })

  test('focus indicators are visible', async ({ page }) => {
    await page.goto('/')
    
    // Test focus on interactive elements
    const interactiveElements = page.locator('button, a, input, textarea, select')
    const elementCount = await interactiveElements.count()
    
    // Test a few interactive elements
    const elementsToTest = Math.min(5, elementCount)
    
    for (let i = 0; i < elementsToTest; i++) {
      const element = interactiveElements.nth(i)
      await element.focus()
      
      // Check if element has visible focus indicator
      const focusStyles = await element.evaluate(el => {
        const styles = window.getComputedStyle(el, ':focus')
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          boxShadow: styles.boxShadow,
        }
      })
      
      // Should have some form of focus indicator
      const hasFocusIndicator = 
        focusStyles.outline !== 'none' ||
        focusStyles.outlineWidth !== '0px' ||
        focusStyles.boxShadow !== 'none'
      
      expect(hasFocusIndicator).toBeTruthy()
    }
  })
})