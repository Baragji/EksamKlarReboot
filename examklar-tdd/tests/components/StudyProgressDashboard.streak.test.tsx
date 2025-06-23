import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import StudyProgressDashboard from '../../src/components/StudyProgressDashboard'
import { useExamStore } from '../../src/stores/examStore'
import { useFlashcardStore } from '../../src/stores/flashcardStore'

// Mock the stores
vi.mock('../../src/stores/examStore')
vi.mock('../../src/stores/flashcardStore')

const mockUseExamStore = vi.mocked(useExamStore)
const mockUseFlashcardStore = vi.mocked(useFlashcardStore)

describe('StudyProgressDashboard Streak UI - TDD V5', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Mock flashcard store
    mockUseFlashcardStore.mockReturnValue({
      getStats: () => ({
        totalDecks: 0,
        totalCards: 0,
        cardsToReview: 0
      }),
      // Add other required properties with safe defaults
      decks: [],
      currentDeck: null,
      createDeck: vi.fn(),
      deleteDeck: vi.fn(),
      addCard: vi.fn(),
      updateCard: vi.fn(),
      deleteCard: vi.fn(),
      studyCard: vi.fn(),
      getCardsDueForReview: vi.fn(),
      exportDeck: vi.fn(),
      importDeck: vi.fn(),
      searchCards: vi.fn(),
      reset: vi.fn()
    })
  })

  it('should display current streak count from store', () => {
    // Mock store with streak data
    mockUseExamStore.mockReturnValue({
      progress: {
        totalStudyTime: 120,
        weeklyProgress: 60,
        weeklyGoal: 300,
        sessionsCompleted: 3
      },
      streakCount: 5,
      longestStreak: 8,
      lastActivityDate: new Date('2025-06-23'),
      getStreakMessage: () => "Amazing streak! 🔥 5 days in a row!",
      getUpcomingDeadlines: () => [],
      // Add other required properties with safe defaults
      setUser: vi.fn(),
      addSubject: vi.fn(),
      removeSubject: vi.fn(),
      setCurrentSubject: vi.fn(),
      updateStudyPlan: vi.fn(),
      updateProgress: vi.fn(),
      completeOnboarding: vi.fn(),
      addScheduledSession: vi.fn(),
      updateSession: vi.fn(),
      deleteSession: vi.fn(),
      completeSession: vi.fn(),
      recordActivity: vi.fn(),
      getCurrentProgress: vi.fn(),
      getTodaysGoal: vi.fn(),
      reset: vi.fn(),
      user: null,
      subjects: [],
      currentSubject: null,
      studyPlan: null,
      onboardingCompleted: false,
      studySessions: [],
      scheduledSessions: []
    })

    render(<StudyProgressDashboard />)

    // Check if streak count is displayed
    expect(screen.getByText('5 days')).toBeInTheDocument()
    expect(screen.getByText('Current Streak')).toBeInTheDocument()
  })

  it('should display motivational streak message from store', () => {
    mockUseExamStore.mockReturnValue({
      progress: {
        totalStudyTime: 120,
        weeklyProgress: 60,
        weeklyGoal: 300,
        sessionsCompleted: 3
      },
      streakCount: 7,
      longestStreak: 10,
      lastActivityDate: new Date('2025-06-23'),
      getStreakMessage: () => "One week strong! 💪 7 days in a row!",
      getUpcomingDeadlines: () => [],
      // Mock defaults
      setUser: vi.fn(), addSubject: vi.fn(), removeSubject: vi.fn(), setCurrentSubject: vi.fn(),
      updateStudyPlan: vi.fn(), updateProgress: vi.fn(), completeOnboarding: vi.fn(),
      addScheduledSession: vi.fn(), updateSession: vi.fn(), deleteSession: vi.fn(),
      completeSession: vi.fn(), recordActivity: vi.fn(), getCurrentProgress: vi.fn(),
      getTodaysGoal: vi.fn(), reset: vi.fn(), user: null, subjects: [], currentSubject: null,
      studyPlan: null, onboardingCompleted: false, studySessions: [], scheduledSessions: []
    })

    render(<StudyProgressDashboard />)

    // Check if motivational message is displayed
    expect(screen.getByText('One week strong! 💪 7 days in a row!')).toBeInTheDocument()
  })

  it('should handle zero streak gracefully', () => {
    mockUseExamStore.mockReturnValue({
      progress: {
        totalStudyTime: 0,
        weeklyProgress: 0,
        weeklyGoal: 300,
        sessionsCompleted: 0
      },
      streakCount: 0,
      longestStreak: 0,
      lastActivityDate: null,
      getStreakMessage: () => "Start your learning journey today! 🌟",
      getUpcomingDeadlines: () => [],
      // Mock defaults
      setUser: vi.fn(), addSubject: vi.fn(), removeSubject: vi.fn(), setCurrentSubject: vi.fn(),
      updateStudyPlan: vi.fn(), updateProgress: vi.fn(), completeOnboarding: vi.fn(),
      addScheduledSession: vi.fn(), updateSession: vi.fn(), deleteSession: vi.fn(),
      completeSession: vi.fn(), recordActivity: vi.fn(), getCurrentProgress: vi.fn(),
      getTodaysGoal: vi.fn(), reset: vi.fn(), user: null, subjects: [], currentSubject: null,
      studyPlan: null, onboardingCompleted: false, studySessions: [], scheduledSessions: []
    })

    render(<StudyProgressDashboard />)

    expect(screen.getByText('0 days')).toBeInTheDocument()
    expect(screen.getByText('Start your learning journey today! 🌟')).toBeInTheDocument()
  })
})
