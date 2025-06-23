import { render, screen, fireEvent } from '@testing-library/react'
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

  describe('Basic Functionality', () => {
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

  describe('Gamified Welcome Experience - Phase 2 Week 3 Day 1-2', () => {
    it('should render welcome step with gamified styling', () => {
      renderOnboardingPage()
      
      // Check for gamified welcome container
      const welcomeContainer = screen.getByTestId('onboarding-welcome-step')
      expect(welcomeContainer).toBeInTheDocument()
      expect(welcomeContainer).toHaveClass('section-gamified-welcome')
    })

    it('should display engaging welcome animation container', () => {
      renderOnboardingPage()
      
      // Check for animation wrapper
      const animationContainer = screen.getByTestId('welcome-animation-container')
      expect(animationContainer).toBeInTheDocument()
      expect(animationContainer).toHaveClass('animation-fade-in')
    })

    it('should render progress indicator with gamified styling', () => {
      renderOnboardingPage()
      
      // Check for gamified progress indicator
      const progressIndicator = screen.getByTestId('onboarding-progress')
      expect(progressIndicator).toBeInTheDocument()
      expect(progressIndicator).toHaveClass('progress-gamified-indicator')
      expect(progressIndicator).toHaveAttribute('aria-label', 'Step 1 of 3')
    })

    it('should display motivational elements', () => {
      renderOnboardingPage()
      
      // Check for motivational emoji or icon
      const motivationalElement = screen.getByTestId('welcome-motivation')
      expect(motivationalElement).toBeInTheDocument()
      expect(motivationalElement.textContent).toMatch(/🚀|🎯|✨|🌟/)
    })

    it('should render Get Started button with gamified styling', () => {
      renderOnboardingPage()
      
      const getStartedButton = screen.getByRole('button', { name: /get started/i })
      expect(getStartedButton).toBeInTheDocument()
      expect(getStartedButton).toHaveClass('btn-gamified-primary')
    })

    it('should have smooth card transitions', () => {
      renderOnboardingPage()
      
      const welcomeCard = screen.getByTestId('onboarding-card')
      expect(welcomeCard).toBeInTheDocument()
      expect(welcomeCard).toHaveClass('card-gamified-interactive')
    })
  })

  describe('Multi-Step Flow Enhancement - Phase 2 Week 3 Day 3-4', () => {
    it('should render subject selection step with interactive cards', async () => {
      renderOnboardingPage()
      
      // Navigate to step 2
      const getStartedButton = screen.getByRole('button', { name: /get started/i })
      fireEvent.click(getStartedButton)
      
      // Check for gamified subject selection
      const subjectStep = screen.getByTestId('onboarding-subject-step')
      expect(subjectStep).toBeInTheDocument()
      expect(subjectStep).toHaveClass('section-gamified-form')
    })

    it('should display form validation with engaging feedback', async () => {
      renderOnboardingPage()
      
      // Navigate to step 2
      const getStartedButton = screen.getByRole('button', { name: /get started/i })
      fireEvent.click(getStartedButton)
      
      // Try to proceed without filling form
      const nextButton = screen.getByRole('button', { name: /next/i })
      fireEvent.click(nextButton)
      
      // Check for gamified error feedback
      const errorFeedback = screen.getByTestId('form-validation-feedback')
      expect(errorFeedback).toBeInTheDocument()
      expect(errorFeedback).toHaveClass('alert-gamified-error')
    })

    it('should show smooth transitions between steps', async () => {
      renderOnboardingPage()
      
      // Check step transition container
      const stepContainer = screen.getByTestId('onboarding-step-container')
      expect(stepContainer).toBeInTheDocument()
      expect(stepContainer).toHaveClass('animation-slide-in')
    })

    it('should render gamified input fields', async () => {
      renderOnboardingPage()
      
      // Navigate to step 2
      const getStartedButton = screen.getByRole('button', { name: /get started/i })
      fireEvent.click(getStartedButton)
      
      // Check for gamified inputs
      const subjectInput = screen.getByLabelText(/subject name/i)
      expect(subjectInput).toHaveClass('input-gamified-enhanced')
    })
  })
})
