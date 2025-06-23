import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import FlashcardsPage from '../../src/pages/FlashcardsPage'
import Layout from '../../src/components/layout/Layout'

describe('FlashcardsPage - Advanced TDD', () => {
  // Basic structure tests (these should pass)
  it('should render Flashcards heading', () => {
    render(
      <MemoryRouter>
        <Layout>
          <FlashcardsPage />
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Flashcards' })).toBeInTheDocument()
  })
  
  it('should have proper semantic structure', () => {
    render(
      <MemoryRouter>
        <Layout>
          <FlashcardsPage />
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  // Advanced functionality tests (these should fail - RED phase)
  it('should display deck management section', () => {
    render(<FlashcardsPage />)
    
    expect(screen.getByText('My Flashcard Decks')).toBeInTheDocument()
    expect(screen.getByText('Total Decks: 0')).toBeInTheDocument()
  })

  it('should show subject filter dropdown', () => {
    render(<FlashcardsPage />)
    
    expect(screen.getByLabelText('Filter by subject')).toBeInTheDocument()
    expect(screen.getByText('All Subjects')).toBeInTheDocument()
  })

  it('should show create new deck button', () => {
    render(<FlashcardsPage />)
    
    expect(screen.getByText('Create New Deck')).toBeInTheDocument()
  })

  it('should show search input', () => {
    render(<FlashcardsPage />)
    
    expect(screen.getByPlaceholderText('Search flashcard decks...')).toBeInTheDocument()
  })

  it('should show sort options', () => {
    render(<FlashcardsPage />)
    
    expect(screen.getByLabelText('Sort by')).toBeInTheDocument()
  })

  it('should show statistics section', () => {
    render(<FlashcardsPage />)
    
    expect(screen.getByText('Statistics')).toBeInTheDocument()
    expect(screen.getByText('Total Cards:')).toBeInTheDocument()
    expect(screen.getByText('Cards Due for Review:')).toBeInTheDocument()
  })

  it('should have accessibility attributes', () => {
    render(
      <MemoryRouter>
        <Layout>
          <FlashcardsPage />
        </Layout>
      </MemoryRouter>
    )
    
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })
})
