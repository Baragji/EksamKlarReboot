import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import QuizPage from '../../src/pages/QuizPage'
import Layout from '../../src/components/layout/Layout'

describe('QuizPage - TDD', () => {
  it('should render Quiz heading', () => {
    render(
      <Layout>
        <QuizPage />
      </Layout>
    )
    expect(screen.getByText('Quiz')).toBeInTheDocument()
  })
  
  it('should have proper semantic structure', () => {
    render(
      <Layout>
        <QuizPage />
      </Layout>
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
