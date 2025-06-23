import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import NotFoundPage from '../../src/pages/NotFoundPage'
import Layout from '../../src/components/layout/Layout'

describe('NotFoundPage - TDD', () => {
  it('should render Page Not Found message', () => {
    render(
      <MemoryRouter>
        <Layout>
          <NotFoundPage />
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
  })
  
  it('should have proper semantic structure', () => {
    render(
      <MemoryRouter>
        <Layout>
          <NotFoundPage />
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
