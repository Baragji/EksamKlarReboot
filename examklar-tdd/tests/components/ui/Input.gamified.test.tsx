import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Input } from '../../../src/components/ui/Input'

describe('Input - Gamified Design System', () => {
  describe('Gamified Variants', () => {
    it('should render gamified input with modern styling', () => {
      render(<Input variant="gamified" placeholder="Enter your answer..." />)
      
      const input = screen.getByPlaceholderText('Enter your answer...')
      expect(input).toBeInTheDocument()
      expect(input).toHaveClass('input-gamified')
    })

    it('should render gamified input with success state', () => {
      render(<Input variant="gamified-success" placeholder="Correct!" />)
      
      const input = screen.getByPlaceholderText('Correct!')
      expect(input).toBeInTheDocument()
      expect(input).toHaveClass('input-gamified-success')
    })

    it('should render gamified input with error state', () => {
      render(<Input variant="gamified-error" placeholder="Try again..." />)
      
      const input = screen.getByPlaceholderText('Try again...')
      expect(input).toBeInTheDocument()
      expect(input).toHaveClass('input-gamified-error')
    })
  })

  describe('Gamified Sizes', () => {
    it('should render large gamified input for hero sections', () => {
      render(<Input variant="gamified" size="gamified-large" placeholder="Search..." />)
      
      const input = screen.getByPlaceholderText('Search...')
      expect(input).toHaveClass('input-gamified-large')
    })

    it('should render small gamified input for compact areas', () => {
      render(<Input variant="gamified" size="gamified-small" placeholder="Filter" />)
      
      const input = screen.getByPlaceholderText('Filter')
      expect(input).toHaveClass('input-gamified-small')
    })
  })

  describe('Interactive Features', () => {
    it('should have focus effects for gamified inputs', () => {
      render(<Input variant="gamified" placeholder="Focus me" />)
      
      const input = screen.getByPlaceholderText('Focus me')
      expect(input).toHaveClass('focus-gamified')
    })

    it('should handle disabled state with proper styling', () => {
      render(<Input variant="gamified" disabled placeholder="Disabled" />)
      
      const input = screen.getByPlaceholderText('Disabled')
      expect(input).toBeDisabled()
      expect(input).toHaveClass('disabled:opacity-50')
    })

    it('should support onChange events', () => {
      const handleChange = vi.fn()
      render(<Input variant="gamified" onChange={handleChange} placeholder="Type here" />)
      
      const input = screen.getByPlaceholderText('Type here')
      fireEvent.change(input, { target: { value: 'test input' } })
      
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(input).toHaveValue('test input')
    })
  })

  describe('Icon Support', () => {
    it('should render input with leading icon', () => {
      render(
        <Input 
          variant="gamified" 
          icon="🔍" 
          iconPosition="left" 
          placeholder="Search with icon" 
        />
      )
      
      const container = screen.getByPlaceholderText('Search with icon').parentElement
      expect(container).toHaveTextContent('🔍')
    })

    it('should render input with trailing icon', () => {
      render(
        <Input 
          variant="gamified" 
          icon="✨" 
          iconPosition="right" 
          placeholder="Magic input" 
        />
      )
      
      const container = screen.getByPlaceholderText('Magic input').parentElement
      expect(container).toHaveTextContent('✨')
    })
  })

  describe('Accessibility', () => {
    it('should maintain accessibility attributes with gamified styling', () => {
      render(
        <Input 
          variant="gamified" 
          aria-label="Search for courses"
          data-testid="search-input"
          placeholder="Search"
        />
      )
      
      const input = screen.getByTestId('search-input')
      expect(input).toHaveAttribute('aria-label', 'Search for courses')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('should support keyboard navigation', () => {
      const handleKeyDown = vi.fn()
      render(<Input variant="gamified" onKeyDown={handleKeyDown} placeholder="Press keys" />)
      
      const input = screen.getByPlaceholderText('Press keys')
      
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
      expect(handleKeyDown).toHaveBeenCalledTimes(1)
    })
  })

  describe('Animation Classes', () => {
    it('should include animation classes for micro-interactions', () => {
      render(<Input variant="gamified" placeholder="Animated input" />)
      
      const input = screen.getByPlaceholderText('Animated input')
      expect(input).toHaveClass('transition-all')
      expect(input).toHaveClass('duration-300')
    })

    it('should have focus ring animation', () => {
      render(<Input variant="gamified" placeholder="Focus ring" />)
      
      const input = screen.getByPlaceholderText('Focus ring')
      expect(input).toHaveClass('focus:ring-2')
    })
  })

  describe('Label Integration', () => {
    it('should render with label for better UX', () => {
      render(
        <Input 
          variant="gamified" 
          label="Your Name" 
          placeholder="Enter your name"
          id="name-input"
        />
      )
      
      const label = screen.getByText('Your Name')
      const input = screen.getByPlaceholderText('Enter your name')
      
      expect(label).toBeInTheDocument()
      expect(label).toHaveAttribute('for', 'name-input')
      expect(input).toHaveAttribute('id', 'name-input')
    })

    it('should render with helper text', () => {
      render(
        <Input 
          variant="gamified" 
          label="Email" 
          helpText="We'll never share your email"
          placeholder="your@email.com"
        />
      )
      
      const helperText = screen.getByText("We'll never share your email")
      expect(helperText).toBeInTheDocument()
      expect(helperText).toHaveClass('text-gamified-helper')
    })
  })
})