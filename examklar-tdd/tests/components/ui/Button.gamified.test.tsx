import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../../../src/components/ui/Button'

describe('Button - Gamified Design System', () => {
  describe('Gamified Variants', () => {
    it('should render primary gamified button with gradient background', () => {
      render(<Button variant="gamified-primary">Start Learning</Button>)
      
      const button = screen.getByRole('button', { name: 'Start Learning' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('btn-gamified-primary')
    })

    it('should render secondary gamified button with card styling', () => {
      render(<Button variant="gamified-secondary">Continue</Button>)
      
      const button = screen.getByRole('button', { name: 'Continue' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('btn-gamified-secondary')
    })

    it('should render success gamified button with achievement styling', () => {
      render(<Button variant="gamified-success">Complete ✅</Button>)
      
      const button = screen.getByRole('button', { name: 'Complete ✅' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('btn-gamified-success')
    })

    it('should render danger gamified button with warning styling', () => {
      render(<Button variant="gamified-danger">Reset Progress</Button>)
      
      const button = screen.getByRole('button', { name: 'Reset Progress' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('btn-gamified-danger')
    })
  })

  describe('Gamified Sizes', () => {
    it('should render large gamified button for hero actions', () => {
      render(<Button variant="gamified-primary" size="gamified-large">Get Started 🚀</Button>)
      
      const button = screen.getByRole('button', { name: 'Get Started 🚀' })
      expect(button).toHaveClass('btn-gamified-large')
    })

    it('should render small gamified button for secondary actions', () => {
      render(<Button variant="gamified-secondary" size="gamified-small">Skip</Button>)
      
      const button = screen.getByRole('button', { name: 'Skip' })
      expect(button).toHaveClass('btn-gamified-small')
    })
  })

  describe('Interactive States', () => {
    it('should have hover effects for gamified buttons', () => {
      render(<Button variant="gamified-primary">Hover Me</Button>)
      
      const button = screen.getByRole('button', { name: 'Hover Me' })
      expect(button).toHaveClass('hover-lift')
      expect(button).toHaveClass('interactive-gamified')
    })

    it('should handle disabled state with proper styling', () => {
      render(<Button variant="gamified-primary" disabled>Disabled</Button>)
      
      const button = screen.getByRole('button', { name: 'Disabled' })
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50')
    })

    it('should handle loading state with spinner', () => {
      render(<Button variant="gamified-primary" loading>Loading...</Button>)
      
      const button = screen.getByRole('button', { name: '⏳ Loading...' })
      expect(button).toBeDisabled()
      expect(button).toHaveClass('btn-gamified-loading')
    })
  })

  describe('Accessibility', () => {
    it('should maintain accessibility attributes with gamified styling', () => {
      render(
        <Button 
          variant="gamified-primary" 
          aria-label="Start your learning journey"
          data-testid="start-button"
        >
          Start
        </Button>
      )
      
      const button = screen.getByTestId('start-button')
      expect(button).toHaveAttribute('aria-label', 'Start your learning journey')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('should support keyboard navigation', () => {
      const handleClick = vi.fn()
      render(<Button variant="gamified-primary" onClick={handleClick}>Click Me</Button>)
      
      const button = screen.getByRole('button', { name: 'Click Me' })
      
      // Test Enter key
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
      expect(handleClick).toHaveBeenCalledTimes(1)
      
      // Test Space key
      fireEvent.keyDown(button, { key: ' ', code: 'Space' })
      expect(handleClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('Icon Support', () => {
    it('should render button with leading icon', () => {
      render(
        <Button variant="gamified-primary" icon="🎮" iconPosition="left">
          Play Game
        </Button>
      )
      
      const button = screen.getByRole('button', { name: '🎮 Play Game' })
      expect(button).toBeInTheDocument()
      expect(button.textContent).toContain('🎮')
    })

    it('should render button with trailing icon', () => {
      render(
        <Button variant="gamified-success" icon="→" iconPosition="right">
          Next Level
        </Button>
      )
      
      const button = screen.getByRole('button', { name: 'Next Level →' })
      expect(button).toBeInTheDocument()
      expect(button.textContent).toContain('→')
    })
  })

  describe('Animation Classes', () => {
    it('should include animation classes for micro-interactions', () => {
      render(<Button variant="gamified-primary">Animated Button</Button>)
      
      const button = screen.getByRole('button', { name: 'Animated Button' })
      expect(button).toHaveClass('transition-all')
      expect(button).toHaveClass('duration-300')
    })

    it('should have scale animation on active state', () => {
      render(<Button variant="gamified-primary">Scale Button</Button>)
      
      const button = screen.getByRole('button', { name: 'Scale Button' })
      expect(button).toHaveClass('active:scale-95')
    })
  })
})