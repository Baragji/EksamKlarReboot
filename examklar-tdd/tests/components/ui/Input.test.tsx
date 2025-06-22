import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from '../../../src/components/ui/Input'

describe('Input Component - TDD', () => {
  it('should render with placeholder text', () => {
    render(<Input placeholder="Enter your name" />)
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
  })
  
  it('should render with label when provided', () => {
    render(<Input label="Username" />)
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByText('Username')).toBeInTheDocument()
  })
  
  it('should call onChange handler when value changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test')
    
    expect(handleChange).toHaveBeenCalledTimes(4) // One for each character
  })
  
  it('should display current value', () => {
    render(<Input value="test value" readOnly />)
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument()
  })
  
  it('should show error state and message', () => {
    render(<Input error="This field is required" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-500')
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })
  
  it('should show success state', () => {
    render(<Input success />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-green-500')
  })
  
  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
  })
  
  it('should apply different sizes correctly', () => {
    const { rerender } = render(<Input size="sm" />)
    expect(screen.getByRole('textbox')).toHaveClass('h-8', 'text-xs')
    
    rerender(<Input size="md" />)
    expect(screen.getByRole('textbox')).toHaveClass('h-10', 'text-sm')
    
    rerender(<Input size="lg" />)
    expect(screen.getByRole('textbox')).toHaveClass('h-12', 'text-base')
  })
  
  it('should render as different input types', () => {
    const { rerender } = render(<Input type="email" data-testid="email-input" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
    
    rerender(<Input type="password" data-testid="password-input" />)
    const passwordInput = screen.getByTestId('password-input')
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    rerender(<Input type="number" data-testid="number-input" />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number')
  })
  
  it('should show required indicator when required', () => {
    render(<Input label="Email" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })
  
  it('should show help text when provided', () => {
    render(<Input helpText="Enter a valid email address" />)
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
  })
  
  it('should forward ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })
  
  it('should have proper accessibility attributes', () => {
    render(
      <Input 
        label="Email"
        required 
        error="Invalid email"
        helpText="Enter your email address"
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-required', 'true')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby')
  })
  
  it('should not call onChange when disabled', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Input onChange={handleChange} disabled />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test')
    
    expect(handleChange).not.toHaveBeenCalled()
  })
})
