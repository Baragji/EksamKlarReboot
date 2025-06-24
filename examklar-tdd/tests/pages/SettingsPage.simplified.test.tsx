import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import SettingsPage from '@/pages/SettingsPage'

// Mock the stores
vi.mock('@/stores/flashcardStore', () => ({
  useFlashcardStore: vi.fn(() => ({
    decks: [{ id: '1', name: 'Test Deck', cards: [] }],
    clearAllDecks: vi.fn(),
    addDeck: vi.fn()
  }))
}))

vi.mock('@/stores/examStore', () => ({
  useExamStore: vi.fn(() => ({
    progress: { sessionsCompleted: 5, totalStudyTime: 300 },
    currentSubject: 'Mathematics',
    onboardingCompleted: true,
    setProgress: vi.fn(),
    setCurrentSubject: vi.fn(),
    setOnboardingCompleted: vi.fn()
  }))
}))

vi.mock('@/stores/achievementStore', () => ({
  useAchievementStore: vi.fn(() => ({
    unlockedAchievements: ['achievement1', 'achievement2'],
    resetAchievements: vi.fn(),
    unlockAchievement: vi.fn()
  }))
}))

describe('SettingsPage - Simplified Tests', () => {
  it('should render settings page with correct data summary', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )
    
    // Check page title
    expect(screen.getByText('Settings')).toBeInTheDocument()
    
    // Check data summary
    expect(screen.getByText('1')).toBeInTheDocument() // Flashcard decks
    expect(screen.getByText('5')).toBeInTheDocument() // Study sessions
    expect(screen.getByText('2')).toBeInTheDocument() // Achievements
    expect(screen.getByText('5h')).toBeInTheDocument() // Total study time (300 min = 5h)
    
    // Check export/import buttons
    expect(screen.getByRole('button', { name: /export data/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /import data/i })).toBeInTheDocument()
  })
})