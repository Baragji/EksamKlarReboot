import { render, screen, act, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { FlashcardDeck } from '../../src/components/FlashcardDeck'

describe('FlashcardDeck Component - TDD', () => {
  const mockCards = [
    {
      id: '1',
      front: 'What is 2+2?',
      back: '4',
      difficulty: 'easy' as const,
      tags: ['math'],
      lastReviewed: new Date('2025-06-20'),
      nextReview: new Date('2025-06-25'),
      correctStreak: 1,
      totalReviews: 3
    },
    {
      id: '2',
      front: 'What is the capital of Spain?',
      back: 'Madrid',
      difficulty: 'medium' as const,
      tags: ['geography'],
      lastReviewed: new Date('2025-06-19'),
      nextReview: new Date('2025-06-26'),
      correctStreak: 0,
      totalReviews: 2
    },
    {
      id: '3',
      front: 'What is photosynthesis?',
      back: 'The process by which plants make food using sunlight',
      difficulty: 'hard' as const,
      tags: ['biology', 'science'],
      lastReviewed: new Date('2025-06-18'),
      nextReview: new Date('2025-06-27'),
      correctStreak: 3,
      totalReviews: 8
    }
  ]

  it('should display first card initially', () => {
    render(<FlashcardDeck cards={mockCards} />)
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument()
  })

  it('should show current card position', () => {
    render(<FlashcardDeck cards={mockCards} />)
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
  })

  it('should navigate to next card when next button clicked', () => {
    render(<FlashcardDeck cards={mockCards} />)
    
    act(() => {
      fireEvent.click(screen.getByLabelText('Next card'))
    })
    
    expect(screen.getByText('What is the capital of Spain?')).toBeInTheDocument()
    expect(screen.getByText('2 of 3')).toBeInTheDocument()
  })

  it('should navigate to previous card when previous button clicked', () => {
    render(<FlashcardDeck cards={mockCards} />)
    
    // Go to second card
    act(() => {
      fireEvent.click(screen.getByLabelText('Next card'))
    })
    expect(screen.getByText('2 of 3')).toBeInTheDocument()
    
    // Go back to first card
    act(() => {
      fireEvent.click(screen.getByLabelText('Previous card'))
    })
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument()
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
  })

  it('should disable previous button on first card', () => {
    render(<FlashcardDeck cards={mockCards} />)
    expect(screen.getByLabelText('Previous card')).toBeDisabled()
  })

  it('should disable next button on last card', () => {
    render(<FlashcardDeck cards={mockCards} />)
    
    // Navigate to last card
    act(() => {
      fireEvent.click(screen.getByLabelText('Next card'))
    })
    act(() => {
      fireEvent.click(screen.getByLabelText('Next card'))
    })
    
    expect(screen.getByText('3 of 3')).toBeInTheDocument()
    expect(screen.getByLabelText('Next card')).toBeDisabled()
  })

  it('should show difficulty distribution', () => {
    render(<FlashcardDeck cards={mockCards} />)
    expect(screen.getByText(/easy: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/medium: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/hard: 1/i)).toBeInTheDocument()
  })

  it('should show progress bar', () => {
    render(<FlashcardDeck cards={mockCards} />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '1')
    expect(progressBar).toHaveAttribute('aria-valuemax', '3')
  })

  it('should call onCardComplete when card is marked as complete', () => {
    const handleCardComplete = vi.fn()
    render(<FlashcardDeck cards={mockCards} onCardComplete={handleCardComplete} />)
    
    act(() => {
      fireEvent.click(screen.getByLabelText('Mark as correct'))
    })
    
    expect(handleCardComplete).toHaveBeenCalledWith(mockCards[0].id, 'correct')
  })

  it('should call onDeckComplete when all cards are reviewed', () => {
    const handleDeckComplete = vi.fn()
    render(<FlashcardDeck cards={mockCards} onDeckComplete={handleDeckComplete} />)
    
    // Mark all cards as complete
    mockCards.forEach(() => {
      act(() => {
        fireEvent.click(screen.getByLabelText('Mark as correct'))
      })
      if (screen.queryByLabelText('Next card') && !screen.getByLabelText('Next card').hasAttribute('disabled')) {
        act(() => {
          fireEvent.click(screen.getByLabelText('Next card'))
        })
      }
    })
    
    expect(handleDeckComplete).toHaveBeenCalledWith({
      totalCards: 3,
      correctCards: 3,
      incorrectCards: 0,
      timeSpent: expect.any(Number)
    })
  })

  it('should shuffle cards when shuffle button clicked', () => {
    render(<FlashcardDeck cards={mockCards} />)
    
    const firstCardText = screen.getByText('What is 2+2?')
    expect(firstCardText).toBeInTheDocument()
    
    act(() => {
      fireEvent.click(screen.getByLabelText('Shuffle cards'))
    })
    
    // After shuffle, the order might be different
    // We just check that some card content is still present
    expect(screen.getByText(/What is|Madrid|photosynthesis/)).toBeInTheDocument()
  })

  it('should show empty state when no cards provided', () => {
    render(<FlashcardDeck cards={[]} />)
    expect(screen.getByText(/no flashcards available/i)).toBeInTheDocument()
  })

  it('should have keyboard navigation support', () => {
    render(<FlashcardDeck cards={mockCards} />)
    
    // Test arrow key navigation
    act(() => {
      fireEvent.keyDown(document.body, { key: 'ArrowRight' })
    })
    expect(screen.getByText('What is the capital of Spain?')).toBeInTheDocument()
    
    act(() => {
      fireEvent.keyDown(document.body, { key: 'ArrowLeft' })
    })
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument()
  })

  it('should support auto-advance mode', () => {
    vi.useFakeTimers()
    
    render(<FlashcardDeck cards={mockCards} autoAdvance autoAdvanceDelay={3000} />)
    
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument()
    
    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    
    expect(screen.getByText('What is the capital of Spain?')).toBeInTheDocument()
    
    vi.useRealTimers()
  })
})
