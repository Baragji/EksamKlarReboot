import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import SettingsPage from '@/pages/SettingsPage'

// Mock the stores instead of using real ones
vi.mock('@/stores/flashcardStore', () => ({
  useFlashcardStore: vi.fn(() => ({
    decks: [{ id: '1', name: 'Test Deck', cards: [] }],
    exportDecks: vi.fn(() => JSON.stringify({ decks: [{ id: '1', name: 'Test Deck', cards: [] }] })),
    importDecks: vi.fn()
  }))
}))

vi.mock('@/stores/examStore', () => ({
  useExamStore: vi.fn(() => ({
    sessions: [{ id: '1', date: new Date().toISOString(), duration: 60 }],
    achievements: [{ id: '1', name: 'First Study', date: new Date().toISOString() }],
    totalStudyTime: 120,
    exportData: vi.fn(() => JSON.stringify({ sessions: [], achievements: [] })),
    importData: vi.fn()
  }))
}))

// Mock the export/import functionality
vi.mock('@/utils/exportImport', () => ({
  exportToFile: vi.fn((data, filename) => Promise.resolve()),
  importFromFile: vi.fn(() => Promise.resolve({ data: { decks: [], sessions: [] } }))
}))

describe('SettingsPage - Robust Tests', () => {
  // Mock URL API
  const mockCreateObjectURL = vi.fn(() => 'mock-url')
  const mockRevokeObjectURL = vi.fn()
  
  beforeEach(() => {
    // Setup URL API mocks
    global.URL.createObjectURL = mockCreateObjectURL
    global.URL.revokeObjectURL = mockRevokeObjectURL
    
    // Mock console.error to suppress React DOM warnings
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  
  afterEach(() => {
    // Clean up
    cleanup()
    vi.clearAllMocks()
  })
  
  it('should render settings page with export/import buttons', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /export data/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /import data/i })).toBeInTheDocument()
  })
  
  it('should display current data summary', () => {
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
  
  it('should handle export button click', async () => {
    // Import the mocked module
    const { exportToFile } = await import('@/utils/exportImport')
    
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )
    
    // Click the export button
    const exportButton = screen.getByRole('button', { name: /export data/i })
    fireEvent.click(exportButton)
    
    // Verify the export function was called
    await waitFor(() => {
      expect(exportToFile).toHaveBeenCalled()
    })
  })
  
  it('should handle import button click', async () => {
    // Import the mocked module
    const { importFromFile } = await import('@/utils/exportImport')
    
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )
    
    // Click the import button
    const importButton = screen.getByRole('button', { name: /import data/i })
    fireEvent.click(importButton)
    
    // Verify the import function was called
    await waitFor(() => {
      expect(importFromFile).toHaveBeenCalled()
    })
  })
})