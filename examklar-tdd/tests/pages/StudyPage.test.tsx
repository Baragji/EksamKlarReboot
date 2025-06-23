import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import StudyPage from '../../src/pages/StudyPage'
import Layout from '../../src/components/layout/Layout'

describe('StudyPage - TDD', () => {
  it('should render Study Session heading', () => {
    render(
      <MemoryRouter>
        <Layout>
          <StudyPage />
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByText('Study Session')).toBeInTheDocument()
  })
  
  it('should have a main heading with correct accessibility', () => {
    render(
      <MemoryRouter>
        <Layout>
          <StudyPage />
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1, name: /Study Session/i })).toBeInTheDocument()
  })
  
  it('should have proper semantic structure', () => {
    render(
      <MemoryRouter>
        <Layout>
          <StudyPage />
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
