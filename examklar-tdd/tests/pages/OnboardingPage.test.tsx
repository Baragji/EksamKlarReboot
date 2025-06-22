import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import OnboardingPage from '../../src/pages/OnboardingPage'
import Layout from '../../src/components/layout/Layout'

describe('OnboardingPage - TDD', () => {
  it('should render welcome message', () => {
    render(
      <Layout>
        <OnboardingPage />
      </Layout>
    )
    expect(screen.getByText('Welcome to ExamKlar')).toBeInTheDocument()
  })
  
  it('should render subtitle about AI-powered study companion', () => {
    render(
      <Layout>
        <OnboardingPage />
      </Layout>
    )
    expect(screen.getByText(/AI-powered study companion/i)).toBeInTheDocument()
  })
  
  it('should have a main heading with correct accessibility', () => {
    render(
      <Layout>
        <OnboardingPage />
      </Layout>
    )
    expect(screen.getByRole('heading', { level: 1, name: /Welcome to ExamKlar/i })).toBeInTheDocument()
  })
  
  it('should render call-to-action content', () => {
    render(
      <Layout>
        <OnboardingPage />
      </Layout>
    )
    expect(screen.getByText(/personalized exam preparation/i)).toBeInTheDocument()
  })
  
  it('should have proper semantic structure', () => {
    render(
      <Layout>
        <OnboardingPage />
      </Layout>
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
