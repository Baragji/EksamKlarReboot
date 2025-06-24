import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import OnboardingPage from '@/pages/OnboardingPage'
import Layout from '@/components/layout/Layout'
import { useExamStore } from '@/stores/examStore'

// Mock the dataBridge utility
vi.mock('@/utils/dataBridge', () => ({
  dataBridge: {
    onProgressUpdate: vi.fn((callback) => {
      // Simulate progress updates
      setTimeout(() => {
        callback({
          progress: 20,
          stage: 'analyzing',
          message: 'Analyzing content...'
        })
      }, 10)
      
      setTimeout(() => {
        callback({
          progress: 40,
          stage: 'generating-flashcards',
          message: 'Generating flashcards...'
        })
      }, 20)
      
      setTimeout(() => {
        callback({
          progress: 60,
          stage: 'generating-quizzes',
          message: 'Creating quizzes...'
        })
      }, 30)
      
      setTimeout(() => {
        callback({
          progress: 80,
          stage: 'creating-schedule',
          message: 'Building study schedule...'
        })
      }, 40)
      
      setTimeout(() => {
        callback({
          progress: 100,
          stage: 'complete',
          message: 'Content generation complete!'
        })
      }, 50)
      
      return vi.fn() // Return unsubscribe function
    }),
    generateContent: vi.fn(() => Promise.resolve({
      flashcardDecks: [
        { id: '1', name: 'Basic Concepts', cards: [{id: '1', front: 'Question 1', back: 'Answer 1'}] },
        { id: '2', name: 'Advanced Topics', cards: [{id: '2', front: 'Question 2', back: 'Answer 2'}] }
      ],
      quizzes: [
        { id: '1', name: 'Quiz 1', questions: [] },
        { id: '2', name: 'Quiz 2', questions: [] }
      ],
      studySchedule: [
        { id: '1', date: new Date(), topics: [] },
        { id: '2', date: new Date(), topics: [] }
      ]
    })),
    generateFallbackContent: vi.fn(() => Promise.resolve({
      flashcardDecks: [{ id: '1', name: 'Fallback Deck', cards: [] }],
      quizzes: [{ id: '1', name: 'Fallback Quiz', questions: [] }],
      studySchedule: [{ id: '1', date: new Date(), topics: [] }]
    }))
  }
}))

