import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import DashboardPage from '../../src/pages/DashboardPage'
import Layout from '../../src/components/layout/Layout'

describe('DashboardPage - TDD', () => {
  it('should render Dashboard heading', () => {
    render(
      <Layout>
        <DashboardPage />
      </Layout>
    )
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
  
  it('should have a main heading with correct accessibility', () => {
    render(
      <Layout>
        <DashboardPage />
      </Layout>
    )
    expect(screen.getByRole('heading', { level: 1, name: /Dashboard/i })).toBeInTheDocument()
  })
  
  it('should have proper semantic structure', () => {
    render(
      <Layout>
        <DashboardPage />
      </Layout>
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
  
  it('should display user progress overview', () => {
    render(
      <Layout>
        <DashboardPage />
      </Layout>
    )
    // Check for the new Study Progress Dashboard component
    expect(screen.getByText('Study Progress Dashboard')).toBeInTheDocument()
    // Check for the older study progress card
    expect(screen.getByText('Track your learning journey')).toBeInTheDocument()
  })
  
  it('should show study overview section', () => {
    render(
      <Layout>
        <DashboardPage />
      </Layout>
    )
    expect(screen.getByText(/study overview/i)).toBeInTheDocument()
  })
})
