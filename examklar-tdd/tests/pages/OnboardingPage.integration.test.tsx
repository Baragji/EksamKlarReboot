import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import OnboardingPage from '../../src/pages/OnboardingPage'
import { useExamStore } from '../../src/stores/examStore'

// Mock the examStore to test integration
const renderOnboardingPage = () => {
  return render(
    <BrowserRouter>
      <OnboardingPage />
    </BrowserRouter>
  )
}

describe('Onboarding Integration Flow', () => {
  beforeEach(() => {
    // Reset store state before each test
    useExamStore.getState().reset()
  })

  it('should complete step 1: welcome screen interaction', async () => {
    renderOnboardingPage()
    
    // Should show welcome message
    expect(screen.getByText(/welcome to examklar/i)).toBeInTheDocument()
    
    // Should have get started button
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument()
    
    // Should show current step indicator
    expect(screen.getByText(/step 1/i)).toBeInTheDocument()
  })

  it('should advance to step 2 when get started is clicked', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    
    // Click get started button
    await user.click(screen.getByRole('button', { name: /get started/i }))
    
    // Should advance to step 2
    await waitFor(() => {
      expect(screen.getByText(/step 2/i)).toBeInTheDocument()
    })
    
    // Should show subject selection form
    expect(screen.getByText(/add your first subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/subject name/i)).toBeInTheDocument()
  })

  it('should complete step 2: add subject and advance to step 3', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    
    // Advance to step 2
    await user.click(screen.getByRole('button', { name: /get started/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/subject name/i)).toBeInTheDocument()
    })
    
    // Fill out subject form
    await user.type(screen.getByLabelText(/subject name/i), 'Mathematics')
    await user.type(screen.getByLabelText(/exam date/i), '2025-08-01')
    await user.type(screen.getByLabelText(/estimated hours/i), '40')
    
    // Click next to advance to step 3 (generation)
    await user.click(screen.getByRole('button', { name: /next/i }))
    
    // Should advance to step 3 first (generation in progress)
    await waitFor(() => {
      expect(screen.getByText(/step 3/i)).toBeInTheDocument()
    })
    
    // Wait for generation to complete and advance to step 4 (completion)
    await waitFor(() => {
      expect(screen.getByText(/you're all set/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Should show the added subject in store
    expect(useExamStore.getState().subjects).toHaveLength(1)
    expect(useExamStore.getState().subjects[0].name).toBe('Mathematics')
  })

  it('should complete full onboarding flow and redirect to dashboard', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    
    // Step 1: Welcome
    await user.click(screen.getByRole('button', { name: /get started/i }))
    
    // Step 2: Add subject
    await waitFor(() => {
      expect(screen.getByLabelText(/subject name/i)).toBeInTheDocument()
    })
    
    await user.type(screen.getByLabelText(/subject name/i), 'Physics')
    await user.type(screen.getByLabelText(/exam date/i), '2025-09-15')
    await user.type(screen.getByLabelText(/estimated hours/i), '60')
    await user.click(screen.getByRole('button', { name: /next/i }))
    
    // Step 3: Wait for generation to complete and show completion
    await waitFor(() => {
      expect(screen.getByText(/you're all set/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Should have button to go to dashboard
    expect(screen.getByRole('button', { name: /go to dashboard/i })).toBeInTheDocument()
    
    // Verify final state
    const finalState = useExamStore.getState()
    expect(finalState.subjects).toHaveLength(1)
    expect(finalState.subjects[0]).toMatchObject({
      name: 'Physics',
      estimatedHours: 60
    })
    expect(finalState.onboardingCompleted).toBe(true)
  })

  it('should allow going back to previous steps', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    
    // Advance to step 2
    await user.click(screen.getByRole('button', { name: /get started/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/step 2/i)).toBeInTheDocument()
    })
    
    // Should have back button
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    
    // Click back
    await user.click(screen.getByRole('button', { name: /back/i }))
    
    // Should return to step 1
    await waitFor(() => {
      expect(screen.getByText(/step 1/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/welcome to examklar/i)).toBeInTheDocument()
  })

  it('should validate required fields in step 2', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    
    // Advance to step 2
    await user.click(screen.getByRole('button', { name: /get started/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/subject name/i)).toBeInTheDocument()
    })
    
    // Try to advance without filling required fields
    await user.click(screen.getByRole('button', { name: /next/i }))
    
    // Should show validation errors
    expect(screen.getByText(/subject name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/exam date is required/i)).toBeInTheDocument()
    
    // Should not advance to step 3
    expect(screen.getByText(/step 2/i)).toBeInTheDocument()
  })
})
