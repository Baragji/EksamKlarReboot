import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import FlashcardsPage from '../../src/pages/FlashcardsPage'
import Layout from '../../src/components/layout/Layout'

describe('FlashcardsPage - TDD', () => {
  it('should render Flashcards heading', () => {
    render(
      <Layout>
        <FlashcardsPage />
      </Layout>
    )
    expect(screen.getByText('Flashcards')).toBeInTheDocument()
  })
  
  it('should have proper semantic structure', () => {
    render(
      <Layout>
        <FlashcardsPage />
      </Layout>
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
