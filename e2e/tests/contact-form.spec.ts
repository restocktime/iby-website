import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Navigate to contact section
    await page.click('nav a[href="#contact"]')
    await expect(page.locator('#contact')).toBeInViewport()
  })

  test('displays contact form with all fields', async ({ page }) => {
    const contactForm = page.locator('[data-testid="contact-form"]')
    await expect(contactForm).toBeVisible()

    // Check all form fields are present
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('textarea[name="message"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('shows validation errors for empty fields', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Check for validation error messages
    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Message is required')).toBeVisible()
  })

  test('validates email format', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Invalid email format')).toBeVisible()
  })

  test('submits form successfully with valid data', async ({ page }) => {
    // Fill out the form
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('textarea[name="message"]', 'This is a test message')

    // Mock the API response
    await page.route('/api/contact', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Message sent successfully' })
      })
    })

    // Submit the form
    await page.click('button[type="submit"]')

    // Check for success message
    await expect(page.locator('text=Message sent successfully')).toBeVisible()
  })

  test('handles form submission errors gracefully', async ({ page }) => {
    // Fill out the form
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('textarea[name="message"]', 'This is a test message')

    // Mock API error response
    await page.route('/api/contact', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      })
    })

    // Submit the form
    await page.click('button[type="submit"]')

    // Check for error message
    await expect(page.locator('text=Failed to send message')).toBeVisible()
  })

  test('shows loading state during submission', async ({ page }) => {
    // Fill out the form
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('textarea[name="message"]', 'This is a test message')

    // Mock slow API response
    await page.route('/api/contact', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })

    // Submit the form
    await page.click('button[type="submit"]')

    // Check for loading state
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
  })

  test('contact methods are displayed', async ({ page }) => {
    // Check for different contact methods
    await expect(page.locator('[data-testid="email-contact"]')).toBeVisible()
    await expect(page.locator('[data-testid="whatsapp-contact"]')).toBeVisible()
    await expect(page.locator('[data-testid="discord-contact"]')).toBeVisible()
  })

  test('availability indicator is shown', async ({ page }) => {
    const availabilityIndicator = page.locator('[data-testid="availability-indicator"]')
    await expect(availabilityIndicator).toBeVisible()
    
    // Check if it shows some status
    const statusText = await availabilityIndicator.textContent()
    expect(statusText).toBeTruthy()
  })
})