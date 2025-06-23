import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom'
import StudyProgressDashboard from '../../src/components/StudyProgressDashboard'
import { useExamStore } from '../../src/stores/examStore'
import { useFlashcardStore } from '../../src/stores/flashcardStore'

// Mock the stores
vi.mock('../../src/stores/examStore', () => ({
  useExamStore: vi.fn()
}))

vi.mock('../../src/stores/flashcardStore', () => ({
  useFlashcardStore: vi.fn()
}))

const mockUseExamStore = vi.mocked(useExamStore)
const mockUseFlashcardStore = vi.mocked(useFlashcardStore)

describe('StudyProgressDashboard Component - TDD', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
    
    // Default mock return values
    mockUseExamStore.mockReturnValue({
      progress: {
        sessionsCompleted: 15,
        totalStudyTime: 1800, // 30 hours in minutes
        streakCount: 7,
        lastActivity: new Date('2025-06-23'),
        weeklyGoal: 600, // 10 hours in minutes
        weeklyProgress: 480 // 8 hours completed this week
      },
      subjects: [
        {
          id: '1',
          name: 'Mathematics',
          examDate: new Date('2025-08-01'),
          estimatedHours: 40
        },
        {
          id: '2', 
          name: 'Physics',
          examDate: new Date('2025-08-15'),
          estimatedHours: 35
        }
      ],
      studySessions: [],
      scheduledSessions: [],
      getUpcomingDeadlines: vi.fn(() => [
        {
          id: '1',
          name: 'Mathematics',
          examDate: new Date('2025-08-01'),
          estimatedHours: 40
        }
      ]),
      getCurrentProgress: vi.fn(() => 80),
      addScheduledSession: vi.fn(),
      updateSession: vi.fn(),
      deleteSession: vi.fn()
    })

    mockUseFlashcardStore.mockReturnValue({
      getStats: vi.fn(() => ({
        totalDecks: 3,
        totalCards: 45,
        cardsDueForReview: 8,
        difficultyDistribution: { easy: 20, medium: 15, hard: 10 },
        studyStreak: 7
      }))
    })
  })

  it('should render progress dashboard with study statistics', () => {
    render(<StudyProgressDashboard />)
    
    // Check for main heading
    expect(screen.getByText('Study Progress Dashboard')).toBeInTheDocument()
    
    // Check for study time display
    expect(screen.getByText('Total Study Time')).toBeInTheDocument()
    expect(screen.getByText('30 hours')).toBeInTheDocument()
    
    // Check for sessions completed
    expect(screen.getByText('Sessions Completed')).toBeInTheDocument()
    // Look for sessions completed specifically in the Sessions Completed card
    const sessionsCard = screen.getByText('Sessions Completed').closest('div')
    expect(sessionsCard).toHaveTextContent('15')
    
    // Check for current streak
    expect(screen.getByText('Current Streak')).toBeInTheDocument()
    expect(screen.getByText('7 days')).toBeInTheDocument()
  })

  it('should display weekly progress with visual progress bar', () => {
    render(<StudyProgressDashboard />)
    
    // Check for weekly goal section
    expect(screen.getByText('Weekly Goal')).toBeInTheDocument()
    expect(screen.getByText('8 / 10 hours')).toBeInTheDocument()
    
    // Check for progress bar with correct percentage
    const progressBar = screen.getByRole('progressbar', { name: /progress: 80% complete/i })
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '80')
  })

  it('should show upcoming exams and deadlines', () => {
    render(<StudyProgressDashboard />)
    
    // Check for upcoming exams section
    expect(screen.getByText('Upcoming Exams')).toBeInTheDocument()
    expect(screen.getByText('Mathematics')).toBeInTheDocument()
    expect(screen.getByText(/Aug.*2025/)).toBeInTheDocument() // Flexible date format
  })

  it('should display flashcard statistics integration', () => {
    render(<StudyProgressDashboard />)
    
    // Check for flashcard stats
    expect(screen.getByText('Flashcard Stats')).toBeInTheDocument()
    
    // Use getAllByText to handle multiple instances and check the correct ones exist
    const allThrees = screen.getAllByText('3')
    expect(allThrees.length).toBeGreaterThan(0)
    
    const allEights = screen.getAllByText('8')
    expect(allEights.length).toBeGreaterThan(0)
    
    // Check for the specific flashcard text labels
    expect(screen.getByText('decks')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText('cards total')).toBeInTheDocument()
    expect(screen.getByText('due for review')).toBeInTheDocument()
  })

  it('should handle empty progress state gracefully', () => {
    // Mock empty state
    mockUseExamStore.mockReturnValue({
      progress: null,
      subjects: [],
      getUpcomingDeadlines: vi.fn(() => []),
      getCurrentProgress: vi.fn(() => 0)
    })

    mockUseFlashcardStore.mockReturnValue({
      getStats: vi.fn(() => ({
        totalDecks: 0,
        totalCards: 0,
        cardsDueForReview: 0,
        difficultyDistribution: { easy: 0, medium: 0, hard: 0 },
        studyStreak: 0
      }))
    })

    render(<StudyProgressDashboard />)
    
    // Should show default values
    expect(screen.getByText('0 hours')).toBeInTheDocument()
    expect(screen.getByText('No sessions yet')).toBeInTheDocument()
    expect(screen.getByText('Start your study journey!')).toBeInTheDocument()
  })

  it('should calculate and display study efficiency metrics', () => {
    render(<StudyProgressDashboard />)
    
    // Check for efficiency metrics
    expect(screen.getByText('Study Efficiency')).toBeInTheDocument()
    expect(screen.getByText('2.0 hours/session')).toBeInTheDocument() // 30 hours / 15 sessions
  })

  it('should show motivational messages based on streak', () => {
    render(<StudyProgressDashboard />)
    
    // Check for streak-based motivation
    expect(screen.getByText(/great streak/i)).toBeInTheDocument()
  })

  it('should display progress charts container', () => {
    render(<StudyProgressDashboard />)
    
    // Check for charts section
    expect(screen.getByText('Progress Trends')).toBeInTheDocument()
    expect(screen.getByTestId('progress-charts-container')).toBeInTheDocument()
    
    // Check for individual chart components
    expect(screen.getByTestId('weekly-study-chart')).toBeInTheDocument()
    expect(screen.getByTestId('subject-progress-chart')).toBeInTheDocument()
    expect(screen.getByTestId('monthly-trend-chart')).toBeInTheDocument()
  })
})
