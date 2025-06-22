import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import OnboardingPage from '../../src/pages/OnboardingPage'

describe('OnboardingPage - TDD', () => {
  it('should render welcome message', () => {
    render(<OnboardingPage />)
    expect(screen.getByText('Welcome to ExamKlar')).toBeInTheDocument()
  })
  
  it('should render subtitle about AI-powered study companion', () => {
    render(<OnboardingPage />)
    expect(screen.getByText(/AI-powered study companion/i)).toBeInTheDocument()
  })
  
  it('should have a main heading with correct accessibility', () => {
    render(<OnboardingPage />)
    expect(screen.getByRole('heading', { level: 1, name: /Welcome to ExamKlar/i })).toBeInTheDocument()
  })
  
  it('should render call-to-action content', () => {
    render(<OnboardingPage />)
    expect(screen.getByText(/personalized exam preparation/i)).toBeInTheDocument()
  })
  
  it('should have proper semantic structure', () => {
    render(<OnboardingPage />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
