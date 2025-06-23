import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SettingsPage from '@/pages/SettingsPage'

// Mock browser APIs that don't exist in test environment
const mockClick = vi.fn()
const mockAppendChild = vi.fn()
const mockRemoveChild = vi.fn()

beforeEach(() => {
  // Reset mocks
  vi.clearAllMocks()
  
  // Mock URL methods
  global.URL.createObjectURL = vi.fn(() => 'mock-url')
  global.URL.revokeObjectURL = vi.fn()

  // Mock document.createElement
  global.document.createElement = vi.fn((tagName: string) => {
    if (tagName === 'a') {
      return {
        href: '',
        download: '',
        click: mockClick,
      } as any
    }
    if (tagName === 'input') {
      return {
        type: '',
        accept: '',
        onchange: null,
        click: vi.fn(),
      } as any
    }
    return {} as any
  })

  // Mock document.body methods
  global.document.body.appendChild = mockAppendChild
  global.document.body.removeChild = mockRemoveChild
})

describe('SettingsPage - Data Export/Import (V5 Fase 3)', () => {
  it('should render settings page with export/import buttons', () => {
    // 🟢 GREEN: This test should pass - SettingsPage exists
    render(<SettingsPage />)
    
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /export data/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /import data/i })).toBeInTheDocument()
  })

  it('should have export functionality', async () => {
    // 🔴 RED → 🟢 GREEN: Test loading state during export
    render(<SettingsPage />)
    
    const exportButton = screen.getByRole('button', { name: /export data/i })
    fireEvent.click(exportButton)
    
    // Should show loading state while exporting
    await waitFor(() => {
      expect(screen.getByText(/exporting data/i)).toBeInTheDocument()
    })
  })

  it('should have import functionality', async () => {
    // 🔴 RED → 🟢 GREEN: Test loading state during import
    render(<SettingsPage />)
    
    const importButton = screen.getByRole('button', { name: /import data/i })
    expect(importButton).toBeInTheDocument()
    
    // Should show loading state when clicked
    fireEvent.click(importButton)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /import data\.\.\./i })).toBeInTheDocument()
    })
  })

  it('should display current data summary', () => {
    // 🟢 GREEN: This test should pass - data summary exists
    render(<SettingsPage />)
    
    expect(screen.getByText(/current data/i)).toBeInTheDocument()
    expect(screen.getByText(/flashcard decks/i)).toBeInTheDocument()
    expect(screen.getByText(/study sessions/i)).toBeInTheDocument()
    expect(screen.getByText(/achievements/i)).toBeInTheDocument()
  })
})
