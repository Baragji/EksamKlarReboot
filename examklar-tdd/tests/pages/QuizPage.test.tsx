import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import QuizPage from '../../src/pages/QuizPage'
import Layout from '../../src/components/layout/Layout'

describe('QuizPage - TDD', () => {
  it('should render Quiz heading', () => {
    render(
      <MemoryRouter>
        <Layout>
          <QuizPage />
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Quiz' })).toBeInTheDocument()
  })
  
  it('should have proper semantic structure', () => {
    render(
      <MemoryRouter>
        <Layout>
          <QuizPage />
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
