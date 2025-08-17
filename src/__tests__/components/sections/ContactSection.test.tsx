import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContactSection } from '@/components/sections/ContactSection'

// Mock the contact form submission
jest.mock('@/app/api/contact/route', () => ({
  POST: jest.fn(),
}))

describe('ContactSection Component', () => {
  it('renders contact section with form', () => {
    render(<ContactSection />)
    expect(screen.getByRole('heading', { name: /contact/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<ContactSection />)
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/message is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    render(<ContactSection />)
    
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })
    global.fetch = mockFetch

    render(<ContactSection />)
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } })
    
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      }))
    })
  })

  it('displays success message after successful submission', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    render(<ContactSection />)
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } })
    
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
    })
  })

  it('displays error message on submission failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

    render(<ContactSection />)
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } })
    
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument()
    })
  })
})