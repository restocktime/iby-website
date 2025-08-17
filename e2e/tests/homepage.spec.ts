import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct title and meta description', async ({ page }) => {
    await expect(page).toHaveTitle(/Isaac Benyakar/i)
    
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /web developer/i)
  })

  test('displays hero section with typewriter effect', async ({ page }) => {
    // Check if hero section is visible
    const heroSection = page.locator('[data-testid="hero-section"]')
    await expect(heroSection).toBeVisible()

    // Check for typewriter text
    const typewriterText = page.locator('[data-testid="typewriter-text"]')
    await expect(typewriterText).toBeVisible()
    
    // Wait for typewriter animation to start
    await page.waitForTimeout(2000)
    const textContent = await typewriterText.textContent()
    expect(textContent).toBeTruthy()
  })

  test('navigation works correctly', async ({ page }) => {
    // Test navigation to different sections
    await page.click('nav a[href="#projects"]')
    await expect(page.locator('#projects')).toBeInViewport()

    await page.click('nav a[href="#skills"]')
    await expect(page.locator('#skills')).toBeInViewport()

    await page.click('nav a[href="#contact"]')
    await expect(page.locator('#contact')).toBeInViewport()
  })

  test('scroll progress indicator works', async ({ page }) => {
    const progressIndicator = page.locator('[data-testid="scroll-progress"]')
    await expect(progressIndicator).toBeVisible()

    // Scroll down and check if progress updates
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(500)
    
    const progressValue = await progressIndicator.getAttribute('style')
    expect(progressValue).toContain('width')
  })

  test('floating cards respond to mouse movement', async ({ page }) => {
    const floatingCards = page.locator('[data-testid="floating-cards"]')
    await expect(floatingCards).toBeVisible()

    // Move mouse over the hero section
    const heroSection = page.locator('[data-testid="hero-section"]')
    await heroSection.hover()
    
    // Check if cards have transform styles (indicating movement)
    const firstCard = page.locator('[data-testid="floating-card"]').first()
    const transform = await firstCard.getAttribute('style')
    expect(transform).toContain('transform')
  })

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check if mobile navigation is visible
    const mobileNav = page.locator('[data-testid="mobile-nav"]')
    await expect(mobileNav).toBeVisible()

    // Check if desktop navigation is hidden
    const desktopNav = page.locator('[data-testid="desktop-nav"]')
    await expect(desktopNav).not.toBeVisible()

    // Test mobile menu toggle
    const menuToggle = page.locator('[data-testid="menu-toggle"]')
    await menuToggle.click()
    
    const mobileMenu = page.locator('[data-testid="mobile-menu"]')
    await expect(mobileMenu).toBeVisible()
  })
})