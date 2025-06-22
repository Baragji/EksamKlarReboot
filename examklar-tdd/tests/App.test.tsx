import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import App from '../../src/App'

describe('App Routing - TDD', () => {
  it('should render onboarding page on root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Welcome to ExamKlar')).toBeInTheDocument()
  })
  
  it('should render dashboard on /dashboard route', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
  
  it('should render study page on /study route', () => {
    render(
      <MemoryRouter initialEntries={['/study']}>
        <App />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Study Session')).toBeInTheDocument()
  })
  
  it('should render flashcards page on /flashcards route', () => {
    render(
      <MemoryRouter initialEntries={['/flashcards']}>
        <App />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Flashcards')).toBeInTheDocument()
  })
  
  it('should render quiz page on /quiz route', () => {
    render(
      <MemoryRouter initialEntries={['/quiz']}>
        <App />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Quiz')).toBeInTheDocument()
  })
  
  it('should render 404 page for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
  })
  
  it('should have proper navigation structure', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    )
    
    // Check for navigation elements
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
  
  it('should maintain layout across different routes', () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    )
    
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    
    rerender(
      <MemoryRouter initialEntries={['/study']}>
        <App />
      </MemoryRouter>
    )
    
    // Navigation should still be present
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
  
  it('should handle protected routes when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    )
    
    // Should redirect to onboarding if not set up
    // This test will be implemented when we have auth state
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