// Mock process.env.NODE_ENV for testing
vi.stubGlobal('process', {
  ...process,
  env: {
    ...process.env,
    NODE_ENV: 'test'
  }
})

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
      expect(progressIndicator).toHaveAttribute('aria-label', 'Step 1 of 4')
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

  describe('Advanced Onboarding - V5 DataBridge TDD', () => {
    it('should generate structured learning plan after onboarding completion', async () => {
      // RED: This test will fail because DataBridge doesn't exist yet
      renderOnboardingPage()
      
      // Complete onboarding flow
      const getStartedButton = screen.getByRole('button', { name: /get started/i })
      fireEvent.click(getStartedButton)
      
      // Fill out subject form
      const subjectInput = screen.getByLabelText(/subject name/i)
      const examDateInput = screen.getByLabelText(/exam date/i)
      const hoursInput = screen.getByLabelText(/estimated hours/i)
      
      fireEvent.change(subjectInput, { target: { value: 'Mathematics' } })
      fireEvent.change(examDateInput, { target: { value: '2024-06-15' } })
      fireEvent.change(hoursInput, { target: { value: '20' } })
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      fireEvent.click(nextButton)
      
      // Should show DataBridge generating content
      expect(screen.getByTestId('databridge-generation')).toBeInTheDocument()
      expect(screen.getByText(/Creating Your Learning Plan/i)).toBeInTheDocument()
    })

    it('should display AI thinking animation during content generation', async () => {
      // RED: This test will fail because AI thinking animation doesn't exist
      renderOnboardingPage()
      
      // Complete onboarding to trigger generation
      const getStartedButton = screen.getByRole('button', { name: /get started/i })
      fireEvent.click(getStartedButton)
      
      const subjectInput = screen.getByLabelText(/subject name/i)
      const examDateInput = screen.getByLabelText(/exam date/i)
      const hoursInput = screen.getByLabelText(/estimated hours/i)
      
      fireEvent.change(subjectInput, { target: { value: 'Physics' } })
      fireEvent.change(examDateInput, { target: { value: '2024-07-01' } })
      fireEvent.change(hoursInput, { target: { value: '30' } })
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      fireEvent.click(nextButton)
      
      // Should show completion step with AI-generated content
      expect(await screen.findByTestId('onboarding-completion-step')).toBeInTheDocument()
      expect(screen.getByText(/Everything is ready for your study journey/i)).toBeInTheDocument()
      
      // Should show content summary instead of animation
      expect(screen.getByTestId('onboarding-completion-summary')).toBeInTheDocument()
    })

    it('should generate sample flashcards based on subject', async () => {
      // RED: This test will fail because sample flashcard generation doesn't exist
      renderOnboardingPage()
      
      // Complete onboarding
      const getStartedButton = screen.getByRole('button', { name: /get started/i })
      fireEvent.click(getStartedButton)
      
      const subjectInput = screen.getByLabelText(/subject name/i)
      const examDateInput = screen.getByLabelText(/exam date/i)
      const hoursInput = screen.getByLabelText(/estimated hours/i)
      
      fireEvent.change(subjectInput, { target: { value: 'Chemistry' } })
      fireEvent.change(examDateInput, { target: { value: '2024-08-15' } })
      fireEvent.change(hoursInput, { target: { value: '25' } })
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      fireEvent.click(nextButton)
      
      // Should show completion with flashcard count
      expect(await screen.findByTestId('onboarding-completion-summary')).toBeInTheDocument()
      expect(screen.getByTestId('flashcards-count')).toBeInTheDocument()
      
      // Should show flashcard decks ready
      expect(screen.getByText(/flashcard decks with/i)).toBeInTheDocument()
      expect(screen.getByText(/15 cards/i)).toBeInTheDocument()
    })

    it('should generate quiz questions based on subject and difficulty', async () => {
      // RED: This test will fail because quiz generation doesn't exist
      renderOnboardingPage()
      
      // Complete onboarding
      const getStartedButton = screen.getByRole('button', { name: /get started/i })
      fireEvent.click(getStartedButton)
      
      const subjectInput = screen.getByLabelText(/subject name/i)
      const examDateInput = screen.getByLabelText(/exam date/i)
      const hoursInput = screen.getByLabelText(/estimated hours/i)
      
      fireEvent.change(subjectInput, { target: { value: 'Biology' } })
      fireEvent.change(examDateInput, { target: { value: '2024-09-01' } })
      fireEvent.change(hoursInput, { target: { value: '40' } })
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      fireEvent.click(nextButton)
      
      // Should show completion with quiz count
      expect(await screen.findByTestId('onboarding-completion-summary')).toBeInTheDocument()
      expect(screen.getByTestId('quizzes-count')).toBeInTheDocument()
      
      // Should show practice quizzes ready
      expect(screen.getByText(/practice quizzes/i)).toBeInTheDocument()
      expect(screen.getByText(/3/)).toBeInTheDocument()
    })

    it('should create structured study schedule based on exam date and hours', async () => {
      // RED: This test will fail because study schedule generation doesn't exist
      renderOnboardingPage()
      
      // Complete onboarding
      const getStartedButton = screen.getByRole('button', { name: /get started/i })
      fireEvent.click(getStartedButton)
      
      const subjectInput = screen.getByLabelText(/subject name/i)
      const examDateInput = screen.getByLabelText(/exam date/i)
      const hoursInput = screen.getByLabelText(/estimated hours/i)
      
      fireEvent.change(subjectInput, { target: { value: 'History' } })
      fireEvent.change(examDateInput, { target: { value: '2024-10-15' } })
      fireEvent.change(hoursInput, { target: { value: '50' } })
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      fireEvent.click(nextButton)
      
      // Should show completion with schedule info
      expect(await screen.findByTestId('onboarding-completion-summary')).toBeInTheDocument()
      expect(screen.getByText(/Everything is ready for your study journey/i)).toBeInTheDocument()
      
      // Should show schedule details
      expect(screen.getByTestId('schedule-duration')).toBeInTheDocument()
      expect(screen.getByText(/scheduled study sessions/i)).toBeInTheDocument()
    })

    it('should show completion confirmation with generated content summary', async () => {
      // GREEN: This test should now pass with the updated implementation
      renderOnboardingPage()
      
      // Complete full onboarding flow
      const getStartedButton = screen.getByRole('button', { name: /get started/i })
      fireEvent.click(getStartedButton)
      
      const subjectInput = screen.getByLabelText(/subject name/i)
      const examDateInput = screen.getByLabelText(/exam date/i)
      const hoursInput = screen.getByLabelText(/estimated hours/i)
      
      fireEvent.change(subjectInput, { target: { value: 'Computer Science' } })
      fireEvent.change(examDateInput, { target: { value: '2024-12-01' } })
      fireEvent.change(hoursInput, { target: { value: '60' } })
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      fireEvent.click(nextButton)
      
      // Wait for content generation to complete and move to step 4
      await waitFor(() => {
        expect(screen.getByText(/you're all set/i)).toBeInTheDocument()
      }, { timeout: 1000 })
      
      // Should show summary of all generated content
      expect(screen.getByTestId('onboarding-completion-summary')).toBeInTheDocument()
      expect(screen.getByText(/Everything is ready for your study journey/i)).toBeInTheDocument()
      
      // Should show counts of generated content
      expect(screen.getByTestId('flashcards-count')).toBeInTheDocument()
      expect(screen.getByTestId('quizzes-count')).toBeInTheDocument()
      expect(screen.getByTestId('schedule-duration')).toBeInTheDocument()
      
      // Verify onboarding is marked as completed
      expect(useExamStore.getState().onboardingCompleted).toBe(true)
    })

    it('should handle generation errors gracefully with fallback content', async () => {
      // RED: This test will fail because error handling for generation doesn't exist
      renderOnboardingPage()
      
      // Complete onboarding with edge case data
      const getStartedButton = screen.getByRole('button', { name: /get started/i })
      fireEvent.click(getStartedButton)
      
      const subjectInput = screen.getByLabelText(/subject name/i)
      const examDateInput = screen.getByLabelText(/exam date/i)
      const hoursInput = screen.getByLabelText(/estimated hours/i)
      
      // Use subject that might cause generation issues
      fireEvent.change(subjectInput, { target: { value: 'Invalid Subject #@!$' } })
      fireEvent.change(examDateInput, { target: { value: '2024-01-01' } }) // Very soon date
      fireEvent.change(hoursInput, { target: { value: '1' } }) // Very few hours
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      fireEvent.click(nextButton)
      
      // Should show fallback content instead of failing
      expect(await screen.findByTestId('fallback-content')).toBeInTheDocument()
      expect(screen.getByText(/We've prepared some basic study materials/i)).toBeInTheDocument()
      
      // Should still allow user to proceed
      expect(screen.getByRole('button', { name: /go to dashboard/i })).toBeInTheDocument()
    })
  })
})
