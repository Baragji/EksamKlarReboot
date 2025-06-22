import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import OnboardingPage from '../../src/pages/OnboardingPage'
import Layout from '../../src/components/layout/Layout'
import { useExamStore } from '../../src/stores/examStore'

const renderOnboardingPage = () => {
  return render(
    <BrowserRouter>
      <Layout>
        <OnboardingPage />
      </Layout>
    </BrowserRouter>
  )
}

describe('OnboardingPage - TDD', () => {
  beforeEach(() => {
    // Reset store state before each test
    useExamStore.getState().reset()
  })

  it('should render welcome message', () => {
    renderOnboardingPage()
    expect(screen.getByText('Welcome to ExamKlar')).toBeInTheDocument()
  })
  
  it('should render subtitle about AI-powered study companion', () => {
    renderOnboardingPage()
    expect(screen.getByText(/AI-powered study companion/i)).toBeInTheDocument()
  })
  
  it('should have a main heading with correct accessibility', () => {
    renderOnboardingPage()
    expect(screen.getByRole('heading', { level: 1, name: /Welcome to ExamKlar/i })).toBeInTheDocument()
  })
  
  it('should render call-to-action content', () => {
    renderOnboardingPage()
    expect(screen.getByText(/personalized exam preparation/i)).toBeInTheDocument()
  })
  
  it('should have proper semantic structure', () => {
    renderOnboardingPage()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
