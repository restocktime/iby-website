/**
 * Basic test to verify Jest setup is working correctly
 */
describe('Test Setup', () => {
  it('should run basic tests', () => {
    expect(1 + 1).toBe(2)
  })

  it('should have access to DOM APIs', () => {
    const element = document.createElement('div')
    element.textContent = 'Hello World'
    expect(element.textContent).toBe('Hello World')
  })

  it('should have jest-dom matchers available', () => {
    const element = document.createElement('div')
    element.style.display = 'none'
    document.body.appendChild(element)
    
    expect(element).not.toBeVisible()
    
    document.body.removeChild(element)
  })
})