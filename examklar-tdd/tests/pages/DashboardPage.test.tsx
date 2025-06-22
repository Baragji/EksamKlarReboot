import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import DashboardPage from '../../src/pages/DashboardPage'

describe('DashboardPage - TDD', () => {
  it('should render Dashboard heading', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
  
  it('should have a main heading with correct accessibility', () => {
    render(<DashboardPage />)
    expect(screen.getByRole('heading', { level: 1, name: /Dashboard/i })).toBeInTheDocument()
  })
  
  it('should have proper semantic structure', () => {
    render(<DashboardPage />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
  
  it('should display user progress overview', () => {
    render(<DashboardPage />)
    expect(screen.getByText(/progress/i)).toBeInTheDocument()
  })
  
  it('should show study overview section', () => {
    render(<DashboardPage />)
    expect(screen.getByText(/study overview/i)).toBeInTheDocument()
  })
})
