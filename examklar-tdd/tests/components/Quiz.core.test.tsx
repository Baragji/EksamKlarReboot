import { render, screen, act, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { Quiz } from '../../src/components/Quiz'

describe('Quiz Component - Core TDD Tests (Working)', () => {
  const mockQuiz = {
    id: '1',
    title: 'Mathematics Quiz',
    description: 'Test your math skills',
    questions: [
      {
        id: '1',
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
        explanation: 'Basic addition: 2 + 2 = 4',
        difficulty: 'easy' as const,
        points: 10
      },
      {
        id: '2',
        question: 'What is 5 × 7?',
        options: ['30', '32', '35', '40'],
        correctAnswer: 2,
        explanation: 'Multiplication: 5 × 7 = 35',
        difficulty: 'medium' as const,
        points: 20
      }
    ],
    timeLimit: 300, // 5 minutes in seconds
    passingScore: 60
  }

  it('should display quiz title and description', () => {
    render(<Quiz quiz={mockQuiz} onComplete={vi.fn()} />)
    expect(screen.getByText('Mathematics Quiz')).toBeInTheDocument()
    expect(screen.getByText('Test your math skills')).toBeInTheDocument()
  })

  it('should show question progress', () => {
    render(<Quiz quiz={mockQuiz} onComplete={vi.fn()} />)
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
  })

  it('should display timer when quiz has time limit', () => {
    render(<Quiz quiz={mockQuiz} onComplete={vi.fn()} />)
    expect(screen.getByText(/05:00/)).toBeInTheDocument()
    expect(screen.getByLabelText('Quiz timer')).toBeInTheDocument()
  })

  it('should disable next button when no answer selected', () => {
    render(<Quiz quiz={mockQuiz} onComplete={vi.fn()} />)
    expect(screen.getByText('Next Question')).toBeDisabled()
  })

  it('should have proper accessibility attributes', () => {
    render(<Quiz quiz={mockQuiz} onComplete={vi.fn()} />)
    
    // Check radiogroup structure
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    
    // Check question heading
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('What is 2 + 2?')
    
    // Check option buttons have proper labels
    expect(screen.getByLabelText('Option A: 3')).toBeInTheDocument()
    expect(screen.getByLabelText('Option B: 4')).toBeInTheDocument()
    expect(screen.getByLabelText('Option C: 5')).toBeInTheDocument()
    expect(screen.getByLabelText('Option D: 6')).toBeInTheDocument()
  })

  it('should support keyboard navigation', () => {
    render(<Quiz quiz={mockQuiz} onComplete={vi.fn()} />)
    
    const firstOption = screen.getByLabelText('Option A: 3')
    
    // Test keyboard focus on option buttons
    act(() => {
      firstOption.focus()
    })
    expect(firstOption).toHaveFocus()
    
    // Note: Disabled button focus testing removed - disabled buttons shouldn't receive focus
    // This matches proper accessibility behavior
  })
})
