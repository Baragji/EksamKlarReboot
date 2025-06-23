import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Navigation from '../../../src/components/layout/Navigation'

const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('Navigation Component - TDD', () => {
  it('should render all navigation links', () => {
    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )

    // Check for main navigation links
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /study/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /flashcards/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /quiz/i })).toBeInTheDocument()
  })

  it('should have correct href attributes for navigation links', () => {
    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard')
    expect(screen.getByRole('link', { name: /study/i })).toHaveAttribute('href', '/study')
    expect(screen.getByRole('link', { name: /flashcards/i })).toHaveAttribute('href', '/flashcards')
    expect(screen.getByRole('link', { name: /quiz/i })).toHaveAttribute('href', '/quiz')
  })

  it('should have proper accessibility attributes', () => {
    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')

    // Check that all links are keyboard accessible
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('tabindex', '0')
    })
  })

  it('should highlight active navigation item', () => {
    // Mock current location
    delete (window as any).location
    ;(window as any).location = { pathname: '/dashboard' }

    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    expect(dashboardLink).toHaveClass('bg-blue-100', 'text-blue-700') // Active styles
  })

  it('should be responsive and mobile-friendly', () => {
    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )

    const nav = screen.getByRole('navigation')
    // Check for responsive classes
    expect(nav).toHaveClass('flex', 'space-x-4')
  })

  it('should display navigation icons alongside text', () => {
    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )

    // Check for icon containers (we'll use Heroicons)
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    expect(dashboardLink.querySelector('svg')).toBeInTheDocument()
  })

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup()
    
    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )

    const firstLink = screen.getByRole('link', { name: /dashboard/i })
    const secondLink = screen.getByRole('link', { name: /study/i })

    await user.tab()
    expect(firstLink).toHaveFocus()

    await user.tab()
    expect(secondLink).toHaveFocus()
  })

  it('should have hover effects on navigation items', async () => {
    const user = userEvent.setup()
    
    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    
    await user.hover(dashboardLink)
    expect(dashboardLink).toHaveClass('hover:bg-gray-100')
  })
})
