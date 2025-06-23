import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Layout from '../../../src/components/layout/Layout'

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <Layout>{children}</Layout>
  </BrowserRouter>
)

describe('Layout Component - Navigation Integration TDD', () => {
  it('should include navigation menu in layout', () => {
    render(
      <LayoutWrapper>
        <div>Test content</div>
      </LayoutWrapper>
    )

    // Should render the ExamKlar brand
    expect(screen.getByText('ExamKlar')).toBeInTheDocument()
    
    // Should render navigation links
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /study/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /flashcards/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /quiz/i })).toBeInTheDocument()
  })

  it('should render navigation within the header section', () => {
    render(
      <LayoutWrapper>
        <div>Test content</div>
      </LayoutWrapper>
    )

    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    const header = nav.closest('header')
    
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('bg-white', 'shadow-lg')
  })

  it('should maintain existing layout structure with new navigation', () => {
    render(
      <LayoutWrapper>
        <div data-testid="page-content">Test page content</div>
      </LayoutWrapper>
    )

    // Check that main content area still exists
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByTestId('page-content')).toBeInTheDocument()
    
    // Check that the layout structure is preserved
    const main = screen.getByRole('main')
    expect(main).toHaveClass('py-8')
  })

  it('should have responsive navigation layout', () => {
    render(
      <LayoutWrapper>
        <div>Test content</div>
      </LayoutWrapper>
    )

    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    // Navigate up: nav -> div (flex items-center) -> div (flex justify-between h-16)
    const headerContainer = nav.parentElement?.parentElement
    expect(headerContainer).toHaveClass('flex', 'justify-between', 'h-16')
  })

  it('should position brand and navigation correctly', () => {
    render(
      <LayoutWrapper>
        <div>Test content</div>
      </LayoutWrapper>
    )

    const brand = screen.getByText('ExamKlar')
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    
    // Brand should be in the left section
    expect(brand.closest('div')).toHaveClass('flex', 'items-center')
    
    // Navigation should be accessible
    expect(dashboardLink).toBeInTheDocument()
  })
})
