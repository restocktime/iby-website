import { test, expect } from '@playwright/test'

test.describe('Visual Regression Tests', () => {
  test('homepage visual regression', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Wait for animations to settle
    await page.waitForTimeout(2000)
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('hero section visual regression', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const heroSection = page.locator('[data-testid="hero-section"]')
    await expect(heroSection).toHaveScreenshot('hero-section.png', {
      animations: 'disabled',
    })
  })

  test('navigation visual regression', async ({ page }) => {
    await page.goto('/')
    
    const navigation = page.locator('nav')
    await expect(navigation).toHaveScreenshot('navigation.png')
  })

  test('projects section visual regression', async ({ page }) => {
    await page.goto('/')
    await page.click('nav a[href="#projects"]')
    await page.waitForTimeout(1000)
    
    const projectsSection = page.locator('#projects')
    await expect(projectsSection).toHaveScreenshot('projects-section.png', {
      animations: 'disabled',
    })
  })

  test('skills section visual regression', async ({ page }) => {
    await page.goto('/')
    await page.click('nav a[href="#skills"]')
    await page.waitForTimeout(1000)
    
    const skillsSection = page.locator('#skills')
    await expect(skillsSection).toHaveScreenshot('skills-section.png', {
      animations: 'disabled',
    })
  })

  test('contact section visual regression', async ({ page }) => {
    await page.goto('/')
    await page.click('nav a[href="#contact"]')
    await page.waitForTimeout(1000)
    
    const contactSection = page.locator('#contact')
    await expect(contactSection).toHaveScreenshot('contact-section.png', {
      animations: 'disabled',
    })
  })

  test('mobile homepage visual regression', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    await expect(page).toHaveScreenshot('mobile-homepage.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('tablet homepage visual regression', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    await expect(page).toHaveScreenshot('tablet-homepage.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('dark mode visual regression', async ({ page }) => {
    await page.goto('/')
    
    // Toggle dark mode if available
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]')
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click()
      await page.waitForTimeout(1000)
      
      await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
        fullPage: true,
        animations: 'disabled',
      })
    }
  })

  test('project modal visual regression', async ({ page }) => {
    await page.goto('/')
    await page.click('nav a[href="#projects"]')
    await page.waitForTimeout(1000)
    
    // Click on first project card
    const firstProjectCard = page.locator('[data-testid="project-card"]').first()
    if (await firstProjectCard.isVisible()) {
      await firstProjectCard.click()
      await page.waitForTimeout(1000)
      
      const modal = page.locator('[data-testid="project-modal"]')
      await expect(modal).toHaveScreenshot('project-modal.png')
    }
  })

  test('contact form states visual regression', async ({ page }) => {
    await page.goto('/')
    await page.click('nav a[href="#contact"]')
    await page.waitForTimeout(1000)
    
    const contactForm = page.locator('[data-testid="contact-form"]')
    
    // Empty form state
    await expect(contactForm).toHaveScreenshot('contact-form-empty.png')
    
    // Filled form state
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('textarea[name="message"]', 'This is a test message')
    
    await expect(contactForm).toHaveScreenshot('contact-form-filled.png')
    
    // Error state
    await page.fill('input[name="email"]', 'invalid-email')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(500)
    
    await expect(contactForm).toHaveScreenshot('contact-form-error.png')
  })
})