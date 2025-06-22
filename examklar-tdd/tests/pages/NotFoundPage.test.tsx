import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import NotFoundPage from '../../src/pages/NotFoundPage'
import Layout from '../../src/components/layout/Layout'

describe('NotFoundPage - TDD', () => {
  it('should render Page Not Found message', () => {
    render(
      <Layout>
        <NotFoundPage />
      </Layout>
    )
    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
  })
  
  it('should have proper semantic structure', () => {
    render(
      <Layout>
        <NotFoundPage />
      </Layout>
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
