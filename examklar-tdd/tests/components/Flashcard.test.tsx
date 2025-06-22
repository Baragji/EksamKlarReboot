import { render, screen, act, fireEvent } from '@testing-library/react'
import { vi, beforeEach, afterEach } from 'vitest'
import { Flashcard } from '../../src/components/Flashcard'

describe('Flashcard Component - TDD', () => {
  const mockCard = {
    id: '1',
    front: 'What is the capital of France?',
    back: 'Paris',
    difficulty: 'easy' as const,
    tags: ['geography', 'capitals'],
    lastReviewed: new Date('2025-06-20'),
    nextReview: new Date('2025-06-25'),
    correctStreak: 2,
    totalReviews: 5
  }

  it('should display front of card initially', () => {
    render(<Flashcard card={mockCard} />)
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument()
    expect(screen.queryByText('Paris')).not.toBeInTheDocument()
  })

  it('should show flip indicator when card can be flipped', () => {
    render(<Flashcard card={mockCard} />)
    expect(screen.getByLabelText('Flip card')).toBeInTheDocument()
    expect(screen.getByText(/click to flip/i)).toBeInTheDocument()
  })

  it('should flip to back when clicked', () => {
    render(<Flashcard card={mockCard} />)
    
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /flip card/i }))
    })
    
    expect(screen.getByText('Paris')).toBeInTheDocument()
    expect(screen.queryByText('What is the capital of France?')).not.toBeInTheDocument()
  })

  it('should flip back to front when clicked again', () => {
    render(<Flashcard card={mockCard} />)
    
    // Flip to back
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /flip card/i }))
    })
    expect(screen.getByText('Paris')).toBeInTheDocument()
    
    // Flip back to front
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /flip card/i }))
    })
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument()
    expect(screen.queryByText('Paris')).not.toBeInTheDocument()
  })

  it('should show difficulty indicator', () => {
    render(<Flashcard card={mockCard} />)
    expect(screen.getByText('Easy')).toBeInTheDocument()
  })

  it('should display tags when provided', () => {
    render(<Flashcard card={mockCard} />)
    expect(screen.getByText('geography')).toBeInTheDocument()
    expect(screen.getByText('capitals')).toBeInTheDocument()
  })

  it('should show review stats on back of card', () => {
    render(<Flashcard card={mockCard} />)
    
    // Flip to back
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /flip card/i }))
    })
    
    expect(screen.getByText(/streak: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/reviews: 5/i)).toBeInTheDocument()
  })

  it('should call onFlip callback when flipped', () => {
    const handleFlip = vi.fn()
    render(<Flashcard card={mockCard} onFlip={handleFlip} />)
    
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /flip card/i }))
    })
    
    expect(handleFlip).toHaveBeenCalledWith(mockCard.id, true) // true = showing back
  })

  it('should be keyboard accessible', () => {
    render(<Flashcard card={mockCard} />)
    
    const cardButton = screen.getByRole('button', { name: /flip card/i })
    expect(cardButton).toBeInTheDocument()
    
    // Test keyboard interaction
    act(() => {
      fireEvent.keyDown(cardButton, { key: 'Enter' })
    })
    
    expect(screen.getByText('Paris')).toBeInTheDocument()
  })

  it('should have proper ARIA attributes', () => {
    render(<Flashcard card={mockCard} />)
    
    const cardButton = screen.getByRole('button', { name: /flip card/i })
    expect(cardButton).toHaveAttribute('aria-label', 'Flip card')
    expect(cardButton).toHaveAttribute('tabIndex', '0')
  })

  it('should show loading state when flipping', () => {
    render(<Flashcard card={mockCard} isFlipping />)
    expect(screen.getByText(/flipping.../i)).toBeInTheDocument()
  })
})
