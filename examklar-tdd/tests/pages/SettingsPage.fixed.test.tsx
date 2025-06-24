import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import SettingsPage from '@/pages/SettingsPage'

// Mock the stores instead of using real ones
vi.mock('@/stores/flashcardStore', () => ({
  useFlashcardStore: vi.fn(() => ({
    decks: [{ id: '1', name: 'Test Deck', cards: [] }],
    clearAllDecks: vi.fn(),
    addDeck: vi.fn()
  }))
}))

vi.mock('@/stores/examStore', () => ({
  useExamStore: vi.fn(() => ({
    progress: { sessionsCompleted: 0, totalStudyTime: 0 },
    currentSubject: 'Math',
    onboardingCompleted: true,
    setProgress: vi.fn(),
    setCurrentSubject: vi.fn(),
    setOnboardingCompleted: vi.fn()
  }))
}))

vi.mock('@/stores/achievementStore', () => ({
  useAchievementStore: vi.fn(() => ({
    unlockedAchievements: [],
    resetAchievements: vi.fn(),
    unlockAchievement: vi.fn()
  }))
}))

// Mock the export/import functionality
vi.mock('@/utils/exportImport', () => ({
  exportToFile: vi.fn((data, filename) => Promise.resolve()),
  importFromFile: vi.fn(() => Promise.resolve({ data: { version: '1.0', examStore: {}, flashcardStore: {} } }))
}))

describe('SettingsPage - Data Export/Import (V5 Fase 3)', () => {
  beforeEach(() => {
    // Mock URL methods for export functionality
    global.URL.createObjectURL = vi.fn(() => 'mock-url')
    global.URL.revokeObjectURL = vi.fn()
    
    // Mock console.error to suppress React DOM warnings
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Clean up React components
    cleanup()
    
    // Clear all mocks
    vi.clearAllMocks()
  })

  it('should render settings page with export/import buttons', () => {
    // 🟢 GREEN: This test should pass - SettingsPage exists
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /export data/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /import data/i })).toBeInTheDocument()
  })

  it('should have export functionality', async () => {
    // Import the mocked module
    const { exportToFile } = await import('@/utils/exportImport')
    
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )
    
    const exportButton = screen.getByRole('button', { name: /export data/i })
    fireEvent.click(exportButton)
    
    // Should show loading state briefly
    await waitFor(() => {
      expect(screen.getByText(/exporting data/i)).toBeInTheDocument()
    })
    
    // Verify the export function was called
    await waitFor(() => {
      expect(exportToFile).toHaveBeenCalled()
    })
  })

  it('should have import functionality', async () => {
    // Import the mocked module
    const { importFromFile } = await import('@/utils/exportImport')
    
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )
    
    const importButton = screen.getByRole('button', { name: /import data/i })
    expect(importButton).toBeInTheDocument()
    
    fireEvent.click(importButton)
    
    // Should show loading state briefly
    await waitFor(() => {
      expect(screen.getByText(/import data\.\.\./i)).toBeInTheDocument()
    })
    
    // Verify the import function was called
    await waitFor(() => {
      expect(importFromFile).toHaveBeenCalled()
    })
  })

  it('should display current data summary', () => {
    // 🟢 GREEN: This test should pass - data summary exists
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText(/current data/i)).toBeInTheDocument()
    expect(screen.getByText(/flashcard decks/i)).toBeInTheDocument()
    expect(screen.getByText(/study sessions/i)).toBeInTheDocument()
    expect(screen.getByText(/achievements/i)).toBeInTheDocument()
    expect(screen.getByText(/total study time/i)).toBeInTheDocument()
  })
})