import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import DashboardPage from '../../src/pages/DashboardPage'
import Layout from '../../src/components/layout/Layout'

describe('DashboardPage - TDD', () => {
  it('should render Dashboard heading', () => {
    render(
      <MemoryRouter>
        <Layout>
          <DashboardPage />
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument()
  })
  
  it('should have a main heading with correct accessibility', () => {
    render(
      <MemoryRouter>
        <Layout>
          <DashboardPage />
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1, name: /Dashboard/i })).toBeInTheDocument()
  })
  
  it('should have proper semantic structure', () => {
    render(
      <MemoryRouter>
        <Layout>
          <DashboardPage />
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
  
  it('should display user progress overview', () => {
    render(
      <MemoryRouter>
        <Layout>
          <DashboardPage />
        </Layout>
      </MemoryRouter>
    )
    // Check for the new Study Progress Dashboard component
    expect(screen.getByText('Study Progress Dashboard')).toBeInTheDocument()
    // Check for the older study progress card
    expect(screen.getByText('Track your learning journey')).toBeInTheDocument()
  })
  
  it('should show study overview section', () => {
    render(
      <MemoryRouter>
        <Layout>
          <DashboardPage />
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByText(/study overview/i)).toBeInTheDocument()
  })

  it('should display achievements section', () => {
    // RED: This test will fail because we haven't added achievements to DashboardPage yet
    render(
      <MemoryRouter>
        <Layout>
          <DashboardPage />
        </Layout>
      </MemoryRouter>
    )
    
    // Should show achievements section
    expect(screen.getByTestId('achievements-list')).toBeInTheDocument()
    expect(screen.getByText('🏆 Achievements')).toBeInTheDocument()
  })
})
