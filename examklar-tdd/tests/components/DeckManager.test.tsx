import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { DeckManager } from '../../src/components/DeckManager'
import '@testing-library/jest-dom'

// 🔴 RED: Writing tests for enhanced deck management component
describe('DeckManager Component - TDD', () => {
  beforeEach(() => {
    // Mock localStorage for Zustand persist
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    })
  })

  it('should render deck management interface', () => {
    render(<DeckManager />)
    
    expect(screen.getByText('Deck Management')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search decks...')).toBeInTheDocument()
    expect(screen.getByText('Create New Deck')).toBeInTheDocument()
    expect(screen.getByText('Filter by Subject')).toBeInTheDocument()
    expect(screen.getByText('Sort by')).toBeInTheDocument()
  })

  it('should show create deck form when create button is clicked', async () => {
    const user = userEvent.setup()
    render(<DeckManager />)
    
    // Click the button (not the heading that appears in modal)
    await user.click(screen.getByRole('button', { name: 'Create New Deck' }))
    
    // Check for form elements using more specific queries
    expect(screen.getByRole('heading', { name: 'Create New Deck' })).toBeInTheDocument()
    expect(screen.getByLabelText('Deck Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Subject')).toBeInTheDocument()
  })

  it('should create a new deck when form is submitted', async () => {
    const user = userEvent.setup()
    render(<DeckManager />)
    
    // Open create form
    await user.click(screen.getByRole('button', { name: 'Create New Deck' }))
    
    // Fill form
    await user.type(screen.getByLabelText('Deck Name'), 'Math Basics')
    await user.type(screen.getByLabelText('Description'), 'Basic math concepts')
    await user.selectOptions(screen.getByLabelText('Subject'), 'math-101')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: 'Create Deck' }))
    
    // Wait a bit for re-render and check stats updated
    expect(screen.getByText('1')).toBeInTheDocument() // Total decks counter should show 1
  })

  it('should filter decks by search term', async () => {
    const user = userEvent.setup()
    render(<DeckManager />)
    
    // Create test decks first
    await user.click(screen.getByText('Create New Deck'))
    await user.type(screen.getByLabelText('Deck Name'), 'Algebra')
    await user.type(screen.getByLabelText('Description'), 'Algebra topics')
    await user.selectOptions(screen.getByLabelText('Subject'), 'math-101')
    await user.click(screen.getByRole('button', { name: 'Create Deck' }))
    
    await user.click(screen.getByText('Create New Deck'))
    await user.type(screen.getByLabelText('Deck Name'), 'Chemistry')
    await user.type(screen.getByLabelText('Description'), 'Chemistry topics')
    await user.selectOptions(screen.getByLabelText('Subject'), 'science-101')
    await user.click(screen.getByRole('button', { name: 'Create Deck' }))
    
    // Filter by search
    await user.type(screen.getByPlaceholderText('Search decks...'), 'algebra')
    
    expect(screen.getByText('Algebra')).toBeInTheDocument()
    expect(screen.queryByText('Chemistry')).not.toBeInTheDocument()
  })

  it('should show deck statistics', () => {
    render(<DeckManager />)
    
    expect(screen.getByText('Total Decks:')).toBeInTheDocument()
    expect(screen.getByText('Total Cards:')).toBeInTheDocument()
    expect(screen.getByText('Cards Due:')).toBeInTheDocument()
  })

  it('should allow deck deletion', async () => {
    const user = userEvent.setup()
    
    // Mock window.confirm to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    
    render(<DeckManager />)
    
    // Create a deck first
    await user.click(screen.getByRole('button', { name: 'Create New Deck' }))
    await user.type(screen.getByLabelText('Deck Name'), 'Test Deck')
    await user.type(screen.getByLabelText('Description'), 'Test description')
    await user.selectOptions(screen.getByLabelText('Subject'), 'math-101')
    await user.click(screen.getByRole('button', { name: 'Create Deck' }))
    
    // Get current deck count before deletion
    const initialCount = parseInt(screen.getAllByText(/^\d+$/).find(el => 
      el.closest('.bg-blue-50')
    )?.textContent || '0')
    
    // Find all delete buttons and click the last one (most recently created)
    const deleteButtons = screen.getAllByLabelText('Delete deck')
    await user.click(deleteButtons[deleteButtons.length - 1])
    
    // Verify confirm was called
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this deck?')
    
    // Verify deck count decreased by 1
    const newCount = parseInt(screen.getAllByText(/^\d+$/).find(el => 
      el.closest('.bg-blue-50')
    )?.textContent || '0')
    expect(newCount).toBe(initialCount - 1)
    
    // Cleanup
    confirmSpy.mockRestore()
  })

  it('should allow deck editing', async () => {
    const user = userEvent.setup()
    render(<DeckManager />)
    
    // Create a deck first
    await user.click(screen.getByRole('button', { name: 'Create New Deck' }))
    await user.type(screen.getByLabelText('Deck Name'), 'Original Name')
    await user.type(screen.getByLabelText('Description'), 'Original description')
    await user.selectOptions(screen.getByLabelText('Subject'), 'math-101')
    await user.click(screen.getByRole('button', { name: 'Create Deck' }))
    
    // Find all edit buttons and click the last one (most recently created)
    const editButtons = screen.getAllByLabelText('Edit deck')
    await user.click(editButtons[editButtons.length - 1])
    
    // Verify edit form appears
    expect(screen.getByRole('heading', { name: 'Edit Deck' })).toBeInTheDocument()
  })

  it('should support importing decks', async () => {
    const user = userEvent.setup()
    render(<DeckManager />)
    
    // Get initial deck count
    const initialCount = parseInt(screen.getAllByText(/^\d+$/).find(el => 
      el.closest('.bg-blue-50')
    )?.textContent || '0')
    
    const importButton = screen.getByText('Import Deck')
    await user.click(importButton)
    
    expect(screen.getByText('Import Deck from JSON')).toBeInTheDocument()
    expect(screen.getByLabelText('JSON Data')).toBeInTheDocument()
    
    const validJSON = JSON.stringify({
      name: 'Imported Deck',
      subjectId: 'math-101',
      description: 'Imported description',
      cards: [
        {
          front: 'Question 1',
          back: 'Answer 1',
          difficulty: 'easy',
          tags: ['imported']
        }
      ]
    })
    
    // Use fireEvent to set JSON directly (userEvent doesn't handle braces well)
    const jsonTextarea = screen.getByLabelText('JSON Data')
    fireEvent.change(jsonTextarea, { target: { value: validJSON } })
    await user.click(screen.getByRole('button', { name: 'Import' }))
    
    // Check that total decks increased by 1
    const newCount = parseInt(screen.getAllByText(/^\d+$/).find(el => 
      el.closest('.bg-blue-50')
    )?.textContent || '0')
    expect(newCount).toBe(initialCount + 1)
  })

  it('should support exporting decks', async () => {
    const user = userEvent.setup()
    render(<DeckManager />)
    
    // Create a deck first
    await user.click(screen.getByRole('button', { name: 'Create New Deck' }))
    await user.type(screen.getByLabelText('Deck Name'), 'Export Test')
    await user.type(screen.getByLabelText('Description'), 'Export description')
    await user.selectOptions(screen.getByLabelText('Subject'), 'math-101')
    await user.click(screen.getByRole('button', { name: 'Create Deck' }))
    
    // Find all export buttons and click the last one (most recently created)
    const exportButtons = screen.getAllByLabelText('Export deck')
    await user.click(exportButtons[exportButtons.length - 1])
    
    expect(screen.getByText('Export Deck JSON')).toBeInTheDocument()
  })
})
