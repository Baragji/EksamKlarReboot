import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { DeckManager } from '../../src/components/DeckManager'

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
    
    await user.click(screen.getByText('Create New Deck'))
    
    expect(screen.getByText('Create New Deck')).toBeInTheDocument()
    expect(screen.getByLabelText('Deck Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Subject')).toBeInTheDocument()
  })

  it('should create a new deck when form is submitted', async () => {
    const user = userEvent.setup()
    render(<DeckManager />)
    
    // Open create form
    await user.click(screen.getByText('Create New Deck'))
    
    // Fill form
    await user.type(screen.getByLabelText('Deck Name'), 'Math Basics')
    await user.type(screen.getByLabelText('Description'), 'Basic math concepts')
    await user.selectOptions(screen.getByLabelText('Subject'), 'math-101')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: 'Create Deck' }))
    
    // Verify deck was created and appears in list
    expect(screen.getByText('Math Basics')).toBeInTheDocument()
    expect(screen.getByText('Basic math concepts')).toBeInTheDocument()
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
    render(<DeckManager />)
    
    // Create a deck first
    await user.click(screen.getByText('Create New Deck'))
    await user.type(screen.getByLabelText('Deck Name'), 'Test Deck')
    await user.type(screen.getByLabelText('Description'), 'Test description')
    await user.selectOptions(screen.getByLabelText('Subject'), 'math-101')
    await user.click(screen.getByRole('button', { name: 'Create Deck' }))
    
    // Delete the deck
    const deleteButton = screen.getByLabelText('Delete deck')
    await user.click(deleteButton)
    
    // Confirm deletion
    await user.click(screen.getByText('Delete'))
    
    expect(screen.queryByText('Test Deck')).not.toBeInTheDocument()
  })

  it('should allow deck editing', async () => {
    const user = userEvent.setup()
    render(<DeckManager />)
    
    // Create a deck first
    await user.click(screen.getByText('Create New Deck'))
    await user.type(screen.getByLabelText('Deck Name'), 'Original Name')
    await user.type(screen.getByLabelText('Description'), 'Original description')
    await user.selectOptions(screen.getByLabelText('Subject'), 'math-101')
    await user.click(screen.getByRole('button', { name: 'Create Deck' }))
    
    // Edit the deck
    const editButton = screen.getByLabelText('Edit deck')
    await user.click(editButton)
    
    // Update fields
    const nameInput = screen.getByDisplayValue('Original Name')
    await user.clear(nameInput)
    await user.type(nameInput, 'Updated Name')
    
    // Save changes
    await user.click(screen.getByText('Save Changes'))
    
    expect(screen.getByText('Updated Name')).toBeInTheDocument()
    expect(screen.queryByText('Original Name')).not.toBeInTheDocument()
  })

  it('should support importing decks', async () => {
    const user = userEvent.setup()
    render(<DeckManager />)
    
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
    
    await user.type(screen.getByLabelText('JSON Data'), validJSON)
    await user.click(screen.getByRole('button', { name: 'Import' }))
    
    expect(screen.getByText('Imported Deck')).toBeInTheDocument()
  })

  it('should support exporting decks', async () => {
    const user = userEvent.setup()
    render(<DeckManager />)
    
    // Create a deck first
    await user.click(screen.getByText('Create New Deck'))
    await user.type(screen.getByLabelText('Deck Name'), 'Export Test')
    await user.type(screen.getByLabelText('Description'), 'Export description')
    await user.selectOptions(screen.getByLabelText('Subject'), 'math-101')
    await user.click(screen.getByRole('button', { name: 'Create Deck' }))
    
    // Export the deck
    const exportButton = screen.getByLabelText('Export deck')
    await user.click(exportButton)
    
    expect(screen.getByText('Export Deck JSON')).toBeInTheDocument()
    expect(screen.getByDisplayValue(/Export Test/)).toBeInTheDocument()
  })
})
